import { ObjectId } from "mongodb";
import { connectDB } from "../config/database.js";

export async function paymentDB(dados) {
    const db = await connectDB()

    let acesso = {
        userId: new ObjectId(dados.userId),
        valor: dados.valor,
        data_pag: dados.dataCriacao,
        data_exp: dados.dataExpiracao,
        ativo: true
    }

    console.log(acesso)
    console.log("\n\n Chegou at[e aqui")
    return db.collection("payment").insertOne(acesso)
}

