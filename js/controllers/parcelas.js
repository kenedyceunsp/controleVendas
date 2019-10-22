gerarParcelas = (total, qtdParcelas) => {

    datasFixas = (mes) => {
        let dataF = new Date();
        let diaF
        let mesF
        let anoF
        if ((dataF.getMonth() + mes + 2) > 12) {
            anoF = dataF.getFullYear() + 1
            mesF = (dataF.getMonth() + mes + 2) - 12
        } else {
            anoF = dataF.getFullYear()
            mesF = (dataF.getMonth() + mes + 2)
        }
        if (mesF === 2) {
            if (dataF.getDate() > 28) {
                diaF = 01
                mesF = 03
            } else {
                diaF = dataF.getDate()
            }
        } else {
            diaF = dataF.getDate()
        }
        if (mesF < 10) {
            mesF = "0" + mesF
        }
        if (diaF < 10) {
            diaF = "0" + diaF
        }
        let retData = `${anoF}-${mesF}-${diaF}`
        return retData
    }

    if (($('#totalFicha').val() === "") || ($('#qtdParcelas').val() === "")) {
        alert("parcelas e quantidade de parcelas NÃO informadas")
        limpaFormParcelas()
    } else if (($('#totalFicha').val() <= 0) || ($('#qtdParcelas').val() <= 0)) {
        alert("parcelas e quantidade de parcelas DEVEM SER MAIOR QUE ZERO")
        limpaFormParcelas()
    } else {
        let formNovaFicha = $('#formNovaFicha');

        limpaFormParcelas()

        let lbDataVencimento = document.createElement('label')
        lbDataVencimento.className = 'col-6'
        lbDataVencimento.id = 'dataVencimento1'
        let txtDataVencimento = document.createTextNode("Data de vencimento")

        lbDataVencimento.append(txtDataVencimento)
        formNovaFicha.append(lbDataVencimento)

        let lbvalor = document.createElement('label')
        lbvalor.className = 'col-6'
        lbvalor.id = 'valorParcela1'
        let txtValor = document.createTextNode("Valor")

        lbvalor.append(txtValor)
        formNovaFicha.append(lbvalor)

        for (let i = 0; i < qtdParcelas; i++) {
            let dataVencimento = document.createElement('input')
            dataVencimento.type = 'date';
            dataVencimento.value = datasFixas(i)
            dataVencimento.className = 'form-control col-6'
            dataVencimento.name = 'dtVencimentoParcela'

            let valorParcela = document.createElement('input')
            valorParcela.type = 'number'
            valorParcela.className = 'form-control col-6'
            valorParcela.name = 'valorParcela'
            valorParcela.readOnly = true;
            valorParcela.value = (total / qtdParcelas).toFixed(2)

            formNovaFicha.append(dataVencimento)
            formNovaFicha.append(valorParcela)
        }
    }
    lembraParcelas()
}

exibeParcelasFicha = (arrParcelas) => {
    let formFicha = $('#formNovaFicha');

    if (formFicha == null) {
        return false
    } else {
        let lbDataVencimento = document.createElement('label')
        lbDataVencimento.className = 'col-6'
        lbDataVencimento.id = 'dataVencimento1'
        let txtDataVencimento = document.createTextNode("Data de vencimento")

        lbDataVencimento.append(txtDataVencimento)
        formFicha.append(lbDataVencimento)

        let lbvalor = document.createElement('label')
        lbvalor.className = 'col-6'
        lbvalor.id = 'valorParcela1'
        let txtValor = document.createTextNode("Valor")

        lbvalor.append(txtValor)
        formFicha.append(lbvalor)

        arrParcelas.forEach(function (parcela) {
            let dataVencimento = document.createElement('input')
            dataVencimento.type = 'date'
            dataVencimento.className = 'form-control col-6'
            dataVencimento.name = 'dtVencimentoParcela'
            dataVencimento.value = parcela.VENCIMENTO
            dataVencimento.readOnly = true

            let valorParcela = document.createElement('input')
            valorParcela.className = 'form-control col-6'
            valorParcela.name = 'valorParcela'
            valorParcela.type = 'number'
            valorParcela.value = parcela.VALOR
            valorParcela.readOnly = true
            formFicha.append(dataVencimento)
            formFicha.append(valorParcela)
        })
    }

}

