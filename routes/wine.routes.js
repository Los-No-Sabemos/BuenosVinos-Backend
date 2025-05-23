const router = require("express").Router();
const Wine = require("../models/Wine.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Get all wines
router.get("/", (req, res) => {
  Wine.find({})
    .then(wines => res.status(200).json(wines))
    .catch(error => {
      console.error('Error retrieving wines:', error);
      res.status(500).json({ error: 'Error retrieving wines' });
    });
});

// Post a new wine (authenticated)
router.post("/", isAuthenticated, (req, res) => {
  const winesData = req.body;
  winesData.userId = req.payload._id;

  Wine.create(winesData)
    .then(createdWine => res.status(200).json(createdWine))
    .catch(error => {
      console.error('Error creating wine:', error);
      res.status(500).json({ message: "Error creating wine" });
    });
});

// Get a wine by ID
router.get("/:wineId", (req, res) => {
  Wine.findById(req.params.wineId)
    .then(wine => res.status(200).json(wine))
    .catch(error => {
      console.error('Error retrieving wine by ID:', error);
      res.status(500).json({ error: 'Error retrieving wine by ID' });
    });
});

// Update a wine (only if user is creator)
router.put("/:wineId", isAuthenticated, (req, res) => {
  const userId = req.payload._id;

  Wine.findById(req.params.wineId)
    .then(wine => {
      if (!wine) return res.status(404).json({ message: "Wine not found" });

      if (wine.userId.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to update this wine" });
      }

      return Wine.findByIdAndUpdate(req.params.wineId, req.body, { new: true });
    })
    .then(updatedWine => res.status(200).json(updatedWine))
    .catch(error => {
      console.error('Error updating wine by ID:', error);
      res.status(500).json({ error: 'Error updating wine by ID' });
    });
});

// Delete a wine (only if user is creator)
router.delete("/:wineId", isAuthenticated, (req, res) => {
  const userId = req.payload._id;

  Wine.findById(req.params.wineId)
    .then(wine => {
      if (!wine) return res.status(404).json({ message: "Wine not found" });

      if (wine.userId.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to delete this wine" });
      }

      return Wine.findByIdAndDelete(req.params.wineId);
    })
    .then(() => res.status(200).json({ message: "Wine deleted successfully" }))
    .catch(error => {
      console.error('Error deleting wine by ID:', error);
      res.status(500).json({ error: 'Error deleting wine by ID' });
    });
});

module.exports = router;