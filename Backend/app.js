const express = require('express');
const mongoose=require('mongoose')
const app = express();
const Book = require('./models/Books')
mongoose.connect('mongodb+srv://ludo:ewvRqUA75iQlJY5N@cluster0.xbvegf1.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/books',(req,res)=>{
   delete req.body._id;
   const book = new Book({
    ...req.body
   })
   book.save()
   .then(()=>res.status(201).json({message:'Objet enregistré !'}))
   .catch(error=>res.status(400).json({error}));

})
app.get('/api/books',(req,res)=>{
    
    Book.find()
   
    .then(books=>res.status(200).json(books))
    
    .catch(err=>res.status(500).json({message: 'Erreur de récupération', error: err.message }))
   
    
    
   


})
app.get('/api/books/bestrating',(req,res)=>{
Book.find().sort({ averageRating: -1 }).limit(3)                     
  .then(books =>res.status(200).json(books))
  
  .catch(err => {
    console.error('Erreur :', err);
  });

})
app.get(`/api/books/:id`,(req,res)=>{
    const bookId= req.params.id; 
    Book.findOne({_id:bookId})
      .then(book => {
          if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
          }
          res.json(book);
        })
        .catch(err => res.status(500).json({ message: 'Erreur serveur', error: err.message }));
})

app.put('/api/books/:id',(req,res)=>{
    Book.updateOne({_id: req.params.id},{...req.body, _id: req.params.id})
    .then(()=>res.status(200).json({message:'Objet modifié !'}))
    .catch(error=> res.status(400).json({error}));
})

app.delete('/api/books/:id', (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});




module.exports = app;