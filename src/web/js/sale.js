import "regenerator-runtime/runtime"
import DataTable from "datatables.net-dt"
import axios from "axios"
const url = "http://localhost:3000/sales/"
let table
$(document).ready(async function(){
    loadTable()
})

$("#btnSalvar").click(async function () {
    var id = $("#txtID").val()
    var userId = $("#txtUserID").val()
    var prodId = $("#txtProdID").val()
    var clientId = $("#txtClientID").val()
    var quantity =parseInt($("#txtQuantity").val())
    var value = parseInt($("#txtValue").val())
    if(!id){
        axios.post(url,{
            userId:userId,
            productId:prodId,
            clientId:clientId,
            quantity:quantity,
            value:value
        }).then(function(response){
            alert("Venda criada com sucesso")
            cleanFields()
            refreshTable()
        }).catch(function(error){
            alert(error)
        })
    }else{
        axios.put(url+id, {
            id:id,
            userId:userId,
            productId:prodId,
            clientId:clientId,
            quantity:quantity,
            value:value
        }).then(function(response){
            alert("Informações alteradas")
            cleanFields()
            refreshTable()
        }).catch(function(error){
            alert(error)
            console.log(userId, ",", prodId, "/", clientId, "/", quantity, "/", value)
        })
    }
})

$("#btnLimpar").click(async function () {
    cleanFields()
})

$("#tabelaLista").on('click', 'button', function(e){
    var row = table.row($(this).parents('tr'))
    var rowData = row.data()
    if(this.id === "edit"){
        $("#txtID").val(rowData['id'])
        $("#txtUserID").val(rowData['userId'])
        $("#txtProdID").val(rowData['productId'])
        $("#txtClientID").val(rowData['clientId'])
        $("#txtQuantity").val(rowData['quantity'])
        $("#txtValue").val(rowData['value'])
    }else{
        deleteSale(rowData['id'])
        refreshTable()
    }
})

async function loadTable() {
    await axios(url).then(function(response){
        table = $('#tabelaLista').DataTable({
            data: response.data,
            columnDefs:[
                {title: "ID", targets:0},
                {title: "ID User", targets:1},
                {title: "ID Produto", targets:2},
                {title: "ID Cliente", targets:3},
                {title: "Quantidade", targets:4},
                {title: "Valor", targets:5},
                {title: "Opções", targets: -1}
            ],
            columns: [
                {data: "id"},
                {data: "userId"},
                {data: "productId"},
                {data: "clientId"},
                {data: "quantity"},
                {data: "value"},
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

function cleanFields(){
    $("#txtID").val('')
    $("#txtUserID").val('')
    $("#txtProdID").val('')
    $("#txtClientID").val('')
    $("#txtQuantity").val('')
    $("#txtValue").val('')
}

async function deleteSale(id){
    try{
        await axios.delete(url + id)
        alert("Deletado com sucesso")
    }catch(error){
        alert(error)
    }
    await refreshTable()
}

async function refreshTable() {
    console.log("refreshado")
    try {
        const response = await axios(url);
        table.clear().rows.add(response.data).draw();
    } catch (error) {
        console.log("Erro ao atualizar a tabela: " + error);
    }
}