lembraParcelas = () => {//responsavel por guardar a ficha no storage depois de montar seu objeto

    let arrParcelasGeradas = []
    let objParcela = {}
    let valorParcela
    let idFicha = window.localStorage.getItem("idFichaAtual")
    let status = "pendente"
    let dtCriacao = dataHoraAtual()
    let idUser = 1
    $('input[name=dtVencimentoParcela]').each(function (indice1, inputVencimento) {
        //console.log("print do valor do vencimento", inputVencimento.value)
        if (inputVencimento.value === "") {
            alert("TODOS os vencimentos devem ser informados")
            objParcela.VENCIMENTO = ""
            return false
        } else {
            objParcela.VENCIMENTO = inputVencimento.value
            arrParcelasGeradas[indice1] = JSON.parse(JSON.stringify(objParcela))
            //console.log("parcelas vencimento: ", arrParcelasGeradas, "indice atual: ",indice1)
        }
    })
    $('input[name=valorParcela]').each(function (indice2, inputValorParcela) {
        valorParcela = inputValorParcela.value
    })
    arrParcelasGeradas.forEach(function (parcela) {
        parcela.VALOR = valorParcela
        parcela.ID_FICHA = idFicha
        parcela.STATUS = status
        parcela.DT_CRIACAO = dtCriacao
        parcela.ID_USER = idUser
        //console.log(parcela)
    })
    if ((objParcela.VENCIMENTO !== "") && (objParcela.VENCIMENTO !== undefined)) {
        window.localStorage.setItem("arrParcelas", JSON.stringify(arrParcelasGeradas))
        //console.log("Print das percelas salvas no escopo global: ", window.localStorage.getItem("arrParcelas"))
        return true
    } else {
        return false
    }

}

limpaFormParcelas = () => {
    $('input[name=dtVencimentoParcela]').remove()
    $('input[name=valorParcela]').remove()
    $('#dataVencimento1').remove()
    $('#valorParcela1').remove()
    $('#parcelasRecebimentos tr').remove()
}

cadastraParcelasSQL = (jsonParcelas) => {
    //console.log("objeto de parcelas: ", JSON.parse(jsonParcelas))
    $.ajax({
        url: 'php/webservices/wsparcelas.php',
        method: 'post',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: "CADASTRA_PARCELAS",
            dataParcelas: jsonParcelas
        }
    }).done(function (retorno) {
        console.log(retorno)
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

consultaParcelasByIdFicha = (idFicha) => {
    // console.log(idFicha)
    $.ajax({
        url: 'php/webservices/wsparcelas.php',
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'CONSULTA_PARCELAS_IDFICHA',
            idFicha: idFicha
        }
    }).done(function (retorno) {
        exibeParcelasRecebimento(retorno.data)
        exibeParcelasFicha(retorno.data)
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

exibeParcelasRecebimento = (arrParcelas) => {
    limpaFormParcelas()
    let tbodyParcelas = document.getElementById('parcelasRecebimentos')

    if (tbodyParcelas == null) {
        return false
    } else {
        arrParcelas.forEach(function (parcela) {
            let trParcela = document.createElement('tr')
            const qtdInfoParcela = 3;
            let arrInfoParcelas = []

            arrInfoParcelas[0] = parcela.VENCIMENTO
            arrInfoParcelas[1] = parcela.VALOR
            arrInfoParcelas[2] = parcela.STATUS

            for (let i = 0; i < qtdInfoParcela; i++) {
                let tdParcela = document.createElement('td')
                let txtInfoParcela = document.createTextNode(arrInfoParcelas[i])

                tdParcela.append(txtInfoParcela)
                trParcela.append(tdParcela)
            }
            tbodyParcelas.append(trParcela)
        })
    }

}

atualizaStatusPacela = (arrRecebimentos, idFicha) => {
    $.ajax({
        url: 'php/webservices/wsparcelas.php',
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'CONSULTA_PARCELAS_IDFICHA',
            idFicha: idFicha
        }
    }).done(function (retorno) {
        let newStatusParcela = ""
        switch (retorno.statusCode) {
            case "01":
                let arrParcelas = retorno.data
                let totRecebimentos = 0
                arrRecebimentos.forEach(function (recebimento) {
                    totRecebimentos = totRecebimentos + parseFloat(recebimento.VALOR)
                })
                arrParcelas.forEach(function (parcela) {
                    if (totRecebimentos >= parcela.VALOR) {
                        newStatusParcela = "recebido"
                    }else{
                        newStatusParcela = "pendente"
                    }
                    totRecebimentos = totRecebimentos - parcela.VALOR
                    $.ajax({
                        url: 'php/webservices/wsparcelas.php',
                        method: 'post',
                        cache: false,
                        dataType: 'json',
                        data: {
                            requisicao: 'ATUALIZA_STATUS_PARCELAS',
                            idParcela: parcela.ID,
                            status: newStatusParcela
                        }
                    }).done(function (retorno) {
                        //console.log(retorno)
                        consultaParcelasByIdFicha(idFicha)
                    }).fail(function (e) {
                        console.log(e.responseText)
                    })
                })
                break;

            default:
                break;
        }
    })
}

$(document).ready(function () {
    $('#gerarParcelas').on('click', function () {
        let totalFicha = $('#totalFicha').val()
        let qtdParcelas = $('#qtdParcelas').val()
        gerarParcelas(totalFicha, qtdParcelas)
    })
})