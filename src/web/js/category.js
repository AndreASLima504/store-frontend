import 'regenerator-runtime/runtime';
import DataTable from 'datatables.net-dt';

import axios from 'axios';
const url = "http://localhost:3000/categories/";
let table



$(document).ready(function () {
    loadTable()
    
})


$("#btnSalvar").click(async function () {
    var id = $("#txtId").val()
    var name = $("#txtName").val()
    var description = $("#txtDescription").val()
    console.log(id, name, description)

    if(!id){
    await axios.post(url, {
        name:name,
        description: description
    }).then(function (response){
        alert("Categoria criado com sucesso")
        cleanFields()
    }).catch(function(error){
        console.log(error)
    });
    }else{
        await axios.put(url + id ,{
            name:name,
            description: description
        }).then(function(response){
            cleanFields()
        })
    }
    await refreshTable()
});


function cleanFields(){
    try{
        $("#txtId").val('')
        $("#txtName").val('')
        $("#txtDescription").val('')
    }catch(errors){
        console.log(errors)
    }
}


$("#btnCancelar").click(async function(){
    cleanFields()
})

async function refreshTable(){
    console.log("refreshado")
    try {
        const response = await axios(url);
        table.clear().rows.add(response.data).draw();
    } catch (error) {
        console.log("Erro ao atualizar a tabela: " + error);
    }
}

async function deleteCategory(id){
    try{
        await axios.delete(url + id)
        console.log("Deletado com sucesso")
    }catch(e){
        console.log(e)
    }
    await refreshTable()
}


$('#tabelaLista').on('click', 'button', function (e) {
    var row = table.row($(this).parents('tr'));
    var rowData = row.data()
    if (this.id === 'edit') {
        $("#txtId").val(rowData['id'])
        $("#txtName").val(rowData['name'])
        $("#txtDescription").val(rowData['description'])
    } else {
        deleteCategory(rowData['id']);
    }
});


async function loadTable(){
    await axios(url).then(function(response){
        table = $('#tabelaLista').DataTable({
            data: response.data,
            columnDefs:[
                {title: "Id", targets: 0},
                {title: "Nome", targets: 1},
                {title: "Descrição", targets: 2},
                {title: "Opções", targets: -1},
                
            ],
            columns: [
                { data: "id" },
                { data: "name" },
                { data: "description" },
                {data: null,
                    defaultContent: '<button id="edit">Editar</button>&nbsp;<button id="excluir">Excluir</button>',
                    targets: -1},
            ],
        })
        
    }).catch(function (error){
        console.log(error)
    })
}