import prisma from '../../../lib/prisma'
// import {Documento} from '@prisma/client'

export default async function (req, res) {
    if (req.method === 'GET') {
        const relDocumentos = 
            await prisma
                .$queryRaw`SELECT id,nome FROM documento`
            // await prisma.execute_raw(`SELECT id,nome FROM documento`)
            //await prisma.documento.findMany()
        res.json(relDocumentos)
    }
}