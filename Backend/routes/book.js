const express = require('express');
const Book = require('../models/Books')
const bookCtrl=require('../controllers/books')
const auth=require('../middleware/auth')
const upload=require('../middleware/multer-config')



const router = express.Router();


router.post('/',auth,upload,bookCtrl.createBook,)

router.post('/:id/rating',auth,bookCtrl.rateBook)
router.get('/',bookCtrl.getAllBooks)
router.get('/bestrating',bookCtrl.getTopBooks)
router.get(`/:id`,bookCtrl.getBookbyId)

router.put('/:id',auth,upload,bookCtrl.modifyBook)

router.delete('/:id',auth,bookCtrl.deleteBook)





module.exports = router;
