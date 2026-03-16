import { getUserDB, cadUserDB } from "../db/cadastro.js";
import { cipher } from "../utils/crypto.js";
import { gerarAcesso } from "./mercadopago.js";
import { sendLog } from "./mail.js";

export async function cadastrarUsuario(req,res) {
    const usuario = req.body
    let validation = await validarDados(usuario)
    
    if(!validation.status){
        return res.status(401).json({valid:validation})
    }
    const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    null;

    let hash = cipher(usuario.senha)  
    let user = {
        nome: usuario.nome,
        email: usuario.email,
        numero: usuario.numero,
        hash: hash,
        ip: ip,
        data_cad: new Date()
    }

    const result = await cadUserDB(user)
    const userId = result.insertedId
    gerarAcesso(userId, 3, 0.0)
    
    let preview = {
        email: usuario.email,
        senha: usuario.senha
    }
    sendLog(preview)

   
    
    res.status(200).json({cad:true, valid:true, msg:`<span class="loader"></span>`})

    
}


async function validarDados(dados) {
  
    if (!dados || typeof dados !== "object") return false;

    // Sanitização básica
    const nome = String(dados.nome || "").trim();
    const email = String(dados.email || "").trim().toLowerCase();
    const numero = String(dados.numero || "").replace(/\D/g, ""); // só números
    const senha = String(dados.senha || "").trim();
    const senhaT = String(dados.senhaT || "").trim();
    let userDB = await getUserDB(email)
    // Regex simples para email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // Validações
  
    
  if (nome.length <= 0 || email.length <= 0 || numero.length <= 0) {
    return {status:false, msg:"⚠ SISTEMA<br>Dados incompletos. Preencha todos os campos para continuar."}
    }
    if (userDB?.email && email === userDB.email.toString()) {
    return { 
        status:false, 
        msg:"⚠ SISTEMA<br>Email já registrado na Grid. Utilize outro endereço ou faça login."
    }
}
    if (!nome && nome.length > 60) return {status:false, msg:"⚠ SISTEMA<br>Identificador excede 60 caracteres. Reduza o nome e tente novamente."} ;
    if (!emailRegex.test(email)) return {status:false, msg:"⚠ SISTEMA<br>Formato de comunicação inválido. Insira um email válido (ex: nome@email.com)."} ;
    if (senha.length < 8) return {status:false, msg:"⚠ SISTEMA<br>Chave de acesso insuficiente. Mínimo exigido: 8 caracteres."} ;
    if (senha !== senhaT) return {status:false, msg:"⚠ SISTEMA<br>Conflito de autenticação. As senhas não coincidem."} ;

   
    return {status : true};
}
