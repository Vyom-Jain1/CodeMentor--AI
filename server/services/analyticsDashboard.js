const UserProgress = require("../models/UserProgress");

class AnalyticsDashboard {
  static async generateUserInsights(userId, timeRange = "30d") {
    const progress = await UserProgress.findOne({ userId });
    const timeData = await this.getTimeSeriesData(userId, timeRange);
    return {
      performance: await this.calculatePerformanceMetrics(progress),
      trends: timeData,
      predictions: await this.generatePredictions(progress, timeData),
      recommendations: await this.generateRecommendations(progress),
      comparison: await this.getPeerComparison(userId, progress),
    };
  }

  static async calculatePerformanceMetrics(progress) {
    const totalTime = (progress.dailyActivity || []).reduce(
      (sum, day) => sum + (day.timeSpent || 0),
      0
    );
    const avgTimePerProblem =
      totalTime / Math.max(progress.totalProblemsAttempted || 1, 1);
    return {
      accuracyRate:
        (progress.totalProblemsSolved /
          Math.max(progress.totalProblemsAttempted || 1, 1)) *
        100,
      avgTimePerProblem: Math.round(avgTimePerProblem),
      consistencyScore: this.calculateConsistencyScore(
        progress.dailyActivity || []
      ),
      improvementRate: await this.calculateImprovementRate(progress),
      focusScore: this.calculateFocusScore(progress.topicMastery || {}),
    };
  }

  static calculateConsistencyScore(dailyActivity) {
    const last30Days = dailyActivity.slice(-30);
    const activeDays = last30Days.filter(
      (day) => day.problemsSolved > 0
    ).length;
    const streakDays = this.calculateCurrentStreak(last30Days);
    // Weighted score: 60% active days, 40% streak consistency
    const activeScore = (activeDays / 30) * 60;
    const streakScore = Math.min(streakDays / 7, 1) * 40;
    return Math.round(activeScore + streakScore);
  }

