export class EventEmitter {
  // イベントタイプとリスナーの関連付けをMapオブジェクトで行う
  #listeners = new Map();

  // イベントタイプ(キー)とリスナー(値)を関連付けて管理する。リスナー(値)にはSetオブジェクトを使用する
  // Setオブジェクトを使うことでリスナー(値)の重複を防ぐ。
  // Mapオブジェクトへの追加はSetメソッド、Setオブジェクトへの追加はaddメソッドで行う
  addEventListener(type, listener) {
    if (!this.#listeners.has(type)) {
      this.#listeners.set(type, new Set());
    }
    const listenerSet = this.#listeners.get(type); // Setオブジェクトとしてのリスナーの集合を取得
    listenerSet.add(listener);
  }

  // 指定したイベント(type)に登録されているリスナーを1つずつ全て呼び出す
  emit(type) {
    const listenerSet = this.#listeners.get(type); // Setオブジェクトとしてのリスナーの集合を取得
    if (!listenerSet) {
      return;
    }
    listenerSet.forEach(listener => {
      // call関数にthisを渡すことで特定のモデルのインスタンスが対象となり、そのモデルのメソッドを使用できる。
      // また、listener関数内のthisを指定のインスタンスで実行させることができる。
      listener.call(this); 
    });
  }

  // 指定のリスナーを削除する
  removeEventListener(type, listener) {
    const listenerSet = this.#listeners.get(type); //Setオブジェクトとしてのリスナーを取得
    if (!listenerSet) {
      return;
    }
    listenerSet.forEach(ownListener => {
      if (ownListener === listener) {
        listenerSet.delete(listener);
      }
    });
  }
}