import 'regenerator-runtime/runtime';
import DataTable from 'datatables.net-dt';

import axios from 'axios';
const url = "http://localhost:3000/";
let table
let clients
let token = window.localStorage.getItem("token_de_acesso")
const config = {
    headers: { Authorization: `Bearer ${token}` }
};

const bodyParameters = {
   key: "value"
};

$(document).ready(function () {
    try{
        loadClients()
    }
    catch(error) {
        alert(error);
    };

    loadTable();
})



async function loadClients(){
    clients = await axios("http://localhost:3000/clients/", config, bodyParameters)
    console.log(clients.data)

    var select = $("#selectClient")
    clients.data.forEach(p => {
        var option = document.createElement('option')
        option.value = p['id']
        option.innerHTML = p['name']
        
        select.append(option)
    });
}

$("#btnSalvar").click(async function () {
    var id = $("#txtId").val()
    var client = $("#selectClient").val()
    var name = $("#txtName").val()
    var email = $("#txtEmail").val()
    var admin = ($("#boolAdmin").val() === "true")

    var password = $("#txtPassword").val()
    console.log(name, client, email, admin, password)

    if(!id){
    await axios.post(url + 'users', {
        name:name,
        clientId:client,
        email:email,
        admin:admin,
        password:password,
    }).then(function (response){
        alert("Usuário criado com sucesso")
        cleanFields()
    }).catch(function(error){
        alert(error)
    });
    }else{
        await axios.put(url + 'users/' + id ,{
            name:name,
            email:email,
            clientId:client,
            admin:admin,
            password:password,
        }, config, bodyParameters,
        ).then(function(response){
            alert("Alterções concluídas")
        }).catch(function(error){
            alert(error)
        })
    }
    await refreshTable()
});


function cleanFields(){
    try{
        $("#txtName").val('')
        $("#txtEmail").val('')
        $("#boolAdmin").val('')
        $("#txtPassword").val('')
        $("#selectClient").val('')
    }catch(errors){
        alert(errors)
    }
}


$("#btnCancelar").click(async function(){
    cleanFields()
})

async function refreshTable(){
    try {
        const response = await axios(url + "users", config, bodyParameters);
        table.clear().rows.add(response.data).draw();
    } catch (error) {
        alert("Erro ao atualizar a tabela: " + error);
    }
}

async function deleteUser(id){
    try{
        await axios.delete(url + 'users/' + id, config, bodyParameters)
        alert("Deletado com sucesso")
    }catch(e){
        alert(e)
    }
    await refreshTable()
}

// Copiar dados da tabela para os campos
$('#tabelaLista').on('click', 'button', function (e) {
    var row = table.row($(this).parents('tr'));
    var rowData = row.data()
    if (this.id === 'edit') {
        $("#txtId").val(rowData['id'])
        $("#txtName").val(rowData['name'])
        $("#txtEmail").val(rowData['email'])
        $("#selectClient").val(rowData['clientId'])
        if (rowData['admin'] === 0) {
            $("#boolAdmin").val("true");
        } else {
            $("#boolAdmin").val("false");
        }
    } else {
        deleteUser(rowData['id']);
    }
});


async function loadTable(){
    await axios(url + "users", config, bodyParameters).then(function(response){
        table = $('#tabelaLista').DataTable({
            data: response.data,
            columnDefs:[
                {title: "Id", targets: 0},
                {title: "Nome", targets: 1},
                {title: "Nome cliente", targets: 2},
                {title: "Email", targets: 3},
                {title: "Cargo", targets: 4},
                {title: "Opções", targets: -1},
                
            ],
            columns: [
                { data: "id" },
                { data: "name" },
                { data: "clientName" },
                { data: "email" },
                {data: "role"},
                {data: null,
                    defaultContent: '<button id="edit">Editar</button>&nbsp;<button id="excluir">Excluir</button>',
                    targets: -1},
            ],
        })
        
    }).catch(function (error){
        alert(error)
    })
}