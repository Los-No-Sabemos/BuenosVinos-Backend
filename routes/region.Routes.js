const express = require("express");
const router = express.Router();

const Region = require("../models/Region.model");

// GET /regions - Get all regions
router.get("/", (req, res) => {
  Region.find()
    .then((regions) => {
      res.json(regions);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to retrieve regions",
        error: err.message
      });
    });
});

// GET /regions/:id - Get a single region by ID
router.get("/:id", (req, res) => {
  Region.findById(req.params.id)
    .then((region) => {
      res.json(region || {});
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error retrieving region",
        error: err.message
      });
    });
});

// POST /regions - Create a new regio
router.post("/", (req, res) => {
  const { country, region } = req.body;

  Region.create({ country, region })
    .then((newRegion) => {
      res.status(201).json(newRegion);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to create new region",
        error: err.message
      });
    });
});

// PUT /regions/:id - Update a region
router.put("/:id", (req, res) => {
  const { country, region } = req.body;

  Region.findByIdAndUpdate(
    req.params.id,
    { country, region },
    { new: true, runValidators: true }
  )
    .then((updatedRegion) => {
      res.json(updatedRegion || {});
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to update region",
        error: err.message
      });
    });
});

// DELETE /regions/:id - Delete a region
router.delete("/:id", (req, res) => {
  Region.findByIdAndDelete(req.params.id)
    .then((deletedRegion) => {
      res.json(deletedRegion || {});
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to delete region",
        error: err.message
      });
    });
});

module.exports = router;