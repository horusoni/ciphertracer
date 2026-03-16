import { ObjectId } from "mongodb";
import { connectDB } from "../config/database.js";

export async function userDB(email){
    const db = await connectDB()
    return db.collection("user").findOne({email:email})
}

export async function logsDB(dados) {
    const db = await connectDB()

    return db.collection("logs").insertOne(dados)
}

export async function getLogsDB(uid) {
    const db = await connectDB();

    return db.collection("logs").find({userId: new ObjectId(uid)}).toArray()
}
