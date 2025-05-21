const Book = require('../models/Books')
exports.createBook=(req,res)=>{
      delete req.body._id;
       const book = new Book({
        ...req.body
       })
       book.save()
       .then(()=>res.status(201).json({message:'Objet enregistré !'}))
       .catch(error=>res.status(400).json({error}));
    
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
      Book.updateOne({_id: req.params.id},{...req.body, _id: req.params.id})
        .then(()=>res.status(200).json({message:'Objet modifié !'}))
        .catch(error=> res.status(400).json({error}));
}


exports.deleteBook=(req,res)=>{
    Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));

}