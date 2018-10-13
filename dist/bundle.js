const storeKey = "_store:"

_runtime = {}

const initStore = () => {
  if(!localStorage.getItem(storeKey)) {
    localStorage.setItem(storeKey, JSON.stringify({}))
  }
}

initStore()

const getStore = () => JSON.parse(localStorage.getItem(storeKey))
const setStore = (parsedStore) => localStorage.setItem(storeKey, JSON.stringify(parsedStore))

// TODO: cache store
// no need to get and fetch each time frome localStore, just fetch once
// on app dying save
_runtime.set = (key, value) => {
  let store = getStore()
  store[key] = value
  setStore(store)
}

_runtime.get = (key) => getStore()[key]

window.addEventListener("load", () => {
  _runtime.components = document.getElementById("components")
})

_runtime.addComponent = (componentObj) => {
  const component = document.createElement('div')
  component.innerHTML = componentObj.view
  _runtime.components.appendChild(component)
  return component.innerHTML
}

_runtime.api = (method,  url,  body, headers) => {
  let httpRequest = getHttpRequest()

  if(method == "GET") {
    url = `${url}?${queryParam(body)}`

    httpRequest.open(method, url, true)
    if(headers) {
      Object.keys(headers).forEach(header => {
        httpRequest.setRequestHeader(header, headers[header])
      })
    }
    httpRequest.send()
  } else if (method == "POST") {

    // TODO: implement POST
  } else {
    throw new Error ("Invalid method")
  }

  return {
    then: (cb) => {
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if(httpRequest.status === 200) {
              cb(httpRequest.responseText)
            } else {
              cb({error: true, status: httpRequest.status})
            }
          }
        } catch(e) {
          console.error(e)
          throw new Error("Error ", e.description)
        }
      }

    }
  }
}

// TODO: do with reduce
// TODO: do with Map to guarantee order
const queryParam = (obj) => {
  let val = ""
  let keys = Object.keys(obj)
    keys.map((key, i) => val += `${key}=${obj[key]}${i !== (keys.length - 1) ? "&" : ""}`)
  return val
}

const getHttpRequest = () => {
  let httpRequest
  if(window.XMLHttpRequest) {
    httpRequest = new XMLHttpRequest()
  } else {
    httpRequest = new ActiveXObject('Microsoft.XMLHTTP')
  }
  return httpRequest
}

_runtime.on = (eventName, cb) => {
  // not stored in localstorage as function stringified won't work
  // might shift from this is storage.sync supports it
  const storedEventName = "event_" + eventName

  _runtime.fnMap = _runtime.fnMap || new Map()

  const eventHandlers = _runtime.fnMap.get(storedEventName) || []

  _runtime.fnMap.set(storedEventName, eventHandlers.concat(cb))
}

// null check
_runtime.trigger = (eventName, value) => _runtime.fnMap.get("event_" + eventName).map(cb => cb({value}))
_runtime.set("config",
  {
    rescueTime: {
      dailySummary: "https://cors-anywhere.herokuapp.com/https://rescuetime.com/anapi/daily_summary_feed"
    }
  }
)
const createSvgElem = (elem, props, endTag) => {
  let elemProps = Object.keys(props).reduce((acc, prop) => `${acc} ${prop}="${props[prop]}"`, "")
  return `<${elem}${elemProps} ${!endTag?'/':''}>\n`
}

const hasChildren = (elemNode) => elemNode.children && elemNode.children.length

const svgDom = (svg) => {
  let finalNode = ''

  finalNode += createSvgElem(svg.type, svg.props, hasChildren(svg))

  if(hasChildren(svg)) {
    finalNode += `${svg.children.map(svgDom).join("")}</${svg.type}>`
  }

  return finalNode
}

const svg = (type, props, children) => children? {type, props, children} : {type, props}
function displayFire() {
  const fire = document.querySelector(".fire")
  Array.from(Array(50).keys()).forEach((i) => {
    const fireParticle = document.createElement("div")
    fireParticle.className = "particle"
    fire.appendChild(fireParticle)
  })
}

function displayDaysLeft() {
  const daysLabel = document.querySelector(".promignis-days")
  const deadlineT = new Date("January 1, 2019 00:01:00")
  const currentT = new Date(Date.now())
  daysLabel.innerHTML = dateDiffInDays(currentT, deadlineT)
}

function dateDiffInDays(a, b) {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds())
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds(), b.getMilliseconds())
  return Math.floor((utcB - utcA) / (1000 * 60 * 60 * 24))
}

function displayQuote() {
  fetch("http://quotes.rest/qod.json?category=inspire")
    .then(function (response) {
      if (response.ok) {
        response.json().then((resp) => {
          if (!resp.success) return
          const quotesLabel = document.querySelector(".quote-text")
          const sourceLabel = document.querySelector(".quote-source")
          quotesLabel.innerText = resp.contents.quotes[0].quote
          sourceLabel.innerText = "- " + resp.contents.quotes[0].author
        })
      } else {
        throw new Error("Could not reach the API: " + response.statusText);
      }
    })
    .catch(function (er) {
      console.warn("unknown response " + er)
    })
}

