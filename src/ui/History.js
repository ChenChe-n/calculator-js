// 历史记录组件：渲染历史列表并支持点击复用表达式

export class HistoryView {
  constructor(root, { onSelect, onDelete } = {}) {
    this.root = root;
    this.onSelect = onSelect;
    this.onDelete = onDelete;
    this.listEl = null;
  }

  render(items, { highlightId } = {}) {
    if (!this.root) return;
    if (!items || items.length === 0) {
      this.listEl = null;
      this.root.innerHTML = "";
      const emptyEl = document.createElement("div");
      emptyEl.className = "history-empty";
      emptyEl.textContent = "暂无历史记录";
      this.root.appendChild(emptyEl);
      return;
    }

    if (!this.listEl) {
      this.root.innerHTML = "";
      this.listEl = document.createElement("ul");
      this.listEl.className = "history-list";
      this.root.appendChild(this.listEl);
    }

    this.listEl.classList.toggle("history-list--inserting", Boolean(highlightId));

    const existingNodes = new Map();
    Array.from(this.listEl.children).forEach((child) => {
      if (child.dataset && child.dataset.timestamp) {
        existingNodes.set(child.dataset.timestamp, child);
      }
    });

    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const key = String(item.timestamp);
      let li = existingNodes.get(key);
      if (li) {
        this.updateHistoryItem(li, item);
        existingNodes.delete(key);
      } else {
        li = this.createHistoryItem(item);
      }

      if (highlightId && item.timestamp === highlightId) {
        li.classList.remove("history-item--fresh");
        requestAnimationFrame(() => {
          li.classList.add("history-item--fresh");
        });
      } else {
        li.classList.remove("history-item--fresh");
      }

      fragment.appendChild(li);
    });

    existingNodes.forEach((node) => {
      node.remove();
    });

    this.listEl.innerHTML = "";
    this.listEl.appendChild(fragment);
  }

  createHistoryItem(item) {
    const li = document.createElement("li");
    li.className = "history-item";
    li.__historyItem = item;
    li.dataset.timestamp = item.timestamp;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "history-remove";
    deleteBtn.textContent = "×";
    deleteBtn.title = "删除该条记录";
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (typeof this.onDelete === "function") {
        this.onDelete(li.__historyItem.timestamp);
      }
    });

    const exprEl = document.createElement("div");
    exprEl.className = "history-expression";
    const resultEl = document.createElement("div");
    resultEl.className = "history-result";
    li.__exprEl = exprEl;
    li.__resultEl = resultEl;

    this.updateHistoryItem(li, item);

    li.appendChild(deleteBtn);
    li.appendChild(exprEl);
    li.appendChild(resultEl);
    li.addEventListener("click", () => {
      if (typeof this.onSelect === "function") {
        this.onSelect(li.__historyItem);
      }
    });

    return li;
  }

  updateHistoryItem(li, item) {
    li.__historyItem = item;
    li.dataset.timestamp = item.timestamp;
    if (li.__exprEl) {
      li.__exprEl.textContent = item.expression;
    }
    if (li.__resultEl) {
      li.__resultEl.textContent = item.result;
    }
  }
}
