const path = require('path')
const fastify = require('fastify')({
    logger: true
})
const fastifyEnv = require('@fastify/env');
const { type } = require('os');

//Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})
//register plugin
fastify.register(require("@fastify/cors"))
fastify.register(require("@fastify/sensible"))
fastify.register(require("@fastify/env"), {
    dotenv: true,
    schema:{
        type: 'object',
        required: ['PORT',"MONGO_URI","JWT_SECRET"],
        properties: {
            PORT: { type: 'string',default : 3000 },
            MONGO_URI: { type: 'string' },
            JWT_SECRET: { type: 'string' },

        }
    }
})

//register custom plugin
fastify.register(require("./plugin/mongodb"))

//test database connection
fastify.get("/test", async (request, reply) => {
    try {
        const db = fastify.mongoose 
        const connectionState = await db.connection.readyState

        let status = ''
        switch (connectionState) {
            case 0:
                status = 'disconnected'
                break;
            case 1:
                status = 'connected'
                break;
            case 2:
                status = 'connecting'
                break;
            case 3:
                status = 'disconnecting'
                break;
            default:
                status = 'unknown'
                break;
        }
        reply.status(200).send({ status })
    } catch (error) {
        fastify.log.error(error)
        reply.status(500).send(error)
        process.exit(1)

    }
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