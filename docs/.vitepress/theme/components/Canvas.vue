<template>
  <div class="canvas">
    <canvas
      ref="animationCanvas"
      class="absolute top-0 left-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    ></canvas>
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

// 初始化節點
const initializeNodes = (width: number, height: number) => {
  nodes.length = 0; // 清空現有節點

  for (let i = 0; i < 30; i++) {
    const radius = 3 + Math.random() * 5;
    nodes.push({
      x: Math.random() * (width - 2 * radius) + radius,
      y: Math.random() * (height - 2 * radius) + radius,
      radius,
      color: `rgba(${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)}, 0.45)`,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
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
    }
    if (node.y - node.radius < 0 || node.y + node.radius > height) {
      node.vy *= -1;
      node.y = Math.max(node.radius, Math.min(node.y, height - node.radius));
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
      if (distance < 100) {
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

  // 繼續動畫循環
  animationFrameId = requestAnimationFrame(() => animate(ctx, width, height));
};

// 設置畫布大小，考慮設備像素比
const setCanvasSize = () => {
  const canvas = animationCanvas.value;
  if (!canvas) return;
  const parent = canvas.parentElement;
  if (!parent) return;

  const rect = parent.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  // 設置畫布的寬度和高度，考慮 DPR
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // 設置 CSS 寬度和高度
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    // 重置變換，避免累積縮放
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
};

// 定義 handleResize 作為獨立函數
const handleResize = () => {
  setCanvasSize();
  if (animationCanvas.value) {
    const dpr = window.devicePixelRatio || 1;
    initializeNodes(
      animationCanvas.value.width / dpr,
      animationCanvas.value.height / dpr
    );
  }
};

// 追蹤當前的動畫上下文，以便在重新啟動動畫時使用
let currentCtx: CanvasRenderingContext2D | null = null;

onMounted(() => {
  const canvas = animationCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  currentCtx = ctx;

  // 初始設置畫布大小
  setCanvasSize();

  // 初始化節點，使用 CSS 像素值
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  initializeNodes(width, height);

  // 開始動畫
  animate(ctx, width, height);

  // 監聽窗口縮放事件
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  // 清除動畫循環和事件監聽器
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}
</style>
