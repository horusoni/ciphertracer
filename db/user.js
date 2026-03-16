import { ObjectId } from "mongodb";
import { connectDB, } from "../config/database.js";

export async function getUserDB(uid) {
    const db = await connectDB()

    return db.collection("user")
             .findOne({ _id: new ObjectId(uid) }, { projection: { hash: 0 } })
}

export async function getPaymentUser(uid) {
    const db = await connectDB()

    return db.collection("payment").find({ userId: new ObjectId(uid) }).toArray()
}

export async function updatePayment(userId) {
    const db = await connectDB()

    const ultimo = await db.collection("payment")
        .find({ userId: new ObjectId(userId) })
        .sort({ data_pag: -1 })
        .limit(1)
        .toArray()

    if (!ultimo.length) return null

    return db.collection("payment").updateOne(
        { _id: ultimo[0]._id },
        { $set: { ativo: false } }
    )
}