<?php
include '../model/MySQL.php';
switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST":
            switch ($_POST['requisicao']) {

                case 'CADASTRA_FICHA':
                    gravaFicha($_POST['dataFicha']);
                    break;
                case 'ATUALIZA_STATUS_FICHA':
                    updateStatusFicha($_POST['statusFicha'], $_POST['idFicha']);
                break;
                case 'ATUALIZA_CHECK_IN':
                    updateCheckIn($_POST['idFicha'], $_POST['dtCheckIn']);
                break;
                case 'ATUALIZA_INFO_FICHA':
                    updateInfoFicha($_POST['infoFicha']);
                break;
                case 'EXCLUIR_FICHA':
                    deleteFicha($_POST['idFicha']);
                break;
                default:
                    # code...
                    break;
            }
        break;
    case "GET":
            switch ($_GET['requisicao']) {
                case 'CONSULTA_FICHA_CLIENTE':
                    selectFichasByIdCliente($_GET['idCliente']);
                    break;
                case 'CONSULTA_ULTIMA_FICHA':
                    selectUltimaFicha();
                    break;
                    case 'CONSULTA_FICHA_ID':
                    selectFichaByID($_GET['idFicha']);
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

function selectFichasByIdCliente($idCliente){
    $instructionSQL = "SELECT * FROM FICHAS WHERE ID_CLIENTE = '$idCliente' ORDER BY DT_CRIACAO DESC";
    $con = new MySQL();
    try {
        $result = $con->execQuery($instructionSQL);
        if(count($result) <= 0){
            print json_encode($retorno = [
                "msg"=>"NENHUMA ficha cadastrada para esse cliente",
                "statusCode"=>"03",
                "data"=>$result
            ]);
        }else{
            print json_encode($retorno = [
                "msg"=>"o cliente POSSUI fichas cadastradas",
                "statusCode"=>"01",
                "data"=> $result,
                "instrucaoSQL"=> $instructionSQL
            ]);
        }
    } catch (Throwable $th) {
        print json_encode($retorno = [
            "msg"=>"Ocorreu um PROBLEMA ao tentar selecionar uma ficha",
            "statusCode"=> "02",
            "erro"=> $th
        ]);
    }
}

function selectUltimaFicha(){
    $instructionSQL = "SELECT * FROM FICHAS ORDER BY DT_CRIACAO DESC LIMIT 1";
    $con = new MySQL();
    try {
        $result = $con->execQuery($instructionSQL);
        if(count($result) <= 0){
            print json_encode($retorno = [
                "msg"=>"Primeira ficha do sistema",
                "statusCode"=>"03",
                "data"=>$result
            ]);
        }else{
            $idUltimaFicha = 1;
            foreach ($result as $key => $value) {
                if($key == "ID"){
                    $idUltimaFicha = (int)$value["ID"];
                }
            }
            $instructionSQL = "ALTER TABLE FICHAS AUTO_INCREMENT = $idUltimaFicha";
            $con->execQuery($instructionSQL);
            print json_encode($retorno = [
                "msg"=>"Ultima ficha cadastrada encontrada com sucesso",
                "statusCode"=>"01",
                "data"=> $result,
                "instrucaoSQL"=> $instructionSQL
            ]);
        }
    } catch (Throwable $th) {
        print json_encode($retorno = [
            "msg"=>"Ocorreu um PROBLEMA ao tentar criar uma nova ficha",
            "statusCode"=> "02",
            "erro"=> $th
        ]);
    }
}

function createFicha($jsonFicha){
    try {
        $dataFicha = json_decode($jsonFicha);
        $instructionSQL = "INSERT INTO FICHAS(ID_CLIENTE, QTD_PARCELAS, TOTAL, MERCADORIAS ,DT_CRIACAO, STATUS, VENDEDOR, MOTORISTA ,ID_USER) VALUES('$dataFicha->ID_CLIENTE', '$dataFicha->QTD_PARCELAS', '$dataFicha->TOTAL', '$dataFicha->MERCADORIAS', '$dataFicha->DT_CRIACAO','$dataFicha->STATUS','$dataFicha->VENDEDOR', '$dataFicha->MOTORISTA' ,'$dataFicha->ID_USER')";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        print json_encode($retorno = [
            "msg"=> "A ficha foi CADASTRADA com sucesso",
            "statusCode"=> "01"
        ]);
    } catch (\Throwable $th) {
        print json_encode($retorno = [
            "msg"=> "houve um PROBLEMA ao tentar cadastrar a ficha",
            "statusCode"=> "02",
            "erro" => $th
        ]);
    }
}

function gravaFicha($jsonFicha){
    try {

        $verificaFichaJson = verificaFicha($jsonFicha);
        $verificaFicha = json_decode($verificaFichaJson);

        switch ($verificaFicha->statusCode) {
            case '02':
                print $verificaFichaJson;
                break;
            case '01':
                createFicha($jsonFicha);
                break;
                case '03':
                print $verificaFichaJson;
                break;
                case '04':
                updateInfoFicha($jsonFicha);
                break;
            default:
                # code...
                break;
        }
    } catch (\Throwable $th) {
        //throw $th;
    }
}

function verificaFicha($jsonFicha){
    try {
        $dataFicha = json_decode($jsonFicha);
        $instructionSQL = "SELECT * FROM FICHAS WHERE ID_CLIENTE = $dataFicha->ID_CLIENTE AND QTD_PARCELAS = $dataFicha->QTD_PARCELAS AND TOTAL = $dataFicha->TOTAL AND MERCADORIAS = '$dataFicha->MERCADORIAS' AND VENDEDOR = '$dataFicha->VENDEDOR' AND MOTORISTA = '$dataFicha->MOTORISTA'";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        if(count($result) <= 0){
            $instructionSQL = "SELECT * FROM FICHAS WHERE ID = $dataFicha->ID";
            $result = $con->execQuery($instructionSQL);
           if(count($result) <= 0 ){
            return json_encode($retorno = [
                "msg"=>"A ficha não existe no sistema, pode gravar",
                "statusCode"=>"01",
                "data"=>$result,
                "instrucaoSQL"=> $instructionSQL
            ]);
           }else{
            return json_encode($retorno = [
                "msg"=>"A ficha existe no sistema, mas não é a mesma",
                "statusCode"=>"04",
                "data"=>$result,
                "instrucaoSQL"=> $instructionSQL
            ]);
           }
        }else{
            return json_encode($retorno = [
                "msg"=>"Está tentando cadastrar a mesma ficha duas vezes ou tentou atualizar informações sem fazer nenhuma alteração",
                "statusCode"=>"02",
                "data"=> $result,
                "instrucaoSQL"=> $instructionSQL
            ]);
        }

    } catch (Throwable $th) {
        return json_encode($retorno = [
            "msg"=>"problema ao verificar fichas",
            "statusCode"=>"03",
            "erro"=> $th,
            "instrucaoSQL"=> $instructionSQL
        ]);
    }
}

function selectFichaByID($idFicha){
    try {
        $dataFicha = json_decode($idFicha);
        $instructionSQL = "SELECT * FROM FICHAS WHERE ID=$dataFicha->ID";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
       // var_dump($instructionSQL);
        if(count($result) > 0){
            print json_encode($retorno = [
                "msg"=> "A ficha foi selecionada com sucesso",
                "statusCode"=> "01",
                "data"=>$result,
                "instrucaoSQL"=> $instructionSQL
            ]);
        }else{
            print json_encode($retorno = [
                "msg"=> "NENHUMA ficha foi selecionada",
                "statusCode"=> "02",
                "data"=>$result,
                "instrucaoSQL"=> $instructionSQL
            ]);
        }
    } catch (Throwable $th) {
        print json_encode($retorno = [
            "msg"=> "houve um PROBLEMA ao tentar selecionar a ficha",
            "statusCode"=> "02",
            "erro" => $th,
            "instrucaoSQL"=> $instructionSQL
        ]);
    }
}

function updateStatusFicha($statusFicha, $idFicha){
    try {
        $dataFicha = json_decode($idFicha);
        $instructionSQL = "UPDATE fichas SET STATUS='$statusFicha' WHERE ID = $dataFicha->ID";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        $msg = "";
        if($statusFicha == "pendente"){
            $msg = "O valor informado não é suficiente para receber finalizar a ficha";
        }else{
            $msg = "A ficha foi finalizada";
        }
        print json_encode($retorno = [
            "msg"=> $msg,
            "statusCode"=> "01",
            "data"=>$result,
            "instrucaoSQL"=> $instructionSQL
        ]);
    } catch (Throwable $th) {
        print json_encode($retorno = [
            "msg"=> "houve um PROBLEMA ao tentar atualizar a ficha",
            "statusCode"=> "02",
            "erro" => $th,
            "instrucaoSQL"=> $instructionSQL
        ]);
    }
}

function updateCheckIn($idFicha, $dtCheckIn){
    try {
        $instructionSQL = "UPDATE FICHAS SET CHECK_IN='$dtCheckIn' WHERE ID=$idFicha";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        print json_encode($retorno = [
            "msg"=> "o CHECK IN foi realizado com sucesso",
            "statusCode"=> "01",
            "data"=>$result,
            "instrucaoSQL"=> $instructionSQL
        ]);
    } catch (\Throwable $th) {
        print json_encode($retorno = [
            "msg"=> "houve um PROBLEMA ao tentar atualizar a ficha",
            "statusCode"=> "02",
            "erro" => $th,
            "instrucaoSQL"=> $instructionSQL
        ]);
    }
}

function updateInfoFicha($jsonFicha){
    try {
        $dataFicha = json_decode($jsonFicha);
        $instructionSQL = "UPDATE fichas SET QTD_PARCELAS = $dataFicha->QTD_PARCELAS, TOTAL = $dataFicha->TOTAL, MERCADORIAS = '$dataFicha->MERCADORIAS', VENDEDOR = '$dataFicha->VENDEDOR', MOTORISTA = '$dataFicha->MOTORISTA' WHERE ID = $dataFicha->ID";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        print json_encode($retorno = [
            "instrucaoSQL" => $instructionSQL,
            "statusCode" => "03",
            "msg" => "Ficha foi atualizada com sucesso"
        ]);
    } catch (\Throwable $th) {
        echo json_encode("Problema com a ficha: ".$th);
    }
}

function deleteFicha($idFicha){
    try {
        $instructionSQL = "DELETE FROM FICHAS WHERE ID = $idFicha";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        print json_encode($retorno = [
            "msg" => "Ficha excluida com sucesso",
            "statusCode" => "01",
            "instrucaoSQL" => $instructionSQL,
            "data" => $result
        ]);
    } catch (\Throwable $th) {
        echo json_encode("Problema com a ficha: ".$th);
    }
}


/**o status code se refere ao o que aconteceu na interação como banco de dados, sendo: 01=conexao feita
 * com sucesso; 02= problema ao conectar; 03=retorno null de uma consulta
 */