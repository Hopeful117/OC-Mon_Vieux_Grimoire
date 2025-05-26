const multer = require('multer');
const MIME_TYPES={
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png'
}



const storage =multer.memoryStorage();
const upload=multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 *1024
    },
    fileFilter:(req,file,callback)=>{
        if (MIME_TYPES[file.mimetype]){
            callback(null,true);
        }
        else{
            callback(new Error('Seules les images sont autorisées'),false);
        }

    }
})
module.exports = upload.single('image');