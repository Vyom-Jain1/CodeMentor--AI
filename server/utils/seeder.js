const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Problem = require("../models/Problem");

// Load environment variables
dotenv.config();

// Set default MongoDB URI if not provided
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/codementor";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
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
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
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
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. A subarray is a contiguous part of an array.",
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
  // Strings - Easy
  {
    title: "Valid Palindrome",
    description:
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
    difficulty: "easy",
    category: "Strings",
    topic: "Basic",
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
    ],
    constraints: ["1 <= s.length <= 2 * 10^5"],
    starterCode: {
      python: "def isPalindrome(s):\n    # Write your code here\n    pass",
      javascript:
        "function isPalindrome(s) {\n    // Write your code here\n}",
    },
    solution: {
      python:
        "def isPalindrome(s):\n    cleaned = ''.join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]",
      javascript:
        "function isPalindrome(s) {\n    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    return cleaned === cleaned.split('').reverse().join('');\n}",
    },
    testCases: [
      {
        input: '"A man, a plan, a canal: Panama"',
        output: "true",
        isHidden: false,
      },
      {
        input: '"race a car"',
        output: "false",
        isHidden: false,
      },
    ],
    hints: [
      "Remove all non-alphanumeric characters first",
      "Convert to lowercase and compare with its reverse",
    ],
    order: 3,
    isPremium: false,
  },
  // Linked Lists - Easy
  {
    title: "Reverse Linked List",
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    difficulty: "easy",
    category: "Linked Lists",
    topic: "Singly Linked List",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The linked list is reversed.",
      },
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    starterCode: {
      python:
        "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head):\n        # Write your code here\n        pass",
      javascript:
        "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\nfunction reverseList(head) {\n    // Write your code here\n}",
    },
    solution: {
      python:
        "def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev",
      javascript:
        "function reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        let nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}",
    },
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        isHidden: false,
      },
      {
        input: "[1,2]",
        output: "[2,1]",
        isHidden: false,
      },
    ],
    hints: [
      "Use three pointers: previous, current, and next",
      "Iterate through the list and reverse the links",
    ],
    order: 4,
    isPremium: false,
  },
  // Trees - Easy
  {
    title: "Maximum Depth of Binary Tree",
    description:
      "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    difficulty: "easy",
    category: "Trees",
    topic: "Binary Trees",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "3",
        explanation: "The maximum depth is 3.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100",
    ],
    starterCode: {
      python:
        "# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\nclass Solution:\n    def maxDepth(self, root):\n        # Write your code here\n        pass",
      javascript:
        "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\nfunction maxDepth(root) {\n    // Write your code here\n}",
    },
    solution: {
      python:
        "def maxDepth(root):\n    if not root:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))",
      javascript:
        "function maxDepth(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}",
    },
    testCases: [
      {
        input: "[3,9,20,null,null,15,7]",
        output: "3",
        isHidden: false,
      },
      {
        input: "[1,null,2]",
        output: "2",
        isHidden: false,
      },
    ],
    hints: [
      "Use recursion to solve this problem",
      "The depth of a tree is 1 + maximum depth of its subtrees",
    ],
    order: 5,
    isPremium: false,
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing problems
    await Problem.deleteMany();
    console.log("Existing problems cleared");

    // Insert new problems
    await Problem.insertMany(problems);
    console.log(`${problems.length} problems seeded successfully`);

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