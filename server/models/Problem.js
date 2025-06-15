const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
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
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Arrays",
        "Strings",
        "Linked Lists",
        "Stacks & Queues",
        "Trees",
        "Graphs",
        "Dynamic Programming",
        "Greedy",
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
      ],
    },
    topic: {
      type: String,
      required: true,
    },
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    constraints: [String],
    starterCode: {
      type: Map,
      of: String,
      default: {},
    },
    solution: {
      type: Map,
      of: String,
      default: {},
    },
    testCases: [
      {
        input: String,
        output: String,
        isHidden: {
          type: Boolean,
          default: false,
        },
      },
    ],
    hints: [String],
    relatedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    order: {
      type: Number,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    executionEnvironment: {
      type: String,
      enum: ["local", "docker", "cloud"],
      default: "local",
    },
    supportedLanguages: [
      {
        type: String,
        enum: [
          "python",
          "javascript",
          "java",
          "cpp",
          "c",
          "csharp",
          "go",
          "rust",
          "ruby",
          "php",
        ],
      },
    ],
    timeLimit: {
      type: Number,
      default: 1000, // in milliseconds
    },
    memoryLimit: {
      type: Number,
      default: 256, // in MB
    },
    tags: [String],
    aiAssistance: {
      enabled: {
        type: Boolean,
        default: true,
      },
      hints: {
        type: Boolean,
        default: true,
      },
      codeCompletion: {
        type: Boolean,
        default: true,
      },
      explanations: {
        type: Boolean,
        default: true,
      },
    },
    strivers_sheet_id: { type: String },
    striver_article_url: { type: String },
    youtube_video_url: { type: String },
    subcategory: { type: String },
    concepts: [String],
    follow_up_questions: [String],
    similar_problems: [String],
    companies: [String],
    frequency: { type: Number, default: 0 },
    ai_explanation: { type: String },
    ai_hints: [String],
    ai_approach_comparison: { type: String },
    total_submissions: { type: Number, default: 0 },
    successful_submissions: { type: Number, default: 0 },
    average_time_to_solve: { type: Number },
    solutions: [
      {
        language: String,
        code: String,
        approach: String,
        time_complexity: String,
        space_complexity: String,
        explanation: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
problemSchema.index({ category: 1, topic: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ order: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ supportedLanguages: 1 });

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
