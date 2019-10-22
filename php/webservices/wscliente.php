<?php
include '../model/MySQL.php';
switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST":
        switch ($_POST['requisicao']) {
            case 'CADASTRA_CLIENTE':
                gravaCliente($_POST['dataCliente']);
                break;
            case 'EXCLUI_CLIENTE':
                deleteCliente($_POST['idCliente']);
                break;
            default:
                # code...
                break;
        }
        break;
    case "GET":
        switch ($_GET['requisicao']) {
            case 'CONSULTA_DOCUMENTO':
                selectClienteByDocumento2($_GET['documento'], $_GET['tipoDocumento']);
                break;
            case 'CONSULTA_ID':
                selectClienteByID($_GET['dataCliente']);
                break;
                case 'CONSULTA_NOME':
                selectClienteByNome($_GET['nome']);
                break;
            default:
                # code...
                break;
        }
        break;
    default:
        # code...
        break;
}

function createCliente($jsonCliente){
    $dataClient = json_decode($jsonCliente);
    $instructionSQL = "INSERT INTO CLIENTES (NOME, ENDERECO, BAIRRO, TELEFONE, CELULAR, CIDADE, RG, CPF, DT_NASC, OBSERVACAO, STATUS, DT_CRIACAO, ID_USER) VALUES('$dataClient->NOME','$dataClient->ENDERECO','$dataClient->BAIRRO','$dataClient->TELEFONE', '$dataClient->CELULAR', '$dataClient->CIDADE', '$dataClient->RG', '$dataClient->CPF', '$dataClient->DT_NASC', '$dataClient->OBSERVACAO', '$dataClient->STATUS', '$dataClient->DT_CRIACAO', $dataClient->ID_USER)";
    $con = new MySQL();
    
    try {
        $result = $con->execQuery($instructionSQL);
        if(count($result) <= 0){
            print json_encode($retorno = [
            "msg"=>"O cliente foi CADASTRADO com sucesso",
            "statusCode"=> "01",
            "data"=> $result,
            "instucaoSQL" => $instructionSQL
            ]);
            }else{
                print json_encode($retorno = [
                "msg"=>"Ocorreu um PROBLEMA ao tentar CADASTRAR o  cliente",
                "statusCode"=> "02",
                "erro"=>$result,
                "instucaoSQL" => $instructionSQL
            ]);
        }
    } catch (Throwable $th) {
        print json_encode($retorno = [
            "msg"=>"Ocorreu um PROBLEMA ao tentar CADASTRAR o  cliente",
            "statusCode"=> "02",
            "erro"=>$th
        ]);
    }    
}

function updateCliente($jsonCliente, $condicao){
    $dataClient = json_decode($jsonCliente);
    if($condicao == "CPF"){
        $instructionSQL = "UPDATE CLIENTES SET NOME = '$dataClient->NOME', ENDERECO = '$dataClient->ENDERECO', BAIRRO = '$dataClient->BAIRRO', TELEFONE = '$dataClient->TELEFONE', CELULAR = '$dataClient->CELULAR', CIDADE = '$dataClient->CIDADE', RG = '$dataClient->RG', CPF = '$dataClient->CPF', DT_NASC = '$dataClient->DT_NASC', OBSERVACAO = '$dataClient->OBSERVACAO', STATUS = '$dataClient->STATUS', DT_CRIACAO = '$dataClient->DT_CRIACAO', ID_USER = '$dataClient->ID_USER' WHERE CPF = '$dataClient->CPF'";
    }else{
        $instructionSQL = "UPDATE CLIENTES SET NOME = '$dataClient->NOME', ENDERECO = '$dataClient->ENDERECO', BAIRRO = '$dataClient->BAIRRO', TELEFONE = '$dataClient->TELEFONE', CELULAR = '$dataClient->CELULAR', CIDADE = '$dataClient->CIDADE', RG = '$dataClient->RG', CPF = '$dataClient->CPF', DT_NASC = '$dataClient->DT_NASC', OBSERVACAO = '$dataClient->OBSERVACAO', STATUS = '$dataClient->STATUS', DT_CRIACAO = '$dataClient->DT_CRIACAO', ID_USER = '$dataClient->ID_USER' WHERE ID = '$dataClient->ID'";
    }
    $con = new MySQL();
    $result = $con->execQuery($instructionSQL);
   
    for($i=0;$i<count($result);$i++){
        try {
            if((gettype($result[$i]) == "array") && (count($result[$i]) > 0)){
                print json_encode($retorno = [
                    "msg"=>"O cliente foi ATUALIZADO com sucesso",
                    "statusCode"=> "01",
                    "instucaoSQL" => $instructionSQL
                ]);
            }
        } catch (Throwable $th) {
            print json_encode($retorno = [
                "msg"=>"Ocorreu um PROBLEMA ao tentar ATUALIZAR o  cliente",
                "statusCode"=> "02",
                "erro"=> $th,
                "instucaoSQL" => $instructionSQL
            ]);
        }
    }
}

