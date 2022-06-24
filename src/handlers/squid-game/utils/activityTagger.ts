import { Context } from 'telegraf';

export enum Actions {
  TEXT = 'text',
  STICKER = 'sticker',
  GIF = 'gif',
  FILE = 'file',
  PHOTO = 'photo',
  VIDEO_SHOT = 'video_shot',
  VOICE_SHOT = 'voice_shot',
}

export enum Modifications {
  DESCRIPTION = 'description',
  MY_FORWARD = 'my_forward',
  OTHER_USER_FORWARD = 'other_user_forward',
  CHANNEL_FORWARD = 'channel_forward',
  EDITED_MESSAGE = 'edited_message',
  MY_REPLY = 'my_reply',
  OTHER_USER_REPLY = 'other_user_reply',
}

export type Activity = Actions | Modifications;

function isText(ctx) {
  return Boolean(ctx?.update?.message?.text);
}

function isSticker(ctx) {
  return Boolean(ctx?.update?.message?.sticker);
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
  return Boolean(ctx?.update?.message?.voice);
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

function withMyReply(ctx) {
  return Boolean(ctx?.update?.message?.reply_to_message)
    && Boolean(ctx?.update?.message?.reply_to_message?.from?.id === ctx?.update?.message?.from?.id);
}

function withOtherUserReply(ctx) {
  return Boolean(ctx?.update?.message?.reply_to_message)
    && Boolean(ctx?.update?.message?.reply_to_message?.from?.id !== ctx?.update?.message?.from?.id);
}

export function buildActivityTags(ctx: Context) {
  const tags = [];

  isText(ctx) && tags.push(Actions.TEXT);
  isSticker(ctx) && tags.push(Actions.STICKER);
  isGif(ctx) && tags.push(Actions.GIF);
  isFile(ctx) && tags.push(Actions.FILE);
  isPhoto(ctx) && tags.push(Actions.PHOTO);
  isVideoShot(ctx) && tags.push(Actions.VIDEO_SHOT);
  isVoiceShot(ctx) && tags.push(Actions.VOICE_SHOT);

  withDescription(ctx) && tags.push(Modifications.DESCRIPTION);
  withMyForward(ctx) && tags.push(Modifications.MY_FORWARD);
  withOtherUserForward(ctx) && tags.push(Modifications.OTHER_USER_FORWARD);
  withChannelForward(ctx) && tags.push(Modifications.CHANNEL_FORWARD);
  withEdit(ctx) && tags.push(Modifications.EDITED_MESSAGE);
  withMyReply(ctx) && tags.push(Modifications.MY_REPLY);
  withOtherUserReply(ctx) && tags.push(Modifications.OTHER_USER_REPLY);

  return tags;
}