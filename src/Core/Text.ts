import { Base } from './Base'
import '../css/text.css'

export class Text extends Base {

  async connectedCallback () {
    await this.init()

    const children = this.innerHTML
    this.innerHTML = `
      <span class="inner">
        <p>${children}</p>
      </span>
    `
    this.applyStyles()
    setTimeout(() => this.applyStyles(), 50)
    setTimeout(() => this.applyStyles(), 100)
  } 

  applyStyles () {
    this.setAttribute('style', `
      --height: ${this.querySelector('p').clientHeight}px;
    `)
  }

}

customElements.define('comic-text', Text)