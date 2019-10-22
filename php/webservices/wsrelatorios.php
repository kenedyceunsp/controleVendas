<?php
include '../model/MySQL.php';
switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST":
            switch ($_POST['requisicao']) {
                
            default:
                # code...
                break;
    }
        break;
    case "GET":
            switch ($_GET['requisicao']) {
                case 'CLIENTES_CONTAS_VENCIDAS':
                    selectContasVencidas($_GET['dtInicio'], $_GET['dtFim']);
                    break;
                case 'CLIENTES_CONTAS_RCEBIDAS':
                    selectContasRecebidas($_GET['dtInicio'], $_GET['dtFim']);
                break;
                case 'FICHAS_FALTANTES':
                    selectFichasVerificadas($_GET['dtInicio'], $_GET['dtFim']);
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

function selectContasVencidas($dtInicio, $dtFim){
    try {
        $instructionSQL = "SELECT c.NOME, p.VENCIMENTO, p.VALOR, f.VENDEDOR, f.MOTORISTA, f.ID as NUMFICHA FROM clientes as c INNER JOIN fichas as f ON c.ID=f.ID_CLIENTE INNER JOIN parcelas as p ON p.ID_FICHA=f.ID WHERE p.VENCIMENTO BETWEEN '$dtInicio' AND '$dtFim' AND p.STATUS='pendente' ORDER BY p.VENCIMENTO";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        if(count($result) > 0){
            print json_encode($retorno = [
                "msg"=>"Relatorio SELECIONADO com sucesso",
                "statusCode"=> "01",
                "data"=> $result,
                "instrucaoSQL"=>$instructionSQL
            ]);
        }else{
            print json_encode($retorno = [
                "msg"=>"PROBLEMA ao selecionar o relatorio",
                "statusCode"=> "03",
                "data"=> $result,
                "instrucaoSQL"=>$instructionSQL
            ]);
        }
    } catch (Throwable $th) {
        print json_encode($retorno = [
            "msg"=>"PROBLEMA ao selecionar o relatorio",
            "statusCode"=> "03",
            "data"=> $result,
            "instrucaoSQL"=>$instructionSQL
        ]);
    }
}

function selectContasRecebidas($dtInicio, $dtFim){
    try {
        $instructionSQL = "SELECT c.NOME, r.VALOR as VALORRECEBIDO, r.DT_RECEBIMENTO, f.ID as NUMFICHA FROM clientes AS c INNER JOIN fichas as f ON f.ID_CLIENTE=c.ID INNER JOIN recebimentos as r ON r.ID_FICHA=f.ID WHERE r.DT_RECEBIMENTO BETWEEN '$dtInicio' AND '$dtFim'";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        if(count($result) > 0){
            print json_encode($retorno = [
                "msg"=>"Relatorio SELECIONADO com sucesso",
                "statusCode"=> "01",
                "data"=> $result,
                "instrucaoSQL"=>$instructionSQL
            ]);
        }else{
            print json_encode($retorno = [
                "msg"=>"PROBLEMA ao selecionar o relatorio",
                "statusCode"=> "03",
                "data"=> $result,
                "instrucaoSQL"=>$instructionSQL
            ]);
        }
    } catch (Throwable $th) {
        print json_encode($retorno = [
            "msg"=>"PROBLEMA ao selecionar o relatorio",
            "statusCode"=> "03",
            "data"=> $result,
            "instrucaoSQL"=>$instructionSQL
        ]);
    }
}

function selectFichasVerificadas($dataInicio, $dataFim){
    try {
        $instructionSQL = "SELECT f.ID as NUMFICHA, c.NOME, f.MERCADORIAS, f.VENDEDOR, f.MOTORISTA, f.DT_CRIACAO as CADASTRADA_EM, f.CHECK_IN as ULTIMA_VISUALIZACAO FROM fichas as f INNER JOIN clientes as c ON c.ID=f.ID_CLIENTE WHERE f.CHECK_IN NOT BETWEEN '$dataInicio' AND '$dataFim' AND f.STATUS = 'pendente'";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        if(count($result) > 0){
            print json_encode($retorno = [
                "msg"=>"Relatorio SELECIONADO com sucesso",
                "statusCode"=> "01",
                "data"=> $result,
                "instrucaoSQL"=>$instructionSQL
            ]);
        }else{
            print json_encode($retorno = [
                "msg"=>"PROBLEMA ao selecionar o relatorio",
                "statusCode"=> "03",
                "data"=> $result,
                "instrucaoSQL"=>$instructionSQL
            ]);
        }
    } catch (Throwable $th) {
        print json_encode($retorno = [
            "msg"=>"PROBLEMA ao selecionar o relatorio",
            "statusCode"=> "03",
            "data"=> $result,
            "instrucaoSQL"=>$instructionSQL
        ]);
    }
}