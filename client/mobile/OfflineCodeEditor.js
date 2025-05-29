import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OfflineCodeEditor = ({ problem, language = "javascript" }) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    loadSavedCode();
  }, [problem.id]);

  const loadSavedCode = async () => {
    try {
      const savedCode = await AsyncStorage.getItem(
        `code_${problem.id}_${language}`
      );
      if (savedCode) {
        setCode(savedCode);
      } else {
        setCode(getTemplateCode(problem, language));
      }
    } catch (error) {
      console.error("Error loading saved code:", error);
    }
  };

  const saveCode = async (newCode) => {
    try {
      await AsyncStorage.setItem(`code_${problem.id}_${language}`, newCode);
      setCode(newCode);
    } catch (error) {
      console.error("Error saving code:", error);
    }
  };

  const getTemplateCode = (problem, language) => {
    // Extend with more templates as needed
    const templates = {
      javascript: {
        array: `function solve(arr) {\n    // Your solution here\n    return arr;\n}`,
        linkedlist: `function ListNode(val, next) {\n    this.val = (val===undefined ? 0 : val);\n    this.next = (next===undefined ? null : next);\n}\n\nfunction solve(head) {\n    // Your solution here\n    return head;\n}`,
        tree: `function TreeNode(val, left, right) {\n    this.val = (val===undefined ? 0 : val);\n    this.left = (left===undefined ? null : left);\n    this.right = (right===undefined ? null : right);\n}\n\nfunction solve(root) {\n    // Your solution here\n    return root;\n}`,
      },
    };
    // Placeholder: implement detectProblemCategory
    const category = "array";
    return templates[language][category] || templates[language].array;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{problem.title}</Text>
        <Text style={styles.language}>{language}</Text>
      </View>
      <ScrollView style={styles.editorContainer}>
        <TextInput
          style={styles.codeEditor}
          value={code}
          onChangeText={saveCode}
          multiline
          placeholder="Start coding here..."
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />
      </ScrollView>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolButton}>
          <Text>Run Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Text>Get Hint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  language: { fontSize: 14, color: "#888" },
  editorContainer: { flex: 1, marginVertical: 10 },
  codeEditor: {
    minHeight: 200,
    fontFamily: "monospace",
    fontSize: 16,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 6,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  toolButton: { backgroundColor: "#e0e0e0", padding: 10, borderRadius: 6 },
});

export default OfflineCodeEditor;
