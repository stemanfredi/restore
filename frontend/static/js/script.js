'use strict'

import Ricerca from './views/Ricerca.js'
import Compila from './views/Compila.js'
import Importa from './views/Importa.js'
import Esporta from './views/Esporta.js'

const router = async () => {
  const routes = [
    { path: '/', view: Ricerca },
    { path: '/compila', view: Compila },
    { path: '/importa', view: Importa },
    { path: '/esporta', view: Esporta },
  ]

  // Test each route for potential match
  const potentialMatches = routes.map(route => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    }
  })

  let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch)

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    }
  }

  const view = new match.route.view()

  await view.show()
}

const navigateTo = url => {
  history.pushState(null, null, url)
  router()
}

// Take into account going back in history
window.addEventListener('popstate', router)

// Call the router
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault()
      navigateTo(e.target.href)
    }
  })
  router()
})
