const mongoose = require("mongoose");
const Problem = require("../models/Problem");
require("dotenv").config();

const problems = [
  {
    title: "Maximum and Minimum Element in an Array",
    description: "Find the maximum and minimum element in an array.",
    difficulty: "easy",
    category: "Arrays",
    topic: "Arrays",
    companies: [
      "ABCO",
      "Accolite",
      "Amazon",
      "Cisco",
      "Hike",
      "Microsoft",
      "Snapdeal",
      "VMWare",
      "Google",
      "Adobe",
    ],
    source: "apna_college",
    sourceUrl: "https://www.geeksforgeeks.org/maximum-and-minimum-in-an-array/",
  },
  {
    title: "Reverse the Array",
    description: "Write a program to reverse an array or string.",
    difficulty: "easy",
    category: "Arrays",
    topic: "Arrays",
    companies: ["Infosys", "Moonfrog Labs"],
    source: "apna_college",
    sourceUrl:
      "https://www.geeksforgeeks.org/write-a-program-to-reverse-an-array-or-string/",
  },
  {
    title: "Maximum Subarray",
    description: "Find the contiguous subarray with the largest sum.",
    difficulty: "medium",
    category: "Arrays",
    topic: "Arrays",
    companies: ["Microsoft", "Facebook"],
    source: "apna_college",
    sourceUrl: "https://leetcode.com/problems/maximum-subarray/",
    tags: ["Kadane's Algorithm"],
  },
  {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    category: "Arrays",
    topic: "Arrays",
    companies: ["Amazon", "Google", "Microsoft", "Apple"],
    source: "striver",
    sourceUrl: "https://leetcode.com/problems/two-sum/",
  },
  {
    title: "Sort Colors",
    description:
      "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent.",
    difficulty: "medium",
    category: "Arrays",
    topic: "Arrays",
    companies: ["Microsoft", "Amazon", "Adobe"],
    source: "striver",
    sourceUrl: "https://leetcode.com/problems/sort-colors/",
  },
];

async function populateProblems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    await Problem.insertMany(problems);
    console.log(`Successfully inserted ${problems.length} problems`);

    const count = await Problem.countDocuments();
    console.log(`Total problems in database: ${count}`);
  } catch (error) {
    console.error("Error populating problems:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

populateProblems();
