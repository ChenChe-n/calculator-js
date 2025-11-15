// 键盘组件：渲染按钮并将点击事件转化为高层事件

export class Keyboard {
  constructor(root, { onButtonPress, getLayout, mapKey } = {}) {
    this.root = root;
    this.onButtonPress = onButtonPress;
    this.getLayout = typeof getLayout === "function" ? getLayout : () => [];
    this.mapKey = typeof mapKey === "function" ? mapKey : null;
    this.render();
    this.bindKeyboardEvents();
  }

  render() {
    if (!this.root) return;
    this.root.innerHTML = "";
    const layout = this.getLayout();
    if (!layout || layout.length === 0) return;

    layout.forEach((row) => {
      const rowButtons = Array.isArray(row) ? row : row.buttons || [];
      const rowEl = document.createElement("div");
      rowEl.className = "keyboard-row";
      const columns = rowButtons.length || 4;
      rowEl.style.setProperty("--columns", columns);

      rowButtons.forEach((btn) => {
        const buttonEl = document.createElement("button");
        const typeClass = btn.type ? ` key-${btn.type}` : "";
        buttonEl.className = `key${typeClass}`;
        buttonEl.textContent = btn.label;
        buttonEl.dataset.type = btn.type;
        buttonEl.dataset.value = btn.value;
        if (btn.span) {
          buttonEl.style.gridColumn = `span ${btn.span}`;
        }
        if (btn.active) {
          buttonEl.classList.add("key--active");
        }
        if (btn.disabled) {
          buttonEl.disabled = true;
        }
        buttonEl.addEventListener("click", () => {
          this.emit(btn.type, btn.value);
        });
        rowEl.appendChild(buttonEl);
      });
      this.root.appendChild(rowEl);
    });
  }

  // 当模式或布局切换时，外部可以调用该方法重新渲染键盘
  setLayout() {
    this.render();
  }

  emit(type, value) {
    if (typeof this.onButtonPress === "function") {
      this.onButtonPress({ type, value });
    }
  }

  bindKeyboardEvents() {
    window.addEventListener("keydown", (event) => {
      const { key, target } = event;

      const active = target || document.activeElement;
      const tag = active && active.tagName;
      const isEditable =
        active &&
        (active.isContentEditable || tag === "INPUT" || tag === "TEXTAREA");

      if (isEditable) {
        if (key === "Enter" || key === "=") {
          event.preventDefault();
          this.emit("action", "equals");
        } else if (key === "Escape") {
          this.emit("action", "clear-expression");
        }
        return;
      }

      if (this.mapKey) {
        const mapped = this.mapKey({ key, event });
        if (mapped && mapped.type && mapped.value) {
          event.preventDefault();
          this.emit(mapped.type, mapped.value);
          return;
        }
      }

      if (/^[0-9]$/.test(key)) {
        this.emit("digit", key);
        return;
      }
      if (key === ".") {
        this.emit("action", ".");
        return;
      }
      if (["+", "-", "*", "/", "%"].includes(key)) {
        this.emit("operator", key);
        return;
      }
      if (key === "Enter" || key === "=") {
        event.preventDefault();
        this.emit("action", "equals");
        return;
      }
      if (key === "Backspace") {
        this.emit("action", "delete");
        return;
      }
      if (key === "Escape") {
        this.emit("action", "clear-entry");
        return;
      }

      if (key === "(" || key === ")") {
        this.emit("action", key);
        return;
      }

      if (key === "!") {
        this.emit("postfix", "!");
      }
    });
  }
}
