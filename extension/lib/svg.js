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


