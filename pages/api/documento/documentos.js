import prisma from '../../../lib/prisma'


export default async function (req, res) {
  if (req.method === 'POST') {
    const { body } = req;
    const movie = await prisma.movie.create({ data: JSON.parse(body) });
    res.json(movie);
  }
}