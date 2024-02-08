import fastify from "fastify"
import { createPoll } from "./routes/create-poll"
import { getPoll } from "./routes/get-polls"
const app = fastify()
import cookie from '@fastify/cookie'
import { voteOnPoll } from "./routes/vote-on-poll"



app.register(cookie, {
    secret: 'polls-app-nlw',
    hook: 'onRequest',
    parseOptions: {}
})
app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)


app.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running ')
})