export class Emote {
  name: string;
  url: string;
  hidden: boolean = false;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
}
