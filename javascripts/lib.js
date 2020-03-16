const COMMANDS = {
  paste: "editing_paste",
  copy: "editing_copy",
  open_app: "launching_openApplication",
  open_url: "launching_openURL",
  screenshot: "screen_captureScreenToClipboard",
  quit_app: "application_quit",
}

class CommandRunner {

  constructor(deviceId) {
    this.deviceId = deviceId
    this.client = new KWClient(deviceId)
  }

  openUrl(path) {
    return this.executeCommand(COMMANDS.open_url, {"path": path})
  }

  async paste() {
    return this.executeCommand(COMMANDS.paste, {})
  }

  async copy() {
    return this.executeCommand(COMMANDS.copy, {})
  }

  async screenshot() {
    return this.executeCommand(COMMANDS.screenshot, {})
  }

  async openApp(path) {
    return this.executeCommand(COMMANDS.open_app, {"path": path})
  }

  async openOSXTerminal() {
    return this.openApp("/Applications/Utilities/Terminal.app")
  }

  async quitApp() {
    return this.executeCommand(COMMANDS.quit_app, {})
  }

  async executeCommand(command, params={}) {
    console.log({
      action: "Executing command...",
      command: command,
      params: params,
    })
    return this.client.executeCommand(command, params)
  }
}

class KWClient {

  constructor(deviceId) {
    this.deviceId = deviceId;
    this.button = 8;
    this.baseUrl = "http://localhost:9090"
  }

  async getConfig() {
    const url = `${this.baseUrl}/pointer?app=*&device=${this.deviceId}`

    const start = new Date().getTime()
    return this.fetchGetNoCors(url).then(() => {
      const finish = new Date().getTime()
      console.log({
        time_ms: finish - start,
      })
    });
  }

  async executeCommand(command, params={}) {
    return this.bindButton(command, params).then(() => this.emulateClick())
  }

  async bindButton(command, params) {
    console.log({
      action: "Binding...",
      command: command,
      params: params,
    })

    const url = `${this.baseUrl}/config/buttons?app=*&device=${this.deviceId}&button=${this.button}`
    const body = {"command": command, "params": params}

    const start = new Date().getTime()
    return this.fetchPostNoCors(url, body).then(() => {
      const finish = new Date().getTime()
      console.log({
        action: "Finished binding",
        command: command,
        params: params,
        time_ms: finish - start,
      })
    });
  }

  async emulateClick() {
    console.log({
      action: "Emulating click...",
    })
    const url = `${this.baseUrl}/devices/${this.deviceId}/emulatebuttonclick/${this.button}`

    const start = new Date().getTime()
    return this.fetchPostNoCors(url, {}).then(() => {
      const finish = new Date().getTime()
      console.log({
        action: "Finished emulate click",
        time_ms: finish - start,
      })
    });
  }

  async fetchGetNoCors(url) {
    return fetch(
      url, {method : "GET", mode: "no-cors"}
    )
  }

  async fetchPostNoCors(url, body) {
    return fetch(
      url, {method : "POST", mode: "no-cors", body: JSON.stringify(body)}
    )
  }
}
