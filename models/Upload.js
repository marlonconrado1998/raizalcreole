module.exports = class ClassUpload {

    constructor(multer) {
        this.multer = multer;
    }

    uploadImageToServer(path) {
        return this.multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path)
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + parseInt(Math.random() * (9999 - 1000) + 1000) + '.jpg')
            }
        });
    }
}