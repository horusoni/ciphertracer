import { getPaymentUser, getUserDB } from "../db/user.js"
import { getClientInfo } from "./login.js"

export async function sendUser(req,res) {
    let uid = req.user.id
    let user = await getUserDB(uid)
    let paymentUser = await getPaymentUser(uid)
    let ip = getClientInfo(req).ip


    res.status(200).json({user: user, atualIp:ip, plano:"SISTEMA ATIVO", paymentUser})

}

