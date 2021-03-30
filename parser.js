'use strict'

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
  info: /(?<=^INFO\s)[\s\S]*?(?=\r?\nBT$)/m,
  classifica: /(?<=^BT\r?\n).+/m,
  sic: /(?<=^SIC\s).+/m,
  protocollo: /(?<=^SIC\s.{3,}\r?\n).+/m,
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
  gdoRiparA: /(?<=^\s*AMP\/GDO DA: \d{6}\w{4}\d{2} A: )\d{6}\w{4}\d{2}(?=\+$)/m,
  listaDP: /(?<=^\s*LDP: ).+(?=\+$)/m,
  monografia: /(?<=^\s*MONOGRAFIA: ).+(?=\+$)/m,
  pdrPrev: /^PDRPREV\/[\s\S]*?(?=\r?\n(?:PDRUTIL|VAREFF)\/)/m,
  pdrUtil: /^PDRUTIL\/[\s\S]*?(?=\r?\nVAREFF\/)/m,
  varEff: /(?<=^VAREFF\/).*?(?=\/*$)/m,
  effetti: /(?<=^RMKS\/DESCRIZIONE EFFETTI AVARIA:\r?\n)[\s\S]*?(?=\+?\/*\r?\n(?:NATURA E CAUSA AVARIA:$|\s*DENOMINAZIONE (?:EC|ES):\s|COMMENTI:$|SIGA\/))/m,
  natura: /(?<=^NATURA E CAUSA AVARIA:\r?\n)[\s\S]*?(?=\+?\/*\r?\n(?:\s*DENOMINAZIONE (?:EC|ES):\s|COMMENTI:$|SIGA\/))/m,
  eCRiparato: /(?<=\r?\n)\s*DENOMINAZIONE EC:\s[\s\S]*?(?=\+?\/*\r?\n(?:\s*DENOMINAZIONE ES:\s|COMMENTI:$|SIGA\/))/m,
  eSRiparati: /(?<=\r?\n)\s*DENOMINAZIONE ES:\s[\s\S]*?(?=\r?\n(?:COMMENTI:$|SIGA\/))/m,
  commenti: /(?<=^COMMENTI:\r?\n)[\s\S]*?(?=\/*\r?\nSIGA\/)/m,
  siga: /(?<=^SIGA\/)[\s\S]*?(?=\/{2}\r?\n)/m,
  geva: /(?<=^GEVA\/).*?(?=\/*\r?\nP\.D\.C\.:\s)/m,
  pdc: /(?<=^P\.D\.C\.:\s)[\s\S]*?(?=\/*\r?\n)/m,
  distruzione: /(?<=^DISTRUZIONE\/|^DISTRUGGERE IL ).*?(?=\/*\r?\n)/m,
  declassifica: /^DECLASSIFICARE .+/m,
}

// Regex to check message text format id and discard the useless first part
const auxRgx = {
  mtfId: /^MSGID\/AVREP\s/m,
  split: new RegExp(
    `^FM SISTEMA DI GESTIONE[\\s\\S]*?(?=${regex.gdo
      .toString()
      .replace(/(?<!\\)\/(?:\w*$)?/g, '')}$)`,
    'm'
  ),
}

// (RegExp, string) => matched substring || null
const matchRegex = (re, msg) => (re.test(msg) ? re.exec(msg)[0] : null)

// (string) => object of matched substrings
const parse = msg => {
  const splitMsg = auxRgx.split.test(msg) ? msg.split(auxRgx.split)[1] : msg
  const record = {}
  for (const key in regex) record[key] = matchRegex(regex[key], splitMsg)
  return record
}

// (html table element, object of row elements) => new row in table body
const generateTableBody = (table, data) => {
  const row = table.insertRow()
  for (const key in data) {
    const cell = row.insertCell()
    const text = document.createTextNode(data[key])
    cell.appendChild(text)
  }
}

// (html table element, array of column names) => table head
const generateTableHead = (table, data) => {
  const thead = table.createTHead()
  const row = thead.insertRow()
  for (const key of data) {
    const th = document.createElement('th')
    const text = document.createTextNode(key)
    th.appendChild(text)
    row.appendChild(th)
  }
}

// (object of row elements) => new row in table body,
//                             table head if called for the 1st time
const generateTable = data => {
  const table = document.querySelector('table')
  generateTableBody(table, data)
  if (!table.tHead) generateTableHead(table, Object.keys(data))
}

// Select the input
const fileUploader = document.getElementById('file-uploader')

// Create array of input files
fileUploader.addEventListener('change', event => {
  const files = Array.from(event.target.files)

  // Read content of each file
  for (const file of files) {
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')

    // Process file text and output to table
    reader.addEventListener('load', event => {
      const msg = event.target.result
      if (auxRgx.mtfId.test(msg)) generateTable(parse(msg))
    })
  }
})
