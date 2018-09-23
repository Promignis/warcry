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
      Object.keys(headers).map(header => {
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

let e = svgDom(
  svg("svg", {}, [
    svg("circle", {cx: 10, cy: 10, r: 10}),
    svg("rect", {x: 10, y: 10, width: 100, height: 100})
  ])
)

window.addEventListener("load", () => {
  _runtime.addComponent({view: e})
})

console.log(e)


const run = () => {
    const apiKeyView = {view:`<input placeholder='rescuetime api key' id="apiKey" /><button id="fetchBtn">fetch</button>`},
          rescueTimeKey = "rescuetime_apikey"


  if(!_runtime.get(rescueTimeKey)) {
    _runtime.addComponent(apiKeyView)
    document.getElementById("fetchBtn").addEventListener("click", (event) => {
      rescueTimeFlow(document.getElementById("apiKey").value)
    })
  } else {

  }

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
    if(apiKey) {
        _runtime.set(apiKey)
        _runtime.api("GET", config.rescueTime.dailySummary, {key: apiKey}, headers).then(apiResp => {
          if(!apiResp.error) {
            const dailySummaries = JSON.parse(apiResp)
            dailySummaries.map(dailySummary => {
              console.log(dailySummary.productivity_pulse, getDay(dailySummary.date))
              // getDay(dailySummary.date)
            })
          }
        })
    } else {
      throw new Error("Invalid Api Key")
    }
  }
}

window.addEventListener("load", () => {
  run()
})
