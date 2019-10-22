consultaFichaCliente = (idCliente) => {
    $.ajax({
        url: 'php/webservices/wsficha.php',//caminho do arquivo php que vai salvar as fichas do banco de dados
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            idCliente: idCliente,
            requisicao: 'CONSULTA_FICHA_CLIENTE'
        }
    }).done(function (retorno) {
        exibeHistoricoFicha(retorno.data)
        lembraFichas(retorno.data)
        // console.log(retorno)
    }).fail(function (e) {
        console.log(e)
    })
}

lembraFichas = (arrFichas) => {
    jsonFichas = JSON.stringify(arrFichas)
    window.localStorage.setItem("fichasCliente", jsonFichas)
}

instanciaClickHistorico = (arrFichas) => {
    let linhasHistorico = $('#historicoFichas tr')
    if (linhasHistorico.length == arrFichas.length) {
        $('#historicoFichas tr').on("dblclick", function () {
            //console.log(window.localStorage.getItem("arrParcelas"))
            let idSelecionado = this.id
            let fichasCliente = JSON.parse(window.localStorage.getItem("fichasCliente"))
            fichasCliente.forEach(function (ficha) {
                if (idSelecionado == ficha.ID) {
                    window.localStorage.setItem("idFichaAtual", ficha.ID)
                    consultaParcelasByIdFicha(ficha.ID)
                    exibeModalEditFichas(ficha)
                    return false
                }
            })
        })
    }
}

exibeModalEditFichas = (dataFicha) => {
    limpaModalFicha()
    $('#numeroFicha').val(dataFicha.ID)
    $('#nomeVendedor').val(dataFicha.VENDEDOR)
    $('#nomeMotorista').val(dataFicha.MOTORISTA)
    $('#qtdParcelas').val(dataFicha.QTD_PARCELAS)
    $('#totalFicha').val(dataFicha.TOTAL)
    $('#listaMercadorias').val(dataFicha.MERCADORIAS)

    $('#qtdParcelas').attr("readonly", true)
    $('#totalFicha').attr("readonly", true)
    $('#gerarParcelas').attr("disabled", true)
    $('#excluiFicha').show()

    $('#modalFicha').modal('show')
}

limpaModalFicha = () => {
    $('#numeroFicha').val("")
    $('#nomeVendedor').val("")
    $('#nomeMotorista').val("")
    $('#qtdParcelas').val("")
    $('#totalFicha').val("")
    $('#listaMercadorias').val("")
}

