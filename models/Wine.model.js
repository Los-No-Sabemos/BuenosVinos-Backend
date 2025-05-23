const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const wineSchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User",required: true,
    },
    name: {type: String,required: true,
    },
    regionId: {type: Schema.Types.ObjectId, ref: "Region", required: true,
    },
    grapeIds: [
      {type: Schema.Types.ObjectId, ref: "Grape", required: true,
      },
    ],
    year: {type: Number, required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 10
    },
    notes: { type: String, required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Wine = model("Wine", wineSchema);

module.exports = Wine;
