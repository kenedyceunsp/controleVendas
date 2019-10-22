contasVencidas = (dtInicio, dtFim) => {
    $.ajax({
        url: 'php/webservices/wsrelatorios.php',
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            dtInicio: dtInicio,
            dtFim: dtFim,
            requisicao: 'CLIENTES_CONTAS_VENCIDAS'
        }
    }).done(function (retorno) {
        console.log(retorno)
        exibeContasVencidas(retorno.data)
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

contasRecebidas = (dtInicio, dtFim) => {
    $.ajax({
        url: 'php/webservices/wsrelatorios.php',
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            dtInicio: dtInicio,
            dtFim: dtFim,
            requisicao: 'CLIENTES_CONTAS_RCEBIDAS'
        }
    }).done(function (retorno) {
        console.log(retorno)
        exibeContasRecebidas(retorno.data)
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

fichasVerificadas = (dtInicio, dtFim) => {
    $.ajax({
        url: 'php/webservices/wsrelatorios.php',
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            dtInicio: dtInicio,
            dtFim: dtFim,
            requisicao: 'FICHAS_FALTANTES'
        }
    }).done(function (retorno) {
        console.log(retorno)
        exibeFichasFaltantes(retorno.data)
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

exibeContasVencidas = (arrContasVencidas) => {
    let tbodyContasVencidas = $('#tbodyContasVencidas')
    limpaContasVencidas()
    arrContasVencidas.forEach(function (contaVencida) {
        let trContaVencida = document.createElement('tr')
        let qtdInfoContas = 6
        let arrInfoContas = []

        arrInfoContas[0] = contaVencida.NOME
        arrInfoContas[1] = contaVencida.VENCIMENTO
        arrInfoContas[2] = contaVencida.VALOR
        arrInfoContas[3] = contaVencida.VENDEDOR
        arrInfoContas[4] = contaVencida.MOTORISTA
        arrInfoContas[5] = contaVencida.NUMFICHA

        for (let i = 0; i < qtdInfoContas; i++) {
            let tdContaVencida = document.createElement('td')
            let txtContaVencida = document.createTextNode(arrInfoContas[i])

            tdContaVencida.append(txtContaVencida)
            trContaVencida.append(tdContaVencida)
        }

        tbodyContasVencidas.append(trContaVencida)
    })
    let totAReceber = calcTotalParcelas(arrContasVencidas)
    exibeTotAReceber(totAReceber)
}

calcTotalParcelas = () => {

}

exibeContasRecebidas = (arrContasRecebidas) => {
    let tbodyContasRecebidas = $('#tbodyContasRecebidas')
    limpaContasRecebidas()
    arrContasRecebidas.forEach(function (contaRecebida) {
        let trContaRecebida = document.createElement('tr')
        let qtdInfoContas = 4
        let arrInfoContas = []

        arrInfoContas[0] = contaRecebida.NOME
        arrInfoContas[1] = contaRecebida.VALORRECEBIDO
        arrInfoContas[2] = contaRecebida.DT_RECEBIMENTO
        arrInfoContas[3] = contaRecebida.NUMFICHA

        for (let i = 0; i < qtdInfoContas; i++) {
            let tdContaRecebida = document.createElement('td')
            let txtContaRecebida = document.createTextNode(arrInfoContas[i])

            tdContaRecebida.append(txtContaRecebida)
            trContaRecebida.append(tdContaRecebida)
        }
        tbodyContasRecebidas.append(trContaRecebida)
    })
    let totRecebimentos = calcTotalRecebimentos(arrContasRecebidas)
    exibeTotRecebimentos(totRecebimentos)
}

exibeFichasFaltantes = (arrFichas) => {
    let tbodyFichas = $('#tbodyFichasVerificadas')
    limpaFichasFaltantes()
    arrFichas.forEach(function (ficha) {
        let trFicha = document.createElement('tr')
        let qtdInfoFicha = 7
        let arrInfoFicha = []

        arrInfoFicha[0] = ficha.NUMFICHA
        arrInfoFicha[1] = ficha.NOME
        arrInfoFicha[2] = ficha.MERCADORIAS
        arrInfoFicha[3] = ficha.VENDEDOR
        arrInfoFicha[4] = ficha.MOTORISTA
        arrInfoFicha[5] = ficha.CADASTRADA_EM
        arrInfoFicha[6] = ficha.ULTIMA_VISUALIZACAO

        for (let i = 0; i < qtdInfoFicha; i++) {
            let tdFicha = document.createElement('td')
            let txtFicha = document.createTextNode(arrInfoFicha[i])

            tdFicha.append(txtFicha)
            trFicha.append(tdFicha)
        }

        tbodyFichas.append(trFicha)
    })
}

calcTotalRecebimentos = (arrContasRecebidas) => {
    let totRecebimentos = 0
    arrContasRecebidas.forEach(function (contaRecebida) {
        totRecebimentos = totRecebimentos + parseFloat(contaRecebida.VALORRECEBIDO)
    })

    return parseFloat(totRecebimentos).toFixed(2)
}

calcTotalParcelas = (arrContasVencidas) => {
    let totAReceber = 0
    arrContasVencidas.forEach(function(contaVencida){
        totAReceber = totAReceber+parseFloat(contaVencida.VALOR)
    })
    return parseFloat(totAReceber).toFixed(2)
}


exibeTotRecebimentos = (totRecebimentos) => {
    $('#totRecebimentos').text(totRecebimentos)
}

exibeTotAReceber = (totAReceber) => {
    $('#totAReceber').text(totAReceber)
}

limpaContasVencidas = () => {
    $('#tbodyContasVencidas tr').remove()
}

limpaContasRecebidas = () => {
    $('#tbodyContasRecebidas tr').remove()
}

limpaFichasFaltantes = () => {
    $('#tbodyFichasVerificadas tr').remove()
}

$(document).ready(function () {
    $('#consultaContasVencidas').on("click", function () {
        let dtInicio = $('#dtContaVencidaInicio').val()
        let dtFim = $('#dtContaVencidaFim').val()

        if ((dtInicio !== "") || (dtFim !== "")) {
            contasVencidas(dtInicio, dtFim)
        } else {
            alert("Datas não informadas")
        }
    })
    $('#consultaContasRecebidas').on("click", function () {
        let dtInicio = $('#dtContaRecebidaInicio').val()
        let dtFim = $('#dtContaRecebidaFim').val()

        if ((dtInicio !== "") || (dtFim !== "")) {
            contasRecebidas(dtInicio, dtFim)
        } else {
            alert("Datas não informadas")
        }
    })
    $('#consultaFichasVerificadas').on("click", function () {
        let dtInicio = $('#dtFichaInicio').val()
        let dtFim = $('#dtFichaFim').val()

        if ((dtInicio !== "") || (dtFim !== "")) {
            fichasVerificadas(dtInicio, dtFim)
        } else {
            alert("Datas não informadas")
        }
    })
    $('#imprimeRelatorio').on("click", function () {
        window.print()
    })
})