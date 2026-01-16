const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


exports.register = async(request, reply) => {
    try {
        const { name, email, password, country } = request.body
        //Validate fields
        if (!name || !email || !password || !country) {
            return reply.status(400).send({ error: "All fields are required" })
        }
        
        //Hash password
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({
            name,
            email,
            password: hashedPassword,
            country
        })
        await user.save()
        reply.code(201).send({message: "User created successfully"})
    } catch (error) {
        reply.send(error)
    }
}

exports.login = async(request, reply) => {
    try {
        const { email, password } = request.body
        //Validate fields
        if (!email || !password) {
            return reply.status(400).send({ error: "All fields are required" })
        }
        //Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return reply.status(401).send({ error: "Invalid credentials" })
        }
        //Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return reply.status(401).send({ error: "Invalid credentials" })
        }
        const token = request.server.jwt.sign({ id: user._id })
        reply.code(200).send({ token })
    } catch (error) {
        reply.send(error)
    }
}

exports.forgotPassword = async(request, reply) => {
    try {
        const { email } = request.body
        //Validate fields
        if (!email) {
            return reply.status(400).send({ error: "Email is required" })
        }
        //Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return reply.status(401).send({ error: "User not found" })
        }
        //Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex")
        user.resetPasswordToken = resetToken
        user.resetPasswordExpiry = Date.now() + 3600000 //1 hour
        await user.save({ validateBeforeSave: false })
        const resetUrl = `http://localhost:${process.env.PORT}api/auth/reset-password/${resetToken}`
        //Send email
        reply.code(200).send({ resetUrl })
    } catch (error) {
        reply.send(error)
    }
}

exports.resetPassword = async(request, reply) => {
    const resetToken = request.params.token
    const {newPassword} = request.body

    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpiry: { $gt: Date.now() },

    })
    if(!user){
        return reply.badRequest("Invalid or expired token")
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    await user.save()
    reply.send({message : "Password reset successfully"})

}

exports.logout = async(req, reply) => {

    //JWT are stateless, use strategy like refresh token or blacklist token or more
    reply.code(200).send({message: "User logged out successfully"})
}