consultaFichaByID = (idFicha) => {
    $.ajax({
        url: 'php/webservices/wsficha.php',
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'CONSULTA_FICHA_ID',
            idFicha: idFicha
        }
    }).done(function (retorno) {
        switch (retorno.statusCode) {
            case "01":
                let numIdFicha = JSON.parse(idFicha)
                window.localStorage.setItem("idFichaAtual", numIdFicha.ID)
                window.localStorage.setItem("infoFichaAtual", JSON.stringify(retorno.data))
                consultaClienteByID(retorno.data[0].ID_CLIENTE)
                consultaParcelasByIdFicha(retorno.data[0].ID)
                exibeVendedorFicha(retorno.data[0].VENDEDOR)
                exibeMotoristaFicha(retorno.data[0].MOTORISTA)
                exibeMercadorias(retorno.data[0].MERCADORIAS)
                exibirTotalFicha(retorno.data[0].TOTAL)
                exibeCheckIn(retorno.data[0].CHECK_IN)
                consultaRecebimentos(retorno.data[0].ID)
                break;
            case "02":
                limpaRecebimento()
                limpaFormParcelas()
                limpaFormCliente()
                limpaFichas()
                alert(retorno.msg)
                break;
            default:
                break;
        }
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

limpaFichas = () => {
    $('#nomeVendedorRecebimento').val("")
    $('#totalFichaRecebimento').val("")
    $('#listaMercadorias').val("")
}

atualizaStatusFicha = (arrRecebimentos, idFicha) => {
    $.ajax({
        url: 'php/webservices/wsficha.php',
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'CONSULTA_FICHA_ID',
            idFicha: idFicha
        }
    }).done(function (retorno) {
        let newStatusFicha = ""
        switch (retorno.statusCode) {
            case "01":
                let totRecebimento = 0
                arrRecebimentos.forEach(function (recebimentos) {
                    totRecebimento = totRecebimento + parseFloat(recebimentos.VALOR)
                })
                if (totRecebimento >= retorno.data[0].TOTAL) {
                    newStatusFicha = "finalizada"
                } else {
                    newStatusFicha = "pendente"
                }
                $.ajax({
                    url: 'php/webservices/wsficha.php',
                    method: 'post',
                    cache: false,
                    dataType: 'json',
                    data: {
                        requisicao: 'ATUALIZA_STATUS_FICHA',
                        idFicha: idFicha,
                        statusFicha: newStatusFicha
                    }
                }).done(function (retorno2) {
                    if (newStatusFicha == "finalizada") {
                        desativaRecebimento()
                        alert(retorno2.msg)
                    }else{
                        ativaRecebimento()
                    }
                }).fail(function (e) {
                    console.log(e)
                    console.log(e.responseText)
                })
                break;

            default:
                break;
        }

    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}


cadastraFichaSQL = (jsonFicha) => {
    $.ajax({
        url: 'php/webservices/wsficha.php',//caminho do arquivo php que vai salvar as fichas do banco de dados
        method: 'post',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'CADASTRA_FICHA',
            dataFicha: jsonFicha
        }
    }).done(function (retorno) {
        let objFicha = JSON.parse(jsonFicha)
        switch (retorno.statusCode) {
            case "01":
                cadastraParcelasSQL(window.localStorage.getItem("arrParcelas"))
                consultaFichaCliente(objFicha.ID_CLIENTE)
                break;
            case "02":
                alert(retorno.msg)
                break;
            case "03":
                objFicha = JSON.parse(jsonFicha)
                consultaFichaCliente(objFicha.ID_CLIENTE)
                break;
            default:
                break;
        }
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

exibeCheckIn = (checkIn) => {
    limpaCheckIn()
    if (checkIn !== "0000-00-00") {
        $('#dtCheckIn').val(checkIn)
    }
}

limpaCheckIn = () => {
    $('#dtCheckIn').val("")
}

checkInFicha = (dataFicha) => {
    $.ajax({
        url: 'php/webservices/wsficha.php',
        method: 'post',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'ATUALIZA_CHECK_IN',
            idFicha: dataFicha.ID,
            dtCheckIn: dataHoraAtual()
        }
    }).done(function (retorno) {
        console.log(retorno)
        consultaFichaByID(JSON.stringify(dataFicha))
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

exibirTotalFicha = (total) => {
    $('#totalFichaRecebimento').val(total)
}

exibeVendedorFicha = (vendedor) => {
    $('#nomeVendedorRecebimento').val(vendedor)
}
exibeMotoristaFicha = (motorista) => {
    $('#nomeMotoristaRecebimento').val(motorista)
}

exibeMercadorias = (mercadorias) => {
    $('#listaMercadorias').val(mercadorias)
}

limpaHistoricoFichas = () => {
    $('#historicoFichas tr').remove();
}

exibeHistoricoFicha = (arrFichas) => {
    let tableFichas = document.getElementById('historicoFichas')
    limpaHistoricoFichas()
    arrFichas.forEach(function (ficha) {

        $.ajax({
            url: 'php/webservices/wsrecebimentos.php',
            method: 'get',
            cache: false,
            dataType: 'json',
            data: {
                requisicao: 'CONSULTA_RECEBIMENTO_IDFICHA',
                idFicha: ficha.ID
            }
        }).done(function (retorno) {
            let trFicha = document.createElement('tr')
            const qtdInfoHistorico = 7
            let arrInfoHistorico = []

            trFicha.id = ficha.ID

            arrInfoHistorico[0] = ficha.DT_CRIACAO
            arrInfoHistorico[1] = ficha.QTD_PARCELAS
            arrInfoHistorico[2] = (parseFloat(ficha.TOTAL / ficha.QTD_PARCELAS)).toFixed(2)
            arrInfoHistorico[3] = ficha.TOTAL
            arrInfoHistorico[5] = ficha.STATUS
            arrInfoHistorico[6] = ficha.ID

            if (retorno.data.length > 0) {
                arrInfoHistorico[4] = retorno.data[retorno.data.length - 1].DT_RECEBIMENTO
            } else {
                arrInfoHistorico[4] = "Não existe"
            }

            for (let i = 0; i < qtdInfoHistorico; i++) {
                let tdHistorico = document.createElement('td')
                let txtInfoHistorico = document.createTextNode(arrInfoHistorico[i])

                tdHistorico.append(txtInfoHistorico)
                trFicha.append(tdHistorico)
            }

            tableFichas.append(trFicha)
            instanciaClickHistorico(arrFichas)
        }).fail(function (e) {
            console.log(e.responseText)
        })
    })
}

geraFicha = (idCliente) => {

    if (isNull(idCliente)) {
        alert("NENHUM cliente selecionado para gerar ficha")
        $('#modalFicha').modal('hide');
    } else {
        $.ajax({
            url: 'php/webservices/wsficha.php',//caminho do arquivo php que vai salvar as fichas do banco de dados
            method: 'get',
            cache: false,
            dataType: 'json',
            data: {
                requisicao: 'CONSULTA_ULTIMA_FICHA'
            }

        }).done(function (retorno) {
            liberaModalFicha()
            switch (retorno.statusCode) {
                case "03":
                    limpaModalFicha()
                    $('#numeroFicha').val("1")
                    $('#modalFicha').modal('show');
                    window.localStorage.setItem("idFichaAtual", 1)
                    console.log(retorno.data)
                    break;
                case "01":
                    limpaModalFicha()
                    $('#numeroFicha').val(parseInt(retorno.data[0].ID) + 1)
                    $('#modalFicha').modal('show');
                    window.localStorage.setItem("idFichaAtual", parseInt(retorno.data[0].ID) + 1)
                    break;
                default:
                    break;
            }
        }).fail(function (e) {
            alert("caiu no fail: " + e.responseText)
            console.log(e)
        })
    }
}

liberaModalFicha = () => {
    $('#qtdParcelas').removeAttr("readonly")
    $('#totalFicha').removeAttr("readonly")
    $('#gerarParcelas').removeAttr("disabled")
    $('#excluiFicha').hide()
    limpaFormParcelas()
}

atualizaInfoFicha = (jsonInfoFicha) => {
    $.ajax({
        url: 'php/webservices/wsficha.php',
        method: 'post',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'ATUALIZA_INFO_FICHA',
            infoFicha: jsonInfoFicha
        }
    }).done(function (retorno) {
        console.log(retorno)
    }).fail(function (e) {
        console.log(e)
    })
}

excluiFicha = (idFicha) => {
    $.ajax({
        url: 'php/webservices/wsficha.php',
        method: 'post',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'EXCLUIR_FICHA',
            idFicha: idFicha
        }
    }).done(function (retorno) {
        $('#modalFicha').modal("hide")
        consultaFichaCliente(window.localStorage.getItem("idCliente"))
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

$(document).ready(function () {

    $('#novaFicha').click(function () {
        geraFicha(window.localStorage.getItem("idCliente"))
    })
    $('#salvaFicha').on('click', function () {
        const statusFicha = "pendente"
        const idUser = 1
        let objFicha = {}

        objFicha.ID_CLIENTE = window.localStorage.getItem('idCliente')
        objFicha.QTD_PARCELAS = $('#qtdParcelas').val()
        objFicha.TOTAL = $('#totalFicha').val();
        objFicha.DT_CRIACAO = dataHoraAtual();
        objFicha.STATUS = statusFicha;
        objFicha.VENDEDOR = $('#nomeVendedor').val();
        objFicha.MOTORISTA = $('#nomeMotorista').val()
        objFicha.MERCADORIAS = $('#listaMercadorias').val()
        objFicha.ID_USER = idUser

        objFicha.ID = $('#numeroFicha').val()

        let gerouParcelas = lembraParcelas();

        if (gerouParcelas) {
            cadastraFichaSQL(JSON.stringify(objFicha))
            $('#modalFicha').modal("hide")
        } else {
            alert("Parcelas não foram geradas")
        }
    })
    $('#consultaFichaRecebimento').on("click", function () {
        let idFicha = $('#numFichaRecebimento').val()
        let obj = {}
        obj.ID = idFicha

        if (idFicha !== "") {
            consultaFichaByID(JSON.stringify(obj))
        }
    })
    $('#numFichaRecebimento').keypress(function (e) {
        if (e.key === "Enter") {
            let idFicha = $('#numFichaRecebimento').val()
            let obj = {}
            obj.ID = idFicha

            if (idFicha !== "") {
                consultaFichaByID(JSON.stringify(obj))
            }
        }
    })
    $('#gravaCheckIn').click(function () {
        let objIdFicha = {}
        objIdFicha.ID = $('#numFichaRecebimento').val()
        if (objIdFicha.ID !== "") {
            checkInFicha(objIdFicha)
        }
    })
    $('#excluiFicha').on("click", function () {
        excluiFicha($('#numeroFicha').val())
    })
})