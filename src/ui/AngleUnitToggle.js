// 角度单位切换组件：deg / rad / grad

export class AngleUnitToggle {
  constructor(root, { preferencesManager, onChange } = {}) {
    this.root = root;
    this.preferencesManager = preferencesManager;
    this.onChange = onChange;
    this.render();
  }

  render() {
    if (!this.root) return;
    const current = (this.preferencesManager && this.preferencesManager.get().angleUnit) || "deg";

    const wrapper = document.createElement("div");
    wrapper.className = "angle-toggle";

    const btnDeg = document.createElement("button");
    btnDeg.type = "button";
    btnDeg.textContent = "DEG";
    btnDeg.setAttribute("aria-pressed", current === "deg" ? "true" : "false");

    const btnRad = document.createElement("button");
    btnRad.type = "button";
    btnRad.textContent = "RAD";
    btnRad.setAttribute("aria-pressed", current === "rad" ? "true" : "false");

    const btnGrad = document.createElement("button");
    btnGrad.type = "button";
    btnGrad.textContent = "GRAD";
    btnGrad.setAttribute("aria-pressed", current === "grad" ? "true" : "false");

    const update = (unit) => {
      btnDeg.setAttribute("aria-pressed", unit === "deg" ? "true" : "false");
      btnRad.setAttribute("aria-pressed", unit === "rad" ? "true" : "false");
      btnGrad.setAttribute("aria-pressed", unit === "grad" ? "true" : "false");
      if (typeof this.onChange === "function") {
        this.onChange(unit);
      }
    };

    btnDeg.addEventListener("click", () => {
      update("deg");
    });

    btnRad.addEventListener("click", () => {
      update("rad");
    });

    btnGrad.addEventListener("click", () => {
      update("grad");
    });

    wrapper.appendChild(btnDeg);
    wrapper.appendChild(btnRad);
    wrapper.appendChild(btnGrad);
    this.root.innerHTML = "";
    this.root.appendChild(wrapper);
  }
}
