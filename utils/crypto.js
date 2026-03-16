import crypto from "crypto";

export function cipher(text){
    return crypto.createHash("sha256")
    .update(text)
    .digest("hex")
}
