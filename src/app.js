'use strict'

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------ */
  /* TABLES */
  /* ------------------------------------------------------ */

  const generateTable = (table, data) => {
    // Table body
    data.forEach(item => {
      const row = table.insertRow()
      // For each key of the row object
      for (const key in item) {
        const cell = row.insertCell()
        const text = document.createTextNode(item[key])
        cell.appendChild(text)
      }
    })
    // Table head
    if (!table.tHead) {
      const thead = table.createTHead()
      const row = thead.insertRow()
      // For each key of the first row object
      Object.keys(data[0]).forEach(item => {
        const th = document.createElement('th')
        const text = document.createTextNode(item)
        th.appendChild(text)
        row.appendChild(th)
      })
    }
  }

  /* ------------------------------------------------------ */
  /* CONTENT PARSING */
  /* ------------------------------------------------------ */

  // To check how RegEx work paste them into https://regex101.com/
  // (?=...) positive lookahead
  // (?<=...) positive lookbehind
  // (?<!...) negative lookbehind
  // *? lazy quantifier
  // [\s\S] all characters - 's' flag equivalent

  const regex = {
    gdo: /^(?:[RPOZ]\s){1,2}\d{6}\w\s\w{3}\s\d{2}/m,
    from: /(?<=^FM\s)[\s\S]*?(?=\r?\nTO)/m,
    to: /(?<=^TO\s)[\s\S]*?(?=\r?\nINFO)/m,
    info: /(?<=^INFO\s)[\s\S]*?(?=\r?\n(?:BT|R I S E R V A T O|NON CLASSIFICATO)$)/m,
    classifica: /.+(?=\r?\nSIC\s\S{3,})/m,
    sic: /(?<=^SIC\s)\S{3,}/m,
    protocollo: /(?<=^SIC\s\S{3,}\r?\n).+/m,
    exer: /(?<=^EXER\/)[\s\S]*?(?=\/*$)/m,
    oper: /(?<=^OPER\/)[\s\S]*?(?=\/*$)/m,
    mtfId: /(?<=^MSGID\/)[^\/]+/m,
    origine: /(?<=^MSGID\/[^\/]+\/)[^\/]+/m,
    nSeriale: /(?<=^MSGID\/(?:[^\/]+\/){2})[^\/]+/m,
    ref: /(?<=^REF\/)[\s\S]*?(?=\r?\nLIMOP\/)/m,
    limOp: /(?<=^LIMOP\/)[^\/]+/m,
    serv: /(?<=^SERV\/)[^\/]+/m,
    nProgr: /(?<=^SERV\/[^\/]+\/)[^\/]+/m,
    turno: /(?<=^SERV\/(?:[^\/]+\/){2})[^\/]+/m,
    impattoServ: /(?<=^SERV\/(?:[^\/]+\/){3})[^\/]+/m,
    gdoEvento: /(?<=^SERV\/(?:[^\/]+\/){4})[^\/]+/m,
    tipoEvento: /(?<=^SERV\/(?:[^\/]+\/){5})[^\/]+/m,
    siglaEC: /(?<=^AVARIA\/)[^\/]+/m,
    posizioneEC: /(?<=^AVARIA\/[^\/]+\/)[^\/]*/m,
    nomeEC: /(?<=^AVARIA\/(?:[^\/]*\/){2}(?:\r?\n)?)[^\r\n\/]+/m,
    funzionamEC: /(?<=^AVARIA\/(?:[^\/]+\/){3}(?:\r?\n)?)[^\r\n\/]+/m,
    eS: /(?<=\r?\n)\s*AMP\/DENOMINAZIONE E\.S\.:[\s\S]*?(?=\r?\n\s*AMP\/SINTOMATOLOGIA:)/m,
    sintomi: /(?<=^\s*AMP\/SINTOMATOLOGIA:\r?\n)[\s\S]*?(?=\/*\r?\nRIPAR\/)/m,
    luogoRipar: /(?<=^RIPAR\/)[^\/]+/m,
    gdoRipar: /(?<=^RIPAR\/[^\/]+\/)[^\/]+/m,
    enteRipar: /(?<=^RIPAR\/(?:[^\/]+\/){2})[^\/]+/m,
    gdoRiparDa: /(?<=^\s*AMP\/GDO DA: )\d{6}\w{4}\d{2}/m,
    gdoRiparA:
      /(?<=^\s*AMP\/GDO DA: \d{6}\w{4}\d{2} A: )\d{6}\w{4}\d{2}(?=\+$)/m,
    listaDP: /(?<=^\s*LDP: ).+(?=\+$)/m,
    monografia: /(?<=^\s*MONOGRAFIA: ).+(?=\+$)/m,
    pdrPrev: /^PDRPREV\/[\s\S]*?(?=\r?\n(?:PDRUTIL|VAREFF)\/)/m,
    pdrUtil: /^PDRUTIL\/[\s\S]*?(?=\r?\nVAREFF\/)/m,
    varEff: /(?<=^VAREFF\/).*?(?=\/*$)/m,
    effetti:
      /(?<=^RMKS\/DESCRIZIONE EFFETTI AVARIA:\r?\n)[\s\S]*?(?=\+?\/*\r?\n(?:NATURA E CAUSA AVARIA:$|\s*DENOMINAZIONE (?:EC|ES):\s|COMMENTI:$|SIGA\/))/m,
    natura:
      /(?<=^NATURA E CAUSA AVARIA:\r?\n)[\s\S]*?(?=\+?\/*\r?\n(?:\s*DENOMINAZIONE (?:EC|ES):\s|COMMENTI:$|SIGA\/))/m,
    eCRiparato:
      /(?<=\r?\n)\s*DENOMINAZIONE EC:\s[\s\S]*?(?=\+?\/*\r?\n(?:\s*DENOMINAZIONE ES:\s|COMMENTI:$|SIGA\/))/m,
    eSRiparati:
      /(?<=\r?\n)\s*DENOMINAZIONE ES:\s[\s\S]*?(?=\r?\n(?:COMMENTI:$|SIGA\/))/m,
    commenti: /(?<=^COMMENTI:\r?\n)[\s\S]*?(?=\/*\r?\nSIGA\/)/m,
    siga: /(?<=^SIGA\/)[\s\S]*?(?=\/{2}\r?\n)/m,
    geva: /(?<=^GEVA\/).*?(?=\/*\r?\nP\.D\.C\.:\s)/m,
    pdc: /(?<=^P\.D\.C\.:\s)[\s\S]*?(?=\/*\r?\n)/m,
    distruzione: /(?<=^DISTRUZIONE\/|^DISTRUGGERE IL ).*?(?=\/*\r?\n)/m,
    declassifica: /^DECLASSIFICARE\s.*?(?=\/*\r?\n)/m,
  }

  // Additional regex to:
  // - check message text format id
  // - discard 'FM SISTEMA DI GESTIONE' part
  // - discard '############### SECTION X OF Y ###############'
  const auxRgx = {
    mtfId: /^MSGID\/AVREP\s/m,
    split: new RegExp(
      `^FM SISTEMA DI GESTIONE[\\s\\S]*?(?=${regex.gdo
        .toString()
        .replace(/(?<!\\)\/(?:\w*$)?/g, '')}$)`,
      'm'
    ),
    delim: /^#+(?: FINAL)? SECTION(?: \w+)? OF \w+ #+\r?\n/gm,
  }

  // (RegExp, string) => matched substring || null
  const matchRegex = (re, msg) => (re.test(msg) ? re.exec(msg)[0] : null)

  // (string) => object of matched substrings
  const parse = msg => {
    let msgRev = auxRgx.split.test(msg) ? msg.split(auxRgx.split)[1] : msg
    if (auxRgx.delim.test(msgRev)) msgRev = msgRev.replace(auxRgx.delim, '')
    const record = {}
    for (const key in regex) record[key] = matchRegex(regex[key], msgRev)
    return record
  }

  /* ------------------------------------------------------ */
  /* TXT INPUT */
  /* ------------------------------------------------------ */

  let imported
  const importTable = document.getElementById('import__table')
  const fileUploader = document.getElementById('file-uploader')

  // Fires when files have been uploaded
  fileUploader.addEventListener('change', ev => {
    imported = []
    const files = Array.from(ev.target.files)
    files.forEach((item, idx, array) => {
      const reader = new FileReader()
      reader.readAsText(item, 'UTF-8')
      // Fires when file have been read
      reader.addEventListener('load', ev => {
        const msg = ev.target.result
        if (auxRgx.mtfId.test(msg)) imported.push(parse(msg))
        // If last item of the array
        if (idx === array.length - 1) {
          importTable.innerHTML = ''
          generateTable(importTable, imported)
        }
      })
    })
  })

  /* ------------------------------------------------------ */
  /* DATABASE INITIALIZATION */
  /* ------------------------------------------------------ */

  let db

  // Open database 'restore' version 1
  let request = window.indexedDB.open('restore', 1)

  request.onerror = function () {
    console.log('Database failed to open')
  }

  request.onsuccess = function () {
    console.log('Database opened successfully')
    db = request.result
    displayData()
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

  /* ------------------------------------------------------ */
  /* DATABASE MANIPULATION */
  /* ------------------------------------------------------ */

  // Data insertion
  const serv = document.querySelector('#serv')
  const nSeriale = document.querySelector('#nSeriale')
  const tipo = document.querySelector('#tipo')
  const nProgr = document.querySelector('#nProgr')
  const prior = document.querySelector('#prior')
  const from = document.querySelector('#from')
  const to = document.querySelector('#to')
  const info = document.querySelector('#info')
  const nomeEC = document.querySelector('#nomeEC')

  const compiledForm = document.querySelector('#compiledForm')
  const importForm = document.querySelector('#importForm')

  const addData = ev => {
    ev.preventDefault()
    let newItem = {
      //id: serv.value + nSeriale.value + tipo.value + nProgr.value,
      serv: serv.value,
      nSeriale: +nSeriale.value,
      tipo: tipo.value,
      nProgr: +nProgr.value,
      prior: prior.value,
      from: from.value,
      to: to.value,
      info: info.value,
      nomeEC: nomeEC.value,
    }

    let transaction = db.transaction(['compiled'], 'readwrite')
    let objectStore = transaction.objectStore('compiled')
    let request = objectStore.add(newItem)

    request.onsuccess = () => {
      //serv.value = ''
      nSeriale.value++
      //tipo.value = ''
      //nProgr.value = ''
      //prior.value = ''
      //from.value = ''
      //to.value = ''
      //info.value = ''
      //nomeEC.value = ''
    }

    transaction.oncomplete = () => {
      displayData()
      console.log('Transaction completed on the database')
    }

    transaction.onerror = () => {
      console.log('Transaction not completed, error!')
    }
  }

  const addImportedData = ev => {
    ev.preventDefault()

    if (imported.length > 0) {
      imported.forEach(item => {
        let transaction = db.transaction(['imported'], 'readwrite')
        let objectStore = transaction.objectStore('imported')
        let request = objectStore.add(item)

        request.onsuccess = () => {}

        transaction.oncomplete = () => {
          importTable.innerHTML = ''
          console.log('Transaction completed on the database')
        }

        transaction.onerror = () => {
          console.log('Transaction not completed, error!')
        }
      })
    }
  }

  const searchTable = document.querySelector('#search__table')

  const displayData = () => {
    const compiled = []
    let objectStore = db.transaction(['compiled']).objectStore('compiled')

    objectStore.openCursor(IDBKeyRange.upper, 'prev').onsuccess = e => {
      let cursor = e.target.result

      if (cursor) {
        compiled.push(cursor.value)
        if (cursor.key === 1) {
          searchTable.innerHTML = ''
          generateTable(searchTable, compiled)
        }
        cursor.continue()
      }
    }
  }

  compiledForm.onsubmit = addData
  importForm.onsubmit = addImportedData

  /* ------------------------------------------------------ */
  /* VIEW SELECTION */
  /* ------------------------------------------------------ */

  const wall = document.querySelector('.wall')
  const loginForm = document.querySelector('#login')
  const nav = document.querySelector('nav')
  const navBtn = document.querySelectorAll('.nav__btn')
  const views = document.querySelectorAll('.view')

  // THIS IS NOT A TRUE LOGIN FORM!
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

  /* ------------------------------------------------------ */
  /* PAGE UNLOAD */
  /* ------------------------------------------------------ */

  window.addEventListener('beforeunload', ev => {
    // Cancel the event as stated by the standard
    ev.preventDefault()
    // Chrome requires returnValue to be set
    ev.returnValue = ''
  })
})
