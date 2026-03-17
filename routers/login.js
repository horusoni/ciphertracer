
import DeviceDetector from "device-detector-js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getLogsDB, logsDB } from "../db/login.db.js"
import { userDB } from "../db/login.db.js";
import { cipher } from "../utils/crypto.js";
import { getPaymentUser } from "../db/user.js";
export async function userLogin(req, res) {
  const clean_data = sanitizeInput(req.body)
  const isVoid = sanitizeResponse(clean_data)
  
  if (!isVoid.value) {
    return res.status(400).json({
      status: "Recebido mas não válido",
      message: "Preencha todos os campos."
    })
  }

  const email = clean_data.email
  const hash = await cipher(clean_data.pass)
  const user = await userDB(email)
 // const payUser = await getPaymentUser()

  // 🔐 Se usuário não existe
  if (!user) {
    return res.status(401).json({
      message: "Email ou senha inválidos."
    })
  }

  // 🔐 Valida senha
  if (user.hash !== hash) {
    return res.status(401).json({
      message: "Email ou senha inválidos."
    })
  }

  // 🔐 Gera token
  const token = jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )
  /*res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // true em produção (HTTPS)
    sameSite: "Strict",  // ou "Lax"
    maxAge: 15 * 60 * 1000
  })*/

 res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    domain: ".vercel.app",
    path: "/",
    maxAge: 15 * 60 * 1000
  })
  return res.status(200).json({ message: "Logado com sucesso" })
}

function sanitizeInput(data) {
  const cleaned = {};

  // Função interna para limpar string
  const cleanString = (value, maxLength = 255) => {
    if (typeof value !== "string") return "";

    return value
      .replace(/<[^>]*>?/gm, "")        // remove tags HTML
      .replace(/[^\w@.\- ]/gi, "")      // remove caracteres perigosos
      .trim()
      .slice(0, maxLength);             // limita tamanho
  };

  // EMAIL
  if (typeof data.email === "string") {
    const email = cleanString(data.email, 100);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    cleaned.email = emailRegex.test(email) ? email : null;
  }

  // PASSWORD
  if (typeof data.pass === "string") {
    cleaned.pass = data.pass.trim().slice(0, 100);
  }

  // ACTION (whitelist)
  const allowedActions = ["ACESSAR", "CADASTRAR"];
  if (typeof data.action === "string" && allowedActions.includes(data.action)) {
    cleaned.action = data.action;
  } else {
    cleaned.action = null || "Enter";
  }

  // SCREEN WIDTH
  cleaned.screen_w = Number.isInteger(Number(data.screen_w))
    ? parseInt(data.screen_w)
    : null;

  // SCREEN HEIGHT
  cleaned.screen_h = Number.isInteger(Number(data.screen_h))
    ? parseInt(data.screen_h)
    : null;
  
  return cleaned;
}

function sanitizeResponse(data){
   for (let key in data) {
      if (data[key] === null || data[key] === undefined || data[key] === "") {
         return { value: false, message: `Preencha todos os campos` };
      }
   }

   return { value: true };
}

export function getClientInfo(req) {
  const userAgent = req.headers['user-agent'] || 'unknown';
  const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;

  const detector = new DeviceDetector();
  const device = detector.parse(userAgent);

  let deviceInfo;

  if (device.device?.type === 'smartphone' || device.device?.type === 'tablet') {
    deviceInfo = device.device?.model || 'Modelo não identificado';
  } else {
    deviceInfo = device.os?.name || 'Sistema não identificado';
  }

  return {
    ip,
    deviceInfo
  };
}

export async function logs(req,res){
    let uid = req.user.id
    let sendLog = await getLogsDB(uid)
    let ip = getClientInfo(req).ip;
    let userAgent = getClientInfo(req).deviceInfo;

    let acess = {
      userId: new ObjectId(uid),
      ip : ip,
      userAgent : userAgent,
      data : new Date()
    }

    logsDB(acess)
    
    res.json({logs:sendLog})
}

export async function exit(req,res) {
  res.clearCookie("token", {
     httpOnly: true,
     secure: true,
     sameSite: "None",
     path: "/",
     maxAge: 15 * 60 * 1000
  })

  res.json({ message: "Logout realizado" })
}
