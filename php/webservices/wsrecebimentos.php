<?php
include '../model/MySQL.php';
switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST":
            switch ($_POST['requisicao']) {
                case 'CADASTRA_RECEBIMENTO':
                   createRecebimento($_POST['dataRecebimento']);
                break;
                case 'EXCLUI_ULTIMO_RECEBIMENTO':
                deleteRecebimento($_POST['idRecebimento']);
                break;
            default:
    }
        break;
    case "GET":
            switch ($_GET['requisicao']) {
                case 'CONSULTA_RECEBIMENTO_IDFICHA':
                    selectRecebimentoByIdFicha($_GET['idFicha']);
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

function createRecebimento($jsonRcebimento){
    
    try {
        $dataRecebimento = json_decode($jsonRcebimento);
        $instructionSQL = "INSERT INTO RECEBIMENTOS(ID_FICHA, DT_RECEBIMENTO, VALOR, DT_CRIACAO ,ID_USER) VALUES('$dataRecebimento->ID_FICHA', '$dataRecebimento->DT_RECEBIMENTO', '$dataRecebimento->VALOR', '$dataRecebimento->DT_CRIACAO' ,'$dataRecebimento->ID_USER')";
        
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        //var_dump($result);
        print json_encode($retorno = [
            "msg"=>"recebimento REALIZADO com sucesso",
            "statusCode"=>"01",
            "instrucaoSQL"=> $instructionSQL
        ]);
    } catch (Throwable $th) {
        
        print json_encode($retorno = [
            "msg"=>"PROBLEMA ao tentar realizar o recebimento",
            "statusCode"=>"03",
            "instrucaoSQL"=> $instructionSQL,
            "erro"=>$th
        ]);
    }
}

function selectRecebimentoByIdFicha($idFicha){
    try {
        $instructionSQL = "SELECT * FROM RECEBIMENTOS WHERE ID_FICHA = $idFicha ORDER BY DT_RECEBIMENTO";
        
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);

        if(count($result) > 0){
            print json_encode($retorno = [
                "msg"=>"recebimento SELECIONADO com sucesso",
                "statusCode"=>"01",
                "instrucaoSQL"=> $instructionSQL,
                "data"=>$result
            ]);
        }else{
            print json_encode($retorno = [
                "msg"=>"NENHUM recebimento encontrado",
                "statusCode"=>"02",
                "instrucaoSQL"=> $instructionSQL,
                "data"=>$result
            ]);
        }
    } catch (Throwable $th) {
        print json_encode($retorno = [
            "msg"=>"PROBLEMA ao tentar consultar o recebimento",
            "statusCode"=>"03",
            "instrucaoSQL"=> $instructionSQL,
            "erro"=>$th
        ]);
    }
}

function deleteRecebimento($idRecebimento){
    $arrInstrucoes = [];
    $i = 0;
    try {
        $instructionSQL = "DELETE FROM RECEBIMENTOS WHERE ID = $idRecebimento";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        $arrInstrucoes[$i] = $instructionSQL;
        $i++;
        $newID = (int)$idRecebimento - 1;
        $instructionSQL = "ALTER TABLE RECEBIMENTOS AUTO_INCREMENT = $newID";
        $con->execQuery($instructionSQL);
        $arrInstrucoes[$i] = $instructionSQL;
        print json_encode($retorno = [
            "msg"=>"Recebimento excluido",
            "statusCode"=>"01",
            "instrucaoSQL"=> $arrInstrucoes,
            "data"=>$result
        ]);
    } catch (\Throwable $th) {
        echo json_encode("Erro ao tentar excluir o recebimento: ".$th);
    }
}