function updateState(state) {
  const quoteDiv = document.querySelector(".quote")
  const promignisDiv = document.querySelector(".promignis")
  let visibleSide = quoteDiv
  let hiddenSide = promignisDiv
  if (state == "quote") {
    visibleSide = quoteDiv
    hiddenSide = promignisDiv
  } else {
    visibleSide = promignisDiv
    hiddenSide = quoteDiv
  }
  visibleSide.style.display = "block"
  hiddenSide.style.display = "none"
  localStorage.setItem("state", state)
}

function init() {
  //show fire
  displayFire()

  //show quote
  displayQuote()

  //show days
  displayDaysLeft()

  //get previous state
  const checkbox = document.querySelector("#myonoffswitch")
  let state = localStorage.getItem("state") || "quote"
  if (state == "quote") {
    checkbox.checked = false
  }
  updateState(state)
  checkbox.addEventListener("change", (ev) => {
    state = checkbox.checked ? "promignis" : "quote"
    updateState(state)
  })
}

window.addEventListener("load", () => {
  init()
})
const daysInWeek = 7
const primaryColor = "#eee123"

const genBackground = (cx, cy, n, factor) => {
  const circles = Array(n).fill(0).map((a, i) =>
    svg("circle", {cx, cy, r: i * factor, stroke: primaryColor, fill: "none", "stroke-width": 4, "stroke-opacity": 0.5}))

  let point;
  const lines = Array(daysInWeek).fill(0).map((a, i) => {
    point = getPoint(n * factor, daysInWeek, (i + 1))
    return svg("path", {stroke: "#eee123", "stroke-width": 4, "stroke-opacity": 0.5, fill: "none", d: `M ${cx},${cy}, L ${cx+point.x},${cy+point.y}`})
  })
  return circles.concat(lines)
}

const getPoint = (r, n, i) => {
  const theta = (2 * Math.PI)/n
  return {x: r * Math.cos(theta * i), y: r * Math.sin(theta * i)}
}

const genDataPoints = (data, max) => {
  const endPoints = Array(daysInWeek).fill(0).map((a, i) => getPoint(max, daysInWeek, (i+1))),
        pathProps = {stroke: primaryColor, "stroke-width": 0.8, fill: "#eee111", d: '', opacity: 0.4}
  pathProps.d += Array(daysInWeek).fill(0).map((a, i) => {
    const mulFactor = (data[i].productivity/100),
          letter = i == 0 ? "M" : "L"
    endPoints[i].x *= mulFactor
    endPoints[i].y *= mulFactor
    return `${letter} ${max + parseInt(endPoints[i].x.toFixed(2))},${max + parseInt(endPoints[i].y.toFixed(2))}`
  }).join(" ")
  pathProps.d+=" Z"
  return [svg("path", pathProps)]
}

const svgD = (data) => {
  const factor = 40,
        n = 6,
        max = 6*40
  return svgDom(
  svg("svg", {viewBox: "0 0 500 500"},
    genBackground(max, max, n, factor).concat(genDataPoints(data, max))
  ))
}

_runtime.on("rescueTime_api_result", (eventData) => {
  _runtime.addComponent({view: svgD(eventData.value)})
})
const apiKeyView = {view:`<input placeholder='rescuetime api key' id="apiKey" /><button id="fetchBtn">fetch</button>`},
      rescueTimeKey = "rescuetime_apikey"

const getDay = (dateStr) => {
  const dateArr = dateStr.split("-"),
        year = dateArr[0],
        month = dateArr[1],
        day = dateArr[2],
        date = new Date(year, month, day)

  const dayMap = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday"
  }

  return dayMap[date.getDay()]
}

const rescueTimeFlow = (apiKey) => {
  const config = _runtime.get("config")
  const headers = {}
  headers["Access-Control-Allow-Headers"] = "*"
  headers["Content-Type"] = "application/json"
  if(apiKey) {
      _runtime.set(rescueTimeKey, apiKey)
      _runtime.api("GET", config.rescueTime.dailySummary, {key: apiKey}, headers).then(apiResp => {
        if(!apiResp.error) {
          const dailySummaries = JSON.parse(apiResp)
          const drawingData = dailySummaries.map(dailySummary => {return {productivity: dailySummary.productivity_pulse, day: getDay(dailySummary.date)}})
          _runtime.trigger("rescueTime_api_result", drawingData)
        }
      })
  } else {
    throw new Error("Invalid Api Key")
  }
}

const run = () => {
  if(!_runtime.get(rescueTimeKey)) {
    _runtime.addComponent(apiKeyView)
    document.getElementById("fetchBtn").addEventListener("click", (event) => {
      rescueTimeFlow(document.getElementById("apiKey").value)
    })
  } else {
    return rescueTimeFlow(_runtime.get(rescueTimeKey))
  }

}

window.addEventListener("load", () => {
  run()
})
