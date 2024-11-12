import 'regenerator-runtime/runtime';
import DataTable from 'datatables.net-dt';

import axios from 'axios';
const url = "http://localhost:3000/products/";
let table

let categorias

$(document).ready(async function () {
    loadTable()
    loadCategories()
    
})

async function loadCategories(){
    categorias = await axios("http://localhost:3000/categories/")
    console.log(categorias.data)

    var select = $("#selectCategory")
    categorias.data.forEach(c => {
        var option = document.createElement('option')
        option.value = c['id']
        option.innerHTML = c['name']
        
        select.append(option)
    });
}

$("#btnSalvar").click(async function () {
    var id = $("#txtId").val()
    var name = $("#txtName").val()
    var description = $("#txtDescription").val()
    var price = $("#txtPrice").val()
    var categoryId = $("#selectCategory").val()

    if(!id){
    await axios.post(url, {
        name:name,
        description: description,
        price: price,
        categoryId: categoryId,
    }).then(function (response){
        
        alert("Produto criado com sucesso")
        console.log(response)
        cleanFields()
    
    }).catch(function(error){
        console.log(error)
    });
    }else{
        await axios.put(url + id ,{
            name:name,
            description: description,
            price: price,
            categoryId: categoryId
        }).then(
            cleanFields()
        )
    }
    await refreshTable()
});


function cleanFields(){
    try{
        $("#txtId").val('')
        $("#txtName").val('')
        $("#txtDescription").val('')
        $("#txtPrice").val('')
        $("#txtCategoryId").val('')
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
        $("#txtPrice").val(rowData['price'])
        $("#selectCategory").val(rowData['categoryId'])
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
                {title: "Preço unitário", targets: 3},
                {title: "Categoria", targets: 4},
                {title: "Opções", targets: -1},
                
            ],
            columns: [
                { data: "id" },
                { data: "name" },
                { data: "description" },
                { data: "price" },
                { data: "categoryName" },
                {data: null,
                    defaultContent: '<button id="edit">Editar</button>&nbsp;<button id="excluir">Excluir</button>',
                    targets: -1},
            ],
        })
        
    }).catch(function (error){
        console.log(error)
    })
}