<?php
include '../model/MySQL.php';
switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST":
        
        break;
    case "GET":
        switch ($_GET['requisicao']) {
            case 'REALIZA_LOGIN':
                    realizaLogin($_GET['usuario'], $_GET['senha']); 
                break;
            
        }
        break;
    default:
        # code...
        break;
}

function realizaLogin($usuario, $senha){
    try {
        $senhaMD5 = geraMD5($senha);
        $instructionSQL = "SELECT NOME, EMAIL, DT_CRIACAO FROM USUARIOS WHERE NOME = '$usuario' AND SENHA = '$senhaMD5'";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        
        if(count($result) > 0){
            print json_encode($retorno = [
                "MSG" => "Usuario e senha autenticados com sucesso",
                "statusCode" => "01",
                "data"=> $result
            ]);
        }else{
            print json_encode($retorno = [
                "MSG" => "Não foi possivel autenticar o usuario",
                "statusCode" => "02",
            ]);
        }
    } catch (Throwable $th) {
        echo json_encode("Problema ao tentar autenticar usuario, contate desenvolvedor");
    }
}

function geraMD5($string){
    return md5(trim($string));
}