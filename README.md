# cropSVG
Small helper to crop SVGs to perfect square and to compile a TSX React component

## Install
- `git clone https://github.com/DominikFischer86/cropSVG.git`
- `cd cropSVG`
- `npm i`

## Start
- `node server.js` (Choose Option 1 or 2, any other input quits the prompt)
- `npm run dev` (Starts Frontend, will have to adjust filenames and imports though)

## Troubleshooting
When .bbox() is not a function error appears, try to clean the SVG from any XML headers (needs to start as svg)