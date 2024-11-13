import 'regenerator-runtime/runtime'
import DataTable from 'datatables.net-dt'
import axios from 'axios'
const url = 'http://localhost:3000/clients/'
let table

$(document).ready(async function() {
    loadTable()
})

$("#btnSalvar").click(async function(){
    var id = $("#txtId").val()
    var name = $("#txtName").val()
    var description = $("#txtDescription").val()
    var cpf = $("#txtCpf").val()
    var address = $("#txtAddress").val()
    var phone = $("#txtPhone").val()

    if(!id){
        axios.post(url ,{
            name:name,
            description:description,
            cpf:cpf,
            address:address,
            phone:phone
        }).then(function(response){
            alert("Cliente Cadastrado")
            cleanFields()
            refreshTable()
        }).catch(function(errors){
            alert(errors)
            console.log(name, description, cpf, address, phone)
        })
    }else{
        axios.put(url+ id, {
            id:id,
            name:name,
            description:description,
            cpf:cpf,
            address:address,
            phone:phone
        }).then(function(response){
            alert("Alterações concluídas")
            cleanFields()
            refreshTable()
        }).catch(function(errors){
            alert(errors)  
            console.log(id, name, description, cpf, address, phone, "Deu update nesta porqueira.")
        })
    } 
    console.log('ta chegando')
})
function cleanFields(){
    try{
        $("#txtId").val('')
        $("#txtName").val('')
        $("#txtDescription").val('')
        $("#txtCpf").val('')
        $("#txtAddress").val('')
        $("#txtPhone").val('')
    }catch(errors){
        alert(errors)
    }
}

$("#btnLimpar").click(async function(){
    cleanFields()    
})

async function refreshTable(){
    try {
        const response = await axios(url);
        table.clear().rows.add(response.data).draw();
    } catch (error) {
        alert("Erro ao atualizar a tabela: " + error);
    }
}

async function deleteClient(id){
    try{
        await axios.delete(url + id)
        alert("Deletado com sucesso")
        refreshTable()
    }catch(e){
        alert(e)
    }
    await refreshTable()
}

$('#tabelaLista').on('click', 'button', async function () {
    var row = table.row($(this).parents('tr'));
    var rowData = row.data()
    if (this.id === 'edit') {
        $("#txtId").val(rowData['id'])
        $("#txtName").val(rowData['name'])
        $("#txtDescription").val(rowData['description'])
        $("#txtCpf").val(rowData['cpf'])
        $("#txtAddress").val(rowData['address'])
        $("#txtPhone").val(rowData['phone'])
    } else {
        deleteClient(rowData['id']);
    }
});

async function loadTable() {
    await axios(url).then(function(response){
        table = $('#tabelaLista').DataTable({
            data: response.data,
            columnDefs:[
                {title: "ID", targets:0},
                {title: "Nome", targets:1},
                {title: "Descrição", targets:2},
                {title: "CPF", targets:3},
                {title: "Endereço", targets:4},
                {title: "Telefone", targets:5},
                {title: "Opções", targets: -1}
            ],
            columns: [
                {data: "id"},
                {data: "name"},
                {data: "description"},
                {data: "cpf"},
                {data: "address"},
                {data: "phone"},
                {data: null,
                    defaultContent: '<button id="edit">Editar</button>&nbsp;<button id="excluir">Excluir</button>',
                    targets: -1
                }
            ]
        })
    }).catch(function(error){
        alert(error)
    })

}
