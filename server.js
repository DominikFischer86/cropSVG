import fs from "fs"
import readline from "readline"
import { registerWindow, SVG } from "@svgdotjs/svg.js"
import { createRequire } from "module"
import { stdin, stdout } from "process"

const rl = readline.createInterface({ input: stdin, output: stdout })
const require = createRequire(import.meta.url)

const assetRootPath = "./src/assets"
const importPath = `${assetRootPath}/icons/`
const exportPaths = [
  `${assetRootPath}/squaredIcons/`,
  `${assetRootPath}/croppedIcons/`,
  `${assetRootPath}/iconComponents/`
]

const svgTargetHeight = "500px"
const svgTargetWidth = "500px"

function app(){
  rl.question(
    `-------------\nChoose mode:\n----------------------------------\n1. Crop SVG To Square\n2. Remove Whitespace Around SVG \n3. Convert cropped SVG to TSX \n4. Exit \n----------------------------------\n`, 
    (answer) => {
    if (answer === "1" || answer === "2" || answer === "3") compileSvg(answer)
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

const templateForTypeScriptReactComponent = (fileName, content) => {
  const name = `${toPascalCase(fileName)}Icon`

  return (`import SvgIcon, { Props } from 'Icons/view/components/SvgIcon';

  const ${name} = (props: Omit<Props, 'children'>): React.ReactElement => (
    <SvgIcon {...props}>
      ${content}
    </SvgIcon>
  );

  export default ${name};`
)}

const { createSVGWindow } = require("svgdom")
const window = createSVGWindow()
const { document } = window
registerWindow(window, document)

function compileSvg(mode){
  if (!fs.existsSync(exportPaths[mode-1])) fs.mkdirSync(exportPaths[mode-1])

  fs.readdir(importPath, (err, files) => {
    if (err) throw err

    files.forEach((file) => {
      fs.readFile(`${importPath}/${file}`, (err, data) => {
        if (err) throw err
        const fileWithoutFormat = file.split(".")[0]
        const svgAsString = data.toString()
        const { x, y, width, height } = SVG(svgAsString).bbox()
        const svgItem = SVG(svgAsString).node

        svgItem.setAttribute("viewBox", `${x} ${y} ${width} ${height}`)
        if (mode === "1"){ 
          svgItem.setAttribute("width", svgTargetWidth)
          svgItem.setAttribute("height", svgTargetHeight)
        }

        if (mode !== "1"){
          svgItem.removeAttribute("width")
          svgItem.removeAttribute("height")
        }
        
        const croppedSVG = mode !== "3" ? svgItem.outerHTML : templateForTypeScriptReactComponent(fileWithoutFormat, svgItem.outerHTML.toString())
        const compiledFile = mode !== "3" ? file : `${fileWithoutFormat}.tsx`

        fs.writeFile(`${exportPaths[mode-1]}/${compiledFile}`, croppedSVG, err => {
           if (err) throw err
           if (mode === "1") console.log(`Cropped & squared file ${file} succesfully created`);
           if (mode === "2") console.log(`Cropped file ${file} succesfully created`);
           if (mode === "3") console.log(`Typescript React IconComponent ${fileWithoutFormat}.tsx succesfully created`);
        })
      })
    })
  })
}

app()