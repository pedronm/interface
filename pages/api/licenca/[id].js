import prisma from '../../../lib/prisma'

export default async function handler(req, res){
    if(req.method === 'DELETE')
    {
        if(req.query){
            const retorno = 
                await prisma.operacao.delete({
                    where: {
                        id: Number(req.query.id),
                    },
                });
            res.json(retorno)
    }}
    if(req.method === 'PUT' ){
        console.log('Entrou no update', req.body)
        if(req.body){
            const retorno = 
                await prisma.operacao.update({
                    where: {
                        id: Number(req.query.id)
                    },
                    data:JSON.parse(req.body)
                })
            res.json(retorno)
        }
    }
} 