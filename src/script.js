'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const wall = document.querySelector('.wall')
  const loginForm = document.querySelector('#login')
  const nav = document.querySelector('nav')
  const navBtn = document.querySelectorAll('.nav__btn')
  const views = document.querySelectorAll('.view')

  // Login form behaviour
  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    // Get login parameters
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value
    // Allow/deny access
    if (username && username === password) {
      wall.classList.add('hidden')
      nav.classList.remove('hidden')
      views[0].classList.remove('hidden')
    } else {
      alert('Accesso negato')
    }
  })

  // Navigation buttons behaviour
  navBtn.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault()
      // Get selected view from clicked link
      const selectedView = e.target.getAttribute('data-link')
      // Change buttons appearance
      navBtn.forEach(item => {
        if (item.getAttribute('data-link') === selectedView) {
          item.classList.add('nav__btn--selected')
        } else {
          item.classList.remove('nav__btn--selected')
        }
      })
      // Show only selected view
      views.forEach(item => {
        if (item.id === selectedView) {
          item.classList.remove('hidden')
        } else {
          item.classList.add('hidden')
        }
      })
    })
  })

  // DATABASE OPERATION
  let db

  const serv = document.querySelector('#serv')
  const nSeriale = document.querySelector('#nSeriale')
  const tipo = document.querySelector('#tipo')
  const nProgr = document.querySelector('#nProgr')
  const prior = document.querySelector('#prior')
  const from = document.querySelector('#from')
  const to = document.querySelector('#to')
  const info = document.querySelector('#info')
  const nomeEC = document.querySelector('#nomeEC')

  const reportForm = document.querySelector('#reportForm')

  let request = window.indexedDB.open('restore', 1)

  request.onerror = function () {
    console.log('Database failed to open')
  }

  request.onsuccess = function () {
    console.log('Database opened successfully')
    db = request.result
  }

  request.onupgradeneeded = function (e) {
    let db = e.target.result
    let objectStore = db.createObjectStore('reports', {
      keyPath: 'id',
      autoIncrement: true,
    })

    //objectStore.createIndex('id', 'id', { unique: false })

    console.log('Database setup complete')
  }

  function addData(e) {
    e.preventDefault()
    let newItem = {
      id: serv.value + nSeriale.value + tipo.value + nProgr.value,
      serv: serv.value,
      nSeriale: nSeriale.value,
      tipo: tipo.value,
      nProgr: nProgr.value,
      prior: prior.value,
      from: from.value,
      to: to.value,
      info: info.value,
      nomeEC: nomeEC.value,
    }

    console.log(newItem)

    let transaction = db.transaction(['reports'], 'readwrite')
    let objectStore = transaction.objectStore('reports')
    let request = objectStore.add(newItem)

    request.onsuccess = () => {
      //serv.value = ''
      //nSeriale.value++
      //tipo.value = ''
      //nProgr.value = ''
      //prior.value = ''
      //from.value = ''
      //to.value = ''
      //info.value = ''
      //nomeEC.value = ''
    }

    transaction.oncomplete = () => {
      console.log('Transaction completed on the database')
    }

    transaction.onerror = () => {
      console.log('Transaction not completed, error!')
    }
  }

  reportForm.onsubmit = addData
})

// Ask for confirmation to exit ro reload the page
window.addEventListener('beforeunload', e => {
  // Cancel the event as stated by the standard.
  e.preventDefault()
  // Chrome requires returnValue to be set.
  e.returnValue = ''
})
