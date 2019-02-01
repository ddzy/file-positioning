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
      const { oldFolderName, oldFileName, } = userInput;
      const folderName = oldFolderName ? oldFolderName.name : '';
      const fileName = oldFileName ? this._handleTrim(oldFileName) : '';

      vscode.workspace.findFiles(`**/${fileName}`, `**/node_modules/**`, 10)
        .then((files) => {

          // ** 过滤指定folder下的文件 **
          const filteredFiles = files.reduce((total: string[], current) => {
            if (this._handleMatchPathExact(folderName, current.fsPath)) {
              total.push(current.fsPath);
            }
            return total;
          }, []);

          vscode.window.showQuickPick(filteredFiles, {
            matchOnDescription: true,
            matchOnDetail: true,
            placeHolder: `${filteredFiles.length} files found`,
          }).then((selectedFile) => {
            vscode.window.showInformationMessage(`select ${selectedFile}`);
          });

        });
    })
  }

  private _handleGetUserInput() {
    return vscode.window
      .showWorkspaceFolderPick({
        ignoreFocusOut: true,
        placeHolder: 'Selete the folder you will be looking for...',
      })
      .then((folderName) => {
        return vscode.window
          .showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'Enter the entire file name, like `file-positioning.ts`',
          })
          .then((fileName) => {
            return {
              oldFolderName: folderName,
              oldFileName: fileName,
            };
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