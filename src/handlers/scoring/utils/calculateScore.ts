import { Context } from 'telegraf';

enum Actions {
  TEXT = 'text',
  STICKER = 'sticker',
  GIF = 'gif',
  FILE = 'file',
  PHOTO = 'photo',
  VIDEO_SHOT = 'video_shot',
  VOICE_SHOT = 'voice_shot',
}

enum Modifications {
  MY_FORWARD = 'my_forward',
  OTHER_USER_FORWARD = 'other_user_forward',
  CHANNEL_FORWARD = 'channel_forward',
  EDITED_MESSAGE = 'edited_message',
}

const SCORES = {
  [Actions.TEXT]: 1,
  [Actions.VIDEO_SHOT]: 1,
  [Actions.VOICE_SHOT]: 1,
  [Actions.STICKER]: 1,
  [Actions.GIF]: 1,
  [Actions.FILE]: 1,
  [Actions.PHOTO]: 1,

  [Modifications.MY_FORWARD]: 1,
  [Modifications.OTHER_USER_FORWARD]: 1,
  [Modifications.CHANNEL_FORWARD]: 1,
  [Modifications.EDITED_MESSAGE]: 1
}

function isText(ctx) {
  return !!ctx?.update?.message?.text;
}

function isSticker(ctx) {
  return !!ctx?.update?.message?.sticker;
}

function isGif(ctx) {
  return Boolean(ctx?.update?.message?.animation);
}

function isFile(ctx) {
  return Boolean(ctx?.update?.message?.document);
}

function isPhoto(ctx) {
  return Boolean(ctx?.update?.message?.photo);
}

function isVideoShot(ctx) {
  return Boolean(ctx?.update?.message?.video_note);
}

function isVoiceShot(ctx) {
  return Boolean(ctx?.update?.message?.video_note);
}

function withDescription(ctx) {
  return Boolean(ctx?.update?.message?.caption);
}

function withMyForward(ctx) {
  return Boolean(ctx?.update?.message?.forward_from)
    && Boolean(ctx?.update?.message?.forward_from?.id === ctx?.update?.message?.from?.id);
}

function withOtherUserForward(ctx) {
  return Boolean(ctx?.update?.message?.forward_from)
    && Boolean(ctx?.update?.message?.forward_from?.id !== ctx?.update?.message?.from?.id);
}

function withEdit(ctx) {
  return Boolean(ctx?.update?.message?.edited_message);
}

function withChannelForward(ctx) {
  return Boolean(ctx?.update?.message?.forward_from_chat);
}

export function buildTags(ctx: Context) {
  const tags = [];

  isText(ctx) && tags.push(Actions.TEXT);
  isSticker(ctx) && tags.push(Actions.STICKER);
  isGif(ctx) && tags.push(Actions.GIF);
  isFile(ctx) && tags.push(Actions.FILE);
  isPhoto(ctx) && tags.push(Actions.PHOTO);
  isVideoShot(ctx) && tags.push(Actions.VIDEO_SHOT);
  isVoiceShot(ctx) && tags.push(Actions.VOICE_SHOT);

  withDescription(ctx) && tags.push(Modifications.MY_FORWARD);
  withMyForward(ctx) && tags.push(Modifications.MY_FORWARD);
  withOtherUserForward(ctx) && tags.push(Modifications.OTHER_USER_FORWARD);
  withChannelForward(ctx) && tags.push(Modifications.CHANNEL_FORWARD);
  withEdit(ctx) && tags.push(Modifications.EDITED_MESSAGE);

  return tags;
}

export function calculateScore(ctx: Context): number {
  const tags = buildTags(ctx);
  const score = tags.reduce((score, tag) => (score + SCORES[tag]), 0);

  console.log('ctx', ctx);
  console.log('tags', tags, score);

  return score;
}