const ToDo = require('../models/ToDo');
const jwt = require('jsonwebtoken');
const express = require("express");
const expressValidator = require("express-validator");
const router = express.Router();
const mongoose = require("mongoose");


router.post(
    '/newToDo',
    [
        expressValidator.body('title')
        .isString()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
        expressValidator.body('description')
        .isString()
        .isLength({ min: 10 })
        .withMessage('Description must be between more than 10 characters'),
    ],
    async (req, res) => {
      let user
      jwt.verify(req.headers.authorization, 'KareemElshafey', function(err, decode) {
        if (err) req.user = undefined;
        user = decode;
      });

      if(!user){
        return res.send('Invalid Token')
      }

      req.body.userId = user._id
      const newToDo = new ToDo(req.body)
      newToDo.save()
      return res.send(newToDo)
    }
  );

  router.post(
    '/updateToDo',
    [ 
        expressValidator.body('todoId').isMongoId(), 
        expressValidator.body('title')
        .isString()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
        expressValidator.body('description')
        .isString()
        .isLength({ min: 10 })
        .withMessage('Description must be between more than 10 characters'),
    ],
    async (req, res) => {
      let user
      jwt.verify(req.headers.authorization, 'KareemElshafey', function(err, decode) {
        if (err) req.user = undefined;
        user = decode;
      });

      if(!user){
        return res.send('Invalid Token')
      }
      
      const todo = await ToDo.findById(req.body.todoId)

      if(!todo){
        return res.send('ToDo not found')
      }

      if(todo.userId.toString() != user._id){
        return res.send('ToDo does not belong to this user')
      }



      const updateToDo = ToDo.findByIdAndUpdate(req.body.todoId,req.body.todo)
      return res.send('todo is updated')
    }
  );

  router.delete('/:id', async (req, res) => {
    let user
      jwt.verify(req.headers.authorization, 'KareemElshafey', function(err, decode) {
        if (err) req.user = undefined;
        user = decode;
      });

      if(!user){
        return res.send('Invalid Token')
      }
      
      const todo = await ToDo.findById(req.params.id)

      if(!todo){
        return res.send('ToDo not found')
      }

      if(todo.userId.toString() != user._id){
        return res.send('ToDo does not belong to this user')
      }

      await   ToDo.findByIdAndRemove(req.params.id)
      return res.send('ToDo is removed')
  })

  router.get('/:id', async (req, res) => {
    let user
      jwt.verify(req.headers.authorization, 'KareemElshafey', function(err, decode) {
        if (err) req.user = undefined;
        user = decode;
      });

      if(!user){
        return res.send('Invalid Token')
      }
      
      const todo = await ToDo.findById(req.params.id)

      if(!todo){
        return res.send('ToDo not found')
      }

      if(todo.userId.toString() != user._id){
        return res.send('ToDo does not belong to this user')
      }

      return res.send(todo)
  })

  router.get('/', async (req, res) => {
    let user
      jwt.verify(req.headers.authorization, 'KareemElshafey', function(err, decode) {
        if (err) req.user = undefined;
        user = decode;
      });

      if(!user){
        return res.send('Invalid Token')
      }
      
      const todo = await ToDo.find({userId: user._id})

      if(!todo){
        return res.send('ToDos not found')
      }

      return res.send(todo)
  })


  module.exports = router;
