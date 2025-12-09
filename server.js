require('dotenv').config();
const fastify = require('fastify')({
    logger: true
})

//Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})

const start = async () => {
    try {
        await fastify.listen({port:process.env.PORT});
        fastify.log.info(`server listening on ${process.env.port}`);
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start();