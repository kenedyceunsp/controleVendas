cadastraClienteSQL = (jsonCliente) => {
    $.ajax({
        url: 'php/webservices/wscliente.php',//caminho do arquivo php que vai salvar os clientes do banco de dados
        method: 'post',
        cache: false,
        dataType: 'json',
        data: {
            dataCliente: jsonCliente,
            requisicao: 'CADASTRA_CLIENTE'
        }
    }).done(function (retorno) {
        switch (retorno.statusCode) {
            case "02":
                alert(retorno.msg)
                console.log(retorno)
                break;
            case "01":
                alert(retorno.msg)
                limpaFormCliente()
                editaFormCliente(this.id)
                esqueceCliente()
                console.log(retorno)
                break;
            default:
                console.log(retorno)
                break;
        }
    }).fail(function (e) {
        alert("Ocorreu um erro ao tentar gravar o cliente, por favor contate o desenvolvedor: " + e.responseText)
        console.log(e.responseText)
    })
}

consultaCliente = (documentoCliente, tipoDocumentoCliente) => {
    $.ajax({
        url: 'php/webservices/wscliente.php',//caminho do arquivo php que vai salvar os clientes do banco de dados
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            documento: documentoCliente,
            tipoDocumento: tipoDocumentoCliente,
            requisicao: 'CONSULTA_DOCUMENTO'
        }
    }).done(function (retorno) {
        switch (retorno.statusCode) {
            case "01":
                exibeConsultaCliente(retorno.data)
                lembraCliente(retorno.data)
                consultaFichaCliente(window.localStorage.getItem("idCliente"))
                console.log(retorno.data)
                break;
            case "03":
                alert(retorno.msg)
                limpaFormCliente()
                console.log(retorno)
                break;
            default:
                break;
        }
    }).fail(function (e) {
        alert("Ocorreu um erro ao tentar gravar o cliente, por favor contate o desenvolvedor: " + e.responseText)
        console.log(e)
    })
}

