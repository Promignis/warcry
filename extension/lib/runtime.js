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
  let httpRequest = ajax()

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

const ajax = () => {
  let httpRequest
  if(window.XMLHttpRequest) {
    httpRequest = new XMLHttpRequest()
  } else {
    httpRequest = new ActiveXObject('Microsoft.XMLHTTP')
  }
  return httpRequest
}
