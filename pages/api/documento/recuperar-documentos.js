import prisma from '../../../lib/prisma'

export default async function (req, res) {
    console.log(req.method)
    if (req.method === 'GET') {
        const totalDocumentos = await prisma.documento.findMany()
        console.log(totalDocumentos)
        res.json(totalDocumentos)
    }
}