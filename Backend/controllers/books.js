const Book = require('../models/Books')
const fs = require('fs')
const sharp=require('sharp');
const path=require('path');
exports.createBook=(req,res)=>{
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const name = req.file.originalname.split(' ').join('_').split('.')[0];
  const filename = `${name}_${Date.now()}.jpg`;
  const output = path.join('images', filename);
    sharp(req.file.buffer).resize({width:800}).jpeg({quality:70}).toFile(output)
    const book =new Book({
        ...bookObject,
        _userId:req.auth._userId,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${filename}`


    })
    book.save()
    .then(()=>res.status(201).json({message:'Objet enregistré !'}))
    .catch(error=>{res.status(400).json({error})})
       }
  
exports.getAllBooks=(req,res)=>{
      
        Book.find()
       
        .then(books=>res.status(200).json(books))
        
        .catch(err=>res.status(500).json({message: 'Erreur de récupération', error: err.message }))
       
        

}
exports.getTopBooks=(req,res)=>{
    Book.find().sort({ averageRating: -1 }).limit(3)                     
      .then(books =>res.status(200).json(books))
      
      .catch(err => {
        console.error('Erreur :', err);
      });
    

}

exports.getBookbyId=(req,res)=>{
       const bookId= req.params.id; 
        Book.findOne({_id:bookId})
          .then(book => {
              if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
              }
              res.json(book);
            })
            .catch(err => res.status(500).json({ message: 'Erreur serveur', error: err.message }));
}


exports.modifyBook=(req,res)=>{
    let bookObject;
    Book.findOne({_id: req.params.id})
    .then(book=>{

    
    if(!book) return res.status(404).json({message:'Livre non trouvé'});
  

    
    if(book._userId !== req.auth._userId){
        return res.status(401).json({message:'Non autorisé'});
    }
    
    
    if(req.file){
    const name = req.file.originalname.split(' ').join('_').split('.')[0];
      const filename = `${name}_${Date.now()}.jpg`;
      const output = path.join('images', filename);
      return sharp(req.file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 70 })
        .toFile(output)
        .then(()=>{const oldImage = book.imageUrl.split('/images/')[1];
            
      
       return fs.promises.unlink(`images/${oldImage}`)})
       

        .then(()=>{

          bookObject = {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`
      };

        delete bookObject._userId;
            return Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
          });
      } else {
        const bookObject = { ...req.body };
        delete bookObject._userId;
        return Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
      }
    })
    .then(() => {
      res.status(200).json({ message: 'Livre modifié avec succès' });
    })
    .catch(error => {
      res.status(400).json({ message: 'Erreur lors de la modification', error });
    });
};

      
      



exports.deleteBook=(req,res)=>{
    Book.findOne({ _id: req.params.id })
    .then((book)=>{
       if (book.userId != req.auth.userId)  
        {
            res.status(401).json({message:'Non-authorisé'})
        }
        else
        {
            const filename=book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`,()=>{
            Book.deleteOne({_id: req.params.id})
                .then(()=>res.status(200).json({message:'Objet supprimé'}))
                .catch((error)=>res.status(401).json({error}))

            })
          

        }})

    
    .catch(error => res.status(500).json({ error }));

}