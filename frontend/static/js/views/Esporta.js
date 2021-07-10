import AbstractView from './AbstractView.js'

export default class extends AbstractView {
  constructor() {
    super()
    this.setTitle('Esporta')
  }

  async show() {
    document.querySelector('#section-ricerca').style.display = 'none'
    document.querySelector('#section-compila').style.display = 'none'
    document.querySelector('#section-importa').style.display = 'none'
    document.querySelector('#section-esporta').style.display = 'block'
  }
}
