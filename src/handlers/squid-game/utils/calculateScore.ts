import { Actions, Modifications } from '@/handlers/squid-game/utils/messageDecomposition';
import { Activity } from '@/handlers/squid-game/entities/Activity';
import { ObjectLiteral } from '@/infrastructure/interfaces/ObjectLiteral';
import { calculateWeightedScore } from '@/handlers/squid-game/utils/calculateWeightedScore';

export const BASE_SCORES = {
  [Actions.TEXT]: 1,
  [Actions.VIDEO_SHOT]: 1,
  [Actions.VOICE_SHOT]: 1,
  [Actions.STICKER]: 1,
  [Actions.GIF]: 1,
  [Actions.FILE]: 1,
  [Actions.PHOTO]: 1,
  [Actions.DECREASE_ACTIVITY]: -1,

  [Modifications.DESCRIPTION]: 1,
  [Modifications.MY_FORWARD]: 1,
  [Modifications.OTHER_USER_FORWARD]: 1,
  [Modifications.CHANNEL_FORWARD]: 1,
  [Modifications.EDITED_MESSAGE]: 1,
  [Modifications.MY_REPLY]: 1,
  [Modifications.OTHER_USER_REPLY]: 1,
}

export interface UserScore {
  userId: number;
  baseScore: number;
  weightedScore: number;
  difference: number;
}

function createScore(userId: number): UserScore {
  return {
    userId,
    baseScore: 0,
    weightedScore: 0,
    difference: 0,
  }
}

function createScoreObject(activities: Activity[], usersBySettings: number[]): UserScore[] {
  const usersByActivity = activities.map((activity) => activity.userId);
  const users = Array.from(new Set([...usersByActivity, ...usersBySettings]));

  return users.map((userId) => createScore(userId));
}

function calculateBaseScore(activities: Activity[]): ObjectLiteral<number> {
  return activities.reduce((userScore, activity) => {
    if (!userScore[activity.userId]) {
      userScore[activity.userId] = 0;
    }

    userScore[activity.userId] += (BASE_SCORES[activity.action] || 0);

    return userScore;
  }, {});
}

export function calculateScoreByUsers(activities: Activity[], users: number[] = []): UserScore[] {
  const scores = createScoreObject(activities, users);
  const baseScores = calculateBaseScore(activities);
  const weightedScores = calculateWeightedScore(activities);

  return scores
    .map((score) => {
      const baseScore = baseScores[score.userId] ? Math.ceil(baseScores[score.userId]) : 0;
      const weightedScore = weightedScores[score.userId] ? Math.ceil(weightedScores[score.userId]) : 0;

      return {
        ...score,
        baseScore,
        weightedScore,
      };
    })
    .sort((a, b) => (b.weightedScore - a.weightedScore));
}