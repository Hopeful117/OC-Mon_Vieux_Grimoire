const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Book = require('../models/Books');
const path = require('path');
const jwt = require('jsonwebtoken');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "test" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Book.deleteMany();
});
describe('GET /api/books',()=>{
    let book;
    beforeEach(async () => {
    book = await Book.create({
      userId:'test_user',
      title: 'Livre Test',
      author: 'Auteur',
      year: 2024,
      imageUrl:'http://test.fakeurl.fr',
      genre:'test',
      ratings: [],
      averageRating: 0,
    });
  });

  test('Affiche les livres',async()=>{
    const response = await request(app)
    .get('/api/books')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1);
  })


})

describe('GET /api/books/bestrating',()=>{
    let book;
    beforeEach(async () => {
    book = await Book.create({
      userId:'test_user',
      title: 'Livre Test',
      author: 'Auteur',
      year: 2024,
      imageUrl:'http://test.fakeurl.fr',
      genre:'test',
      ratings: [],
      averageRating: 0,
    });
    book = await Book.create({
      userId:'test_user',
      title: 'Livre Test 2',
      author: 'Auteur',
      year: 2024,
      imageUrl:'http://test.fakeurl.fr',
      genre:'test',
      ratings: [],
      averageRating: 0,
    });

    book = await Book.create({
      userId:'test_user',
      title: 'Livre Test 3',
      author: 'Auteur',
      year: 2024,
      imageUrl:'http://test.fakeurl.fr',
      genre:'test',
      ratings: [],
      averageRating: 0,
    });
    
    
    
  });
    test('Affiche les 3 meilleurs livres',async()=>{
    const response = await request(app)
    .get('/api/books/bestrating')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(3);
  })

})

describe('GET /api/books/:id',()=>{
    let book;
    let fakeID='64d9f2f3c123456789abcdef'
    let invalidId="jazpjeaopzejaop"
    
    beforeEach(async () => {
    book = await Book.create({
      userId:'test_user',
      title: 'Livre Test',
      author: 'Auteur',
      year: 2024,
      imageUrl:'http://test.fakeurl.fr',
      genre:'test',
      ratings: [],
      averageRating: 0,
    });
  });

  test('Affiche la fiche du livre',async()=>{
    const response = await request(app)
    .get(`/api/books/${book._id}`)
    expect(response.status).toBe(200)
   
  })

  test('Livre non trouvé',async()=>{
    const response=await request(app)
    .get(`/api/books/${fakeID}`)
    expect(response.status).toBe(404)
  })
  test('Id invalide',async()=>{
    const response=await request(app)
    .get(`/api/books/${invalidId}`)
    expect(response.status).toBe(400)
  })
  });

  

describe('POST /api/books/',()=>{
      test('Ajoute un livre', async()=>{
         const token = jwt.sign({ userId: 'user1' }, 'RANDOM_TOKEN_SECRET');
        const response = await request(app)
    .post('/api/books')
    .set('Authorization', `Bearer ${token}`)
.field('book', JSON.stringify({
    userId:'user1',
      title: 'Livre Test',
      author: 'Auteur',
      year: 2024,
      genre: 'test',
      averageRating: 0,
      ratings:[],
}))
    .attach('image', path.resolve(__dirname, 'fixtures/test.jpg'));
        expect(response.status).toBe(201)

})


})

