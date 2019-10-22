<?php
include '../model/MySQL.php';
switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST":
            switch ($_POST['requisicao']) {
                case 'CADASTRA_PARCELAS':
                   gravaParcelas($_POST['dataParcelas']);
                break;
                case 'ATUALIZA_STATUS_PARCELAS':
                    updateStatusParcelas($_POST['status'] ,$_POST['idParcela']);
                break;
            default:
                # code...
                break;
    }
        break;
    case "GET":
            switch ($_GET['requisicao']) {
                case 'CONSULTA_PARCELAS_IDFICHA':
                    selectParcelasByIdFicha($_GET['idFicha']);
                    break;
                case '':
                    
                    break;
                default:
                    # code...
                    break;
            }
        break;
    default:
        echo json_encode("não chegou a receber a requisicao nem identificar o método");
        break;
}

function createParcelas($jsonParcelas){
    $dataParcelas = json_decode($jsonParcelas);
    
    try {
        foreach ($dataParcelas as $parcela) {
            $instructionSQL = "INSERT INTO PARCELAS(ID_FICHA, VENCIMENTO, VALOR, STATUS, DT_CRIACAO, ID_USER) VALUES('$parcela->ID_FICHA', '$parcela->VENCIMENTO', '$parcela->VALOR', '$parcela->STATUS', '$parcela->DT_CRIACAO', '$parcela->ID_USER')";
            $con  = new MySQL();
            $result = $con->execQuery($instructionSQL);
        }
        print json_encode($retorno = [
            "data"=>$result,
            "msg"=>"As parcelas foram CADASTRADAS com sucesso",
            "statusCode"=> 01,
            "instrucaoSQL"=> $instructionSQL
        ]);
    } catch (\Throwable $th) {
        print json_encode($retorno = [
            "erro"=>$th,
            "msg"=>"Ocorreu um problema ao tentar gravar as parcelas",
            "statusCode"=> 02
        ]);
    }
}

function selectParcelasByIdFicha($idFicha){
    try {
        $instructionSQL = "SELECT * FROM PARCELAS WHERE ID_FICHA = $idFicha";
        $con  = new MySQL();
        $result = $con->execQuery($instructionSQL);
        print json_encode($retorno = [
            "data"=>$result,
            "msg"=>"As parcelas foram SELECIONADAS com sucesso",
            "statusCode"=> "01",
            "instrucaoSQL"=> $instructionSQL
        ]);
    } catch (\Throwable $th) {
        print json_encode($retorno = [
            "erro"=>$th,
            "msg"=>"Ocorreu um problema ao tentar selecionar as parcelas",
            "statusCode"=> 02
        ]);
    }
}

function updateStatusParcelas($status, $idParcela){
    try {
        $instructionSQL = "UPDATE PARCELAS SET STATUS='$status' WHERE ID=$idParcela";
        $con = new MySQL();
        $result = $con->execQuery($instructionSQL);
        print json_encode($retorno = [
            "data"=>$result,
            "msg"=>"As parcelas foram ATUALIZADAS com sucesso",
            "statusCode"=> "01",
            "instrucaoSQL"=> $instructionSQL
        ]);
    } catch (Throwable $th) {
        print json_encode($retorno = [
            "erro"=>$th,
            "msg"=>"Ocorreu um problema ao tentar selecionar as parcelas",
            "statusCode"=> 02
        ]);
    }
}

function gravaParcelas($jsonParcelas){
    $verifica = verificaParcelas($jsonParcelas);
    switch ($verifica["statusCode"]) {
        case '01':
            updateParcelas($jsonParcelas);
            break;
        case '02':
            createParcelas($jsonParcelas);
            break;
        default:
            print $verifica;
            break;
    }
}

function updateParcelas($jsonParcelas){
    try {
     $dataParcelas = json_decode($jsonParcelas);
     $arrInstrucoes = [];
     $i=0;
     foreach ($dataParcelas as $parcela) {
        $instructionSQL = "UPDATE PARCELAS SET VENCIMENTO = '$parcela->VENCIMENTO', VALOR = '$parcela->VALOR' WHERE ID = $parcela->ID";
        $con  = new MySQL();
        $result = $con->execQuery($instructionSQL);
        $arrInstrucoes[$i] = $instructionSQL;
        $i++;
    }
     print json_encode($retorno = [
        "statusCode" => "01",
        "msg" => "Parcelas atualizadas com sucesso",
        "instrucaoSQL" => $arrInstrucoes
    ]);
    } catch (\Throwable $th) {
        print json_encode($retorno = [
            "statusCode" => "03",
            "msg" => "PROBLEMAS para atualizar as parcelas",
            "instrucaoSQL" => $instructionSQL,
            "erro" => $th
        ]);
    }
}

function verificaParcelas($jsonParcelas){
 try {
     $dataParcelas = json_decode($jsonParcelas);
     $parcela = $dataParcelas[0];
     $instructionSQL = "SELECT * FROM PARCELAS WHERE ID_FICHA = $parcela->ID_FICHA";
     $con = new MySQL();
     $result = $con->execQuery($instructionSQL);
     if(count($result) > 0 ){
        return $retorno = [
            "statusCode" => "01",
            "msg" => "Parcelas já criadas para essa ficha numero: '$parcela->ID_FICHA'",
            "instrucaoSQL" => $instructionSQL
        ];
     }else{
        return $retorno = [
            "statusCode" => "02",
            "msg" => "Parcelas não foram criadas para essa ficha numero: '$parcela->ID_FICHA'",
            "instrucaoSQL" => $instructionSQL
        ];
     }
 } catch (\Throwable $th) {
    echo "Erro na verificação de parcelas: ".$th;
 }
}