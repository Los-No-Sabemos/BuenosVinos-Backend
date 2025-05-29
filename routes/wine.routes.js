const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const Wine = require("../models/Wine.model");
const SavedWine = require("../models/SavedWine.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const upload = require("../config/multer.config");

// Serve uploaded images statically
router.use("/uploads", require("express").static(path.join(__dirname, "../uploads")));


router.get("/", (req, res) => {
  Wine.find({})
    .then(wines => res.status(200).json(wines))
    .catch(error => {
      console.error('Error retrieving wines:', error);
      res.status(500).json({ error: 'Error retrieving wines' });
    });
});


router.get("/public", (req, res) => {
  Wine.find({ public: true })
    .populate("regionId grapeIds")
    .then(wines => res.status(200).json(wines))
    .catch(error => {
      console.error("Error retrieving public wines:", error);
      res.status(500).json({ error: "Error retrieving public wines" });
    });
});


router.get("/my-cellar", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;

  try {
    const savedWines = await SavedWine.find({ user: userId }).populate({
      path: "wine",
      populate: ["regionId", "grapeIds"],
    });

    const cellarWines = savedWines
      .map(entry => entry.wine)
      .filter(wine => wine !== null && wine.regionId !== null);

    res.status(200).json(cellarWines);
  } catch (error) {
    console.error("Error retrieving user's cellar:", error);
    res.status(500).json({ error: "Error retrieving user's cellar" });
  }
});

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

router.post("/", isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    const winesData = req.body;
    winesData.userId = req.payload._id;

    if (req.file) {
      winesData.image = `/uploads/${req.file.filename}`;
    }

    const createdWine = await Wine.create(winesData);
    res.status(201).json(createdWine);
  } catch (error) {
    console.error("Error creating wine:", error);
    res.status(500).json({ message: "Error creating wine" });
  }
});

router.get("/:wineId", (req, res) => {
  Wine.findById(req.params.wineId)
    .then(wine => res.status(200).json(wine))
    .catch(error => {
      console.error('Error retrieving wine by ID:', error);
      res.status(500).json({ error: 'Error retrieving wine by ID' });
    });
});

router.put("/:wineId", isAuthenticated, upload.single("image"), async (req, res) => {
  const userId = req.payload._id;
  const wineId = req.params.wineId;

  try {
    const wine = await Wine.findById(wineId);
    if (!wine) return res.status(404).json({ message: "Wine not found" });

    if (wine.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this wine" });
    }

    const updatedData = req.body;

    if (req.file) {
      if (wine.image && fs.existsSync(path.join(__dirname, "../", wine.image))) {
        fs.unlinkSync(path.join(__dirname, "../", wine.image));
      }
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedWine = await Wine.findByIdAndUpdate(wineId, updatedData, { new: true });
    res.status(200).json(updatedWine);
  } catch (error) {
    console.error("Error updating wine by ID:", error);
    res.status(500).json({ error: "Error updating wine by ID" });
  }
});

router.delete("/:wineId", isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  const wineId = req.params.wineId;

  try {
    const wine = await Wine.findById(wineId);
    if (!wine) return res.status(404).json({ message: "Wine not found" });

    if (wine.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this wine" });
    }

    if (wine.image && fs.existsSync(path.join(__dirname, "../", wine.image))) {
      fs.unlinkSync(path.join(__dirname, "../", wine.image));
    }

    await Wine.findByIdAndDelete(wineId);
    res.status(200).json({ message: "Wine deleted successfully" });
  } catch (error) {
    console.error("Error deleting wine by ID:", error);
    res.status(500).json({ error: "Error deleting wine by ID" });
  }
});

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