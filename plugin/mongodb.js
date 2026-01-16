const fp = require('fastify-plugin')
const mongoose = require('mongoose')

module.exports = fp(async function (fastify, opts) {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        fastify.decorate("mongoose", mongoose)
        fastify.log.info("mongodb connected")
    } catch (error) {
        fastify.log.error(error)
        fastify.log.error('Failed to connect to MongoDB. Please check your connection string and network.')
        process.exit(1)
    }
})