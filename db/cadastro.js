import { connectDB } from "../config/database.js";


export async function getUserDB(email) {
    const db = await connectDB()

    return db.collection("user").findOne(
        { email: email },
        { projection: { email: 1 } }
    )
}

export async function cadUserDB(dados) {
    const db = await connectDB()
   
    return db.collection("user").insertOne(dados)
}