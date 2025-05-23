const express = require('express');
const Book = require('../models/Books')
const bookCtrl=require('../controllers/books')
const auth=require('../middleware/auth')
const multer=require('../middleware/multer-config')


const router = express.Router();


router.post('/',auth,multer,bookCtrl.createBook,)
router.get('/',bookCtrl.getAllBooks)
router.get('/bestrating',bookCtrl.getTopBooks)
router.get(`/:id`,bookCtrl.getBookbyId)

router.put('/:id',auth,multer,bookCtrl.modifyBook)

router.delete('/:id',auth,bookCtrl.deleteBook)




module.exports = router;
