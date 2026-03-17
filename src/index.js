import express from "express";
import cors from "cors";
import { authToken } from "../middleware/auth.js";
import { exit, logs, userLogin } from "../routers/login.js";
import cookieParser from "cookie-parser"
import { pushData } from "../routers/buscarDados.js";
import { fish, listCapture, pushTemplate } from "../routers/fish.js";
import { sendUser } from "../routers/user.js";
import { verificarPix } from "../routers/payment.js";
import { cadastrarUsuario } from "../routers/cadastrar.js";
import { buscarRedesUser } from "../routers/redes.js";
import { criarCobranca, webhook } from "../routers/mercadopago.js";

const PORT = 4444;
const app = express();

app.use(cookieParser());

app.use(cors({
    //origin : "http://192.168.1.2:5500",
    origin:"https://ciphertracer-front.vercel.app",
    //origin : ["https://ciphertracer-front.vercel.app", "https://account-dusky.vercel.app"],
    credentials:true
}))

app.use(express.json());

app.get("/teste",(req,res)=>{ res.send({status:200})})

app.get("/user",authToken, sendUser)

app.get("/template", authToken, pushTemplate)
app.get("/capture",authToken,listCapture)

app.get("/logs", authToken, logs)

app.post("/dados", authToken, pushData)


app.post('/fish',fish)
app.post('/login' , userLogin );
app.post("/cadastro",cadastrarUsuario)

app.post("/redes",authToken, buscarRedesUser)

app.post("/payment", authToken, criarCobranca)

app.get("/auth-check", authToken, (req, res) => {
  res.status(200).json({ authenticated: true });
});

app.get("/check-pix",authToken, verificarPix)


app.post("/webhook",webhook)

app.get('/teste',(req,res)=>{res.send("teste")})

app.get("/exit" ,authToken, exit)




app.listen(PORT,()=>{
    console.log("\nSERVER: http://localhost:"+PORT)
})
