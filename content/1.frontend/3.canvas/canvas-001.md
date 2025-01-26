---
title: 粒子化練習
description: Canvas、Drawing art、Particles
icon: 'lucide:alarm-clock-check'
gitTalk: false
date: 2025-01-19 15:32:20
read: '20'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Canvas 粒子化練習 - 001 Day [歌詞播放器](https://fet-skills.zeabur.app/canvas-lyrics-player.html)

基於對 Canvas 的好奇，加上颱風天閒閒沒事，看到了 Canvas 粒子化的 YouTube 影片，所以展開了這次的研究。
會接續下列幾點展開:

- 同步顯示歌詞 + 歌詞嵌入 canvas
- 互動粒子效果
- RWD + 粒子化

話不多說就上囉！

### 目錄

1. [Canvas 基礎介紹](#canvas-基礎介紹)
2. [Audio 播放檔案與歌詞](#audio-播放檔案與歌詞)
3. [互動粒子](#互動粒子)
4. [歌詞嵌入](#歌詞嵌入)
5. [RWD與其他可改進的點](#rwd與其他可改進的點)
6. [Reference](#reference)

## Canvas 基礎介紹

### 什麼是 Canvas？

Canvas 是 HTML5 提供的一個強大的圖形繪製 API，允許開發者在網頁上動態地繪製圖形和動畫。通過 js，您可以在 Canvas 上繪製 2D 或 3D 圖形，實現各種視覺效果。

### Canvas 的應用場景

- **遊戲開發**：創建2D或3D遊戲。
- **數據可視化**：繪製圖表和圖形。
- **動畫效果**：實現動態背景或互動動畫。
- **圖像處理**：進行圖片編輯和濾鏡處理。

### 基本使用方法

以下是一個簡單的 Canvas 繪製矩形的練習：

```html
<canvas id="myCanvas" width="500" height="500"></canvas>
<script>
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d"); // 取得 canvas 2d 實例中的屬性及方法

  ctx.fillStyle = "#FF0000";
  ctx.fillRect(50, 50, 150, 100);
</script>
```

在這個練習中，放置了一個 500x500 像素的 Canvas，並在其上繪製了一個紅色的矩形。

## Audio 播放檔案與歌詞

### 音頻播放器設置

在這個練習中，使用 `<audio>` 標籤來播放音樂文件。基本的設置：

```html
<audio src="./02.mp3" type="audio/ogg" controls id="audio-player"></audio>
```

- `src`: 指向音頻文件的路徑。
- `controls`: 顯示瀏覽器默認的音頻控制元件。
- `id`: 用於 js 中引用音頻元素。

### 同步歌詞的數據結構

為了實現歌詞與音頻的同步，將歌詞與對應的時間戳存儲在一個陣列中。每個歌詞對象包含 `time`（以秒為單位）和 `text`。

```js
const lyrics = [
  { time: 0, text: '(傷心酒店 city pop)' },
  { time: 21, text: '冷淡的光線 哀怨的歌聲 飲酒的人無心晟' },
  // 更多歌詞...
];
```

### 歌詞同步邏輯

通過監聽音頻的 `timeupdate` 事件，可以在播放時不斷檢查當前時間，並顯示對應的歌詞。

```js
audio.addEventListener('timeupdate', updateLyrics);

function updateLyrics() {
  const currentTime = audio.currentTime;
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time <= currentTime) {
      currentLineIndex = i;
    }
  }

  if (currentLineIndex !== previousLineIndex) {
    createParticles(lyrics[currentLineIndex].text);
    previousLineIndex = currentLineIndex;
  }
}
```

確保當前播放時間達到某行歌詞的時間標記時，會動態更新顯示新歌詞並創建對應的粒子效果到 canvas 中。

## 互動粒子

### 粒子效果的基本原理

粒子效果通常由許多小粒子組成，粒子們根據特定的物理規則運動，創造出動態的視覺效果。而這次，粒子代表歌詞的每個單字 or 字詞，並隨著音樂播放進行動畫展示。

### 粒子（Particle Class）

定義一個 `Particle` Class 來管理每個粒子的屬性和會有的動作。

```js
const mouse = { x: 0, y: 0, radius: 80 }; // 紀錄滑鼠滑到哪了及影響的半徑
const particles = []; // 一維陣列 負責存儲和管理所有的粒子對象

function Particle(x, y, color) {
  this.x = x + canvas.width / 2 - textWidth / 2; // 粒子在 Canvas 上的初始 x 座標
  this.y = y + canvas.height / 2 - textHeight / 2; // 粒子在 Canvas 上的初始 y 座標
  this.baseX = this.x; // 粒子的基礎 x 座標，粒子恢復位置時的目標 x 座標
  this.baseY = this.y; // 粒子的基礎 y 座標，粒子恢復位置時的目標 y 座標
  this.color = color; // 粒子的顏色
  this.size = particleSize; // 粒子的大小（寬度和高度）
  this.vx = 0; // 粒子在 x 軸的速度
  this.vy = 0; // 粒子在 y 軸的速度
  this.alpha = Math.random() * 0.5 + 0.5; // 粒子的透明度，隨機初始化在 0.5 到 1 之間
}

Particle.prototype.update = function () {
  const dx = mouse.x - this.x; // 計算粒子與滑鼠在 x 軸上的距離
  const dy = mouse.y - this.y; // 計算粒子與滑鼠在 y 軸上的距離
  const distance = Math.sqrt(dx * dx + dy * dy); // 計算粒子與滑鼠距離

  if (isMouseOver && distance < mouse.radius) {
    const angle = Math.atan2(dy, dx); // 計算粒子與滑鼠之間的角度
    const force = (mouse.radius - distance) / mouse.radius; // 計算施加在粒子上的力的大小
    const forceX = Math.cos(angle) * force * 6; // 計算施加在 x 軸上的力
    const forceY = Math.sin(angle) * force * 6; // 計算施加在 y 軸上的力

    this.vx -= forceX; // 更新粒子的 x 速度
    this.vy -= forceY; // 更新粒子的 y 速度
  } else {
    this.vx = (this.baseX - this.x) * 0.1; // 計算粒子回到基礎位置的 x 速度
    this.vy = (this.baseY - this.y) * 0.1; // 計算粒子回到基礎位置的 y 速度
  }

  this.x += this.vx; // 更新粒子的 x 座標
  this.y += this.vy; // 更新粒子的 y 座標

  this.vx *= 0.9; // 減少 x 速度，實現緩動效果
  this.vy *= 0.9; // 減少 y 速度，實現緩動效果

  this.alpha = 0.7 + Math.sin(Date.now() * 0.005 + this.x * 0.01) * 0.3; // 更新粒子的透明度，創建閃爍效果
};

Particle.prototype.draw = function () {
  ctx.fillStyle = this.color; // 設定填充顏色為粒子的顏色
  ctx.globalAlpha = this.alpha; // 設定全域的透明度為粒子的透明度
  ctx.fillRect(this.x, this.y, this.size, this.size); // 繪製粒子為一個小正方形
  ctx.globalAlpha = 1; // 重置透明度
};
```

### 粒子動畫循環

使用 `requestAnimationFrame` 來創建一個流暢的動畫循環，不斷更新和繪製粒子。

```js
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  requestAnimationFrame(animate); // 通常以每秒約 60 幀（FPS）的速度調用回調函數，取決於瀏覽器和設備的性能。
}
```

### 互動效果

滑鼠移動影響粒子運動，使得粒子在滑鼠附近產生排斥效果，增強互動性。

```js
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  isMouseOver = true;
});

canvas.addEventListener('mouseleave', () => {
  isMouseOver = false;
});
```

## 歌詞嵌入

### 將歌詞渲染到 Canvas

為了將歌詞轉換為粒子，**需要將文字渲染到一個臨時的 Canvas 上，然後提取像素數據來生成粒子**。

```js
function createParticles(text) {
  particles = []; // 清空現有的粒子陣列

  // 創建一個臨時的 Canvas 元素，用於渲染文本並提取像素
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width; // 設定臨時 Canvas 的寬度與主 Canvas 相同
  tempCanvas.height = canvas.height; // 設定臨時 Canvas 的高度與主 Canvas 相同

  // 設定字體大小，根據 Canvas 的寬度動態調整
  fontSize = canvas.width / 15;
  tempCtx.font = `${fontSize}px 'Microsoft YaHei', sans-serif`; // 設定字體樣式
  tempCtx.textAlign = 'center'; // 文字水平置中
  tempCtx.textBaseline = 'middle'; // 文字垂直置中

  const maxWidth = canvas.width * 0.8; // 設定文字的最大寬度為 Canvas 寬度的 80%
  const lineHeight = fontSize * 1.2; // 設定行高為字體大小的 1.2 倍
  const lines = wrapText(tempCtx, text, maxWidth); // 將文本進行自動換行

  textHeight = lines.length * lineHeight; // 計算總文字高度

  tempCtx.fillStyle = '#FFFFFF'; // 設定填充顏色為白色

  // 在臨時 Canvas 上繪製每一行文本
  for (let i = 0; i < lines.length; i++) {
    tempCtx.fillText(
      lines[i],
      tempCanvas.width / 2, // x 座標設為 Canvas 的中心
      tempCanvas.height / 2 - textHeight / 2 + i * lineHeight + lineHeight / 2 // y 座標計算，確保文字垂直置中
    );
  }

  textWidth = maxWidth; // 文字寬度設為最大寬度

  // 獲取臨時 Canvas 上的圖像數據
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

  // 遍歷圖像數據的每個像素，每隔2個像素檢查一次
  for (let y = 0; y < tempCanvas.height; y += 2) {
    for (let x = 0; x < tempCanvas.width; x += 2) {
      const index = (y * tempCanvas.width + x) * 4; // 計算像素在數據中的索引
      const alpha = imageData.data[index + 3]; // 獲取像素的透明度值

      if (alpha > 128) {
        // 如果像素不透明（透明度大於 128）
        const color = '#FFFFFF'; // 設定粒子顏色為白色

        // 創建新的粒子，位置根據 Canvas 中心調整
        const particle = new Particle(
          x - canvas.width / 2 + textWidth / 2, // 調整 x 座標，使粒子置中
          y - canvas.height / 2 + textHeight / 2, // 調整 y 座標，使粒子置中
          color // 粒子顏色
        );
        particles.push(particle); // 將粒子加入粒子陣列
      }
    }
  }
}
```

### 自動換行函數

確保歌詞在 Canvas 上整齊換行，保持可讀性。

```js
function wrapText(context, text, maxWidth) {
  const words = text.split(' '); // 將文本以空格分割成單詞陣列
  const lines = []; // 初始化一個空陣列，用於存儲分行後的文本
  let currentLine = words[0]; // 將第一個單詞設為當前行的開始

  // 從第二個單詞開始遍歷所有單詞
  for (let i = 1; i < words.length; i++) {
    const word = words[i]; // 取得當前單詞
    // 計算將當前單詞加入當前行後的總寬度
    const width = context.measureText(`${currentLine} ${word}`).width;

    // 如果總寬度小於最大寬度，則將單詞加入當前行
    if (width < maxWidth) {
      currentLine += ` ${word}`;
    } else {
      // 否則，將當前行推入 lines 陣列，並開始一個新的行
      lines.push(currentLine);
      currentLine = word;
    }
  }

  // 將最後一行加入 lines 陣列
  lines.push(currentLine);

  return lines; // 返回分行後的文本陣列
}
```

## RWD與其他可改進的點

### 響應式設計（RWD）

確保 Canvas 和音頻播放器在不同設備和尺寸下都能展示。

```js
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

window.addEventListener('resize', () => {
  fontSize = canvas.width / 10;
  resizeCanvas();
  createParticles(lyrics[currentLineIndex].text);
});
```

### 字體大小的動態調整

```js
fontSize = canvas.width / 15; // 調整字體大小
tempCtx.font = `${fontSize}px 'Microsoft YaHei', sans-serif`;
```

### 性能優化

- **粒子數量控制**：通過調整粒子的間距和大小來平衡性能和視覺效果。
- **高效渲染**：使用 `requestAnimationFrame` 確保動畫循環的流暢。
- **資源管理**：在處理大量文本或高粒子數量時，管理好內存和處理能力，避免遇到效能瓶頸。

### 其他可改進的點

- **更多粒子效果**：引入不同形狀和顏色的粒子，增強視覺多樣性。
- **用戶自定義**：允許用戶自定義粒子的外觀和行為，如顏色、大小、運動方式等。
- **卡拉OK式**：實現卡拉OK式的歌詞 highlight 顯示，提升用戶體驗及炫砲程度。
- **效能最佳化**: 優化程式效能，可以動態的決定，粒子將渲染或不要渲染。
- **多種動畫效果**：添加粒子旋轉、彈跳等多樣化動畫，提升視覺動感。
- **音樂節奏同步**：根據音樂節奏調整粒子運動，增強與音樂的同步感。
- **手機互動性提升**：在移動設備上支持觸摸互動，提升手機端用戶體驗。
- **粒子生命週期管理**：設計粒子的運轉週期機制，使粒子效果更自然。

## 總結

通過這次的 Canvas 粒子化練習，實現了一個同步歌詞的互動粒子效果播放器。並透過 chatgpt4o-mini 及 perplexity 加速開發體驗，並透過自己對 JS 的認知加上組合功能，
整體來說還是很有趣的 🌟

下一篇會針對可改進的點繪製流體粒子效果！

## Reference

- [Franks laboratory](https://www.youtube.com/@Frankslaboratory) 非常推薦的資源！
- [MDN - Canvas API](https://developer.mozilla.org/zh-TW/docs/Web/API/Canvas_API)
- [Code](https://github.com/eepson123tw/fet-practice-skills/blob/master/fet-trick/canvas/canvas-lyrics-player.html)
