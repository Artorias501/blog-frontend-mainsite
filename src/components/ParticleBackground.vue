<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const animationId = ref<number>(0)
const particles = ref<Particle[]>([])

function createParticle(): Particle {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.5 + 0.2,
  }
}

function initParticles() {
  const count = Math.floor((window.innerWidth * window.innerHeight) / 15000)
  particles.value = Array.from({ length: count }, createParticle)
}

function animate(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  particles.value.forEach((p) => {
    p.x += p.speedX
    p.y += p.speedY

    if (p.x < 0) p.x = ctx.canvas.width
    if (p.x > ctx.canvas.width) p.x = 0
    if (p.y < 0) p.y = ctx.canvas.height
    if (p.y > ctx.canvas.height) p.y = 0

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0, 245, 255, ${p.opacity})`
    ctx.fill()
  })

  animationId.value = requestAnimationFrame(() => animate(ctx))
}

function resizeCanvas() {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
  initParticles()
}

onMounted(() => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  resizeCanvas()
  animate(ctx)

  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId.value)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <canvas ref="canvasRef" class="particles-canvas"></canvas>
</template>

<style scoped>
.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
