import { Item } from "./Item";

export default class WorkshopApi {
  url: string = "https://master.ofpisnotdead.com/reforger-workshop.json";
  lastUpdate: string;
  items: Item[] = [];

  async loadItems() {
    let response = await fetch(this.url);
    let parsedResponse = await response.json();
    this.lastUpdate = parsedResponse.updated_at;
    parsedResponse.data.forEach((item) => {
      this.items = [...this.items, item];
    });

    return this.items;
  }
}
