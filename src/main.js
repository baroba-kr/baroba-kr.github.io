// load electron-reloader - 개발용(빌드시주석처리)
// try { require('electron-reloader')(module); } catch (err) {}

// load electron 
const { app, BrowserWindow } = require('electron');

// 윈도우 객체를 전역에 유지합니다. 만약 이렇게 하지 않으면
// 자바스크립트 GC가 일어날 때 창이 멋대로 닫혀버립니다.
let win;

function createWindow () {
  // 새로운 브라우저 창을 생성합니다. - 개발용(빌드시주석처리)
  // win = new BrowserWindow({ width: 800, height: 600, resizable: true, nodeIntegration:false, title: 'BAROBA', icon: __dirname + '/icon.ico', alwaysOnTop:true});
  // 빌드용(개발시주석처리)
  switch (process.platform) {
    case 'darwin':
      win = new BrowserWindow({ width: 800, height: 600, resizable: true, nodeIntegration:false, title: 'BAROBA', icon: __dirname + '/icon/favicon.icns',webPreferences: {webSecurity: false}});
      break;
    case 'win32':
      win = new BrowserWindow({ width: 800, height: 600, resizable: true, nodeIntegration:false, title: 'BAROBA', icon: __dirname + '/icon/favicon.ico',webPreferences: {webSecurity: false}, alwaysOnTop:true});
      break;
    case 'linux':
      win = new BrowserWindow({ width: 800, height: 600, resizable: true, nodeIntegration:false, title: 'BAROBA', icon: __dirname + '/icon/favicon.ico',webPreferences: {webSecurity: false}});
      break;
  } 

  // popup block
  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
  });

  // Open the DevTools. - 개발용(빌드시주석처리)
  // win.webContents.openDevTools();

  // 그리고 현재 디렉터리의 index.html을 로드합니다.
  win.loadFile('index.html');

  // 윈도우가 닫히면 출력됩니다.
  win.on('closed', () => {
    // 창 개체를 참조 해제합니다. 
    // 일반적으로 창을 저장합니다. 
    // 배열에서 다중 창을 지원하는 앱은 해당 요소를 삭제해야하는 시간입니다.
    win = null
  })
}

// Electron이 초기화를 완료하고 브라우저 창을 만들 준비가되면이 메서드가 호출됩니다. 
// 일부 API는이 이벤트가 발생한 후에 만 사용할 수 있습니다.
app.on('ready', createWindow)

// 모든 창이 닫히면 종료합니다.
app.on('window-all-closed', () => {
  // macOS에서는 사용자가 Cmd + Q를 사용하여 명시 적으로 종료 할 때까지 응용 프로그램과 해당 메뉴 표시 줄이 활성 상태로 유지되는 것이 일반적입니다.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // MacOS에서는 독 아이콘을 클릭하고 다른 창이 열리지 않으면 앱에서 창을 다시 만드는 것이 일반적입니다.
  if (win === null) {
    createWindow()
  }
})

// 이 파일에는 나머지 앱의 특정 기본 프로세스 코드를 포함 할 수 있습니다. 
// 별도의 파일을 여기에 넣는것이 필요할 수도 있습니다.