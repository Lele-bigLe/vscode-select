import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // 注册命令：复制文件引用
  const copyFileReference = vscode.commands.registerCommand(
    'vscode-select.copyFileReference',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const fileName = path.basename(editor.document.fileName);
      const reference = `@${fileName}`;

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
  context.subscriptions.push(copyLineReference);
  context.subscriptions.push(copyRangeReference);
}

export function deactivate() {}
