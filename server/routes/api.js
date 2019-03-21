const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')
const db = "mongodb://localhost:27017/eventsdb"

mongoose.connect(db, err => {
    if(err){
        console.error('Error! ' + err)
    } else {
      console.log('Connected to mongodb')      
    }
})

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}

router.get('/',(req, res) =>{
    res.send('From API route')
})

router.post('/register', (req, res) => {
    let userData = req.body
    let user = new User(userData)
    user.save((error, registeredUser) => {
      if (error) {
        console.log("Error al guardar un usuario a la base de datos: "+error)      
      } else {
        let payload = {subject: registeredUser._id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})
      }
    })
  })

  router.post('/login', (req, res) => {
    let userData = req.body
    User.findOne({email: userData.email}, (error, user) => {
      if (error) {
        console.log("Error al consultar la base de datos: "+error)    
      } else {
        if (!user) {
          res.status(401).send('Invalid Email')
        } else 
        if ( user.password !== userData.password) {
          res.status(401).send('Invalid Password')
        } else {
          let payload = {subject: user._id}
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).send({token})
        }
      }
    })
  })

  router.get('/events', (req,res) => {
    let events = [
      {
        "_id": "1",
        "name": "Titanic",
        "description": "James Cameron",
        "date": "2019-03-21T18:25:43.511Z"
      },
      {
        "_id": "2",
        "name": "Avatar",
        "description": "James Cameron",
        "date": "2019-03-21T18:25:43.511Z"
      },
      {
        "_id": "3",
        "name": "El Rey León",
        "description": "Roger Allers",
        "date": "2019-03-21T18:25:43.511Z"
      },
      {
        "_id": "4",
        "name": "Buscando a Nemo",
        "description": "Andrew Stanton",
        "date": "2019-03-21T18:25:43.511Z"
      },
      {
        "_id": "5",
        "name": "Harry Potter",
        "description": "Chris Columbus",
        "date": "2019-03-21T18:25:43.511Z"
      },
      {
        "_id": "6",
        "name": "Toy Story",
        "description": "John Lasseter",
        "date": "2019-03-21T18:25:43.511Z"
      }
    ]
    res.json(events)
  })

  router.get('/special', verifyToken, (req,res) => {
    let events = [
      {
        "_id": "1",
        "name": "Entrenando a mi Dragon 3",
        "description": "Dean DeBlois",
        "date": "2019-03-21T18:25:43.511Z"
      },
      {
        "_id": "2",
        "name": "Capitana Marvel",
        "description": "Anna Boden",
        "date": "2019-03-21T18:25:43.511Z"
      },
      {
        "_id": "3",
        "name": "Campeones",
        "description": "Javier Fesser",
        "date": "2019-03-21T18:25:43.511Z"
      },
      {
        "_id": "4",
        "name": "Fast & Furious 8",
        "description": "F. Gary Gray",
        "date": "2019-03-21T18:25:43.511Z"
      },
      {
        "_id": "5",
        "name": "Perdiendo el este",
        "description": "Nacho G. Velilla",
        "date": "2019-03-21T18:25:43.511Z"
      },
      {
        "_id": "6",
        "name": "Green Book",
        "description": "Peter Farrelly",
        "date": "2019-03-21T18:25:43.511Z"
      }
    ]
    res.json(events)
  })
  router.get('/chat', (req,res) => {
  })
    
module.exports = router;
