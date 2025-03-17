import 'regenerator-runtime/runtime';
import axios from 'axios';
const url = "http://localhost:3000/";
let token
$("#btnLogin").click(async function () {
    var email = $("#txtEmail").val()
    var senha = $("#txtPassword").val()

    await axios.post(url + 'login', {
        email:email,
        password:senha
     }).then(function (response){
        token = response.data["token"]
        window.localStorage.setItem("token_de_acesso",token)
        window.location.replace("menu.html")
        }).catch(function(error){
        alert(error)
    });
});