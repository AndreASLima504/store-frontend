import 'regenerator-runtime/runtime';
import DataTable from 'datatables.net-dt';

import axios from 'axios';
const url = "http://localhost:3000/stores/";
let table

let categorias

let token = window.localStorage.getItem("token_de_acesso")
const config = {
    headers: { Authorization: `Bearer ${token}` }
};

const bodyParameters = {
   key: "value"
};

$(document).ready(async function () {
    loadTable()
    loadCategories()
    
})

async function loadCategories(){
    categorias = await axios("http://localhost:3000/categories/", config, bodyParameters)
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
    var address = $("#txtAddress").val()
    var description = $("#txtDescription").val()
    var inOperation = ($("#boolInOperation").val() === "true")
    var isOfficial = ($("#boolIsOfficial").val() === "true")
    var categoryId = $("#selectCategory").val()
    if(!id){
    await axios.post(url, {
        name:name,
        address:address,
        description:description,
        isOfficial:isOfficial,
        inOperation: inOperation,
        categoryId: categoryId,
    }, config, bodyParameters
    ).then(function (response){
        
        alert("Loja criada com sucesso")
        console.log(response)
        cleanFields()
    
    }).catch(function(error){
        console.log(error)
    });
    }else{
        await axios.put(url + id , {
            name:name,
            address:address,
            isOfficial:isOfficial,
            description:description,
            inOperation: inOperation,
            categoryId: categoryId
        }, config
        ).then(function(response){
            cleanFields()
            

        }).catch(function(error){
            alert(error)
            
        })
    }
    await refreshTable()
});


function cleanFields(){
    try{
        $("#txtId").val('')
        $("#txtName").val('')
        $("#txtAddress").val('')
        $("#boolInOperation").val('')
        $("#selectCategory").val('')
        $("#txtDescription").val('')
        $("#boolIsOfficial").val('')
    }catch(errors){
        console.log(errors)
    }
}


$("#btnCancelar").click(async function(){
    cleanFields()
})

async function refreshTable(){
    try {
        const response = await axios(url, config, bodyParameters);
        table.clear().rows.add(response.data).draw();
    } catch (error) {
        console.log("Erro ao atualizar a tabela: " + error);
    }
}

async function deleteVendor(id){
    try{
        await axios.delete(url + id, config, bodyParameters)
        alert("Deletado com sucesso")
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
        $("#txtAddress").val(rowData['address'])
        $("#selectCategory").val(rowData['categoryId'])
        console.log(rowData['categoryId'])
        if(rowData['inOperation'].toString() === "1"){
            $("#boolInOperation").val("true")
        }else{
            $("#boolInOperation").val("false")
        }
        if ((rowData['isOfficial']).toString() === "1") {
            $("#boolIsOfficial").val("true")
        } else {
            $("#boolIsOfficial").val("false")
        }
        
    } else {
        deleteVendor(rowData['id']);
    }
});


async function loadTable(){
    await axios(url, config, bodyParameters).then(function(response){
        table = $('#tabelaLista').DataTable({
            data: response.data,
            columnDefs:[
                {title: "Id", targets: 0},
                {title: "Nome", targets: 1},
                {title: "Endereço", targets: 2},
                {title: "Descrição", targets: 3},
                {title: "Categoria", targets: 4},
                {title: "Oficial", targets: 5},
                {title: "Operante", targets: 6},
                {title: "Opções", targets: -1},
                
            ],
            columns: [
                { data: "id" },
                { data: "name" },
                { data: "address" },
                { data: "description"},
                { data: "categoryName" },
                { data: "isOfficial", render: function (data, type, row) {return data ? "Sim" : "Não";} },
                { data: "inOperation", render: function (data, type, row) {return data ? "Sim" : "Não";} },
                {data: null,
                    defaultContent: '<button id="edit">Editar</button>&nbsp;<button id="excluir">Excluir</button>',
                    targets: -1},
            ],
        })
        
    }).catch(function (error){
        console.log(error)
    })
   
}