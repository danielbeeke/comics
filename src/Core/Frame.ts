import { Base } from './Base'
import '../css/frame.css'
import interact from 'interactjs'
import { Page } from './Page'

export class Frame extends Base {

  stringAttributes = ['src', 'position']

  inlineStart: number
  inlineEnd: number
  blockStart: number
  blockEnd: number

  get position () {
    const [inlineStart, inlineEnd, blockStart, blockEnd] = this.stringGetters.position.split(/,|-/g).map(value => parseInt(value))
    return { inlineStart, inlineEnd, blockStart, blockEnd }
  }

  get columns () {
    return this.inlineEnd - this.inlineStart
  }

  get rows () {
    return this.blockEnd - this.blockStart
  }

  get page () {
    return (this.closest('comic-page') as Page)
  }

  get size () {
    return this.page.numberGetters.size
  }

  async connectedCallback () {
    await this.init()
    Object.assign(this, this.position)
    this.apply()
    this.addInteractivity()
  } 

  addInteractivity () {
    let position = { x: 0, y: 0 }
    interact(this)
    .draggable({
      listeners: {
        start (event) {
          position = event.client
        },
        move: (event) => {
          const deltaInline = Math.round((event.client.x - position.x) / this.size)

          if (this.inlineStart + deltaInline > 0 && this.inlineEnd + deltaInline <= this.page.numberGetters.columns + 1) {
            this.inlineStart += deltaInline
            this.inlineEnd += deltaInline
            position.x = position.x + deltaInline * this.size
          }

          const deltaBlock = Math.round((event.client.y - position.y) / this.size)

          if (this.blockStart + deltaBlock > 0 && this.blockEnd + deltaBlock <= this.page.numberGetters.rows + 1) {
            this.blockStart += deltaBlock
            this.blockEnd += deltaBlock
            position.y = position.y + deltaBlock * this.size  
          }
  
          this.apply()
        },
      }
    })
    .resizable({
      edges: { top: true, left: true, bottom: true, right: true },
      listeners: {
        move: (event) => {
          const columns = Math.round(event.rect.width / this.size)
          const rows = Math.round(event.rect.height / this.size)

          if (event.edges.left) this.inlineStart += this.columns - columns
          if (event.edges.right) this.inlineEnd = this.inlineStart + columns
          if (event.edges.top) this.blockStart += this.rows - rows
          if (event.edges.bottom) this.blockEnd = this.blockStart + rows

          this.inlineStart = Math.max(1, this.inlineStart)
          this.inlineEnd = Math.min(this.page.numberGetters.columns, this.inlineEnd)

          this.blockStart = Math.max(1, this.blockStart)
          this.blockEnd = Math.min(this.page.numberGetters.rows, this.blockEnd)

          this.apply()
        }
      }
    })
  }

  apply () {
    this.setAttribute('style', `
      --src: url(${this.stringGetters.src});
      --inline-start: ${this.inlineStart};
      --inline-end: ${this.inlineEnd};
      --block-start: ${this.blockStart};
      --block-end: ${this.blockEnd};
    `)

    this.setAttribute('position', `${this.inlineStart}-${this.inlineEnd}/${this.blockStart}-${this.blockEnd}`)
  }

}

customElements.define('comic-frame', Frame)