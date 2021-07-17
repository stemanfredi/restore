'use strict'

/* ------------------------------------------------------ */
/* DATABASE INITIALIZATION */
/* ------------------------------------------------------ */

let db

document.addEventListener('DOMContentLoaded', () => {
  // Open database 'restore' version 1
  let request = window.indexedDB.open('restore', 1)

  request.onerror = function () {
    console.log('Database failed to open')
  }

  request.onsuccess = function () {
    console.log('Database opened successfully')
    db = request.result
  }

  request.onupgradeneeded = function (ev) {
    let db = ev.target.result
    /*
    let objectStore = db.createObjectStore('reports', {
      keyPath: 'id',
      autoIncrement: true,
    })
    objectStore.createIndex('id', 'id', { unique: false })
    */
    db.createObjectStore('users', { autoIncrement: true })
    db.createObjectStore('compiled', { autoIncrement: true })
    db.createObjectStore('imported', { autoIncrement: true })

    console.log('Database setup complete')
  }
})
