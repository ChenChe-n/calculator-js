// 主题切换组件

import { ThemeManager, THEMES } from "../services/ThemeManager.js";

const THEME_SEQUENCE = [THEMES.AUTO, THEMES.LIGHT, THEMES.DARK];

export class ThemeToggle {
  constructor(root, options = {}) {
    this.root = root;
    this.themeManager = options.themeManager || new ThemeManager();
    this.render();
  }

  render() {
    this.root.innerHTML = "";
    const button = document.createElement("button");
    button.className = "theme-toggle";
    button.type = "button";
    button.addEventListener("click", () => {
      this.cycleTheme();
      this.updateLabel(button);
    });
    this.updateLabel(button);
    this.root.appendChild(button);
  }

  updateLabel(button) {
    const current = this.themeManager.getTheme();
    const labels = {
      [THEMES.AUTO]: "🌗 系统",
      [THEMES.LIGHT]: "🌞 亮色",
      [THEMES.DARK]: "🌙 暗色",
    };
    button.textContent = labels[current] || labels[THEMES.AUTO];
  }

  cycleTheme() {
    const current = this.themeManager.getTheme();
    const index = THEME_SEQUENCE.indexOf(current);
    const next = THEME_SEQUENCE[(index + 1) % THEME_SEQUENCE.length];
    this.themeManager.setTheme(next);
  }
}
