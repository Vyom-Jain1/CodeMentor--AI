const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalProblemsAttempted: { type: Number, default: 0 },
  totalProblemsSolved: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  stepProgress: {
    step1: {
      completed: { type: Boolean, default: false },
      problemsSolved: { type: Number, default: 0 },
      totalProblems: { type: Number, default: 32 },
      timeSpent: { type: Number, default: 0 },
      concepts_mastered: [String],
    },
    step2: {
      completed: { type: Boolean, default: false },
      problemsSolved: { type: Number, default: 0 },
      totalProblems: { type: Number, default: 7 },
      timeSpent: { type: Number, default: 0 },
    },
    step3: {
      completed: { type: Boolean, default: false },
      problemsSolved: { type: Number, default: 0 },
      totalProblems: { type: Number, default: 40 },
      timeSpent: { type: Number, default: 0 },
    },
    // Add more steps as needed
  },
  difficultyStats: {
    easy: {
      attempted: { type: Number, default: 0 },
      solved: { type: Number, default: 0 },
      averageTime: { type: Number, default: 0 },
    },
    medium: {
      attempted: { type: Number, default: 0 },
      solved: { type: Number, default: 0 },
      averageTime: { type: Number, default: 0 },
    },
    hard: {
      attempted: { type: Number, default: 0 },
      solved: { type: Number, default: 0 },
      averageTime: { type: Number, default: 0 },
    },
  },
  topicMastery: {
    arrays: { proficiency: { type: Number, default: 0 }, lastPracticed: Date },
    linkedlist: {
      proficiency: { type: Number, default: 0 },
      lastPracticed: Date,
    },
    binarySearch: {
      proficiency: { type: Number, default: 0 },
      lastPracticed: Date,
    },
    recursion: {
      proficiency: { type: Number, default: 0 },
      lastPracticed: Date,
    },
    dynamicProgramming: {
      proficiency: { type: Number, default: 0 },
      lastPracticed: Date,
    },
    // Add all topics
  },
  learningPattern: {
    preferredLanguage: { type: String, default: "javascript" },
    averageSessionTime: { type: Number, default: 0 },
    peakLearningHours: [Number],
    weakAreas: [String],
    strongAreas: [String],
  },
  achievements: [
    {
      name: String,
      description: String,
      earnedDate: { type: Date, default: Date.now },
      category: {
        type: String,
        enum: ["streak", "milestone", "speed", "consistency"],
      },
    },
  ],
  dailyActivity: [
    {
      date: { type: Date, default: Date.now },
      problemsSolved: { type: Number, default: 0 },
      timeSpent: { type: Number, default: 0 },
      topicsStudied: [String],
      hintsUsed: { type: Number, default: 0 },
    },
  ],
  lastActive: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Progress", progressSchema);
