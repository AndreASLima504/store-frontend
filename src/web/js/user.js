import 'regenerator-runtime/runtime';
import DataTable from 'datatables.net-dt';

import axios from 'axios';
const url = "http://localhost:3000/";




$(document).ready(function () {
    loadTable()
    
    $("#btnSalvar").click(async function () {
        var name = $("#txtName").val()
        var email = $("#txtEmail").val()
        var admin = $("#boolAdmin").val()
        var password = $("#txtPassword").val()
        console.log(name, email, admin, password)
    
        
         await axios.post(url + 'users', {
            name:name,
            email:email,
            admin:admin,
            password:password
         }).then(function (response){
             alert("Usuário criado com sucesso")
             loadTable()
         }).catch(function(error){
             alert(error)
         });
    });
})


async function loadTable(){
    await axios(url + "users").then(function(response){
        $('#tabelaLista').DataTable({
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