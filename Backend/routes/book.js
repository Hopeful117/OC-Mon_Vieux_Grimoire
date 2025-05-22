const express = require('express');
const Book = require('../models/Books')
const bookCtrl=require('../controllers/books')
const auth=require('../middleware/auth')


const router = express.Router();


router.post('/',bookCtrl.createBook,auth)
router.get('/',bookCtrl.getAllBooks)
router.get('/bestrating',bookCtrl.getTopBooks)
router.get(`/:id`,bookCtrl.getBookbyId)

router.put('/:id',bookCtrl.modifyBook,auth)

router.delete('/:id',bookCtrl.deleteBook,auth)




module.exports = router;
