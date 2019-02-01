import * as vscode from 'vscode';

import FilePositioning from './components/FilePositioning';


export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "file-positioning" is now active!');


	const disposable = vscode.commands.registerCommand('extension.fileposition', () => {
		new FilePositioning();
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
