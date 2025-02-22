import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { element, render } from "./view/html-util.js";

export class App {
  // TodoListModelのメソッドを使うため、外部からアクセスさせないためにプライベートクラスフィールドを作る
  #todoListModel = new TodoListModel(); 

  mount() {
    const buttonElement = document.querySelector("#js-todo-restore"); // 保存ボタンのDOM
    const inputElement = document.querySelector("#js-form-input");    // 入力欄のDOM
    const containerElement = document.querySelector("#js-todo-list"); // リストが表示される部分のDOM
    const todoItemCountElement = document.querySelector("#js-todo-count"); // アイテムの数を表示する部分のDOM

    // イベントタイプをchangeで登録されたリスナーを登録する
    this.#todoListModel.onChange(() => {
      const todoListElement = element`<ul></ul>`; // ulの要素(DOM)を制作する

      // モデル値として現在登録されているアイテムを取得する
      const todoItems = this.#todoListModel.getTodoItems();
      todoItems.forEach(item => { 
        const todoItemElement = item.completed
          ? element`<li id="todo-${item.id}"><input type="checkbox" class="checkbox" checked>
            <span class="title"><s>${item.title}</s></span>
            <button class="delete">削除</button><button class="edit">編集</button></li>`
          : element`<li id="todo-${item.id}"><input type="checkbox" class="checkbox">
            <span class="title">${item.title}</span>
            <button class="delete">削除</button><button class="edit">編集</button></li>`;

        // チェックボックス要素に変化が起きた場合(押された場合)にcompletedの値を反転させて、完了↔︎未完了をトグルする
        const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
        inputCheckboxElement.addEventListener("change", () => {
          this.#todoListModel.updateTodo({
            id: item.id,
            completed: !item.completed
          });
        });

        // 削除ボタンがクリックされた場合に対象のidを持つインスタンスをフィルターにかけて外す
        const deleteButtonElement = todoItemElement.querySelector(".delete");
        deleteButtonElement.addEventListener("click", () => {
          this.#todoListModel.deleteTodo({
            id: item.id
          });
        });
        
        // 編集ボタンが押された際にアイテムのタイトルを編集できるようにする
        const editButtonElement = todoItemElement.querySelector(".edit");
        editButtonElement.addEventListener("click", () => {
          this.#todoListModel.editTodo({
            id: item.id
          });
        });
        todoListElement.appendChild(todoItemElement);
      });

      // containerElementを一度空にして、todoListElementを子要素として付け足す
      render(todoListElement, containerElement);

      // アイテムについて全数、完了、未完了を取得して表示する
      const totalNumber = this.#todoListModel.getTotalCount();
      const checkedNumber = this.#todoListModel.getCheckedCount(this.#todoListModel.getTotalCount());
      const uncheckedNumber = totalNumber - checkedNumber;

      todoItemCountElement.textContent = `全てのタスク:${totalNumber} 完了済み:${checkedNumber} 未完了:${uncheckedNumber}`;
    });

    // フォーム右横の保存ボタンを押したら新しいアイテムとしてリストに加える。保存後はフォームを空にする
    buttonElement.addEventListener("click", (event) => {
      event.preventDefault();

      this.#todoListModel.addTodo(new TodoItemModel({
        title: inputElement.value,
        completed: false
      }));
      inputElement.value = "";
    });
  }
}