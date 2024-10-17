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
