var gfs, gridBucket;
const { connection, mongo } = require("mongoose");
const gridFs = require("gridfs-stream");

connection.once('open', () => {
    gfs = gridFs(connection, mongo);
    gridBucket = new mongo.GridFSBucket(connection, {
        bucketName: 'docs'
    })
    gfs.collection("docs");
})

const getDocs = async (req, res) => {
    // song stream api which will directly get image data from gridfs
    try {

        let { name } = req.params;
        let doc = await gfs.files.findOne({ filename: name });
        if (!doc) throw new Error("no document found with name");

        const readstream = gridBucket.openDownloadStream(doc._id);
        res.setHeader('content-Type', 'application/pdf');
        readstream.pipe(res);
    }
    catch (e) {
        res.status(404).json({ success: false, msg: e.message });
    }
}

module.exports = getDocs;