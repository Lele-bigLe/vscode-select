import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // 获取相对路径的辅助函数
  const getRelativePath = (filePath: string): string => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return path.basename(filePath);
    }

    // 查找文件所属的工作区
    for (const folder of workspaceFolders) {
      const folderPath = folder.uri.fsPath;
      if (filePath.startsWith(folderPath)) {
        const relativePath = path.relative(folderPath, filePath);
        // 统一使用正斜杠
        return relativePath.replace(/\\/g, '/');
      }
    }

    return path.basename(filePath);
  };

  // 注册命令：复制文件引用
  const copyFileReference = vscode.commands.registerCommand(
    'vscode-select.copyFileReference',
    (uri?: vscode.Uri) => {
      let filePath: string | undefined;
      let useRelativePath = false;

      // 从资源管理器触发（传入 URI）- 使用相对路径
      if (uri) {
        filePath = uri.fsPath;
        useRelativePath = true;
      }
      // 从编辑器触发 - 使用文件名
      else {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          return;
        }
        filePath = editor.document.fileName;
        useRelativePath = false;
      }

      if (!filePath) {
        return;
      }

      const reference = useRelativePath
        ? `@${getRelativePath(filePath)}`
        : `@${path.basename(filePath)}`;

      vscode.env.clipboard.writeText(reference);
      vscode.window.showInformationMessage(`已复制: ${reference}`);
    }
  );

  // 注册命令：复制文件夹引用
  const copyFolderReference = vscode.commands.registerCommand(
    'vscode-select.copyFolderReference',
    (uri?: vscode.Uri) => {
      if (!uri) {
        return;
      }

      const folderPath = uri.fsPath;
      const relativePath = getRelativePath(folderPath);
      const reference = `@${relativePath}`;

      vscode.env.clipboard.writeText(reference);
      vscode.window.showInformationMessage(`已复制: ${reference}`);
    }
  );

  // 注册命令：复制行引用
  const copyLineReference = vscode.commands.registerCommand(
    'vscode-select.copyLineReference',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const fileName = path.basename(editor.document.fileName);

      // 如果选中多行，使用起始行
      const lineNumber = selection.start.line + 1;
      const reference = `@${fileName}#${lineNumber}`;

      vscode.env.clipboard.writeText(reference);
      vscode.window.showInformationMessage(`已复制: ${reference}`);
    }
  );

  // 注册命令：复制范围引用
  const copyRangeReference = vscode.commands.registerCommand(
    'vscode-select.copyRangeReference',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const fileName = path.basename(editor.document.fileName);

      const startLine = selection.start.line + 1;
      const endLine = selection.end.line + 1;

      // 如果只选中一行，使用行引用格式
      if (startLine === endLine) {
        const reference = `@${fileName}#${startLine}`;
        vscode.env.clipboard.writeText(reference);
        vscode.window.showInformationMessage(`已复制: ${reference}`);
      } else {
        const reference = `@${fileName}#${startLine}-${endLine}`;
        vscode.env.clipboard.writeText(reference);
        vscode.window.showInformationMessage(`已复制: ${reference}`);
      }
    }
  );

  context.subscriptions.push(copyFileReference);
  context.subscriptions.push(copyFolderReference);
  context.subscriptions.push(copyLineReference);
  context.subscriptions.push(copyRangeReference);
}

export function deactivate() {}
