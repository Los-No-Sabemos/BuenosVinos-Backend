const router = require("express").Router();
const Wine = require("../models/Wine.model");
const SavedWine = require("../models/SavedWine.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Get all wines (public)
router.get("/", (req, res) => {
  Wine.find({})
    .then(wines => res.status(200).json(wines))
    .catch(error => {
      console.error('Error retrieving wines:', error);
      res.status(500).json({ error: 'Error retrieving wines' });
    });
});

// Get public wines only
router.get("/public", (req, res) => {
  Wine.find({ public: true })
    .populate("regionId grapeIds")
    .then(wines => res.status(200).json(wines))
    .catch(error => {
      console.error("Error retrieving public wines:", error);
      res.status(500).json({ error: "Error retrieving public wines" });
    });
});

// Get wines saved in user’s cellar (authenticated)
router.get("/my-cellar", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;

  try {
    const savedWines = await SavedWine.find({ user: userId })
      .populate({
        path: "wine",
        populate: ["regionId", "grapeIds"]
      });

    const cellarWines = savedWines.map(entry => entry.wine);
    res.status(200).json(cellarWines);
  } catch (error) {
    console.error("Error retrieving user's cellar:", error);
    res.status(500).json({ error: "Error retrieving user's cellar" });
  }
});

// Save a wine to user’s cellar (authenticated)
router.post("/save/:wineId", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  const wineId = req.params.wineId;

  try {
    const exists = await SavedWine.findOne({ user: userId, wine: wineId });
    if (exists) return res.status(400).json({ message: "Wine already saved" });

    const savedWine = await SavedWine.create({ user: userId, wine: wineId });
    res.status(201).json(savedWine);
  } catch (error) {
    console.error("Error saving wine to cellar:", error);
    res.status(500).json({ error: "Error saving wine to cellar" });
  }
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