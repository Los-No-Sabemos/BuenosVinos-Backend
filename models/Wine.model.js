const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const wineSchema = new Schema(
  {
    userId: Schema.Types.ObjectId, ref: "User", required: true,
    name: String, required: true,
    regionId: Schema.Types.ObjectId, ref: "Region", required: true,        
    grapeIds: [Schema.Types.ObjectId], ref: "Grape", required: true,       
    year: Number, required: true,
    rating: Number, required: true,
    notes: String, required: true,

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Wine = model("Wine", wineSchema);

module.exports = Wine;
