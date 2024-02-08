import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'


export async function getPoll(app: FastifyInstance) {
    app.get('/polls/:pollId', async (request, reply) => {
        const getpollParams = z.object({
            pollId: z.string().uuid(),

        })
        const { pollId } = getpollParams.parse(request.params)
        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include: {
                options: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }

        })
        return reply.send({ poll })
    })

}