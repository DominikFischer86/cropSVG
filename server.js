import fs from "fs"
import readline from "readline"
import { registerWindow, SVG } from "@svgdotjs/svg.js"
import { createRequire } from "module"
import { stdin, stdout } from "process"

const rl = readline.createInterface({ input: stdin, output: stdout })

const require = createRequire(import.meta.url)

const importPath = "./src/assets/icons/"
const exportPathCrSVG = "./src/assets/croppedIcons/"
const exportPathSqSVG = "./src/assets/squaredIcons/"
const exportPathComponent = "./src/assets/iconComponents/"

const svgTargetHeight = "100px"
const svgTargetWidth = "100px"

async function app(){
  rl.question("Choose mode (1. Crop SVG To Square | 2. Remove Whitespace Around SVG | 3. Convert cropped SVG to TSX | 4. Exit) \n", (answer) => {
    if (answer === "1") cropSVGToSquare()
    if (answer === "2") removeWhiteSpaceFromSVG()
    if (answer === "3") convertSVGtoTSX()
    rl.close()
  })

}

function toPascalCase(string) {
  return `${string}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3}`
    )
    .replace(new RegExp(/\w/), s => s.toUpperCase());
}

const formatName = (name) => {
  return toPascalCase(name)+"Icon"
}

const templateForTypeScriptReactComponent = (fileName, content) => {
  return (`
  import SvgIcon, { Props } from 'Icons/view/components/SvgIcon';

  const ${formatName(fileName)} = (props: Omit<Props, 'children'>): React.ReactElement => (
    <SvgIcon {...props}>
      ${content}
    </SvgIcon>
  );

  export default ${formatName(fileName)};
`)}

const { createSVGWindow } = require("svgdom")
const window = createSVGWindow()
const { document } = window
registerWindow(window, document)

function cropSVGToSquare(){
  fs.readdir(importPath, (err, files) => {
    if (err) throw err

    files.forEach((file) => {
      const fileWithoutFormat = file.split(".")[0]
      fs.readFile(`${importPath}/${fileWithoutFormat}.svg`, (err, data) => {
        if (err) throw err
        const svgAsString = data.toString()
        const { x, y, width, height } = SVG(svgAsString).bbox()
        const viewBox = SVG(svgAsString).node.getAttribute("viewBox")
        const sourceString = viewBox ? /viewBox="\d* \d* \d* \d*"/ : /width="\d+.?\d*" height="\d+.?\d*"/

        const replacementString = `width='${svgTargetWidth}' height='${svgTargetHeight}' viewBox="${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)}"`
        const croppedSVG = svgAsString.replace(sourceString, replacementString)

        fs.writeFile(`${exportPathSqSVG}/${fileWithoutFormat}.svg`, croppedSVG, err => {
          if (err) throw err
          console.log(`Cropped & Squared File ${fileWithoutFormat}.svg succesfully written`);
        })
      })
    })
  })
}

function removeWhiteSpaceFromSVG(){
  fs.readdir(importPath, (err, files) => {
    if (err) throw err

    files.forEach((file) => {
      const fileWithoutFormat = file.split(".")[0]
      fs.readFile(`${importPath}/${fileWithoutFormat}.svg`, (err, data) => {
        if (err) throw err
        const svgAsString = data.toString()
        const { x, y, width, height } = SVG(svgAsString).bbox()
        const viewBox = SVG(svgAsString).node.getAttribute("viewBox")
        const sourceString = viewBox ? /viewBox="\d* \d* \d* \d*"/ : /width="\d+.?\d*" height="\d+.?\d*"/

        const replacementString = `viewBox="${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)}"`
        const croppedSVG = svgAsString.replace(sourceString, replacementString)

        fs.writeFile(`${exportPathCrSVG}/${fileWithoutFormat}.svg`, croppedSVG, err => {
          if (err) throw err
          console.log(`Cropped File ${fileWithoutFormat}.svg succesfully written`);
        })
      })
    })
  })
}


function convertSVGtoTSX(){
  fs.readdir(importPath, (err, files) => {
    if (err) throw err

    files.forEach((file) => {
      const fileWithoutFormat = file.split(".")[0]
      fs.readFile(`${importPath}/${fileWithoutFormat}.svg`, (err, data) => {
        if (err) throw err
        const svgAsString = data.toString()
        const { x, y, width, height } = SVG(svgAsString).bbox()
        const viewBox = SVG(svgAsString).node.getAttribute("viewBox")
        const sourceString = viewBox ? /viewBox="\d* \d* \d* \d*"/ : /width="\d+.?\d*" height="\d+.?\d*"/

        const replacementString = `width='{size}' height='{size}' viewBox="${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)}"`
        const croppedSVG = svgAsString.replace(sourceString, replacementString)
        const createIconComponent = templateForTypeScriptReactComponent(fileWithoutFormat, croppedSVG)

        fs.writeFile(`${exportPathComponent}/${fileWithoutFormat}.tsx`, createIconComponent, err => {
          if (err) throw err
          console.log(`File ${fileWithoutFormat}.tsx succesfully written`);
        })
      })
    })
  })
}

app()