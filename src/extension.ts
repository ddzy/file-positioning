import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "file-positioning" is now active!');

	const disposable = vscode.commands.registerCommand('extension.helloWorld', () => {

		vscode.window.showInformationMessage('');

	});

	const disposableTwo = vscode.commands.registerCommand('extension.fileposition', () => {

		const input = vscode.window.createInputBox();
		vscode.window.showInputBox(input).then((v) => {
			vscode.window.showInformationMessage(`${v}`);
		});

	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableTwo);
}


export function deactivate() {}