function selectClienteByDocumento($jsonCliente){
    $dataClient = json_decode($jsonCliente);
    $instructionSQL = "SELECT * FROM CLIENTES WHERE CPF = '$dataClient->CPF'";
    $con = new MySQL();
    $result = $con->execQuery($instructionSQL);
   
    return json_encode($result);
}

function selectClienteByID2($idCliente){
    try {
        $instructionSQL = "SELECT * FROM CLIENTES WHERE ID=$idCliente";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);

        return json_encode($result);
    } catch (\Throwable $th) {
        return json_encode($retorno = [
            "msg"=>"Ocorreu um PROBLEMA ao tentar SELECIONAR o  cliente",
            "statusCode"=> "02",
            "erro"=> $th
        ]);
    }
} 

function gravaCliente($jsonCliente){
    $dataClient = json_decode($jsonCliente);
    if($dataClient->NOME == ""){
        print json_encode($retorkno = [
            "msg" => "Informe ao menos o nome do cliente",
            "statusCode" => "02"
        ]);
    }else{
        $consultaClienteID = json_decode(selectClienteByID2($dataClient->ID));
        if(count($consultaClienteID) <= 0){
            if($dataClient->CPF == ""){
                createCliente($jsonCliente);
            }else{
                $consultaClienteCPF = json_decode(selectClienteByDocumento($dataClient->CPF));
                if(count($consultaClienteCPF) <= 0){
                    createCliente($jsonCliente);
                }else{
                    updateCliente($jsonCliente, "CPF");
                }
            }
        }else{
            updateCliente($jsonCliente, "ID");
        }
    }    
    
}

function selectClienteByDocumento2($documento, $tipoDocumento){
    $instructionSQL = "SELECT * FROM CLIENTES WHERE $tipoDocumento = '$documento'";
    $con = new MySQL();
    $result = $con->execQuery($instructionSQL);

    
    if(count($result) > 0){
        print json_encode($retorno = [
            "msg"=>"O cliente foi SELECIONADO com sucesso",
            "statusCode"=> "01",
            "data"=>$result
        ]);
    }else{
        print json_encode($retorno = [
            "msg"=>"Nenhum cliente encontrado",
            "statusCode"=> "03",
            "data"=>$result,
            "instrucaoSQL"=>$instructionSQL
        ]);
    }
}

function selectClienteByID($idCliente){
    try {
        $instructionSQL = "SELECT * FROM CLIENTES WHERE ID=$idCliente";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);

         
    if(count($result) > 0){
        print json_encode($retorno = [
            "msg"=>"O cliente foi SELECIONADO com sucesso",
            "statusCode"=> "01",
            "data"=>$result
        ]);
    }else{
        print json_encode($retorno = [
            "msg"=>"Nenhum cliente encontrado",
            "statusCode"=> "03",
            "data"=>$result,
            "instrucaoSQL"=>$instructionSQL
        ]);
    }
    } catch (\Throwable $th) {
        print json_encode($retorno = [
            "msg"=>"Ocorreu um PROBLEMA ao tentar SELECIONAR o  cliente",
            "statusCode"=> "02",
            "erro"=> $th
        ]);
    }
}

function selectClienteByNome($nomeCliente){
    try {
        $instructionSQL = "SELECT * FROM clientes WHERE NOME LIKE '$nomeCliente%' ORDER BY NOME LIMIT 50";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);

         
    if(count($result) > 0){
        print json_encode($retorno = [
            "msg"=>"O cliente foi SELECIONADO com sucesso",
            "statusCode"=> "01",
            "data"=>$result,
            "instrucaoSQL" => $instructionSQL
        ]);
    }else{
        print json_encode($retorno = [
            "msg"=>"Nenhum cliente encontrado",
            "statusCode"=> "03",
            "data"=>$result,
            "instrucaoSQL"=>$instructionSQL
        ]);
    }
    } catch (\Throwable $th) {
        print json_encode($retorno = [
            "msg"=>"Ocorreu um PROBLEMA ao tentar SELECIONAR o  cliente",
            "statusCode"=> "02",
            "erro"=> $th
        ]);
    }
}

function deleteCliente($idCliente){
    try {
        $nomeCliente = "";
        $con = new MySQL();
        $instructionSQL = "SELECT * FROM CLIENTES WHERE ID = $idCliente";
        $result = $con->execQuery($instructionSQL);
        if(count($result) > 0){
            
            $nomeCliente = $result[0]["NOME"];
            $instructionSQL = "DELETE FROM CLIENTES WHERE ID = $idCliente";
            $result = $con->execQuery($instructionSQL);
            print json_encode($retorno = [
                "msg" => "O cliente '$nomeCliente' foi excluido",
                "statusCode" => "01",
                "instrucaoSQL" => $instructionSQL 
            ]);
        }else{
            print json_encode($retorno = [
                "msg" => "Cliente nao existe para ser excluido",
                "statusCode" => "02",
                "instrucaoSQL" => $instructionSQL
            ]);
        }
        
    } catch (\Throwable $th) {
        print json_encode("PROBLEMA AO EXCLUIR CLIENTE");
    }
}