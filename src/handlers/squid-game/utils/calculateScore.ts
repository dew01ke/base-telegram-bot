import { Actions, Modifications } from '@/handlers/squid-game/utils/messageDecomposition';
import { Activity } from '@/handlers/squid-game/entities/Activity';

export const SCORES = {
  [Actions.TEXT]: 1,
  [Actions.VIDEO_SHOT]: 1,
  [Actions.VOICE_SHOT]: 1,
  [Actions.STICKER]: 1,
  [Actions.GIF]: 1,
  [Actions.FILE]: 1,
  [Actions.PHOTO]: 1,

  [Modifications.DESCRIPTION]: 1,
  [Modifications.MY_FORWARD]: 1,
  [Modifications.OTHER_USER_FORWARD]: 1,
  [Modifications.CHANNEL_FORWARD]: 1,
  [Modifications.EDITED_MESSAGE]: 1,
  [Modifications.MY_REPLY]: 1,
  [Modifications.OTHER_USER_REPLY]: 1,
}

export interface MemberScore {
  userId: number;
  score: number;
}

export interface MemberScores {
  [key: string]: MemberScore;
}

export function calculateScoreByUsers(activities: Activity[]): MemberScores {
  return activities.reduce((userScore, activity) => {
    if (!userScore[activity.userId]) {
      userScore[activity.userId] = {
        userId: activity.userId,
        score: 0,
      };
    }

    userScore[activity.userId].score += (SCORES[activity.action] || 0);

    return userScore;
  }, {});
}