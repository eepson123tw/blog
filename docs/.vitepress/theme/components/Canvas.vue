<template>
  <div class="canvasContainer">
    <div class="canvas">
      <canvas ref="animationCanvas" aria-hidden="true"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
const animationCanvas = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;

interface Node {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}

interface Line {
  start: Node;
  end: Node;
  color: string;
}

const nodes: Node[] = [];
const lines: Line[] = [];

const NUM = 40;

// 初始化節點
const colorPalette = [
  "#FFC1CC", // 淡粉紅
  "#A8E6CF", // 淡綠色
  "#D4A5FF", // 淡紫色
  "#FFD3B6", // 淡橙色
  "#FFAAA5", // 淡珊瑚色
  "#CDE7FE", // 淡藍色
  "#B5EAD7", // 淡青色
  "#FFB347", // 淡橘色
];

const initializeNodes = (width: number, height: number) => {
  nodes.length = 0; // 清空現有節點

  for (let i = 0; i < NUM; i++) {
    const radius = 3 + Math.random() * 5;
    nodes.push({
      x: Math.random() * (width - 2 * radius) + radius,
      y: Math.random() * (height - 2 * radius) + radius,
      radius,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
    });
  }
};

// 繪製和動畫函數
const animate = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.clearRect(0, 0, width, height);

  // 更新並繪製節點
  nodes.forEach((node) => {
    // 更新位置
    node.x += node.vx;
    node.y += node.vy;

    // 邊界反彈
    if (node.x - node.radius < 0 || node.x + node.radius > width) {
      node.vx *= -1;
      node.x = Math.max(node.radius, Math.min(node.x, width - node.radius));
      node.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    }
    if (node.y - node.radius < 0 || node.y + node.radius > height) {
      node.vy *= -1;
      node.y = Math.max(node.radius, Math.min(node.y, height - node.radius));
      node.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    }

    // 繪製節點
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.fill();
  });

  // 創建節點之間的線條
  lines.length = 0; // 清空現有線條
  nodes.forEach((node, index) => {
    for (let i = index + 1; i < nodes.length; i++) {
      const otherNode = nodes[i];
      const distance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
      if (distance < 1200) {
        lines.push({
          start: node,
          end: otherNode,
          color: `rgba(204, 204, 204, ${1 - distance / 100})`, // 根據距離漸變線條顏色
        });
      }
    }
  });

  // 繪製線條
  lines.forEach((line) => {
    ctx.beginPath();
    ctx.moveTo(line.start.x, line.start.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  animationFrameId = requestAnimationFrame(() => animate(ctx, width, height));
};

// 設置畫布大小，考慮設備像素比
const setCanvasSize = () => {
  const canvas = animationCanvas.value;
  if (!canvas) return;
  const parent = canvas.parentElement;
  if (!parent) return;
  const appContainer = document.querySelector(".VPContent");
  if (!appContainer) return;

  const rect = appContainer.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  // 設置畫布的寬度和高度，考慮 DPR
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  parent.style.width = `${rect.width}px`;
  parent.style.height = `${rect.height}px`;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    // 重置變換，避免累積縮放
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
};

// 追蹤當前的動畫上下文，以便在重新啟動動畫時使用
let currentCtx: CanvasRenderingContext2D | null = null;

onMounted(() => {
  const canvas = animationCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const appContainer = document.querySelector(".VPContent");
  if (!appContainer) return;
  const { width, height } = appContainer.getBoundingClientRect();
  currentCtx = ctx;

  // 初始設置畫布大小
  setCanvasSize();

  // 初始化節點，使用 CSS 像素值
  const renderWidth = width;
  const renderHeight = height;

  initializeNodes(renderWidth, renderHeight);

  // 開始動畫且必須等待其他資源下載完成
  requestAnimationFrame(() => animate(ctx, renderWidth, renderHeight));
});

onBeforeUnmount(() => {
  // 清除動畫循環和事件監聽器
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.canvasContainer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}
.canvas canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}
</style>
