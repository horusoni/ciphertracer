import fetch from "node-fetch";
import { verificarAcesso } from "./payment.js";

export async function pushData(req, res) {
    const userId = req.user.id
    const acessoValido = await verificarAcesso(userId)
    if (!acessoValido) {
        return res.json({ message: "Seu acesso expirou<br>Para renovar Menu > Planos > [Renovar Licença]", ativo: false })
    }

    console.log(acessoValido, "buscarDados.js")

    let { valor } = req.body
    let dados = {
        valor: valor
    }
    let dadosApi = await pushDataApi(dados)
    res.json(dadosApi)
}

async function pushDataApi(value) {
    try {
        const response = await fetch(process.env.DADOS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value)
        })

        if (!response.ok) {
            return { message: "servidor nao encontrado" }
        }

        const data = await response.json()
        return data

    } catch (error) {
        return { message: "servidor nao encontrado" }
    }
}