'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const wall = document.querySelector('.wall')
  const loginForm = document.querySelector('#login')
  const nav = document.querySelector('.nav')
  const viewRicerca = document.querySelector('#view--ricerca')
  const viewCompila = document.querySelector('#view--compila')
  const viewImporta = document.querySelector('#view--importa')
  const viewEsporta = document.querySelector('#view--esporta')

  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value

    if (username && username === password) {
      wall.classList.add('view--hidden')
      nav.classList.remove('view--hidden')
      viewRicerca.classList.remove('view--hidden')
    } else {
      alert('Accesso negato')
    }
  })

  document.querySelector('#link--ricerca').addEventListener('click', e => {
    e.preventDefault()
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('view--hidden')
    })
    viewRicerca.classList.remove('view--hidden')
  })

  document.querySelector('#link--compila').addEventListener('click', e => {
    e.preventDefault()
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('view--hidden')
    })
    viewCompila.classList.remove('view--hidden')
  })

  document.querySelector('#link--importa').addEventListener('click', e => {
    e.preventDefault()
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('view--hidden')
    })
    viewImporta.classList.remove('view--hidden')
  })

  document.querySelector('#link--esporta').addEventListener('click', e => {
    e.preventDefault()
    document.querySelectorAll('.view').forEach(view => {
      view.classList.add('view--hidden')
    })
    viewEsporta.classList.remove('view--hidden')
  })
})

// Ask for confirmation to exit ro reload the page
window.addEventListener('beforeunload', e => {
  // Cancel the event as stated by the standard.
  e.preventDefault()
  // Chrome requires returnValue to be set.
  e.returnValue = ''
})
