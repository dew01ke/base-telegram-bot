export enum Events {
  MESSAGE = 'message',
}

type Subscribers = {
  [key: string]: Subscriber[];
}

type Subscriber = (payload: any) => void;

export class EventEmitter {
  private subscribers: Subscribers = {};

  emit(eventName: Events, payload: any) {
    if (this.subscribers[eventName]) {
      this.subscribers[eventName].forEach((subscriber) => {
        subscriber(payload);
      });
    }
  }

  subscribe(eventName: Events, subscriber: Subscriber): void {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }

    this.subscribers[eventName].push(subscriber);
  }
}
