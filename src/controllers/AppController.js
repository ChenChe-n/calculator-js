import { Calculator } from "../core/Calculator.js";
import { StorageService } from "../services/StorageService.js";
import { PreferencesManager } from "../services/PreferencesManager.js";
import { ExpressionStore } from "../services/ExpressionStore.js";
import { HistoryManager } from "../services/HistoryManager.js";
import { ThemeManager } from "../services/ThemeManager.js";
import { ImportExportService } from "../services/ImportExportService.js";
import { Decimal } from "../core/decimal-config.js";
import { formatExpression, formatNumber } from "../utils/formatters.js";
import { validateExpression } from "../utils/validators.js";
import { BUTTON_LAYOUTS, DEFAULT_MODE, DEFAULT_PREFERENCES } from "../utils/constants.js";

export class AppController {
  constructor() {
    this.storage = new StorageService();
    this.preferencesManager = new PreferencesManager({ storage: this.storage });
    this.calculator = new Calculator({ preferences: this.preferencesManager.get() });
    this.expressionStore = new ExpressionStore({ calculator: this.calculator });
    this.historyManager = new HistoryManager({ storage: this.storage });
    this.themeManager = new ThemeManager({ storage: this.storage });
    this.importExportService = new ImportExportService({
      historyManager: this.historyManager,
      preferencesManager: this.preferencesManager,
      storage: this.storage,
    });
    this.currentMode = this.preferencesManager.get().mode || DEFAULT_MODE;
    this.scientificSecondMode = false;
  }

  getServices() {
    return {
      storage: this.storage,
      preferencesManager: this.preferencesManager,
      calculator: this.calculator,
      expressionStore: this.expressionStore,
      historyManager: this.historyManager,
      themeManager: this.themeManager,
      importExportService: this.importExportService,
    };
  }

  setMode(mode) {
    this.currentMode = mode || DEFAULT_MODE;
    if (this.currentMode !== "scientific") {
      this.scientificSecondMode = false;
    }
  }

  getCurrentMode() {
    return this.currentMode;
  }

  toggleScientificSecond() {
    this.scientificSecondMode = !this.scientificSecondMode;
    return this.scientificSecondMode;
  }

  getLayout() {
    const layoutDef = BUTTON_LAYOUTS[this.currentMode] || BUTTON_LAYOUTS[DEFAULT_MODE];
    if (typeof layoutDef === "function") {
      return layoutDef({ secondMode: this.scientificSecondMode });
    }
    return layoutDef;
  }

  refreshPreferences(partial) {
    if (partial) {
      this.preferencesManager.set(partial);
    }
    this.calculator.setPreferences(this.preferencesManager.get());
  }

  handleInputAppend(value) {
    this.expressionStore.append(value);
  }

  handleDelete() {
    this.expressionStore.deleteLast();
  }

  handleClearEntry() {
    this.expressionStore.clearEntry();
  }

  handleClearExpression() {
    this.expressionStore.clearExpression();
  }

  handleClearAll() {
    this.expressionStore.clearExpression();
    this.historyManager.clear();
  }

  handleToggleSign() {
    return this.expressionStore.toggleLastNumberSign();
  }

  handlePercent() {
    return this.expressionStore.applyPercent();
  }

  handleMemoryAction(action) {
    return this.expressionStore.handleMemoryAction(action);
  }

  getMemoryIndicator() {
    const value = this.expressionStore.getMemoryValue();
    if (value instanceof Decimal) {
      return `内存：${formatNumber(value)}`;
    }
    return "内存：空";
  }

  evaluateExpression() {
    const expr = formatExpression(this.expressionStore.getExpression());
    if (!expr) {
      return { ok: false, error: "" };
    }
    const validation = validateExpression(expr);
    if (!validation.ok) {
      return { ok: false, error: validation.error };
    }
    const result = this.calculator.evaluate(expr);
    if (!result.ok) {
      return { ok: false, error: result.error || "计算出错" };
    }
    const formatted = formatNumber(result.value);
    this.expressionStore.setLastResult(result.value);
    const historyItem = this.historyManager.add({ expression: expr, result: formatted });
    return { ok: true, formatted, historyTimestamp: historyItem.timestamp };
  }

  createExportJson() {
    return this.importExportService.createExportJson();
  }

  applyImport(json) {
    return this.importExportService.applyImportFromJson(json);
  }
}
