const router = require("express").Router();
const Wine = require("../models/Wine.model");
const SavedWine = require("../models/SavedWine.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Get all wines
router.get("/", (req, res) => {
  Wine.find({})
    .then((wines) => res.status(200).json(wines))
    .catch((error) => {
      console.error("Error retrieving wines:", error);
      res.status(500).json({ error: "Error retrieving wines" });
    });
});

// Get all public wines
router.get("/public", (req, res) => {
  Wine.find({ public: true })
    .populate("regionId grapeIds")
    .then((wines) => res.status(200).json(wines))
    .catch((error) => {
      console.error("Error retrieving public wines:", error);
      res.status(500).json({ error: "Error retrieving public wines" });
    });
});

// Get user's saved wines (cellar)
router.get("/my-cellar", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  try {
    const savedWines = await SavedWine.find({ user: userId }).populate({
      path: "wine",
      populate: ["regionId", "grapeIds"],
    });

    const cellarWines = savedWines
      .map((entry) => entry.wine)
      .filter((wine) => wine !== null && wine.regionId !== null);

    res.status(200).json(cellarWines);
  } catch (error) {
    console.error("Error retrieving user's cellar:", error);
    res.status(500).json({ error: "Error retrieving user's cellar" });
  }
});

// Save a wine to user's cellar
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

// Unsave a wine from user's cellar
router.delete("/save/:wineId", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  const wineId = req.params.wineId;

  try {
    const removed = await SavedWine.findOneAndDelete({ user: userId, wine: wineId });
    if (!removed) {
      return res.status(404).json({ message: "That wine isn’t in your cellar" });
    }
    res.status(200).json({ message: "Wine removed from your cellar" });
  } catch (error) {
    console.error("Error removing wine from cellar:", error);
    res.status(500).json({ error: "Error removing wine from cellar" });
  }
});

// Create a new wine (expects image URL in req.body.image)
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const winesData = { ...req.body, userId: req.payload._id };
    const createdWine = await Wine.create(winesData);
    res.status(201).json(createdWine);
  } catch (error) {
    console.error("Error creating wine:", error);
    res.status(500).json({ message: "Error creating wine" });
  }
});

// Get wine by ID
router.get("/:wineId", async (req, res) => {
  try {
    const wine = await Wine.findById(req.params.wineId);
    if (!wine) return res.status(404).json({ message: "Wine not found" });
    const wineObj = wine.toObject();
    wineObj.userId = wine.userId.toString();
    res.status(200).json(wineObj);
  } catch (error) {
    console.error("Error retrieving wine by ID:", error);
    res.status(500).json({ error: "Error retrieving wine by ID" });
  }
});

// Update a wine (expects image URL in req.body.image)
router.put("/:wineId", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  const wineId = req.params.wineId;
  try {
    const wine = await Wine.findById(wineId);
    if (!wine) return res.status(404).json({ message: "Wine not found" });
    if (wine.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this wine" });
    }
    const updatedWine = await Wine.findByIdAndUpdate(wineId, req.body, { new: true });
    res.status(200).json(updatedWine);
  } catch (error) {
    console.error("Error updating wine by ID:", error);
    res.status(500).json({ error: "Error updating wine by ID" });
  }
});

// Delete a wine
router.delete("/:wineId", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  const wineId = req.params.wineId;
  try {
    const wine = await Wine.findById(wineId);
    if (!wine) return res.status(404).json({ message: "Wine not found" });
    if (wine.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this wine" });
    }
    await Wine.findByIdAndDelete(wineId);
    res.status(200).json({ message: "Wine deleted successfully" });
  } catch (error) {
    console.error("Error deleting wine by ID:", error);
    res.status(500).json({ error: "Error deleting wine by ID" });
  }
});

// Update wine visibility
router.patch("/:wineId/visibility", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  const { public: isPublic } = req.body;
  try {
    const wine = await Wine.findById(req.params.wineId);
    if (!wine) return res.status(404).json({ message: "Wine not found" });
    if (wine.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update visibility" });
    }
    wine.public = isPublic;
    const updatedWine = await wine.save();
    res.status(200).json(updatedWine);
  } catch (error) {
    console.error("Error updating wine visibility:", error);
    res.status(500).json({ error: "Error updating wine visibility" });
  }
});

module.exports = router;