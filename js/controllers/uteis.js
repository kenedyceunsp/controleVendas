isNull = (param) => {
    if(param === null){
        return true
    }else{
        return false;
    }
}

dataHoraAtual = () => {
    let dataAtual = new Date()
    return dataAtual.getFullYear() + "-" + (dataAtual.getMonth() + 1) + "-" + dataAtual.getDate() + " " + dataAtual.getHours() + ":" + dataAtual.getMinutes() + ":" + dataAtual.getSeconds()
}

formataNumero = (num) => {
    return (num).toFixed(2)
}

dataAtual = () => {
    
}