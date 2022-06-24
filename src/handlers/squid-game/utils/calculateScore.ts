import { Actions, Activity, Modifications } from '@/handlers/squid-game/utils/activityTagger';

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

export function calculateScoreByActivity(tags: Activity[]) {
  return tags.reduce((score, tag) => (score + SCORES[tag]), 0);
}