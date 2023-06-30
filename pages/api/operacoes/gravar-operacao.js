
export default async function (req, res) {
    let docEnvio = {}
    if (req.method === 'POST') {
        console.log('Corpo da mensagem', JSON.parse(req.body))
        if (req.body){
            docEnvio = JSON.parse(req.body)
            console.log('DOC QUE ESTÁ SENDO ENVIADO',docEnvio)
            const documentoSalvo = await prisma.operacao.create({data:docEnvio})
                .then( (ret)=>{                
                    console.log('Retorno do prisma',ret)
                    res.json(ret);
                })
                .catch((error) => {
                    console.log(error)
                })
            
        }
    }
}