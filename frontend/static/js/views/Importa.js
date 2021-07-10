import AbstractView from './AbstractView.js'

export default class extends AbstractView {
  constructor() {
    super()
    this.setTitle('Importa')
  }

  async show() {
    document.querySelector('#section-ricerca').style.display = 'none'
    document.querySelector('#section-compila').style.display = 'none'
    document.querySelector('#section-importa').style.display = 'block'
    document.querySelector('#section-esporta').style.display = 'none'
  }
}
