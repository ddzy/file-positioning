import {
  window,
  workspace,
} from 'vscode';


export default class FilePositioning {

  constructor() {
    this._init();
  }

  private _init() {
    this
      ._handleGetUserInput()
      .then((userInput) => {
        const { oldFolderName, oldFileName, } = userInput;
        const folderName = oldFolderName ? oldFolderName.name : '';
        const fileName = oldFileName ? this._handleTrim(oldFileName) : '';

        workspace
          .findFiles(`**/${fileName}`, `**/node_modules/**`, 10)
          .then((files) => {
            // ** 过滤指定folder下文件 **
            const filteredFiles = files.filter((file) => {
              return this._handleMatchPathExact(folderName, file.fsPath);
            });
            const filteredFilesName = filteredFiles.map((file) => {
              return file.fsPath;
            });

            window
              .showQuickPick(filteredFilesName, {
                matchOnDescription: true,
                matchOnDetail: true,
                placeHolder: `${filteredFiles.length} files found`,
              })
              .then((selectedFile) => {
                // ** 打开检索到的文件 **
                if (selectedFile) {
                  const discoveredFile = filteredFiles.find((v) => v.fsPath === selectedFile);

                  if (discoveredFile) {
                    workspace
                      .openTextDocument(discoveredFile)
                      .then((doc) => {
                        window.showTextDocument(doc, 1);
                      });
                  }
                }
              });
          });
      })
  }

  private _handleGetUserInput() {
    return window
      .showWorkspaceFolderPick({
        ignoreFocusOut: true,
        placeHolder: 'Selete the folder you will be looking for...',
      })
      .then((folderName) => {
        return window
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