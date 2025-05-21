const express = require('express');
const router = express.Router()
const Grape = require ('../models/Grape.model');

router.get('/', (req,res) => {
    Grape.find()
    .then ((grapes) => {
        res.json(grapes);
    })
    .catch((error) => {
        res.status(500).json({ message: "Failed to get grapes", error: error.message});
    })
})

router.post('/',(req,res) => {
    const { name, description } = req.body

    Grape.create({name, description})
    .then((newGrape) => {
        res.status(201).json(newGrape);
    })
    .catch((error) => {
        res.status(500).json({ message: "Failed to create new grape", er: error.message})
    })
})