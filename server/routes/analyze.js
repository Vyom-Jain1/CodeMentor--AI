const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { protect } = require('../middleware/auth');
const Problem = require('../models/Problem');

router.post('/', protect, async (req, res) => {
  try {
    const { code, language, problemId } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }

    // Get problem details if problemId is provided
    let problem = null;
    if (problemId) {
      problem = await Problem.findById(problemId);
      if (!problem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found'
        });
      }
    }

    // Analyze code structure and quality
    const [codeQuality, complexity] = await Promise.all([
      aiService.queryModel(`Analyze this ${language} code for potential issues and improvements:\n${code}`, { task: 'code' }),
      aiService.queryModel(`What is the time and space complexity of this ${language} code? Answer in Big O notation:\n${code}`, { task: 'code' })
    ]);

    // Save analysis to database if problemId exists
    if (problem) {
      problem.lastAnalysis = {
        codeQuality,
        complexity,
        timestamp: new Date(),
        userId: req.user.id
      };
      await problem.save();
    }

    const qualityLines = codeQuality.split('\n').filter(line => line.trim());
    const issues = qualityLines
      .filter(line => line.toLowerCase().includes('issue') || line.toLowerCase().includes('error'))
      .map(line => line.replace(/^[•\-*]\s*/, '').trim());

    const improvements = qualityLines
      .filter(line => line.toLowerCase().includes('improve') || line.toLowerCase().includes('suggest'))
      .map(line => line.replace(/^[•\-*]\s*/, '').trim());

    // Extract learning suggestions
    const explanationLines = complexity.split('\n').filter(line => line.trim());
    const suggestions = explanationLines
      .filter(line => line.toLowerCase().includes('resource') || line.toLowerCase().includes('learn'))
      .map(line => line.replace(/^[•\-*]\s*/, '').trim());

    // If we have a problem, check if the solution is optimal
    let optimizationSuggestion = null;
    if (problem && problem.optimalComplexity) {
      const currentComplexity = complexity.replace('O(', '').replace(')', '');
      const targetComplexity = problem.optimalComplexity.replace('O(', '').replace(')', '');
      if (currentComplexity !== targetComplexity) {
        optimizationSuggestion = await aiService.queryModel(
          `The current solution has time complexity O(${currentComplexity}) but can be optimized to O(${targetComplexity}). Explain how to optimize it.`,
          { task: 'code' }
        );
      }
    }

    res.json({
      success: true,
      data: {
        codeQuality,
        complexity,
        issues,
        improvements,
        suggestions,
        optimizationSuggestion,
        problem: problem ? {
          id: problem._id,
          title: problem.title,
          difficulty: problem.difficulty,
          optimalComplexity: problem.optimalComplexity
        } : null
      }
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Analysis failed'
    });
  }
});

module.exports = router;
