# 圍棋排譜工具 (The Go Game)

這是一個專為 iPad 與網頁開發的高質感圍棋排譜工具，致力於提供最真實的數位棋具體驗。

## 🌐 線上預覽 (Production URL)

**[https://go-game-57678.web.app](https://go-game-57678.web.app)**

---

## 🚀 快速開始

請確保您的開發環境已安裝 [Node.js](https://nodejs.org/)。

### 1. 安裝依賴
在專案根目錄執行：
```bash
npm install
```

### 2. 啟動開發伺服器
執行以下指令後，在瀏覽器打開 [http://localhost:5173](http://localhost:5173)：
```bash
npm run dev
```

### 3. 建置生產版本
若要部署或預覽生產版本：
```bash
npm run build
npm run preview
```

---

## ✨ 核心特色

### 1. 極致視覺體驗 (Super Realistic Visuals)
- **木紋棋盤**：採用高解析度榧木紋理，搭配 Canvas 繪製 0.5px 細緻網格線。
- **質感棋子**：使用徑向漸層 (Radial Gradient) 模擬黑子的深邃與白子的珍珠光澤。
- **立體感**：透過 CSS 陰影與 Canvas 渲染，營造棋盤厚度與棋子落下的沉穩感。

### 2. 完整圍棋邏輯 (Go Logic Engine)
- **自動提子**：內建 BFS/DFS 演算法，即時計算氣數並自動處理提子。
- **打劫與禁著點**：精確判斷打劫狀態，並對禁著點提供視覺提示。
- **吃子復活**：悔棋 (Undo) 時能精確還原被吃掉的棋子。

### 3. 排譜與導航 (History & Playback)
- **歷史堆疊**：支援無限次的 Undo/Redo。
- **手數統計**：即時顯示目前總手數與黑白雙方提子數。

### 4. iPad 優化 (Touch Optimization)
- **防誤觸**：針對 iPad 觸控手勢進行優化。
- **落子輔助**：解決手指遮擋問題，提供精確的落子體驗。

---

## 🛠 技術棧

- **框架**: [React 19](https://react.dev/)
- **建置工具**: [Vite](https://vitejs.dev/)
- **語言**: [TypeScript](https://www.typescriptlang.org/)
- **資料庫/部署**: [Firebase](https://firebase.google.com/)
- **渲染**: HTML5 Canvas API
