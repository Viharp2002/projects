const { connection } = require("mongoose");

// to accept multipart/form request
const multer = require("multer");

// to upload files in database as gridfs storage
const { GridFsStorage } = require("multer-gridfs-storage");


const storageImage = new GridFsStorage({
    db: connection,
    file: (req, file) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            return {
                // all images will be stored in this
                // like user profile & schems image etc
                // but all will have different ids so not a problem
                filename: Date.now() + "." + file.mimetype.split('/')[1],
                bucketName: "images"
            }
        }
        throw new Error("invalid file type");

    }
})

const storageDocs = new GridFsStorage({
    db: connection,
    file: (req, file) => {
        console.log(file);
        if (file.mimetype == "application/pdf") {
            return {
                filename: Date.now() + "." + file.mimetype.split('/')[1],
                bucketName: "docs",
            }
        }
        throw new Error("invalid file type");
    }
})

const uploadImage = multer({ storage: storageImage });

const uploadDocs = multer({
    storage: storageDocs,
})

module.exports = { uploadDocs, uploadImage };