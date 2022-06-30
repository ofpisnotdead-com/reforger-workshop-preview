import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import WorkshopApi from "./lib/workshop-api";
import { Item } from "./lib/Item";

function formatPercent(number: number): Number {
  return number * 100;
}

const unitlist = ["", "K", "M", "G"];
function humanizeNumber(number: number): string {
  let sign = Math.sign(number);
  let unit = 0;

  while (Math.abs(number) > 1000) {
    unit = unit + 1;
    number = Math.floor(Math.abs(number) / 100) / 10;
  }
  return sign * Math.abs(number) + unitlist[unit];
}

// Registers the element
@customElement("workshop-browser")
export class WorkshopBrowser extends LitElement {
  @state() workshopApi!: WorkshopApi;
  @state() items: Item[] = [];
  @state() loading: Boolean = true;

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
      background-color: #565c54;
      flex: 1 1 300px;
      max-width: 500px;
      justify-content: space-between;

      display: flex;
      flex-direction: column;
    }

    section#title,
    section#summary {
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

    section#stats {
      background-color: #222f34;
      font-size: 1.25em;
      justify-content: space-between;
      font-weight: bold;
      padding: 10px;
    }

    section#stats .scenarios {
      flex: 1 1 100%;
      text-align: right;
      cursor: pointer;
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
      this.loading = false;
    });
  }

  scenariosTitle(scenariosIds: Array<string>) {
    if (scenariosIds.length > 0) {
      let texts = [...scenariosIds];
      texts.push("");
      texts.push("click to copy to clipboard");
      return texts.join("\n");
    } else {
      return "no scenarios";
    }
  }

  copyScenarios(scenariosIds: Array<string>) {
    if (scenariosIds.length > 0) {
      navigator.clipboard.writeText(scenariosIds.join("\n"));
      alert("Copied to clipboard!");
    }
  }

  render() {
    return this.loading ? html`<h2>loading...</h2>` : this.renderWorkshop();
  }

  renderWorkshop() {
    return html`
      <header>
        <h3>
          updated at ${this.workshopApi.lastUpdate}, ordered by popularity
        </h3>
      </header>
      <section>
        ${this.items.map(
          (item, i) =>
            html`<article>
              <section id="title">
                <h1>${item.name}</h1>
                <h2>by ${item.author}</h2>
              </section>
              <section id="stats">
                <div title="${item.ratingCount} class="ratings">
                  ${formatPercent(item.averageRating)}% rating
                </div>
                <div title="${item.subscriberCount} class="subs">
                  ${humanizeNumber(item.subscriberCount)} subs
                </div>
                <div
                  title="${this.scenariosTitle(item.scenariosIds)}"
                  class="scenarios"
                  @click="${() => this.copyScenarios(item.scenariosIds)}"
                  data-clipboard-text="${item.scenariosIds.join("\n")}"
                >
                  ${
                    item.scenariosIds.length > 0
                      ? item.scenariosIds.length === 1
                        ? html`1 scenario`
                        : html`${item.scenariosIds.length} scenarios`
                      : html`no scenarios`
                  }
                </div>
              </section>
              <section id="photo">
                ${
                  item.preview
                    ? html`<img loading="lazy" src=${item.preview} />`
                    : null
                }
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
