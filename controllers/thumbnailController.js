const Thumbnail = require("../models/thumbnail.js");

const path = require("path");
const fs = require("fs");
const {pipeline} = require("stream");
const util = require("util");

const pipelineAsync = util.promisify(pipeline);


exports.createThumbnail = async(req, reply) => {
    try {
        const parts = request.part()
        let fields = {}
        let filename;

        for await (const part of parts) {
            if (part.filename) {
                const filename = `${Date.now()}-${part.filename}`
                const savePath = path.join(__dirname, "..","uploads",
                    "thumbnail", filename)
            await pipelineAsync(part.file, fs.createWriteStream(savePath))

            }
            else {
                fields[part.filename] = parts.value
            }
        }

        const thumbnail = new Thumbnail({
            user: req.user.id,
            videoName: fields.videoName,
            version : fields.version,
            image: `/uploads/thumbnail/${filename}`,
            paid : fields.paid === "true" ? true : false
        })
        await thumbnail.save()
        reply.code(201).send(thumbnail)
    } catch (error) {
        reply.send(error)
    }
}

exports.getThumbnails = async(req, reply) => {
    try {
        const thumbnails = await Thumbnail.find({user: req.user.id})
        reply.code(200).send(thumbnails)
    } catch (error) {
        reply.send(error)
    }
}

exports.getThumbnail = async(req, reply) => {
    try {
        const thumbnail = await Thumbnail.findOne(
            {_id : req.params.id,
            user: req.user.id}
        )
        if(!thumbnail){
            return reply.status(404).send({error: "Thumbnail not found"})
        }
        reply.code(200).send(thumbnail)
    } catch (error) {
        reply.send(error)
    }
}

exports.updateThumbnail = async(req, reply) => {
    try {
        const updateThumbnail = await Thumbnail.findOneAndUpdate(
            {_id : req.params.id,
            user: req.user.id},
            req.body,
            {new: true}
        )
        if(!updateThumbnail){
            return reply.status(404).send({error: "Thumbnail not found"})
        }
        reply.code(200).send(updateThumbnail)
    } catch (error) {
        reply.send(error)
    }
}

exports.deleteThumbnail = async(req, reply) => {
    try {
        const thumbnail  = await Thumbnail.findOneAndDelete(
            {_id : req.params.id,
            user: req.user.id}
        )
        if(!thumbnail){
            return reply.status(404).send({error: "Thumbnail not found"})
        }
        const imagePath = path.join(__dirname, "..", thumbnail.image)
        fs.unlink(imagePath, err => {
            if(err){
                return reply.send(err)
            }
            reply.code(200).send({message: "Thumbnail deleted successfully"})
        })
        

    } catch (error) {
        reply.send(error)
    }
}

exports.deleteThumbnails = async(req, reply) => {
    try {
        const thumbnails = await Thumbnail.deleteMany({user: req.user.id})

        for(const thumbnail of thumbnails.deletedCount){
            const imagePath = path.join(__dirname, "..", thumbnail.image)
            fs.unlink(imagePath, err => {
                if(err){
                    return reply.send(err)
                }
            })
        }
        reply.code(200).send({message: "Thumbnails deleted successfully"})
    } catch (error) {
        reply.send(error)
    }
}