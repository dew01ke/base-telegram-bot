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

export const COMMON_EVENT_NAME = 'common';

type Subscribers = {
  [key: string]: Subscriber[];
}

type Subscriber = (payload: any) => void;

export class EventEmitter {
  private subscribers: Subscribers = {};

  emit(eventName: any, payload: any) {
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
