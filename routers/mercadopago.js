import { MercadoPagoConfig, Payment } from "mercadopago";
import qr_code from "qrcode-terminal";
import { paymentDB } from "../db/payment.db.js";
import 'dotenv/config'
import { getPaymentUser, getUserDB } from "../db/user.js";

const price = 0.10

//criarCobranca()
export async function criarCobranca(req, res) {
    let userId = req.user.id
    let user = await getUserDB(userId)
    let paymentDB = await getPaymentUser(userId)
    let paymentQtd = paymentDB.length - 1

    if(paymentDB[paymentQtd].ativo){ return res.json({erro:true, msg:"Sistema já ativo"})}
    const client = new MercadoPagoConfig({
        accessToken: process.env.ACESS_TOKEN_MERCADOPAGO
    });

    const payment = new Payment(client);

    const body = {
        transaction_amount: price,
        description: 'Acesso a cipherTracer',
        payment_method_id: 'pix',

        external_reference:userId,

        notification_url:"https://www.ciphertracer.com.br/webhook",

        payer: {
            email: user.email,
            first_name: user.nome.split(" ")[0]
        }
    };

    payment.create({ body })
        .then(response => {

            const pix = response.point_of_interaction.transaction_data;

            console.log("PIX Copia e Cola:");
            console.log(pix.qr_code);

            console.log("\nQR Code Base64:");
           // console.log(pix.qr_code_base64);
          //  console.log(qr_code.generate(pix.qr_code, { small : true}))
            res.json({erro: false, qrcode_64: pix.qr_code_base64, qr_code : pix.qr_code, price:price})

        })
        .catch(error => console.log(error));
}

export async function webhook(req, res) {

    // responder rápido para o Mercado Pago
    res.sendStatus(200);

    try {

        console.log(req.body);

        // pegar id do pagamento
        const paymentId = req.body.data?.id || req.body.resource;

        if (!paymentId) return;

        console.log("Pagamento recebido:", paymentId);

        const client = new MercadoPagoConfig({
            accessToken: process.env.ACESS_TOKEN_MERCADOPAGO
        });

        const payment = new Payment(client);

        const pagamento = await payment.get({
            id: paymentId
        });
        let userId = pagamento.external_reference
        console.log("UserId: ",pagamento.external_reference)


        console.log("Status:", pagamento.status);
    

        if (pagamento.status === "approved") {
            console.log("PIX pago ✅");

            gerarAcesso(userId, 7, price)
        }

    } catch (erro) {
        console.log("Erro webhook:", erro);
    }
}

export function gerarAcesso(userId, dias, valor) {

    const dataCriacao = new Date();

    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataCriacao.getDate() + dias);

   let dados = {
    userId:userId,
    valor:valor,
    dataCriacao:dataCriacao,
    dataExpiracao,dataExpiracao
   }

   paymentDB(dados)
  
}