  static calculateCurrentStreak(dailyActivity) {
    let streak = 0;
    for (let i = dailyActivity.length - 1; i >= 0; i--) {
      if (dailyActivity[i].problemsSolved > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  static async calculateImprovementRate(progress) {
    const recentSolves = (progress.dailyActivity || []).slice(-14);
    const olderSolves = (progress.dailyActivity || []).slice(-28, -14);
    const recentAvg =
      recentSolves.reduce((sum, day) => sum + (day.problemsSolved || 0), 0) /
      14;
    const olderAvg =
      olderSolves.reduce((sum, day) => sum + (day.problemsSolved || 0), 0) / 14;
    if (olderAvg === 0) return 0;
    return Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
  }

  static calculateFocusScore(topicMastery) {
    const topics = Object.values(topicMastery || {});
    const totalProblems = topics.reduce(
      (sum, topic) => sum + (topic.problemsSolved || 0),
      0
    );
    if (totalProblems === 0) return 0;
    // Calculate distribution entropy - lower entropy = more focused
    const entropy = topics.reduce((sum, topic) => {
      if (!topic.problemsSolved) return sum;
      const p = topic.problemsSolved / totalProblems;
      return sum - p * Math.log2(p);
    }, 0);
    const maxEntropy = Math.log2(topics.length || 1);
    return Math.round((1 - entropy / maxEntropy) * 100);
  }

  static async generatePredictions(progress, timeData) {
    const recentTrend = this.calculateTrendSlope((timeData || []).slice(-14));
    const currentLevel = this.assessCurrentLevel(progress);
    return {
      nextMilestone: this.predictNextMilestone(progress, recentTrend),
      timeToComplete: this.estimateCompletionTime(progress, recentTrend),
      difficultyReadiness: this.assessDifficultyReadiness(progress),
      burnoutRisk: this.calculateBurnoutRisk(timeData),
      optimalSchedule: this.generateOptimalSchedule(progress, timeData),
    };
  }

  static calculateTrendSlope(timeData) {
    if (!timeData || timeData.length < 2) return 0;
    const n = timeData.length;
    const sumX = timeData.reduce((sum, d, i) => sum + i, 0);
    const sumY = timeData.reduce((sum, d) => sum + (d.problemsSolved || 0), 0);
    const sumXY = timeData.reduce(
      (sum, d, i) => sum + i * (d.problemsSolved || 0),
      0
    );
    const sumX2 = timeData.reduce((sum, d, i) => sum + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
    return slope;
  }

  static predictNextMilestone(progress, trend) {
    const milestones = [
      { problems: 50, title: "Problem Solver" },
      { problems: 100, title: "Code Warrior" },
      { problems: 250, title: "Algorithm Master" },
      { problems: 500, title: "DSA Expert" },
      { problems: 1000, title: "Coding Legend" },
    ];
    const nextMilestone = milestones.find(
      (m) => m.problems > progress.totalProblemsSolved
    );
    if (!nextMilestone) return null;
    const remaining = nextMilestone.problems - progress.totalProblemsSolved;
    const daysToComplete = trend > 0 ? Math.ceil(remaining / trend) : null;
    return {
      ...nextMilestone,
      remaining,
      estimatedDays: daysToComplete,
    };
  }

  static async getPeerComparison(userId, progress) {
    const userLevel = this.assessCurrentLevel(progress);
    const peers = await UserProgress.find({
      totalProblemsSolved: {
        $gte: progress.totalProblemsSolved - 50,
        $lte: progress.totalProblemsSolved + 50,
      },
      userId: { $ne: userId },
    }).limit(100);
    const peerStats = {
      averageProblems:
        peers.reduce((sum, p) => sum + (p.totalProblemsSolved || 0), 0) /
        (peers.length || 1),
      averageStreak:
        peers.reduce((sum, p) => sum + (p.currentStreak || 0), 0) /
        (peers.length || 1),
      averagePoints:
        peers.reduce((sum, p) => sum + (p.totalPoints || 0), 0) /
        (peers.length || 1),
    };
    return {
      percentile: this.calculatePercentile(progress, peers),
      comparison: {
        problems: progress.totalProblemsSolved - peerStats.averageProblems,
        streak: progress.currentStreak - peerStats.averageStreak,
        points: progress.totalPoints - peerStats.averagePoints,
      },
      rank: this.calculateRank(progress, peers),
    };
  }

  // Placeholder methods for completeness
  static assessCurrentLevel(progress) {
    return "Intermediate";
  }
  static estimateCompletionTime(progress, trend) {
    return trend > 0
      ? Math.ceil((1000 - progress.totalProblemsSolved) / trend)
      : null;
  }
  static assessDifficultyReadiness(progress) {
    return "Ready for next level";
  }
  static calculateBurnoutRisk(timeData) {
    return "Low";
  }
  static generateOptimalSchedule(progress, timeData) {
    return "1-2 problems/day";
  }
  static calculatePercentile(progress, peers) {
    return 50;
  }
  static calculateRank(progress, peers) {
    return (
      1 +
      peers.filter((p) => (p.totalPoints || 0) > (progress.totalPoints || 0))
        .length
    );
  }

  static async generateRecommendations(progress) {
    // Placeholder: implement personalized recommendations
    return [
      "Keep up your daily streak!",
      "Focus on weak topics for faster improvement.",
      "Try harder problems to boost your skills.",
    ];
  }

  static async getTimeSeriesData(userId, timeRange) {
    // Placeholder: implement logic to fetch time series data
    // For now, return last N days of dailyActivity
    const progress = await UserProgress.findOne({ userId });
    let days = 30;
    if (timeRange === "7d") days = 7;
    if (timeRange === "90d") days = 90;
    if (timeRange === "1y") days = 365;
    return (progress.dailyActivity || []).slice(-days);
  }
}

module.exports = AnalyticsDashboard;
