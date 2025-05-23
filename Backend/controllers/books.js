const Book = require('../models/Books')
const fs = require('fs')
exports.createBook=(req,res)=>{
    const bookObject = JSON.parse(req.body);
    delete bookObject._id;
    delete bookObject._userId;
    const book =new Book({
        ...bookObject,
        userId:req.auth.userId,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`


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
    const bookObject = req.file ?
    { 
    ...JSON.parse(req.body.thing),
    imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }:
    {...req.body};
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
    .then((book)=>{
       if (book.userId != req.auth.userId)  
        {
            res.status(401).json({message:'Non-authorisé'})
        }
        else
        {
            Book.updateOne({_id:req.params.id},{...bookObject,_id:request.params.id})
            .then(()=>res.status(200).json({message:'Objet modifié'}))
            .catch((error)=>res.status(401).json({error}))

        }


    })
    .catch((error)=>{res.status(400).json({error})})
}


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
                .then(()=>res.status(200).json({message:'Objet modifié'}))
                .catch((error)=>res.status(401).json({error}))

            })
          

        }})

    
    .catch(error => res.status(500).json({ error }));

}