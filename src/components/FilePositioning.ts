import * as vscode from 'vscode';


export default class FilePositioning {

  constructor() {
    this._init();
  }

  private _init() {
    /**
     * TODO
     * 1. 弹出第一个输入框, 输入工作区
     * 2. 弹出第二个输入框, 输入查找的文件
     * 3. 在folders数组中查找指定名称文件
     * 4. 过滤出指定工作区的所有同名文件
     * 5. 弹出picker框, 选择之后打开指定文件
     */

    this._handleGetUserInput().then((userInput) => {
      let [oldFolderName, oldFileName] = userInput;
      const folderName = this._handleTrim((oldFolderName ? oldFolderName : ''));
      const fileName = this._handleTrim(oldFileName ? oldFileName : '');

      vscode.workspace.findFiles(`**/${fileName}`, '*​/node_modules/*', 10)
        .then((files) => {
          // ** 过滤指定folder下的文件 **
          const filteredFiles = files.filter((file) => {
            return this._handleMatchPathExact(folderName, file.fsPath);
          });

          vscode.window.showInformationMessage(`
            ${filteredFiles.toString()}
          `);

        })
    })
  }

  private _handleGetUserInput() {
    return vscode.window
      .showInputBox({
        ignoreFocusOut: true,
        placeHolder: 'Enter the entire folder name, like `ts-utility-plugins`',
      })
      .then((folderName) => {
        return vscode.window
          .showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'Enter the entire file name, like `Home.tsx`',
          })
          .then((fileName) => {
            return [folderName, fileName];
          })
      })
  }

  private _handleTrim(v: string): string {
    return v.trim();
  }

  private _handleMatchPathExact(
    origin: string,
    target: string,
  ): boolean {
    const reg: RegExp = new RegExp(`^(?:.)*(${origin}(?!_|-|\w))(?:.)*$`, 'gi');

    return reg.test(target);
  }

}