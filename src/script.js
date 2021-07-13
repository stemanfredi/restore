'use strict'

document.addEventListener('DOMContentLoaded', () => {
  
  const wall = document.querySelector('.wall')
  const loginForm = document.querySelector('#login')
  const nav = document.querySelector('nav')
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

  // Navigation links behaviour
  nav.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault()
      // Get selected view from clicked link
      const selectedView = e.target.getAttribute('data-link')     
      // Show only selected view
      views.forEach(item => {
        if (item.id === selectedView) {
          item.classList.remove('hidden')
        } else {
          item.classList.add('hidden')
        }
      })
    }
  })  
})

// Ask for confirmation to exit ro reload the page
window.addEventListener('beforeunload', e => {
  // Cancel the event as stated by the standard.
  e.preventDefault()
  // Chrome requires returnValue to be set.
  e.returnValue = ''
})
