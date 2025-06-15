const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  category: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  companies: [
    {
      type: String,
    },
  ],
  source: {
    type: String,
    enum: ["apna_college", "striver", "custom"],
    default: "custom",
  },
  sourceUrl: {
    type: String,
  },
  timeComplexity: {
    type: String,
    default: "O(n)",
  },
  spaceComplexity: {
    type: String,
    default: "O(1)",
  },
  tags: [
    {
      type: String,
    },
  ],
  submissions: {
    type: Number,
    default: 0,
  },
  successfulSubmissions: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
problemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Problem", problemSchema);
problemSchema.index({ category: 1, difficulty: 1 });
problemSchema.index({ topic: 1 });
problemSchema.index({ companies: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ title: "text", description: "text" });

// Virtual for success rate
problemSchema.virtual("successRate").get(function () {
  return this.submissions > 0
    ? Math.round((this.successfulSubmissions / this.submissions) * 100)
    : 0;
});

// Pre-save middleware to update timestamps
problemSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
