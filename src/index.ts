import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import WorkshopApi from "./lib/workshop-api";
import { Item } from "./lib/Item";

// Registers the element
@customElement("workshop-browser")
export class WorkshopBrowser extends LitElement {
  @state() workshopApi!: WorkshopApi;
  @state() items: Item[] = [];

  // Styles are applied to the shadow root and scoped to this element
  static styles = css`
    * {
      padding: 0%;
      margin: 0;
      box-sizing: border-box;
      font-family: "Arimo", sans-serif;
    }

    section {
      display: flex;
      flex-wrap: wrap;
    }

    article {
      border: 1px solid black;
      background-color: #565C54;
      flex: 1 1 300px;
      max-width: 500px;
      margin: 10px;
    }

    article h1,
    article h2 {
      background-color: #e2a750;
      padding: 0 10px;
    }

    article h1 {
      font-size: 1.5em;
      padding-top: 10px;
    }

    article h2 {
      font-size: 1.2em;
      padding-bottom: 10px;
    }

    article p {
      margin: 10px 0;
      padding: 0 10px;
    }

    article img {
      width: 100%;
    }

    header {
      margin: 10px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.workshopApi = new WorkshopApi();
    this.loadItems();
  }

  loadItems() {
    this.workshopApi.loadItems().then((items) => {
      this.items = items;
    });
  }

  render() {
    return html`
      <header>
        <h1>Arma Reforger Workshop unofficial <i>sneak-peak</i> browser</h1>
        <h2>updated at ${this.workshopApi.lastUpdate}</h2>
        <h3>ordered by popularity</h3>
      </header>
      <section>
        ${this.items.map(
          (item, i) =>
            html`<article>
              <h1>${item.name}</h1>
              <h2>by ${item.author}</h2>
              <p>${item.summary}</p>
              ${item.preview ? html`<img src=${item.preview} />` : null}
            </article>`
        )}
      </section>
    `;
  }
}
