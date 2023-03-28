const { app, BrowserWindow, globalShortcut, dialog, Tray, Menu, ipcMain } = require('electron');
const windowStateKeeper = require("electron-window-state");
console.log("main process.......");
let win;

ipcMain.on("msg", (event, args) => {
    console.log("args :: ", args);
    event.reply("back-msg", "Reply from main process")
});

function createWindow() {
    const mainWindowState = windowStateKeeper({
        defaultHeight: 400,
        defaultWidth: 400,
    });
    win = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: 500,
        height: 500,
        // frame: false,    // it will remove titlebar. (we will be unable to move app or close app)
        backgroundColor: '#ff0000', // it will set background colour,
        // alwaysOnTop: true,  // it will stay always on top of the window. Like it will hover on all the apps. we can not hide our app by put any other app on this.
        title: "amazing title", // it will set title of the app
        resizable: false,   // we gets unable to resize the app window
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
    mainWindowState.manage(win);

    let newTray = new Tray('phone.png');    // phone.png is icon
    newTray.setToolTip("Hey buddy!");       // when we hover the icon, this text will be shown ("Hey buddy!")
    // when we click on icon, if our app will minimized then it will be shown, and if it is shown on top then it will be minimized
    newTray.on("click", () => {
        win.isVisible() ? win.hide() : win.show();
    });

    let template = [{label: "item 1", type: "radio"}, {label: "item 2", type: "checkbox"}, {label: "Minimize", role: "minimize"}];
    let newContext = Menu.buildFromTemplate(template);
    newTray.setContextMenu(newContext);



    let mainMenuTemplate = [
        {
            label: "Blog",
            submenu: [{label: "New"}, {label: "Save As"}]
        },
        {label: "Format"},
        {
            label: "Options",
            submenu: [{role: "quit", label: "Quit"}]    // here {role: quit} is inbuilt method, so if we click on quit option then it will quit the application 
        }
    ];
    let mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);


    let wc = win.webContents;

    wc.on("before-input-event", () => {
        console.warn("before-input-event fired");
    });

    wc.on("context-menu", () => {
        newContext.popup();
    })
    win.webContents.openDevTools();

    globalShortcut.register('Shift+K', () => {
        console.warn("shift + k pressed");
        win.loadFile("child.html")
    });
}

app.on('ready', () => {
    createWindow();
});

// we can accecc event object (e) on this event call
app.on('before-quit', (e) => {
    console.warn("before-quit fired :: ");
    // e.preventDefault(); // this will not allow application to get quit. because before app quit, this will set it's state to default.
});
