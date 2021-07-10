import AbstractView from './AbstractView.js'

export default class extends AbstractView {
  constructor() {
    super()
    this.setTitle('Compila')
  }

  async show() {
    document.querySelector('#section-ricerca').style.display = 'none'
    document.querySelector('#section-compila').style.display = 'block'
    document.querySelector('#section-importa').style.display = 'none'
    document.querySelector('#section-esporta').style.display = 'none'
  }
}
