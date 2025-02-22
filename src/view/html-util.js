// DOM内に特殊文字が入っている場合は全て置き換える
export function escapeSpecialChars(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "quot:")
    .replace(/'/g, "&#039;");
}

// 引数として渡したHTML文字列をDOM要素に変換する
export function htmlToElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild;
}

// stringsは静的な文字列の配列、valuesは挿入される動的な値の配列で${}で囲まれた部分。
// reduceメソッドの初期値は指定が無いので先頭のli要素が初期値になる。resultは累積値が入る変数
export function element(strings, ...values) {
  const htmlString = strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
  return htmlToElement(htmlString);
}

// 第二引数のDOM(todoリスト表示欄)を空にして、出来上がったリストのDOMを子要素としてtodoリスト表示欄に付け足す
export function render(bodyElement, containerElement) {
  containerElement.innerHTML = "";
  containerElement.appendChild(bodyElement);
}