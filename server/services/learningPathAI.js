const UserProgress = require("../models/UserProgress");

class LearningPathAI {
  static async generatePersonalizedPath(userId) {
    const userProgress = await UserProgress.findOne({ userId });
    const weakAreas = await this.identifyWeakAreas(userProgress);
    const learningStyle = await this.analyzeLearningStyle(userProgress);
    const path = await this.buildCustomPath(
      weakAreas,
      learningStyle,
      userProgress
    );
    return {
      recommendedProblems: path.problems,
      focusAreas: weakAreas,
      estimatedTimeToComplete: path.estimatedTime,
      difficultyProgression: path.progression,
      learningTips: await this.generateLearningTips(learningStyle),
    };
  }

  static async identifyWeakAreas(userProgress) {
    const topics = Object.keys(userProgress.topicMastery || {});
    const weakAreas = topics
      .filter((topic) => userProgress.topicMastery[topic].proficiency < 60)
      .sort(
        (a, b) =>
          userProgress.topicMastery[a].proficiency -
          userProgress.topicMastery[b].proficiency
      );
    return weakAreas.slice(0, 3);
  }

  static async analyzeLearningStyle(userProgress) {
    const { learningPattern = {} } = userProgress;
    const avgSessionTime = learningPattern.averageSessionTime || 0;
    const hintsUsage =
      (userProgress.hintsUsed || 0) /
      Math.max(userProgress.totalProblemsAttempted || 1, 1);
    const problemsPerSession =
      (userProgress.totalProblemsAttempted || 0) /
      Math.max(learningPattern.totalSessions || 1, 1);
    if (avgSessionTime > 60 && hintsUsage < 0.3) {
      return "deep_learner";
    } else if (problemsPerSession > 5 && avgSessionTime < 45) {
      return "fast_learner";
    } else if (hintsUsage > 0.6) {
      return "guided_learner";
    } else {
      return "balanced_learner";
    }
  }

  static async generateLearningTips(learningStyle) {
    const tips = {
      deep_learner: [
        "Take time to understand the underlying concepts before coding",
        "Try to solve problems using multiple approaches",
        "Focus on understanding time/space complexity deeply",
      ],
      fast_learner: [
        "Challenge yourself with harder problems more frequently",
        "Try timed problem-solving sessions",
        "Focus on pattern recognition to solve faster",
      ],
      guided_learner: [
        "Start with easier problems to build confidence",
        "Use hints strategically - try for 10 minutes before asking",
        "Review solutions after solving to learn patterns",
      ],
      balanced_learner: [
        "Maintain a good mix of easy, medium, and hard problems",
        "Focus on consistency over speed",
        "Review your mistakes regularly",
      ],
    };
    return tips[learningStyle] || tips.balanced_learner;
  }

  static async buildCustomPath(weakAreas, learningStyle, userProgress) {
    // Placeholder: implement logic to select problems and estimate time
    return {
      problems: [],
      estimatedTime: "7 days",
      progression: "easy -> medium -> hard",
    };
  }
}

module.exports = LearningPathAI;
