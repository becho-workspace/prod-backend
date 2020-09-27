const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
      lowercase: true,
    },
    subCategory: [
      {
        name: {
          type: String,
          trim: true,
          unique: true,
          lowercase: true,
        },
        mcq: [
          {
            question: {
              type: String,
            },
            options: [String],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
