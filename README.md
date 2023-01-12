# cropSVG
Small helper to crop SVGs to perfect square and to compile a TSX React component

## Install
- `git clone https://github.com/DominikFischer86/cropSVG.git`
- `cd cropSVG`
- `npm i`

## Start
- `node server.js` (Choose Option 1,2 or 3, any other input quits the prompt)
- `npm run dev` (Starts Frontend, will have to adjust filenames and imports though)

## Modes
1. Crop SVG To Square - This removes whitespace around the paths and sets a width and height of the same value (default is 500px)
2. Remove Whitespace Around SVG - This only removes whitespace around paths and removes any width or height attributes
3. Convert cropped SVG to TSX - This works like Option 2, but it creates a TypeScript React Component as a container for the SVG. You might want to adjust the import paths (Default is `import SvgIcon, { Props } from 'Icons/view/components/SvgIcon';`)

## Troubleshooting
When .bbox() is not a function error appears, try to clean the SVG from any XML headers (needs to start as svg)
