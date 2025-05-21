const express = require('express');
const Book = require('../models/Books')
const bookCtrl=require('../controllers/books')


const router = express.Router();


router.post('/',bookCtrl.createBook)
router.get('/',bookCtrl.getAllBooks)
router.get('/bestrating',bookCtrl.getTopBooks)
router.get(`/:id`,bookCtrl.getBookbyId)

router.put('/:id',bookCtrl.modifyBook)

router.delete('/:id',bookCtrl.deleteBook)




module.exports = router;
