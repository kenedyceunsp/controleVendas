realizaLogin = (usuario, senha) => {
    $.ajax({
        url: 'php/webservices/wslogin.php',
        beforeSend: function(req){
            console.log(req)
        },
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            usuario: usuario,
            senha: senha,
            requisicao: 'REALIZA_LOGIN'
        }
    }).done(function (retorno) {
        console.log(retorno)
  
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

$(document).ready(function () {
    $('#realizaLogin').on("click", function () {
        let nomeUsuario = $('#loginUsuario').val()
        let senhaUsuario = $('#loginSenha').val()

        if((nomeUsuario !== "")&&(senhaUsuario !== "")){
            realizaLogin(nomeUsuario, senhaUsuario)
        }else{
            alert("Usuario e/ou senha não informado(s)")
        }
    })
})