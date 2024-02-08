import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';

export async function voteOnPoll(app: FastifyInstance) {
    app.post('/polls/:pollId/votes', async (request, reply) => {
        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid(),
        });
        const voteOnPollParams = z.object({
            pollId: z.string().uuid(),
        });

        const { pollId } = voteOnPollParams.parse(request.params);
        const { pollOptionId } = voteOnPollBody.parse(request.body);
        let { sessionId } = request.cookies;

        if (!sessionId) {
            sessionId = randomUUID();

            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24,
                signed: true,
                httpOnly: true
            });

            await prisma.vote.create({
                data: {
                    sessionId,
                    pollId,
                    pollOptionId
                }
            });
        } else {
            const userPreviousVoteOnPoll = await prisma.vote.findUnique({
                where: {
                    sessionId_pollId: {
                        sessionId,
                        pollId
                    }
                }
            });

            if (!userPreviousVoteOnPoll) {
                await prisma.vote.create({
                    data: {
                        sessionId,
                        pollId,
                        pollOptionId
                    }
                });
            } else {
                await prisma.vote.delete({
                    where: {
                        id: userPreviousVoteOnPoll.id
                    }
                });
                return reply.status(400).send({ error: "User has already voted on this poll." });
            }
        }

        return reply.status(201).send({ sessionId });
    });
}
