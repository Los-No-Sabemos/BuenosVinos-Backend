const { Schema, model } = require("mongoose");

const savedWineSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  wine: { type: Schema.Types.ObjectId, ref: "Wine", required: true }
}, {
  timestamps: true,
});

module.exports = model("SavedWine", savedWineSchema);