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
