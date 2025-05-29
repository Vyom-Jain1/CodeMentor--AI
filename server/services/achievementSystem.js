const UserProgress = require("../models/UserProgress");
const NotificationService = require("./notificationService");

class AchievementSystem {
  static achievements = [
    {
      id: "first_solve",
      name: "First Steps",
      description: "Solve your first problem",
      icon: "🎯",
      points: 50,
      category: "milestone",
    },
    {
      id: "streak_7",
      name: "Week Warrior",
      description: "Maintain a 7-day solving streak",
      icon: "🔥",
      points: 200,
      category: "streak",
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Solve a medium problem in under 5 minutes",
      icon: "⚡",
      points: 300,
      category: "speed",
    },
    {
      id: "helper",
      name: "Community Helper",
      description: "Help 10 users in discussions",
      icon: "🤝",
      points: 150,
      category: "community",
    },
    {
      id: "perfectionist",
      name: "Perfectionist",
      description: "Solve 10 problems without using hints",
      icon: "💎",
      points: 400,
      category: "skill",
    },
  ];

  static async checkAchievements(userId, action, metadata = {}) {
    const userProgress = await UserProgress.findOne({ userId });
    const newAchievements = [];

    for (const achievement of this.achievements) {
      if (userProgress.achievements.some((a) => a.id === achievement.id)) {
        continue; // Already earned
      }
      if (
        await this.isAchievementEarned(
          achievement,
          userProgress,
          action,
          metadata
        )
      ) {
        newAchievements.push(achievement);
        await this.awardAchievement(userId, achievement);
      }
    }
    return newAchievements;
  }

  static async isAchievementEarned(
    achievement,
    userProgress,
    action,
    metadata
  ) {
    switch (achievement.id) {
      case "first_solve":
        return (
          action === "problem_solved" && userProgress.totalProblemsSolved === 1
        );
      case "streak_7":
        return userProgress.currentStreak >= 7;
      case "speed_demon":
        return (
          action === "problem_solved" &&
          metadata.difficulty === "medium" &&
          metadata.timeSpent < 300
        );
      case "helper":
        return userProgress.communityHelps >= 10;
      case "perfectionist":
        return userProgress.solvedWithoutHints >= 10;
      default:
        return false;
    }
  }

  static async awardAchievement(userId, achievement) {
    await UserProgress.updateOne(
      { userId },
      {
        $push: {
          achievements: {
            ...achievement,
            earnedDate: new Date(),
          },
        },
        $inc: { totalPoints: achievement.points },
      }
    );
    await NotificationService.send(userId, {
      type: "achievement",
      title: "🎉 Achievement Unlocked!",
      message: `You earned "${achievement.name}" - ${achievement.description}`,
      points: achievement.points,
    });
  }

  static listAchievements() {
    return this.achievements;
  }
}

module.exports = AchievementSystem;
