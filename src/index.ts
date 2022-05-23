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
    }

    section {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    article {
      border: 1px solid black;
      background-color: #565C54;
      flex: 1 1 300px;
      max-width: 500px;
      justify-content: space-between;

      display: flex;
      flex-direction: column;
    }

    section#title, section#summary {
      padding: 10px;
    }

    section#summary {
      flex: 1;
    }

    section#title h1 {
      font-size: 1.5em;
    }

    section#title h2 {
      font-size: 1.25em;
    }

    section#title {
      flex-direction: column;
      background-color: #e2a750;
      gap: 0;
    }

    article img {
      width: 100%;
    }

    header {
      margin-bottom: 10px;
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
        <h3>updated at ${this.workshopApi.lastUpdate}, ordered by popularity</h3>
      </header>
      <section>
        ${this.items.map(
          (item, i) =>
            html`<article>
              <section id="title">
                <h1>${item.name}</h1>
                <h2>by ${item.author}</h2>
              </section>

              <section id="photo">
                ${item.preview ? html`<img src=${item.preview} />` : null}
              </section>

              <section id="summary">
              <p>${item.summary}</p>
              </section>
            </article>`
        )}
      </section>
    `;
  }
}
