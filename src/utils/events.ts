export enum Events {
  TEXT = 'text',
  EDITED_MESSAGE = 'edited_message',
  POLL_ANSWER = 'poll_answer',
  PHOTO = 'photo',
  VIDEO = 'video',
  VIDEO_NOTE = 'video_note',
  VOICE = 'voice',
  AUDIO = 'audio',
  MESSAGE = 'message',
  CALLBACK_QUERY = 'callback_query',
  INLINE_QUERY = 'inline_query',
}

export const BASE_EVENTS = [
  Events.MESSAGE,
  Events.CALLBACK_QUERY,
  Events.INLINE_QUERY,
];
export const COMMON_EVENTS = [
  Events.TEXT,
  Events.EDITED_MESSAGE,
  Events.POLL_ANSWER,
  Events.PHOTO ,
  Events.VIDEO,
  Events.VIDEO_NOTE,
  Events.VOICE,
  Events.AUDIO,
];

export const COMMON_EVENT_NAME = 'common';
export const SCHEDULER_EVENT_NAME = 'scheduler';

type Subscribers = {
  [key: string]: Subscriber[];
}

type Subscriber = (payload: any) => void;

export class EventEmitter {
  private subscribers: Subscribers = {};

  emit(eventName: any, payload?: any): void {
    if (this.subscribers[eventName]) {
      this.subscribers[eventName].forEach((subscriber) => {
        subscriber(payload);
      });
    }
  }

  subscribe(eventName: any, subscriber: Subscriber): void {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }

    this.subscribers[eventName].push(subscriber);
  }
}
