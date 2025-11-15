// 模式切换组件：标准 / 科学

export class ModeToggle {
  constructor(root, { preferencesManager, onChange } = {}) {
    this.root = root;
    this.preferencesManager = preferencesManager;
    this.onChange = onChange;
    this.render();
  }

  render() {
    if (!this.root) return;
    const prefs = this.preferencesManager ? this.preferencesManager.get() : {};
    const current = prefs.mode || "scientific";

    const wrapper = document.createElement("div");
    wrapper.className = "mode-toggle";

    const btnStandard = document.createElement("button");
    btnStandard.type = "button";
    btnStandard.textContent = "标准";

    const btnScientific = document.createElement("button");
    btnScientific.type = "button";
    btnScientific.textContent = "科学";

    const update = (mode) => {
      const isScientific = mode === "scientific";
      btnStandard.setAttribute("aria-pressed", !isScientific ? "true" : "false");
      btnScientific.setAttribute("aria-pressed", isScientific ? "true" : "false");
      if (this.preferencesManager) {
        this.preferencesManager.set({ mode });
      }
      if (typeof this.onChange === "function") {
        this.onChange(mode);
      }
    };

    btnStandard.addEventListener("click", () => {
      update("standard");
    });

    btnScientific.addEventListener("click", () => {
      update("scientific");
    });

    wrapper.appendChild(btnStandard);
    wrapper.appendChild(btnScientific);

    this.root.innerHTML = "";
    this.root.appendChild(wrapper);

    // 初始化选中状态
    update(current);
  }
}
