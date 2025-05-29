const problems = [
  {
    title: "Reverse Linked List in Groups of K",
    description: `Given a linked list, reverse the nodes of a linked list k at a time and return its modified list.
    k is a positive integer and is less than or equal to the length of the linked list.
    If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is.
    
    Example:
    Input: head = [1,2,3,4,5], k = 2
    Output: [2,1,4,3,5]
    
    This is a common question asked in companies like Amazon, Microsoft, and Google.`,
    difficulty: "medium",
    category: "Linked Lists",
    topic: "Linked List Manipulation",
    order: 1,
    testCases: [
      {
        input: "head = [1,2,3,4,5], k = 2",
        expectedOutput: "[2,1,4,3,5]",
        explanation:
          "Reverse first 2 nodes, then next 2 nodes, and leave the last node as is.",
      },
      {
        input: "head = [1,2,3,4,5], k = 3",
        expectedOutput: "[3,2,1,4,5]",
        explanation: "Reverse first 3 nodes, leave remaining nodes as is.",
      },
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function reverseKGroup(head, k) {
    // Your code here
}`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        # Your code here`,
    },
    solution: {
      javascript: `function reverseKGroup(head, k) {
    if (!head || k === 1) return head;
    
    let dummy = new ListNode(0);
    dummy.next = head;
    let curr = dummy, next = dummy, prev = dummy;
    let count = 0;
    
    while (curr.next) {
        curr = curr.next;
        count++;
    }
    
    while (count >= k) {
        curr = prev.next;
        next = curr.next;
        for (let i = 1; i < k; i++) {
            curr.next = next.next;
            next.next = prev.next;
            prev.next = next;
            next = curr.next;
        }
        prev = curr;
        count -= k;
    }
    return dummy.next;
}`,
      python: `def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
    if not head or k == 1:
        return head
        
    dummy = ListNode(0)
    dummy.next = head
    curr = dummy
    next = dummy
    prev = dummy
    count = 0
    
    while curr.next:
        curr = curr.next
        count += 1
        
    while count >= k:
        curr = prev.next
        next = curr.next
        for i in range(1, k):
            curr.next = next.next
            next.next = prev.next
            prev.next = next
            next = curr.next
        prev = curr
        count -= k
        
    return dummy.next`,
    },
    hints: [
      "Think about how to reverse a linked list first",
      "Consider using a dummy node to handle edge cases",
      "You'll need to keep track of previous, current, and next nodes",
      "Consider what happens when the remaining nodes are less than k",
    ],
    points: 50,
    timeLimit: 1000,
    memoryLimit: 256,
  },
  {
    title: "LRU Cache Implementation",
    description: `Design and implement a data structure for Least Recently Used (LRU) cache. It should support the following operations: get and put.

    get(key) - Get the value (will always be positive) of the key if the key exists in the cache, otherwise return -1.
    put(key, value) - Set or insert the value if the key is not already present. When the cache reached its capacity, it should invalidate the least recently used item before inserting a new item.

    This is a frequently asked question in companies like Amazon, Microsoft, and Google for system design roles.`,
    difficulty: "hard",
    category: "Dynamic Programming",
    topic: "Cache Design",
    order: 2,
    testCases: [
      {
        input: `cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // returns 1
cache.put(3, 3);    // evicts key 2
cache.get(2);       // returns -1 (not found)
cache.put(4, 4);    // evicts key 1
cache.get(1);       // returns -1 (not found)
cache.get(3);       // returns 3
cache.get(4);       // returns 4`,
        expectedOutput: "[null,null,null,1,null,-1,null,-1,3,4]",
        explanation: "Demonstrates LRU cache operations with capacity 2",
      },
    ],
    starterCode: {
      javascript: `class LRUCache {
    constructor(capacity) {
        // Initialize your data structure here
    }
    
    get(key) {
        // Your code here
    }
    
    put(key, value) {
        // Your code here
    }
}`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        # Initialize your data structure here
        
    def get(self, key: int) -> int:
        # Your code here
        
    def put(self, key: int, value: int) -> None:
        # Your code here`,
    },
    solution: {
      javascript: `class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    
    get(key) {
        if (!this.cache.has(key)) return -1;
        
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    
    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            this.cache.delete(this.cache.keys().next().value);
        }
        this.cache.set(key, value);
    }
}`,
      python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()
        
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        value = self.cache.pop(key)
        self.cache[key] = value
        return value
        
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.pop(key)
        elif len(self.cache) >= self.capacity:
            self.cache.popitem(last=False)
        self.cache[key] = value`,
    },
    hints: [
      "Consider using a hash map for O(1) access",
      "You'll need to track the order of elements",
      "Think about using a doubly linked list",
      "Look into built-in data structures like OrderedDict in Python",
    ],
    points: 100,
    timeLimit: 1000,
    memoryLimit: 256,
  },
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
    You may assume that each input would have exactly one solution, and you may not use the same element twice.
    You can return the answer in any order.
    
    Example:
    Input: nums = [2,7,11,15], target = 9
    Output: [0,1]
    Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    difficulty: "easy",
    category: "Arrays",
    topic: "Array Manipulation",
    order: 3,
    testCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        expectedOutput: "[0,1]",
        explanation: "2 + 7 = 9",
      },
      {
        input: "nums = [3,2,4], target = 6",
        expectedOutput: "[1,2]",
        explanation: "2 + 4 = 6",
      },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your code here
}`,
      python: `def twoSum(nums: List[int], target: int) -> List[int]:
    # Your code here`,
    },
    solution: {
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      python: `def twoSum(nums: List[int], target: int) -> List[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    },
    hints: [
      "Consider using a hash map to store numbers you've seen",
      "Think about the complement of each number",
      "You can do this in one pass through the array",
    ],
    points: 30,
    timeLimit: 1000,
    memoryLimit: 256,
  },
];

module.exports = problems;
