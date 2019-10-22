gravaRecebimento = (jsonRecebimento) => {
    $.ajax({
        url: 'php/webservices/wsrecebimentos.php',
        method: 'post',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'CADASTRA_RECEBIMENTO',
            dataRecebimento: jsonRecebimento
        }
    }).done(function (retorno) {
        switch (retorno.statusCode) {
            case "01":
                console.log(retorno)
                consultaRecebimentos(JSON.parse(jsonRecebimento).ID_FICHA)
                let objIdFicha = {}
                objIdFicha.ID = JSON.parse(jsonRecebimento).ID_FICHA
                checkInFicha(objIdFicha)
                break;

            default:
                break;
        }
    }).fail(function (e) {
        //console.log(e)
        console.log(e.responseText)
        alert("HOUVE UM PROBLEMA, CONTATE O DESENVOLVEDOR: ", e.responseText)
    })
}

consultaRecebimentos = (idFicha) => {
    //console.log(idFicha)
    $.ajax({
        url: 'php/webservices/wsrecebimentos.php',
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'CONSULTA_RECEBIMENTO_IDFICHA',
            idFicha: idFicha
        }
    }).done(function (retorno) {
        let idFicha = {}
        switch (retorno.statusCode) {
            case "01":
                if (retorno.data.length > 0) {
                    window.localStorage.setItem("infoRecebimentos", JSON.stringify(retorno.data[retorno.data.length - 1]))
                    idFicha.ID = retorno.data[0].ID_FICHA
                    atualizaStatusFicha(retorno.data, JSON.stringify(idFicha))
                    atualizaStatusPacela(retorno.data, idFicha.ID)
                    exibirRecebimentos(retorno.data)
                }
                break;
            case "02":
                let arrRecebimentos = []
                let objRecebimento = {
                    VALOR: "0"
                }
                arrRecebimentos[0] = objRecebimento
                idFicha.ID = window.localStorage.getItem("idFichaAtual")
                window.localStorage.setItem("infoRecebimentos", "")
                atualizaStatusFicha(arrRecebimentos, JSON.stringify(idFicha))
                atualizaStatusPacela(arrRecebimentos, idFicha.ID)
                limpaRecebimento()
                ativaRecebimento()
                break;
            default:
                break;
        }
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

excluiUltimoRecebimento = (idRecebimento) => {
    $.ajax({
        url: 'php/webservices/wsrecebimentos.php',
        method: 'post',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'EXCLUI_ULTIMO_RECEBIMENTO',
            idRecebimento: idRecebimento
        }
    }).done(function (retorno) {
        let objIdFicha = {
            ID: window.localStorage.getItem("idFichaAtual")
        }
        console.log(retorno)
        consultaFichaByID(JSON.stringify(objIdFicha));
        checkInFicha(objIdFicha)
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

calculaSaldo = (valorRecebimento, totDivida) => {
    let saldo = parseFloat(totDivida) - parseFloat(valorRecebimento)
    return parseFloat(saldo).toFixed(2)
}

calculaTotRecebimentos = (arrRecebimentos) => {
    let totRecebimento = 0
    arrRecebimentos.forEach(function (recebimentos) {
        totRecebimento = totRecebimento + parseFloat(recebimentos.VALOR)
    })

    return totRecebimento
}

desativaRecebimento = () => {
    $('#gravaRecebimento').attr("disabled", true)
    $('#valorRecebimento').attr("readonly", true)
}

ativaRecebimento = () => {
    $('#gravaRecebimento').removeAttr("disabled")
    $('#valorRecebimento').removeAttr("readonly")
}

exibirRecebimentos = (arrRecebimentos) => {
    limpaRecebimento()

    if (arrRecebimentos.length > 0) {
        let quadroRecebimento = document.getElementById('quadroRecebimentos')
        let totRecebimentos = 0
        arrRecebimentos.forEach(function (recebimento) {
            let trRecebimento = document.createElement('tr')
            const qtdInfoRecebimento = 3 //vai mudar pra 3
            let arrInfoRecebimento = []
            totRecebimentos = totRecebimentos + parseFloat(recebimento.VALOR)
            arrInfoRecebimento[0] = recebimento.DT_RECEBIMENTO
            arrInfoRecebimento[1] = recebimento.VALOR
            arrInfoRecebimento[2] = calculaSaldo(totRecebimentos, $('#totalFichaRecebimento').val())
            for (let i = 0; i < qtdInfoRecebimento; i++) {
                let tdRecebimento = document.createElement('td')
                let txtRecebimento = document.createTextNode(arrInfoRecebimento[i])

                tdRecebimento.append(txtRecebimento)
                trRecebimento.append(tdRecebimento)
            }
            quadroRecebimento.append(trRecebimento)
        })
    }
}

limpaRecebimento = () => {
    $('#quadroRecebimentos tr').remove()
    $('#valorRecebimento').val("")
    $('#dtRecebimento').val("")
}

calculaTotalDivida = () => {

}

$(document).ready(function () {
    $('#gravaRecebimento').on("click", function () {
        if (($('#valorRecebimento').val() !== "") && ($('#valorRecebimento').val() > 0)) {
            if (($('#numFichaRecebimento').val() !== "") && ($('#numFichaRecebimento').val() > 0)) {
                if ($('#dtRecebimento').val() !== "") {
                    let objRecebimento = {}
                    objRecebimento.ID_FICHA = $('#numFichaRecebimento').val()
                    objRecebimento.DT_RECEBIMENTO = $('#dtRecebimento').val()
                    objRecebimento.VALOR = $('#valorRecebimento').val()
                    objRecebimento.DT_CRIACAO = dataHoraAtual()
                    objRecebimento.ID_USER = 1
                    gravaRecebimento(JSON.stringify(objRecebimento))
                } else {
                    alert("Data de recebimento não informada")
                }
            } else {
                alert("Nenhuma ficha informada para recebimento")
            }
        } else {
            alert("Valor para recebimento inválido")
            console.log("Data de recebimento: ", $('#valorRecebimento').val())
        }
    })
    $('#cancelarRecebimento').click(function () {
        if (window.localStorage.getItem("infoRecebimentos") !== "") {
            let infoUltimoRecebimento = JSON.parse(window.localStorage.getItem("infoRecebimentos"))
            excluiUltimoRecebimento(infoUltimoRecebimento.ID)
        }
    })
})