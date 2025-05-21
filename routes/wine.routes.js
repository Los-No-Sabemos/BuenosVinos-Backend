const router = require("express").Router();
const Wine = require("../models/Wine.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

//Get all wines

router.get("/api/wines", (req, res) => {
  Wine.find({})
    .then(wines => {
      res.status(200).json(wines)
    })
    .catch(error => {
      console.error('error retrieving wines', error);
      res.status(500).json({ error: 'error retrieving wines'})
    });
  });

//Post a new wine

router.post("/api/wines", isAuthenticated, (req, res) => {
    
  const winesData = req.body;
    Wine.create(winesData)
    .then((createdWine) => {
        res.status(200).json(createdWine)
    })
    .catch((error) => {
      console.error('error creating wine', error);
        res.status(500).json({ message: "error creating wine"})
    });
});

//Get a wine by id

router.get("/api/wines/:wineId", (req, res) => {
  Wine.findById(req.params.wineId)
    .then(wine => {
      res.status(200).json(wine)
    })
    .catch(error => {
      console.error('error retrieving wine by Id', error);
      res.status(500).json({ error: 'error retrieving wine by Id'})
    });
  
})

//Update a wine by id

router.put("/api/wines/:wineId", isAuthenticated, (req, res) => {
  Wine.findByIdAndUpdate(req.params.wineId, req.body, { new: true })
    .then(updatedWine => {
      res.status(200).json(updatedWine)
    })
    .catch(error => {
      console.error('error updating wine by id', error);
      res.status(500).json({ error: 'error updating wine by id'})
    });

});

//Delete a wine by id

router.delete("/api/wines/:wineId", isAuthenticated, (req, res) => {
  Wine.findByIdAndDelete(req.params.wineId)
    .then(() => {
      res.status(200).json({ message: "wine deleted" })
    })
    .catch(error => {
      console.error('error deleting wine by id', error);
      res.status(500).json({ error: 'error deleting wine by id'})
    });

});

module.exports = router;



