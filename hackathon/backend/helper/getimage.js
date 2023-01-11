var gfs, gridBucket;
const { connection, mongo } = require("mongoose");
const gridFs = require("gridfs-stream");

connection.once('open', () => {
    gfs = gridFs(connection, mongo);
    gridBucket = new mongo.GridFSBucket(connection, {
        bucketName: 'images'
    })
    gfs.collection("images");
})

const getImage = async (req, res) => {
    // song stream api which will directly get image data from gridfs

    try {

        let { name } = req.params;
        let img = await gfs.files.findOne({ filename: name });
        if (!img) throw new Error("no image found with name");
        const readstream = gridBucket.openDownloadStream(img._id);
        res.setHeader('content-Type', 'image/jpeg');
        readstream.pipe(res);
    } catch (e) {
        res.status(404).json({ success: false, msg: e.message });
    }
}

module.exports = getImage