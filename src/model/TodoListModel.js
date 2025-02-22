import { EventEmitter } from "../EventEmitter.js";

export class TodoListModel extends EventEmitter {
  #items; // プライベートクラスフィールドの変数を設けてアイテムを格納することでクラス外からのアクセスを禁じることができる
          // アイテムの値なので外部から編集されては困る

  constructor(items = []) {
    super();
    this.#items = items;
  }

  // #itemsの配列の長さを取得することでリスト内の数を取得する
  getTotalCount() {
    return this.#items.length;
  }

  // #items内の配列を取得する
  getTodoItems() {
    return this.#items;
  }

  // 指定のインスタンス(this)に変更(change)があった場合に処理する内容をlistenerに記述する
  onChange(listener) {
    this.addEventListener("change", listener);
  }

  // changeイベントに対して設定されたリスナーを全て呼び出す。
  emitChange() {
    this.emit("change");
  }

  // #itemsの配列に新しいtodoアイテムを追加する
  addTodo(todoItem) {
    this.#items.push(todoItem);
    this.emitChange();
  }

  // idからtodoアイテムを特定し、空であれば処理終了。アイテムがある場合、completedの値を反転させる
  updateTodo({id, completed }) {
    const todoItem = this.#items.find(todo => todo.id === id);
    if (!todoItem) {
      return;
    }
    todoItem.completed = completed;
    this.emitChange();
  }

// confirmはモーダルウィンドウを出して確認する。引数のidを持つアイテムをフィルタリング(除外)して、残りのアイテムを#itemsへ戻す
  deleteTodo({ id }) {
    let result = confirm("本当に削除してもよろしいですか？");
    this.#items = this.#items.filter(todo => {
      return todo.id !== id;
    });
    this.emitChange();
  }

  // 作成済みのアイテムを編集する
  editTodo({id}) {
    // 引数のidに一致するアイテムのモデル値を取得する
    const currentList = this.#items.find(todo => todo.id === id);

    // idと合致するli要素を取得する。アイテム名、ボタン各種と個別に定義した変数に代入
    const listParentNode = document.getElementById(`todo-${id}`);
    const text = listParentNode.querySelector(".title");
    const deleteButton = listParentNode.querySelector(".delete");
    const editButton = listParentNode.querySelector(".edit");

    // input要素を新たに生成して、既存のtodoのタイトルをフォームとして編集できる状態で表示させる
    const editInput = document.createElement("input");
    editInput.value = text.innerText;
    editInput.className = "text";
    listParentNode.replaceChild(editInput, text); // テキスト表示のspan要素をinput要素で置き換えてフォームでの表示に切り替える

    // 保存ボタンを新たに生成して、編集ボタンが押された時に表示されるように対象のli要素に子要素として加える
    const saveButton = document.createElement("button");
    saveButton.innerText = "保存";
    saveButton.className = "button";
    listParentNode.appendChild(saveButton);

    // 編集ボタンが押されたら削除ボタンと編集ボタンを非表示に設定する
    deleteButton.style.display = "none";
    editButton.style.display = "none";

    // 保存ボタンがクリックされた場合の処理
    saveButton.addEventListener("click", () => {
      if(editInput) {
        // DOMだけでなくモデルの値も変える
        currentList.title = editInput.value;

        // spanタグを生成して編集後の値を編集前と同じ要素で表示できるように準備
        const newText = document.createElement("span");
        newText.innerText = editInput.value;
        newText.className = "title";

        // 編集が終わったinput要素をテキストとして表示できるようにspan要素で置き換える
        listParentNode.replaceChild(newText, editInput);

        // 非表示にしていた削除と編集のボタンを表示し直して、保存ボタンは削除する
        deleteButton.style.display = "";
        editButton.style.display = "";
        listParentNode.removeChild(saveButton);

        this.emitChange();
      }
    });
  }

  // classにcheckboxを持つDOMを取得してcheckedプロパティでtrueのDOMがあれば完了したアイテムがあると認識してカウント数を増やす
  getCheckedCount(total) {
    let checkedNumber = 0;
    const checkboxElement = document.getElementsByClassName("checkbox");
    for (let i = 0; i < total; i++) {
      if(checkboxElement[i].checked === true) {
        checkedNumber += 1;
      }
    }
    return checkedNumber;
  }
}