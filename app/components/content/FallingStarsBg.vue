<template>
  <canvas
    ref="starsCanvas"
    class="absolute inset-0 z-[-1] size-full bg-white dark:bg-black"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

interface Star {
  x: number;
  y: number;
  z: number;
  speed: number;
}

const props = withDefaults(
  defineProps<{
    color?: string;
    count?: number;
    class?: string;
  }>(),
  {
    color: '#FFF',
    count: 200,
  },
);

const starsCanvas = ref<HTMLCanvasElement | null>(null);
let perspective: number = 0;
let stars: Star[] = [];
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number | null = null;
const isMounted = ref(false);

function initStars() {
  const canvas = starsCanvas.value;
  if (!canvas)
    return;

  perspective = canvas.width / 2;
  stars = [];

  for (let i = 0; i < props.count; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 2 * canvas.width,
      y: (Math.random() - 0.5) * 2 * canvas.height,
      z: Math.random() * canvas.width,
      speed: Math.random() * 5 + 2,
    });
  }
}

function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  const bigint = Number.parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function drawStar(star: Star) {
  const canvas = starsCanvas.value;
  if (!canvas)
    return;

  ctx = canvas.getContext('2d');
  if (!ctx)
    return;

  const scale = perspective / (perspective + star.z);
  const x2d = canvas.width / 2 + star.x * scale;
  const y2d = canvas.height / 2 + star.y * scale;
  const size = Math.max(scale * 3, 0.5);

  const prevScale = perspective / (perspective + star.z + star.speed * 15);
  const xPrev = canvas.width / 2 + star.x * prevScale;
  const yPrev = canvas.height / 2 + star.y * prevScale;

  const rgb = hexToRgb(props.color);

  ctx.save();
  ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
  ctx.lineWidth = size * 2.5;
  ctx.shadowBlur = 35;
  ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
  ctx.beginPath();
  ctx.moveTo(x2d, y2d);
  ctx.lineTo(xPrev, yPrev);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`;
  ctx.lineWidth = size;
  ctx.beginPath();
  ctx.moveTo(x2d, y2d);
  ctx.lineTo(xPrev, yPrev);
  ctx.stroke();

  ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
  ctx.beginPath();
  ctx.arc(x2d, y2d, size / 4, 0, Math.PI * 2);
  ctx.fill();
}

function animate() {
  const canvas = starsCanvas.value;
  if (!canvas)
    return;

  ctx = canvas.getContext('2d');
  if (!ctx)
    return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    drawStar(star);

    star.z -= star.speed;

    if (star.z <= 0) {
      star.z = canvas.width;
      star.x = (Math.random() - 0.5) * 2 * canvas.width;
      star.y = (Math.random() - 0.5) * 2 * canvas.height;
    }
  });

  animationFrameId = requestAnimationFrame(animate);
}

function resizeCanvas() {
  const canvas = starsCanvas.value;
  if (!canvas)
    return;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  initStars(); // Reinitialize stars on resize
}

onMounted(() => {
  const canvas = starsCanvas.value;
  if (!canvas || isMounted.value)
    return;

  isMounted.value = true;

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // Sets canvas dimensions and initializes stars
  animate(); // Starts the animation
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  window.removeEventListener('resize', resizeCanvas);
  isMounted.value = false;
});

watch(() => isMounted.value, (val) => {
  stars = [];
  setTimeout(() => {
    if (val) {
      resizeCanvas();
      animate();
    }
  }, 100);
});
</script>
