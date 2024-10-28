export class Emote {
  name: string;
  url: string;
  nameLower: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
    this.nameLower = name.toLocaleLowerCase();
  }
}

export class ChatPronoun {
  id: number;
  subject: string;
  object: string;
  singular: boolean;

  constructor(id: number, subject: string, object: string, singular: boolean) {
    this.id = id;
    this.subject = subject;
    this.object = object;
    this.singular = singular;
  }
}

export enum ActionType {
  None = "none",
  ChatPoll = "chatPoll",
}
