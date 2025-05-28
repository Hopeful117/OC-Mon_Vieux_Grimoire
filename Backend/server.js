const http = require('http');
const app= require('./app');
app.set('port',process.env.PORT || 4000)
const server=http.createServer(app);
server.listen(process.env.PORT || 4000);


const mongoose=require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URl)
 
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));