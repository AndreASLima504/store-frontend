import 'regenerator-runtime/runtime';
import axios from 'axios';
const url = "http://localhost:3000/";

$("#btnLogin").click(async function () {
     var email = $("#txtEmail").val()
     var senha = $("#txtSenha").val()

     await axios.post(url + 'login', {
         email:email,
         password:senha
     }).then(function (response){
         alert("Usuário logado com sucesso")
     }).catch(function(error){
         alert(error)
     });
});