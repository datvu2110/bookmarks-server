require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')

app.use(bodyParser.json())
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status('401').json({error: 'Unauthorized access'})
    }
    next();
});

const books = [
    {
        id:1,
        title:'test',
        url:'http://test.com',
        rating:3,
        description:"testing book"
    }
]

app.route("/bookmarks")
    .get((req, res) =>{
        res.json(books)
    })
    .post((req,res)=>{

        const{title,url,rating,description}=req.body;
    
        if(!title){
          return res
            .status(400)
            .send('title is required');
        }
        if(!url){
          logger.error('url is required');
          return res
            .status(400)
            .send('url Is Required');
        }
        if(!rating){
          logger.error('rating is required');
          return res
            .status(400)
            .send('rating is required');
        }
        if(!description){
          logger.error('description is required');
          return res
            .status(400)
            .send('description is required');
        }

        const id=uuidv4();
        const book={
            id,
            title,
            url,
            rating,
            description
        }

        books.push(book);

        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json(books)
    })

app.route('/bookmarks/:id')
    .get((req,res)=>{
        const { id } = req.params;
        const book = books.find(b => b.id == id);
    
        if (!book) {
            return res
                .status(404)
                .send('Book Not Found');
        }
        res.json(book);

    })

    .delete((req,res)=>{
        const { id } = req.params;
        const bookIndex = books.findIndex(b => b.id == id);
    
       
        if (bookIndex===-1) {
          return res
            .status(404)
            .send('Book Not Found');
        }
    
        books.splice(bookIndex,1);
        res
            .json("book is deleted")
            .status(203)
            .end();
    
    });

app.listen(8000, () => {
    console.log('server at 8000');
})

