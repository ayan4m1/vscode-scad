import * as vscode from 'vscode';

import Renderer from './renderer';

const { commands } = vscode;

let renderer: Renderer;

export function showRenderer() {
  renderer.show();
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Activating vscode-scad!');
  renderer = new Renderer(context.subscriptions);

  const pushSubscription = (name: string, command: (...args: any[]) => any) =>
    context.subscriptions.push(commands.registerCommand(name, command));

  pushSubscription('scad.showRenderer', showRenderer);
}

export function deactivate() {}
