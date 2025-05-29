const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Problem = require("../models/Problem");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected for seeding"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const problems = [
  // Arrays - Easy
  {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    category: "Arrays",
    topic: "Easy",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: {
      python: "def twoSum(nums, target):\n    # Write your code here\n    pass",
      javascript:
        "function twoSum(nums, target) {\n    // Write your code here\n}",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}",
    },
    solution: {
      python:
        "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
      javascript:
        "function twoSum(nums, target) {\n    const seen = {};\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (complement in seen) {\n            return [seen[complement], i];\n        }\n        seen[nums[i]] = i;\n    }\n    return [];\n}",
    },
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        output: "[0,1]",
        isHidden: false,
      },
      {
        input: "[3,2,4]\n6",
        output: "[1,2]",
        isHidden: false,
      },
    ],
    hints: [
      "Try using a hash map to store the numbers you've seen",
      "For each number, check if its complement (target - num) exists in the hash map",
    ],
    order: 1,
    isPremium: false,
  },
  // Arrays - Medium
  {
    title: "Maximum Subarray Sum",
    description:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    difficulty: "medium",
    category: "Arrays",
    topic: "Medium",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6.",
      },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      python: "def maxSubArray(nums):\n    # Write your code here\n    pass",
      javascript:
        "function maxSubArray(nums) {\n    // Write your code here\n}",
    },
    solution: {
      python:
        "def maxSubArray(nums):\n    max_sum = curr_sum = nums[0]\n    for num in nums[1:]:\n        curr_sum = max(num, curr_sum + num)\n        max_sum = max(max_sum, curr_sum)\n    return max_sum",
      javascript:
        "function maxSubArray(nums) {\n    let maxSum = nums[0];\n    let currSum = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currSum = Math.max(nums[i], currSum + nums[i]);\n        maxSum = Math.max(maxSum, currSum);\n    }\n    return maxSum;\n}",
    },
    testCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        isHidden: false,
      },
      {
        input: "[1]",
        output: "1",
        isHidden: false,
      },
    ],
    hints: [
      "Try using Kadane's Algorithm",
      "Keep track of the maximum sum ending at each position",
    ],
    order: 2,
    isPremium: false,
  },
  // Add more problems here...
];

const seedDatabase = async () => {
  try {
    // Clear existing problems
    await Problem.deleteMany();
    console.log("Existing problems cleared");

    // Insert new problems
    await Problem.insertMany(problems);
    console.log("Problems seeded successfully");

    // Disconnect from database
    await mongoose.disconnect();
    console.log("Database connection closed");

    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
