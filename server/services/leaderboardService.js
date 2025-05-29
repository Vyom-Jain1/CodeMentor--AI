const UserProgress = require("../models/UserProgress");

class LeaderboardService {
  static async getGlobalLeaderboard(limit = 100) {
    return await UserProgress.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          username: "$user.username",
          avatar: "$user.avatar",
          totalPoints: 1,
          problemsSolved: "$totalProblemsSolved",
          currentStreak: 1,
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: limit },
    ]);
  }

  static async getWeeklyLeaderboard(limit = 50) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    return await UserProgress.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $addFields: {
          weeklyPoints: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$dailyActivity",
                    cond: { $gte: ["$$this.date", weekStart] },
                  },
                },
                in: "$$this.pointsEarned",
              },
            },
          },
        },
      },
      { $sort: { weeklyPoints: -1 } },
      { $limit: limit },
      {
        $project: {
          username: "$user.username",
          avatar: "$user.avatar",
          weeklyPoints: 1,
        },
      },
    ]);
  }
}

module.exports = LeaderboardService;
