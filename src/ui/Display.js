// 显示屏组件：负责表达式、结果与错误信息的展示

export class Display {
  constructor(root) {
    this.root = root;
    this.expressionEl = root.querySelector("[data-role='expression']");
    this.resultEl = root.querySelector("[data-role='result']");
    this.errorEl = root.querySelector("[data-role='error']");
  }

  setExpression(text) {
    if (this.expressionEl) {
      this.expressionEl.textContent = text || "0";
    }
  }

  setResult(value) {
    if (this.resultEl) {
      this.resultEl.textContent = value === "" || value === null || value === undefined ? "" : String(value);
    }
  }

  setError(message) {
    if (this.errorEl) {
      this.errorEl.textContent = message || "";
      this.errorEl.hidden = !message;
    }
    if (message) {
      this.root.classList.add("has-error");
    } else {
      this.root.classList.remove("has-error");
    }
  }

  // 绑定表达式输入事件：用于 contenteditable 区域手动输入时同步外部状态
  bindExpressionInput(onChange) {
    if (!this.expressionEl || typeof onChange !== "function") return;
    this.expressionEl.addEventListener("input", () => {
      onChange(this.expressionEl.textContent || "");
    });
  }
}
