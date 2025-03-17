import "regenerator-runtime/runtime"
import DataTable from "datatables.net-dt"
import axios from "axios"
const url = "http://localhost:3000/sales/"
let table
let user
var products
let clients


let token = window.localStorage.getItem("token_de_acesso")
const config = {
    headers: { Authorization: `Bearer ${token}` }
};

const bodyParameters = {
   key: "value"
};

$(document).ready(async function(){
   try{
        loadSaleTable()
        cleanFields()
        loadUser()
        loadProduct()
        loadClient()
   }catch(error){
        alert(error)
   }
})

$("#btnSalvar").click(async function () {
    var id = $("#txtID").val()
    var userId = $("#selectUser").val()
    var prodId = $("#selectProd").val()
    var clientId = $("#selectClient").val()
    var quantity =parseInt($("#txtQuantity").val())
    if(!id){
        axios.post(url,{
            clientId: clientId,
            productId:prodId,
            userId: userId,
            quantity: quantity
        }, config, bodyParameters).then(function(response){
            alert("Venda criada com sucesso")
            cleanFields()
            refreshTable()
        }).catch(function(error){
            alert(error)
        })
    }else{
        axios.put(url+id,{
            id:id,
            userId:userId,
            productId:prodId,
            clientId:clientId,
            quantity:quantity
        } , config, bodyParameters
    ).then(function(response){
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

$("#tabelaSale").on('click', 'button', function(e){
    var row = table.row($(this).parents('tr'))
    var rowData = row.data()
    if(this.id === "edit"){
        $("#txtID").val(rowData['id'])
        $("#selectUser").val(rowData['userId'])
        $("#selectProd").val(rowData['productId'])
        $("#selectClient").val(rowData['clientName'])
        $("#txtQuantity").val(rowData['quantity'])

    }else{
        deleteSale(rowData['saleId'])
        refreshTable()
    }
})


async function refreshTable() {
    try {
        const response = await axios(url, config, bodyParameters);
        table.clear().rows.add(response.data).draw();
    } catch (error) {
        console.log("Erro ao atualizar a tabela: " + error);
    }
}


async function loadUser(){
    user = await axios("http://localhost:3000/users/", config, bodyParameters)

    var select = $("#selectUser")
    user.data.forEach(u =>{
        var option = document.createElement('option')
        option.value = u['id']
        option.innerHTML = u['name']

        select.append(option)
    })
}


async function loadClient(){
    clients = await axios("http://localhost:3000/clients/", config, bodyParameters)

    var select = $("#selectClient")
    clients.data.forEach(p => {
        var option = document.createElement('option')
        option.value = p['id']
        option.innerHTML = p['name']
        
        select.append(option)
    });
}


async function loadProduct(){
    products = await axios("http://localhost:3000/products/",  config, bodyParameters)
    var select = $("#selectProd")
    products.data.forEach( p => {
        var option = document.createElement('option')
        option.value = p['id']
        option.innerHTML = p['name']

        select.append(option)
    });
}



async function loadSaleTable() {
    await axios(url, config, bodyParameters).then(function(response){
        let saleData = response.data
        for (var sale of saleData){
            sale.products = JSON.parse(sale.products)
            for(var product of sale.products){
                
                delete product.productId
            }
            sale.products = JSON.stringify(sale.products)
            .replace(/"productName"/g, "Produto")     
            .replace(/"quantity"/g, "quantidade")    
            .replace(/[\[\]{}"]/g, "")
            .split(",")
        }
        // console.log(response.data)
        table = $('#tabelaSale').DataTable({
            data: response.data,
            columnDefs:[
                {title: "ID", targets:0},
                {title: "Usuário", targets:1},
                {title: "Vendedor", targets:2},
                {title: "Produtos", targets:3},
                {title: "Valor da venda", targets:4},
                {title: "Opções", targets:-1}
            ],
            columns: [
                {data: "saleId"},
                {data: "userName"},
                {data: "storeName"},
                {data: "products"},
                {data: "saleValue"},
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
    $("#selectUser").val('')
    $("#selectProd").val('')
    $("#selectClient").val('')
    $("#txtQuantity").val('')
}

async function deleteSale(id){
    try{
        await axios.delete(url + id, config, bodyParameters)
        alert("Deletado com sucesso")
    }catch(error){
        alert(error)
    }
    await refreshTable()
}



