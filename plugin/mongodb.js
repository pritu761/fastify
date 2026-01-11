const fp = require('fastify-plugin')
const mongoose = require('mongoose')

module.exports = fp(async function (fastify, opts) {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        fastify.decorate("mongoose", mongoose)
        fastify.log.info("mongodb connected")
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
})