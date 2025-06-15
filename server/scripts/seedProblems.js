const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Problem = require("../models/Problem");

dotenv.config();

const problems = [
  {
    title: "Reverse Linked List",
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.
A linked list can be reversed either iteratively or recursively. Could you implement both?`,
    difficulty: "medium",
    category: "Linked Lists",
    topic: "Linked List Manipulation",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The linked list is reversed"
      }
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000]",
      "-5000 <= Node.val <= 5000"
    ],
    starterCode: new Map([
      ["python", `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    # Write your code here
    pass`],
      ["javascript", `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function reverseList(head) {
    // Write your code here
}`]
    ]),
    solution: new Map([
      ["python", `def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`],
      ["javascript", `function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        const nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`]
    ]),
    testCases: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        isHidden: false
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
        isHidden: false
      },
      {
        input: "head = []",
        output: "[]",
        isHidden: false
      }
    ],
    optimalComplexity: "O(n)",
    solutionExplanation: `To reverse a linked list, we need to change the direction of all pointers. We can do this by:
1. Keeping track of the previous node
2. Storing the next node before we change the current node's pointer
3. Updating the current node's pointer to point to the previous node
4. Moving forward in the list

Time complexity is O(n) as we visit each node exactly once.
Space complexity is O(1) as we only use a few pointers.`,
    approach: `There are two main approaches:

1. Iterative (O(n) time, O(1) space):
   - Use three pointers: prev, curr, next
   - Iterate through list, reversing pointers

2. Recursive (O(n) time, O(n) space):
   - Base case: empty list or single node
   - Recursively reverse the sublist
   - Fix the head pointer`,
    hints: [
      "Think about using multiple pointers",
      "What happens to the next pointer when you reverse the list?",
      "Try drawing the reversal process on paper",
      "Consider both iterative and recursive approaches"
    ],
    tags: ["linked-list", "recursion", "two-pointer"]
  },
  {
    title: "Binary Tree Level Order Traversal",
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
    difficulty: "medium",
    category: "Trees",
    topic: "Tree Traversal",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
        explanation: "The tree is traversed level by level"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000]",
      "-1000 <= Node.val <= 1000"
    ],
    starterCode: new Map([
      ["python", `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def levelOrder(root):
    # Write your code here
    pass`],
      ["javascript", `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function levelOrder(root) {
    // Write your code here
}`]
    ]),
    solution: new Map([
      ["python", `from collections import deque

def levelOrder(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    
    while queue:
        level = []
        level_size = len(queue)
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
                
        result.append(level)
    
    return result`],
      ["javascript", `function levelOrder(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const level = [];
        const levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            level.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(level);
    }
    
    return result;
}`]
    ]),
    testCases: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
        isHidden: false
      },
      {
        input: "root = [1]",
        output: "[[1]]",
        isHidden: false
      },
      {
        input: "root = []",
        output: "[]",
        isHidden: false
      }
    ],
    optimalComplexity: "O(n)",
    solutionExplanation: `Level order traversal uses a queue to visit nodes level by level:
1. Start with the root in the queue
2. For each level:
   - Get the current level size
   - Process that many nodes from the queue
   - Add their children to the queue
3. Continue until queue is empty

Time complexity is O(n) as we visit each node once.
Space complexity is O(w) where w is the maximum width of the tree.`,
    approach: `There are two main approaches:

1. BFS with Queue (Optimal):
   - Use queue to track nodes at each level
   - Process level by level
   - Keep track of level size

2. DFS with Level Parameter:
   - Pass level number in recursive calls
   - Store nodes in result array by level
   - Requires extra processing to group by level`,
    hints: [
      "How can you track nodes at each level?",
      "Think about using a queue data structure",
      "How do you know when you've finished processing a level?",
      "Consider the relationship between queue size and level size"
    ],
    tags: ["tree", "bfs", "binary-tree", "queue"]
  },
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers in the array that add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
    difficulty: "easy",
    category: "Arrays",
    topic: "Array Traversal",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    starterCode: new Map([
      ["python", "def twoSum(nums, target):\n    # Write your code here\n    pass"],
      ["javascript", "function twoSum(nums, target) {\n    // Write your code here\n}"]
    ]),
    solution: new Map([
      ["python", `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`],
      ["javascript", `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`]
    ]),
    testCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        isHidden: false
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        isHidden: false
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        isHidden: false
      },
      {
        input: "nums = [1,5,8,10,13,2,7,23], target = 15",
        output: "[2,4]",
        isHidden: true
      }
    ],
    optimalComplexity: "O(n)",
    solutionExplanation: `The optimal solution uses a hash map to store previously seen numbers and their indices. For each number, we:
1. Calculate its complement (target - current number)
2. Check if the complement exists in our hash map
3. If it exists, we've found our pair
4. If not, store the current number and its index

This gives us O(n) time complexity as we only need to traverse the array once, and hash map operations are O(1) on average.
Space complexity is O(n) to store at most n elements in the hash map.`,
    approach: `We can solve this using several approaches:

1. Brute Force (O(n²)):
   - Use nested loops to check every pair
   - Not optimal for large inputs

2. Sorting (O(n log n)):
   - Sort array first
   - Use two pointers to find pair
   - Doesn't maintain original indices

3. Hash Map (O(n)) - Optimal:
   - Use hash map to store complements
   - Single pass solution
   - Maintains original indices`,
    hints: [
      "Can we use extra space to optimize time complexity?",
      "What if we store each number we've seen so far?",
      "For each number, what other number do we need to find?",
      "Think about using a hash map to store numbers and their indices"
    ],
    tags: ["array", "hash-table", "two-pointer"]
  }
];

async function seedProblems() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    // Insert new problems
    await Problem.insertMany(problems);
    console.log("Added sample problems");

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedProblems();