describe('DELETE /api/books/:id',()=>{
    let book;
    let fakeID='64d9f2f3c123456789abcdef'
    let invalidId="jazpjeaopzejaop"
  

    beforeEach(async () => {
    book = await Book.create({
       
      userId:'user1',
      title: 'Livre Test',
      author: 'Auteur',
      year: 2024,
      imageUrl:'http://test.fakeurl.fr',
      genre:'test',
      ratings: [],
      averageRating: 0,
    });
  });
    test('Supprime un livre',async()=>{
        const token = jwt.sign({ userId: 'user1' }, 'RANDOM_TOKEN_SECRET');
        const response = await request(app)
        .delete(`/api/books/${book._id}`)
        
        .set('Authorization',`Bearer ${token}`)
        

        expect(response.status).toBe(200)



    })
    test('Refuse la demande de suppression',async()=>{

         const token = jwt.sign({ userId: 'user2' }, 'RANDOM_TOKEN_SECRET');
        const response = await request(app)
        .delete(`/api/books/${book._id}`)
        
        .set('Authorization',`Bearer ${token}`)
        

        expect(response.status).toBe(401)

    })

    test('Livre non trouvé',async()=>{
       const token = jwt.sign({ userId: 'user1' }, 'RANDOM_TOKEN_SECRET');
    const response=await request(app)
    .delete(`/api/books/${fakeID}`)
    .set('Authorization',`Bearer ${token}`)
    
    expect(response.status).toBe(404)
  })
  test('Id invalide',async()=>{
     const token = jwt.sign({ userId: 'user1' }, 'RANDOM_TOKEN_SECRET');
    const response=await request(app)
    .delete(`/api/books/${invalidId}`)
    .set('Authorization',`Bearer ${token}`)
    
    expect(response.status).toBe(400)
  })
})
describe('PUT /api/books/:id',()=>{
let book;
const token = jwt.sign({ userId: 'user1' }, 'RANDOM_TOKEN_SECRET');

const token2 = jwt.sign({ userId: 'user2' }, 'RANDOM_TOKEN_SECRET');
let fakeID='64d9f2f3c123456789abcdef'
let invalidId="jazpjeaopzejaop"


     beforeEach(async () => {
    book = await Book.create({
       
      userId:'user1',
      title: 'Livre Test',
      author: 'Auteur',
      year: 2024,
      imageUrl:'http://test.fakeurl.fr',
      genre:'test',
      ratings: [],
      averageRating: 0,
    });
  });

  test("Modification sans changement d'image",async()=>{
     const response = await request(app)
        .put(`/api/books/${book._id}`)
        
        .set('Authorization',`Bearer ${token}`)

        .send({
        userId:'user1',
      title: 'Livre Test',
      author: 'Auteur',
      year: 2025,
      imageUrl:'http://test.fakeurl.fr',
      genre:'test',
      ratings: [],
      averageRating: 0,


        })
expect(response.status).toBe(200)


  })

  test("Modification avec changement d'image",async()=>{
    const response = await request(app)
     .put(`/api/books/${book._id}`)
        
        .set('Authorization',`Bearer ${token}`)
        .field('book', JSON.stringify({
      userId:'user1',
      title: 'Livre Test',
      author: 'Auteur',
      year: 2025,
      imageUrl:'http://test.fakeurl.fr',
      genre: 'test',
      averageRating: 0,
      ratings:[],

    
  }))
   .attach('image', path.resolve(__dirname, 'fixtures/test.jpg'));
    expect(response.status).toBe(200)
    
 
       

})
test("Refus de modification",async()=>{
  
  const response =await request(app)
   .put(`/api/books/${book._id}`)
  .set('Authorization',`Bearer ${token2}`)
     .send({
        userId:'user1',
      title: 'Livre Test',
      author: 'Auteur',
      year: 2025,
      imageUrl:'http://test.fakeurl.fr',
      genre:'test',
      ratings: [],
      averageRating: 0,


        })

        expect(response.status).toBe(401)

  
})
 test('Livre non trouvé',async()=>{
    const response=await request(app)
    .put(`/api/books/${fakeID}`)
    .set('Authorization',`Bearer ${token}`)
    expect(response.status).toBe(404)
  })
  test('Id invalide',async()=>{
    const response=await request(app)
    .put(`/api/books/${invalidId}`)
    .set('Authorization',`Bearer ${token}`)
    expect(response.status).toBe(400)
  })

})
  
    


describe('POST /api/books/:id/rating', () => {
  let book;
   const token = jwt.sign({ userId: 'user1' }, 'RANDOM_TOKEN_SECRET');
    let fakeID='64d9f2f3c123456789abcdef'
    let invalidId="jazpjeaopzejaop"
  

  beforeEach(async () => {
    book = await Book.create({
      userId:'test_user',
      title: 'Livre Test',
      author: 'Auteur',
      year: 2024,
      imageUrl:'http://test.fakeurl.fr',
      genre:'test',
      ratings: [],
      averageRating: 0,
    });
  });

  test('Ajoute une note valide', async () => {
    const response = await request(app)
      .post(`/api/books/${book._id}/rating`)
        .set('Authorization', `Bearer ${token}`)
        .send({
        userId:'user1', 
        rating: 4 });
  
    expect(response.status).toBe(200);
    expect(response.body.ratings.length).toBe(1);
    expect(response.body.averageRating).toBe(4);
  });

  test('Refuse une note invalide', async () => {
    const response = await request(app)
      .post(`/api/books/${book._id}/rating`)
        .set('Authorization', `Bearer ${token}`)
      .send({userId:'user1',  
        rating: 7 });

    expect(response.status).toBe(400);
  });

  test('Refuse une double notation du même utilisateur', async () => {
    // Première note
    await request(app)
      .post(`/api/books/${book._id}/rating`)
       .set('Authorization', `Bearer ${token}`)
      .send({ userId:'user1', rating: 5 });

    // Deuxième tentative
    const response = await request(app)
      .post(`/api/books/${book._id}/rating`)
        .set('Authorization', `Bearer ${token}`)
      .send({ userId:'user1', rating: 3 });

    expect(response.status).toBe(401);
  });

  test('Livre non trouvé',async()=>{
    const response=await request(app)
    .post(`/api/books/${fakeID}/rating`)
    .set('Authorization',`Bearer ${token}`)
    expect(response.status).toBe(404)
  })
  test('Id invalide',async()=>{
    const response=await request(app)
    .post(`/api/books/${invalidId}/rating`)
    .set('Authorization',`Bearer ${token}`)
    expect(response.status).toBe(400)
  })
});
