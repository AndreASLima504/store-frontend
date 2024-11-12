import 'regenerator-runtime/runtime';
import DataTable from 'datatables.net-dt';

import axios from 'axios';
const url = "http://localhost:3000/";
let table



$(document).ready(function () {
    loadTable()
    
})


$("#btnSalvar").click(async function () {
    var id = $("#txtId").val()
    var name = $("#txtName").val()
    var email = $("#txtEmail").val()
    var admin = ($("#boolAdmin").val() === "true")
    var password = $("#txtPassword").val()
    // console.log(name, email, admin, password)

    if(!id){
    await axios.post(url + 'users', {
        name:name,
        email:email,
        admin:admin,
        password:password
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
            admin:admin,
            password:password
        }).then(function(response){

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
    }catch(errors){
        alert(errors)
    }
}


$("#btnCancelar").click(async function(){
    cleanFields()
})

async function refreshTable(){
    try {
        const response = await axios(url + "users");
        table.clear().rows.add(response.data).draw();
    } catch (error) {
        alert("Erro ao atualizar a tabela: " + error);
    }
}

async function deleteUser(id){
    try{
        await axios.delete(url + 'users/' + id)
        alert("Deletado com sucesso")
    }catch(e){
        alert(e)
    }
    await refreshTable()
}


$('#tabelaLista').on('click', 'button', function (e) {
    var row = table.row($(this).parents('tr'));
    var rowData = row.data()
    if (this.id === 'edit') {
        var blocks = row.find('*')
        blocks.forEach(function() {

        });
        console.log(blocks)
    } else {
        deleteUser(rowData['id']);
    }
});


async function loadTable(){
    await axios(url + "users").then(function(response){
        table = $('#tabelaLista').DataTable({
            data: response.data,
            columnDefs:[
                {title: "Id", targets: 0},
                {title: "Nome", targets: 1},
                {title: "Email", targets: 2},
                {title: "Administrador", targets: 3},
                {title: "Opções", targets: -1},
                
            ],
            columns: [
                { data: "id" },
                { data: "name" },
                { data: "email" },
                { data: "admin" },
                {data: null,
                    defaultContent: '<button id="edit">Editar</button>&nbsp;<button id="excluir">Excluir</button>',
                    targets: -1},
            ],
        })
        
    }).catch(function (error){
        alert(error)
    })
}