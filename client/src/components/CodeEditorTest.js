import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import CodeEditor from "./CodeEditor";

const CodeEditorTest = () => {
  // Sample code for different languages
  const sampleCode = {
    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# This might cause an infinite loop
while True:
    print("Hello")

# Main execution
if __name__ == '__main__':
    print(fibonacci(10))`,

    javascript: `// Using var (not recommended)
var x = 10;

// Potential infinite loop
while(true) {
    console.log("Hello");
}

// Using eval (not recommended)
eval("console.log('test')");

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

console.log(fibonacci(10));`,

    java: `public class Main {
    public static void main(String[] args) {
        // Potential infinite loop
        while(true) {
            System.out.println("Hello");
        }
        
        // Fibonacci implementation
        System.out.println(fibonacci(10));
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n-1) + fibonacci(n-2);
    }
}`,

    cpp: `#include <iostream>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

int main() {
    // Potential infinite loop
    while(true) {
        std::cout << "Hello" << std::endl;
    }
    
    std::cout << fibonacci(10) << std::endl;
    return 0;
}`,
  };

  return (
    <Container maxWidth="xl" sx={{ height: "100vh", py: 2 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Code Editor with AI Assistant - Test Environment
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This is a test environment for the Code Editor with AI Assistant. Try
          writing code in different languages and use the AI Assistant button to
          analyze your code.
        </Typography>
      </Paper>

      <Box sx={{ height: "calc(100vh - 200px)" }}>
        <CodeEditor initialCode={sampleCode.python} readOnly={false} />
      </Box>
    </Container>
  );
};

export default CodeEditorTest;
