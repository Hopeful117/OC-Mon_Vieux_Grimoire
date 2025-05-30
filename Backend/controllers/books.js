const Book = require('../models/Books')
const fs = require('fs')
const sharp=require('sharp');
const path=require('path');
const mongoose=require('mongoose')

exports.createBook = async (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const name = req.file.originalname.split(' ').join('_').split('.')[0];
    const filename = `${name}_${Date.now()}.jpg`;
    const output = path.join('images', filename);

    
    await sharp(req.file.buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 70 })
      .toFile(output);

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId, 
      imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`
    });

    await book.save();

    res.status(201).json({ message: 'Objet enregistré !' });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création du livre', error });
  }
};
  
exports.getAllBooks=async(req,res)=>{
      try{
      const books= await Book.find()
       
      res.status(200).json(books)
      }
       catch (error){ 
        res.status(500).json({message: 'Erreur de récupération', error: err.message })
       }
       
        

}
exports.getTopBooks=async(req,res)=>{
  try{ 
  
  const books=await Book.find().sort({ averageRating: -1 }).limit(3)                     
  res.status(200).json(books)

  }
      
  catch(error){
        res.status(500).json({message: 'Erreur de récupération', error: err.message })
      };
    

}

exports.getBookbyId=async(req,res)=>{
  try{
    const bookId= req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: 'ID invalide' });
    }
    const book=await Book.findOne({_id:bookId})
    
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json(book); 


  }
  catch(error){
    res.status(500).json({message: 'Erreur de récupération', error: err.message })

  }
      
        
          
}


exports.modifyBook=async(req,res)=>{
  try{
    let bookObject;

   
    const book=await Book.findOne({_id: req.params.id})
      if(!book) {
      return res.status(404).json({message:'Livre non trouvé'});
    }
  

    
    if(book.userId !== req.auth.userId){
        return res.status(401).json({message:'Non autorisé'});
    }

     if(req.file){
    const name = req.file.originalname.split(' ').join('_').split('.')[0];
      const filename = `${name}_${Date.now()}.jpg`;
      const output = path.join('images', filename);
       await sharp(req.file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 70 })
        .toFile(output)
        
        const oldImage = book.imageUrl.split('/images/')[1];
            
          if (oldImage){
          return fs.promises.unlink(`images/${oldImage}`).catch(() => null);
          }

          bookObject = {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`
          
          }

      }

       else {
        bookObject = { ...req.body };
     
      }
    
      delete bookObject._userId;
      await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
      res.status(200).json({ message: 'Livre modifié avec succès' });

        
          
      }
      
      catch(error){

            if (!res.headersSent) {
      res.status(400).json({ message: 'Erreur lors de la modification', error });
         }
    };


      }
    

exports.deleteBook=async(req,res)=>{

  try{
     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID invalide' });
       }
       
         const book= await Book.findOne({ _id: req.params.id })
           
         if(!book){ 
          return res.status(404).json({message:'Livre non trouvé'});
        }

         if (book.userId != req.auth.userId)  
        {
            res.status(401).json({message:'Non-authorisé'})
        }

         if(!book) return res.status(404).json({message:'Livre non trouvé'});

           const filename=book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`,()=>{
          try{
           Book.deleteOne({_id: req.params.id})
            res.status(200).json({message:'Objet supprimé'})
          }
          catch(error){
             if (!res.headersSent) {
                  res.status(400).json({error})
                  }

          }

        })

    
        


  }
  catch(error){
    res.status(500).json({ error })

  }
 

}


exports.rateBook=async(req,res)=>{
  try{
     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID invalide' });
       } 
    const book = await Book.findOne({_id: req.params.id})
   
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        
        if (req.body.rating < 0 || req.body.rating > 5) {
        return res.status(400).json({ message: 'Note invalide (0 à 5 autorisés).' });
      }

      

        if(book.ratings.some((rating)=>rating.userId === req.auth.userId)){
            return res.status(401).json({message:'Non-authorisé'})
        }

              book.ratings.push({
              userId:req.auth.userId,
              grade:req.body.rating

          })
          const total=book.ratings.reduce((sum, rating) => sum + rating.grade, 0) 
          book.averageRating= total / book.ratings.length;
               
         try{   
        const updatedBook=await book.save()
        res.status(200).json(updatedBook)
         }
         catch(error){
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement', error });
         }
    }
    catch(error){
      res.status(500).json({ error });

    }


    
}