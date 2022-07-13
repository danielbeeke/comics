export class Base extends HTMLElement {

  numberGetters: { [index: string]: number } = {}
  stringGetters: { [index: string]: string } = {}

  numberAttributes = []
  stringAttributes = []
  
  getNumber (attribute: string) {
    return parseInt(this.attributes.getNamedItem(attribute).value)
  }

  getString (attribute: string) {
    return this.attributes.getNamedItem(attribute).value
  }
  
  async init () {
    for (const attribute of this.numberAttributes) {
      Object.defineProperty(this.numberGetters, attribute, {
        get: () => this.getNumber(attribute)
      })
    }

    for (const attribute of this.stringAttributes) {
      Object.defineProperty(this.stringGetters, attribute, {
        get: () => this.getString(attribute)
      })
    }
  }

}