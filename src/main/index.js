import { app, BrowserWindow, autoUpdater } from 'electron'
const path = require('path')
const fs = require('fs')

// Specify flash path, supposing it is placed in the same directory with main.js.
// Set Flash plugin switches
const pluginDir = process.env.PROD
  ? path.join(process.resourcesPath, 'PepperFlash')
  : path.resolve(
    __dirname,
    '../main',
    'ppapi-flash-plugin',
    process.platform,
    process.arch
  )

const pluginName = {
  win32: 'pepflashplayer.dll',
  darwin: 'PepperFlashPlayer.plugin',
  linux: 'libpepflashplayer.so'
}

app.commandLine.appendSwitch(
  'ppapi-flash-path',
  path.join(pluginDir, pluginName[process.platform])
)
app.commandLine.appendSwitch(
  'ppapi-flash-version',
  JSON.parse(fs.readFileSync(path.join(pluginDir, 'manifest.json'))).version
)

var flashTrust = require('nw-flash-trust')

// appName could be any globally unique string containing only
// big and small letters, numbers and chars "-._"
// It specifies name of file where trusted paths will be stored.
// Best practice is to feed it with "name" value from your package.json file.
var appName = 'myApp'

// Initialization and parsing config file for given appName (if already exists).
var trustManager = flashTrust.initSync(appName)

// adds given filepath to trusted locations

// whole folders are also allowed
trustManager.add(path.resolve('./static', 'RtmpStreamer.swf'))

// returns true or false whether given path is trusted or not
var isTrusted = trustManager.isTrusted(path.resolve('./static', 'RtmpStreamer.swf'))

// returns array containing all trusted paths
var list = trustManager.list()
console.log('list', list, isTrusted, path.resolve('./static', 'RtmpStreamer.swf'))

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
// const winURL = process.env.NODE_ENV === 'development'
//   ? `http://localhost:9080`
//   : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 720,
    useContentSize: true,
    resizable: true,
    width: 1280,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      worldSafeExecuteJavaScript: true,
      nodeIntegration: false,
      allowRunningInsecureContent: true,
      webSecurity: false,
      webviewTag: true,
      plugins: true
    }
  })
  mainWindow.loadURL('https://t.weixue100.com')
  console.log(process.versions.chrome)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
const server = 'https://vercel.com/luanluanxu/chrome-flash/7NXj8gysYkAyLShZKKJpbxD5vDJv'
const feed = `${server}/update/${process.platform}/${app.getVersion()}`

autoUpdater.setFeedURL(feed)

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