consultaClienteByID = (idCliente) => {
    $.ajax({
        url: 'php/webservices/wscliente.php',
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'CONSULTA_ID',
            dataCliente: idCliente
        }
    }).done(function (retorno) {
        exibeConsultaCliente(retorno.data);
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

consultaClienteByNome = (nomeCliente) => {
    $.ajax({
        url: 'php/webservices/wscliente.php',
        method: 'get',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'CONSULTA_NOME',
            nome: nomeCliente
        }
    }).done(function (retorno) {
        switch (retorno.statusCode) {
            case "01":
                exibeModalConsulta(retorno.data)
                console.log(retorno)
                break;
            case "03":
                alert(retorno.msg)
                limpaFormCliente()
                console.log(retorno)
                break;
            default:
                break;
        }
    }).fail(function (e) {
        console.log(e.responseText)
    })
}

excluiCliente = (idCliente) => {
    $.ajax({
        url: 'php/webservices/wscliente.php',
        method: 'post',
        cache: false,
        dataType: 'json',
        data: {
            requisicao: 'EXCLUI_CLIENTE',
            idCliente: parseInt(idCliente)
        }
    }).done(function (retorno) {
        switch (retorno.statusCode) {
            case "01":
                alert(retorno.msg)
                limpaFormCliente()
                editaFormCliente(this.id)
                esqueceCliente()
                break;
            case "02":
                alert(retorno.msg)
                limpaFormCliente()
                editaFormCliente(this.id)
                esqueceCliente()
                break;
            default:
                break;
        }
    }).fail(function (e) {
        console.log(e)
        console.log(e.responseText)
    })
}

exibeModalConsulta = (arrClientes) => {
    $('#modalClientes').modal('show')
    $('#modalClientes').modal('handleUpdate')
    limpaModalConsulta()
    let tableModalCliente = document.getElementById('tableConsultaClientes')
    arrClientes.forEach(function (cliente) {
        let trModalCliente = document.createElement('tr')
        trModalCliente.id = cliente.ID
        let arrInfoClientes = []
        let qtdInfoCliente = 3
        arrInfoClientes[0] = cliente.NOME
        arrInfoClientes[1] = cliente.ENDERECO
        arrInfoClientes[2] = cliente.CIDADE
        for (let i = 0; i < qtdInfoCliente; i++) {
            let tdModalCliente = document.createElement('td')
            let txtModalCliente = document.createTextNode(arrInfoClientes[i])

            tdModalCliente.append(txtModalCliente)
            trModalCliente.append(tdModalCliente)
        }

        tableModalCliente.append(trModalCliente)
    })
    instanciaClickModal(arrClientes)
}

limpaModalConsulta = () => {
    $('#tableConsultaClientes tr').remove()
}



exibeConsultaCliente = (dataCliente) => {
    $('#nomeCliente').val(dataCliente[0].NOME);
    $('#nomeClienteModal').val(dataCliente[0].NOME);
    $("#statusCliente").val(dataCliente[0].STATUS);
    $('#enderecoCliente').val(dataCliente[0].ENDERECO);
    $('#bairroCliente').val(dataCliente[0].BAIRRO);
    $('#telefoneCliente').val(dataCliente[0].TELEFONE);
    $('#celularCliente').val(dataCliente[0].CELULAR);
    $('#cidadeCliente').val(dataCliente[0].CIDADE);
    $('#rgCliente').val(dataCliente[0].RG);
    $('#cpfCliente').val(dataCliente[0].CPF);
    $('#dtNascCliente').val(dataCliente[0].DT_NASC);
    $('#obsCliente').val(dataCliente[0].OBSERVACAO)
}

exibeConsultaClienteNome = (dataCliente) => {
    $('#nomeCliente').val(dataCliente.NOME);
    $('#nomeClienteModal').val(dataCliente.NOME);
    $("#statusCliente").val(dataCliente.STATUS);
    $('#enderecoCliente').val(dataCliente.ENDERECO);
    $('#bairroCliente').val(dataCliente.BAIRRO);
    $('#telefoneCliente').val(dataCliente.TELEFONE);
    $('#celularCliente').val(dataCliente.CELULAR);
    $('#cidadeCliente').val(dataCliente.CIDADE);
    $('#rgCliente').val(dataCliente.RG);
    $('#cpfCliente').val(dataCliente.CPF);
    $('#dtNascCliente').val(dataCliente.DT_NASC);
    $('#obsCliente').val(dataCliente.OBSERVACAO)
}

limpaFormCliente = () => {
    $('input[name=formCliente]').val("")
    $('textarea[name=formCliente]').val("")
    $('#nomeCliente').val("")
}

editaFormCliente = (idBotao) => {

    if (idBotao === "editaFormCliente") {
        $('input[name=formCliente]').removeAttr("readonly");
        $('textarea[name=formCliente]').removeAttr("readonly");
    } else {
        $('input[name=formCliente]').attr("readonly", true)
        $('textarea[name=formCliente]').attr("readonly", true)
    }
}

lembraCliente = (dataCliente) => {
    window.localStorage.setItem("idCliente", dataCliente[0].ID)
    window.localStorage.setItem("nomeCliente", dataCliente[0].NOME)
    //console.log(dataCliente)
}

lembraClienteNome = (dataCliente) => {
    window.localStorage.setItem("idCliente", dataCliente.ID)
    window.localStorage.setItem("nomeCliente", dataCliente.NOME)
    //console.log(dataCliente)
}
esqueceCliente = () => {
    window.localStorage.removeItem("idCliente")
    window.localStorage.removeItem("nomeCliente")
}

validaDigitoCPF = (strCPF) => {

    somatorio = (arrCPF, digito) => {
        let soma = 0
        let multiplicador = 0
        let ajusteCPF = 0 //variavel que recebe o valor que vai determinar quantas vezes o laço será executado
        if (digito === 1) {
            ajusteCPF = 2
            multiplicador = 10
        } else {
            ajusteCPF = 1
            multiplicador = 11
        }
        for (let i = 0; i < (arrCPF.length - ajusteCPF); i++) {
            soma = soma + (arrCPF[i] * multiplicador)
            multiplicador--
        }
        return soma
    }

    if (strCPF.length === 11) {
        let arrCPF = strCPF.split("")
        let digitosInformados = []
        digitosInformados[0] = arrCPF[9]
        digitosInformados[1] = arrCPF[10]

        let dig1 = 11 - (somatorio(arrCPF, 1) % 11)
        let dig2 = 11 - (somatorio(arrCPF, 2) % 11)

        if (dig1 > 9) {
            dig1 = 0
        }
        if (dig2 > 9) {
            dig2 = 0
        }

        if ((digitosInformados[0] == dig1) && (digitosInformados[1] == dig2)) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

instanciaClickModal = (arrClientes) => {
    $('#tableConsultaClientes tr').on("click", function () {
        let idSelecionado = this.id
        arrClientes.forEach(function (cliente) {
            if (idSelecionado == cliente.ID) {
                exibeConsultaClienteNome(cliente)
                lembraClienteNome(cliente)
                consultaFichaCliente(window.localStorage.getItem("idCliente"))
            }
        })
    })
}

$(document).ready(function () {
    const idUser = 1
    esqueceCliente()
    $('#salvarCliente').click(function () {
        let objCliente = {}
        objCliente.ID = 0
        if (window.localStorage.getItem("idCliente") !== null) {
            objCliente.ID = window.localStorage.getItem("idCliente")
        }
        objCliente.NOME = $('#nomeCliente').val();
        objCliente.STATUS = $("#statusCliente").val();
        objCliente.ENDERECO = $('#enderecoCliente').val();
        objCliente.BAIRRO = $('#bairroCliente').val();
        objCliente.TELEFONE = $('#telefoneCliente').val();
        objCliente.CELULAR = $('#celularCliente').val();
        objCliente.CIDADE = $('#cidadeCliente').val();
        objCliente.RG = $('#rgCliente').val();
        objCliente.CPF = $('#cpfCliente').val();
        objCliente.DT_NASC = $('#dtNascCliente').val();
        objCliente.OBSERVACAO = $('#obsCliente').val();
        objCliente.DT_CRIACAO = dataHoraAtual();
        objCliente.ID_USER = idUser

        let valida = validaDigitoCPF($('#cpfCliente').val())
        if (valida) {
            cadastraClienteSQL(JSON.stringify(objCliente))
        } else {
            alert("O(a) cadastro/atualização será realizado(a), porém o cliente está com o CPF INVÁLIDO")
            cadastraClienteSQL(JSON.stringify(objCliente))
        }

    })
    $('#consultaCliente').on("click", function () {
        switch ($('#opConsulta').val()) {
            case "RG":
                let documentoRG = $('#documentoCliente').val();
                let tipoDocumentoRG = $('#opConsulta').val();
                consultaCliente(documentoRG, tipoDocumentoRG);
                break;
            case "CPF":
                documentoCPF = $('#documentoCliente').val();
                tipoDocumentoCPF = $('#opConsulta').val();
                consultaCliente(documentoCPF, tipoDocumentoCPF);
                break;
            case "nome":
                let nomeCliente = $('#documentoCliente').val()
                consultaClienteByNome(nomeCliente)
                break;
            default:
                break;
        }
    })
    $('#editaFormCliente').click(function () {
        editaFormCliente(this.id)
    })
    $('#documentoCliente').keypress(function (e) {
        if (e.key === "Enter") {
            switch ($('#opConsulta').val()) {
                case "RG":
                    let documentoRG = $('#documentoCliente').val();
                    let tipoDocumentoRG = $('#opConsulta').val();
                    consultaCliente(documentoRG, tipoDocumentoRG);
                    break;
                case "CPF":
                    documentoCPF = $('#documentoCliente').val();
                    tipoDocumentoCPF = $('#opConsulta').val();
                    consultaCliente(documentoCPF, tipoDocumentoCPF);
                    break;
                case "nome":
                    let nomeCliente = $('#documentoCliente').val()
                    consultaClienteByNome(nomeCliente)
                    break;
                default:
                    break;
            }
        }
    })
    $('#opConsulta').change(function () {
        $('#documentoCliente').val("")
        if ($('#opConsulta').val() === "nome") {
            $('#documentoCliente').attr("type", "text")
            $('#documentoCliente').attr("placeholder", "Nome do cliente")
        } else {
            $('#documentoCliente').attr("type", "number")
            $('#documentoCliente').attr("placeholder", "Número do documento")
        }
    })
    $('#confirmaExclusao').on("click", function () {
        if (window.localStorage.getItem("idCliente") !== null) {
            excluiCliente(window.localStorage.getItem("idCliente"))
            $('#modalExcluiCliente').modal("hide")
        } else {
            alert("NENHUM CLIENTE SELECIONADO")
        }
    })
})