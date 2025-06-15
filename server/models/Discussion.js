const mongoose = require("mongoose");

const DiscussionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please add content"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Discussion", DiscussionSchema);
