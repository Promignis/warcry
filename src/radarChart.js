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
