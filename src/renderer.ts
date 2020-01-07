import { Disposable } from 'vscode';
import { window, ViewColumn, WebviewPanel } from 'vscode';

export default class Renderer {
  subscriptions: Disposable[];
  visible: boolean;
  panel: WebviewPanel | undefined;

  constructor(subscriptions: Disposable[]) {
    this.subscriptions = subscriptions;
    this.visible = false;
  }

  show() {
    const { activeTextEditor } = window;
    const revealColumn = activeTextEditor
      ? activeTextEditor.viewColumn
      : undefined;

    this.visible = true;
    if (this.panel) {
      return this.panel.reveal(revealColumn);
    }

    this.panel = window.createWebviewPanel(
      'renderView',
      'SCAD Renderer',
      ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    this.panel.webview.html = this.renderView;
    this.panel.onDidDispose(
      () => {
        this.panel = undefined;
      },
      undefined,
      this.subscriptions
    );
  }

  hide() {
    this.visible = false;
  }

  get renderView(): string {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SCAD Renderer</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jscad/openjscad@1.6.1/min.min.css">
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/@jscad/openjscad@1.6.1/dist/min.min.js"></script>
    <div class="jscad-container"  style="width: 1920px; height: 1080px;">
      <div id="header">
        <div id="errordiv">Error initializing OpenJSCAD!</div>
      </div>
      <div oncontextmenu="return false;" id="viewerContext" design-url="https://raw.githubusercontent.com/jscad/OpenJSCAD.org/master/packages/examples/logo.jscad"></div>
      <div id="tail" style="display: block;">
        <div id="statusdiv"></div>
      </div>
    </div>
  </body>
  </html>`;
  }
}
