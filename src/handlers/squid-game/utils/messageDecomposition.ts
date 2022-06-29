import { Context } from '@/infrastructure/interfaces/Context';

export enum Actions {
  TEXT = 'text',
  STICKER = 'sticker',
  GIF = 'gif',
  FILE = 'file',
  PHOTO = 'photo',
  VIDEO_SHOT = 'video_shot',
  VOICE_SHOT = 'voice_shot',
  DECREASE_ACTIVITY = 'decrease_activity',
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

function isText(ctx: Context) {
  return Boolean(ctx?.update?.message?.text);
}

function isSticker(ctx: Context) {
  return Boolean(ctx?.update?.message?.sticker);
}

function isGif(ctx: Context) {
  return Boolean(ctx?.update?.message?.animation);
}

function isFile(ctx: Context) {
  return Boolean(ctx?.update?.message?.document);
}

function isPhoto(ctx: Context) {
  return Boolean(ctx?.update?.message?.photo);
}

function isVideoShot(ctx: Context) {
  return Boolean(ctx?.update?.message?.video_note);
}

function isVoiceShot(ctx: Context) {
  return Boolean(ctx?.update?.message?.voice);
}

function withDescription(ctx: Context) {
  return Boolean(ctx?.update?.message?.caption);
}

function withMyForward(ctx: Context) {
  return Boolean(ctx?.update?.message?.forward_from)
    && Boolean(ctx?.update?.message?.forward_from?.id === ctx?.update?.message?.from?.id);
}

function withOtherUserForward(ctx: Context) {
  return Boolean(ctx?.update?.message?.forward_from)
    && Boolean(ctx?.update?.message?.forward_from?.id !== ctx?.update?.message?.from?.id);
}

function withEdit(ctx: Context) {
  return Boolean(ctx?.update?.message?.edited_message);
}

function withChannelForward(ctx: Context) {
  return Boolean(ctx?.update?.message?.forward_from_chat);
}

function withMyReply(ctx: Context) {
  return Boolean(ctx?.update?.message?.reply_to_message)
    && Boolean(ctx?.update?.message?.reply_to_message?.from?.id === ctx?.update?.message?.from?.id);
}

function withOtherUserReply(ctx: Context) {
  return Boolean(ctx?.update?.message?.reply_to_message)
    && Boolean(ctx?.update?.message?.reply_to_message?.from?.id !== ctx?.update?.message?.from?.id);
}

export function getAction(ctx: Context): Actions {
  let tags = [];

  isText(ctx) && tags.push(Actions.TEXT);
  isSticker(ctx) && tags.push(Actions.STICKER);
  isGif(ctx) && tags.push(Actions.GIF);
  isFile(ctx) && !isGif(ctx) && tags.push(Actions.FILE);
  isPhoto(ctx) && tags.push(Actions.PHOTO);
  isVideoShot(ctx) && tags.push(Actions.VIDEO_SHOT);
  isVoiceShot(ctx) && tags.push(Actions.VOICE_SHOT);

  return tags[0];
}

export function getModifications(ctx: Context): Modifications[] {
  let tags = [];

  withDescription(ctx) && tags.push(Modifications.DESCRIPTION);
  withMyForward(ctx) && tags.push(Modifications.MY_FORWARD);
  withOtherUserForward(ctx) && tags.push(Modifications.OTHER_USER_FORWARD);
  withChannelForward(ctx) && tags.push(Modifications.CHANNEL_FORWARD);
  withEdit(ctx) && tags.push(Modifications.EDITED_MESSAGE);
  withMyReply(ctx) && tags.push(Modifications.MY_REPLY);
  withOtherUserReply(ctx) && tags.push(Modifications.OTHER_USER_REPLY);

  return tags;
}