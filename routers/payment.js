import { getPaymentUser, updatePayment } from "../db/user.js";

export async function verificarPix(req, res) {
    const userId = req.user.id
    const paymentUser = await getPaymentUser(userId)


    console.log("avemaria", paymentUser.length)
    let paymentQtd = paymentUser.length - 1

    let ultimoAtivo = paymentUser[paymentQtd].ativo
    console.log(ultimoAtivo)

    return res.json({ ativo: ultimoAtivo })
}

export async function verificarAcesso(userId) {
    const acesso = await getPaymentUser(userId)
    let i = acesso.length - 1

    if (!acesso || acesso.length === 0) return false

    const agora = new Date()


    console.log("ativo:", acesso[i].ativo)
    console.log("expira:", acesso[i].data_exp)
     console.log("valor:", acesso[i].valor)
    console.log("agora:", agora)

    if (acesso[i].ativo && agora <= acesso[i].data_exp) {
        return true
    }



    updatePayment(userId)
    return false
}