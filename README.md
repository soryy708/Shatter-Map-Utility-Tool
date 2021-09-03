# Shatter Map Utility Thing

Small utility for GTA V modders to take [CodeWalker](https://github.com/dexyfex/CodeWalker) outputted `<ShatterMap>` strings, convert them to a [BMP image](https://en.wikipedia.org/wiki/BMP_file_format), and convert [BMP images](https://en.wikipedia.org/wiki/BMP_file_format) back to `<ShatterMap>` strings.

## Prerequisites

* Download and install an LTS version of [NodeJS](https://nodejs.org/en/)

## How to run?

1. Download the contents of this repository as a ZIP
2. run `npm install` in the directory to get a `node_modules` subdirectory
3. run `npm start`

Alternatively:

1. Download one of the stable releases of Electron here: https://github.com/electron/electron/releases
2. Unpack it somewhere on your file system
3. Download the contents of this repository as a ZIP
4. Place the contents of this repository in Electron's `resources/app`
5. Run `npm install` in that directory to get a `node_modules` subdirectory
6. Start `electron.exe`
