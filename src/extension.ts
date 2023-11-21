// 'vscode'モジュールにはVS Codeの拡張機能APIが含まれています
// モジュールをインポートし、以下のコードでエイリアスvscodeを参照します
import * as vscode from "vscode";

// このメソッドは、拡張機能がアクティブ化されたときに呼び出されます
// 拡張機能は、コマンドが実行された最初の時点でアクティブ化されます
export function activate(context: vscode.ExtensionContext) {
  // このコード行は、拡張機能がアクティブ化されたときに1回だけ実行されます

  // コマンドはpackage.jsonファイルで定義されています
  // 今、registerCommandを使用してコマンドの実装を提供します
  // commandIdパラメータは、package.jsonのcommandフィールドと一致する必要があります

  context.subscriptions.push(
    vscode.commands.registerCommand("atcoder-helper.setup", async () => {
      // ここに置いたコードは、コマンドが実行されるたびに実行されます
      // VSCodeで開いているディレクトリを取得
      const folders = vscode.workspace.workspaceFolders;
      // 開いていない場合はエラーを出して終了する
      if (folders === undefined) {
        vscode.window.showErrorMessage(
          "Error: Open the folder before executing this command."
        );
        return;
      }
      const folderPath = folders[0].uri;
      // ユーザーにメッセージボックスを表示します
      const contestName = await vscode.window.showInputBox({
        title: "コンテスト名",
        placeHolder: "abc001",
      });
      if (!contestName) {
        vscode.window.showInformationMessage("コンテスト名が入力してください");
        return;
      }
      // フォルダーのトップにtemplate.<拡張子>があるかを確認
      const topFilesNames: string[] = await vscode.workspace.fs
        .readDirectory(folderPath)
        .then((files) => files.map((file) => file[0]));
      console.log(topFilesNames);
      const isTemplateFile = topFilesNames.find(
        (fileName) => fileName.match(/^template\..+$/) !== null
      );
      if (!isTemplateFile) {
        vscode.window.showErrorMessage(
          "templateがフォルダーのトップにありません"
        );
        return;
      }
      const extension =
        isTemplateFile.split(".")[isTemplateFile.split(".").length - 1];
      await vscode.workspace.fs.createDirectory(
        vscode.Uri.joinPath(folderPath, contestName)
      );
      await Promise.all(
        ["a", "b", "c", "d", "e", "f", "g", "h"].map(async (problem) => {
          await vscode.workspace.fs.createDirectory(
            vscode.Uri.joinPath(folderPath, contestName, problem)
          );
          await vscode.workspace.fs.copy(
            vscode.Uri.joinPath(folderPath, "template." + extension),
            vscode.Uri.joinPath(
              folderPath,
              contestName,
              problem,
              `main.${extension}`
            )
          );
        })
      );
      vscode.window.showInformationMessage("コンテストフォルダを作成しました");
    })
  );
}

// このメソッドは、拡張機能が非アクティブ化されたときに呼び出されます
export function deactivate() {}
