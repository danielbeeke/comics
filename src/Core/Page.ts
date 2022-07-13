import { Base } from './Base'
import '../css/page.css'

export class Page extends Base {

  numberAttributes = ['columns', 'rows', 'size']

  async connectedCallback () {
    await this.init()

    this.setAttribute('style', `
      --columns: ${this.numberGetters.columns};
      --rows: ${this.numberGetters.rows};
      --size: ${this.numberGetters.size}px;
      --grid: url("data:image/svg+xml;base64,${this.grid()}")
    `)
  } 

  grid () {
    const size = this.numberGetters.size
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <line x1="0" y1="0" x2="0" y2="${size}" stroke="rgba(0, 0, 0, .2)" />
        <line x1="0" y1="0" x2="${size}" y2="0" stroke="rgba(0, 0, 0, .2)" />
      </svg>
    `

    return btoa(svg)
  }

}

customElements.define('comic-page', Page)