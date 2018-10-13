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
