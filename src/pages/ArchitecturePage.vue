<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface ServiceNode {
  id: string
  name: string
  description: string
  tech: string[]
  x: number
  y: number
  color: string
}

const services: ServiceNode[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    description: 'Vue 3 + Vite + TypeScript SPA with cyberpunk UI design',
    tech: ['Vue 3', 'Vite', 'TypeScript', 'Pinia'],
    x: 50,
    y: 15,
    color: 'var(--neon-cyan)',
  },
  {
    id: 'gateway',
    name: 'API Gateway',
    description: 'Go-based gateway with rate limiting and authentication',
    tech: ['Go', 'Gin', 'Redis', 'JWT'],
    x: 50,
    y: 35,
    color: 'var(--neon-purple)',
  },
  {
    id: 'blog',
    name: 'Blog Service',
    description: 'Core blog service handling CRUD operations and caching',
    tech: ['Go', 'GORM', 'SQLite', 'Redis'],
    x: 30,
    y: 55,
    color: 'var(--neon-cyan)',
  },
  {
    id: 'ai',
    name: 'AI Service',
    description: 'AI-powered content summarization and analysis',
    tech: ['Go', 'OpenAI', 'Kafka'],
    x: 70,
    y: 55,
    color: 'var(--neon-pink)',
  },
  {
    id: 'redis',
    name: 'Redis Cache',
    description: 'High-performance caching layer for hot data',
    tech: ['Redis', 'Docker'],
    x: 20,
    y: 75,
    color: 'var(--neon-purple)',
  },
  {
    id: 'db',
    name: 'Database',
    description: 'SQLite for persistent storage with GORM ORM',
    tech: ['SQLite', 'GORM'],
    x: 50,
    y: 85,
    color: 'var(--neon-cyan)',
  },
  {
    id: 'mq',
    name: 'Message Queue',
    description: 'Kafka for async task processing and event streaming',
    tech: ['Kafka', 'Docker'],
    x: 80,
    y: 75,
    color: 'var(--neon-pink)',
  },
]

const connections = [
  { from: 'frontend', to: 'gateway' },
  { from: 'gateway', to: 'blog' },
  { from: 'gateway', to: 'ai' },
  { from: 'blog', to: 'redis' },
  { from: 'blog', to: 'db' },
  { from: 'ai', to: 'mq' },
  { from: 'mq', to: 'blog' },
]

const selectedService = ref<ServiceNode | null>(null)
const animationProgress = ref(0)
let animationFrame: number

function selectService(service: ServiceNode) {
  selectedService.value = selectedService.value?.id === service.id ? null : service
}

function animate() {
  animationProgress.value = (animationProgress.value + 0.5) % 100
  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
})

function getServicePosition(id: string) {
  return services.find((s) => s.id === id)
}

function getPath(from: string, to: string) {
  const fromService = getServicePosition(from)
  const toService = getServicePosition(to)
  if (!fromService || !toService) return ''

  return `M ${fromService.x} ${fromService.y + 5} L ${toService.x} ${toService.y - 5}`
}
</script>

<template>
  <div class="architecture-page">
    <header class="page-header glass-panel">
      <h1 class="page-title">
        <span class="title-decoration">&lt;</span>
        系统架构
        <span class="title-decoration">/&gt;</span>
      </h1>
      <p class="page-subtitle">高性能分布式博客平台</p>
      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>
    </header>

    <section class="diagram-section glass-panel">
      <div class="diagram-container">
        <svg class="architecture-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="var(--neon-cyan)" />
              <stop offset="100%" stop-color="var(--neon-purple)" />
            </linearGradient>
          </defs>

          <g class="connections">
            <path
              v-for="(conn, index) in connections"
              :key="index"
              :d="getPath(conn.from, conn.to)"
              fill="none"
              stroke="url(#lineGradient)"
              stroke-width="0.3"
              stroke-dasharray="2 1"
              :stroke-dashoffset="animationProgress"
              class="connection-line"
            />
          </g>

          <g class="nodes">
            <g
              v-for="service in services"
              :key="service.id"
              class="node"
              :class="{ active: selectedService?.id === service.id }"
              :transform="`translate(${service.x}, ${service.y})`"
              @click="selectService(service)"
            >
              <rect
                :x="-10"
                :y="-5"
                width="20"
                height="10"
                rx="1"
                :fill="'rgba(0,0,0,0.5)'"
                :stroke="service.color"
                stroke-width="0.3"
                class="node-bg"
              />
              <text
                text-anchor="middle"
                dominant-baseline="middle"
                :fill="service.color"
                font-size="2.5"
                font-family="var(--font-mono)"
                font-weight="600"
                class="node-label"
              >
                {{ service.name }}
              </text>
              <circle
                v-if="selectedService?.id === service.id"
                cx="0"
                cy="0"
                r="8"
                fill="none"
                :stroke="service.color"
                stroke-width="0.2"
                class="selection-ring"
              />
            </g>
          </g>
        </svg>
      </div>
      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>
    </section>

    <section class="service-details" v-if="selectedService">
      <div class="detail-card glass-panel">
        <div class="detail-header" :style="{ borderColor: selectedService.color }">
          <h3 class="detail-title" :style="{ color: selectedService.color }">
            {{ selectedService.name }}
          </h3>
          <span class="detail-status">
            <span class="status-dot"></span>
            在线
          </span>
        </div>
        <p class="detail-description">{{ selectedService.description }}</p>
        <div class="detail-tech">
          <h4 class="tech-title">技术栈:</h4>
          <div class="tech-tags">
            <span
              v-for="tech in selectedService.tech"
              :key="tech"
              class="tech-tag"
              :style="{ borderColor: selectedService.color }"
            >
              {{ tech }}
            </span>
          </div>
        </div>
        <div class="corner-decoration top-left"></div>
        <div class="corner-decoration top-right"></div>
        <div class="corner-decoration bottom-left"></div>
        <div class="corner-decoration bottom-right"></div>
      </div>
    </section>

    <section class="services-grid">
      <div
        v-for="service in services"
        :key="service.id"
        class="service-card glass-panel"
        :class="{ active: selectedService?.id === service.id }"
        @click="selectService(service)"
      >
        <div class="card-indicator" :style="{ background: service.color }"></div>
        <h4 class="card-title">{{ service.name }}</h4>
        <p class="card-desc">{{ service.description }}</p>
        <div class="card-tech">
          <span v-for="tech in service.tech.slice(0, 2)" :key="tech" class="mini-tag">
            {{ tech }}
          </span>
          <span v-if="service.tech.length > 2" class="mini-tag more">
            +{{ service.tech.length - 2 }}
          </span>
        </div>
      </div>
    </section>

    <section class="metrics-section glass-panel">
      <h3 class="metrics-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        系统指标
      </h3>
      <div class="metrics-grid">
        <div class="metric-item">
          <div class="metric-value">10K+</div>
          <div class="metric-label">请求/秒</div>
          <div class="metric-bar">
            <div class="bar-fill" style="width: 85%"></div>
          </div>
        </div>
        <div class="metric-item">
          <div class="metric-value">&lt;50ms</div>
          <div class="metric-label">平均延迟</div>
          <div class="metric-bar">
            <div class="bar-fill" style="width: 95%"></div>
          </div>
        </div>
        <div class="metric-item">
          <div class="metric-value">99.9%</div>
          <div class="metric-label">在线率</div>
          <div class="metric-bar">
            <div class="bar-fill" style="width: 99%"></div>
          </div>
        </div>
        <div class="metric-item">
          <div class="metric-value">95%</div>
          <div class="metric-label">缓存命中率</div>
          <div class="metric-bar">
            <div class="bar-fill" style="width: 95%"></div>
          </div>
        </div>
      </div>
      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>
    </section>
  </div>
</template>

<style scoped>
.architecture-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  padding: 24px;
  text-align: center;
  position: relative;
}

.page-title {
  font-family: var(--font-sans);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.title-decoration {
  color: var(--neon-cyan);
  opacity: 0.7;
}

.page-subtitle {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.diagram-section {
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.diagram-container {
  position: relative;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.architecture-svg {
  width: 100%;
  height: auto;
  display: block;
}

.connection-line {
  opacity: 0.6;
  animation: data-flow 3s linear infinite;
}

.node {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.node:hover {
  transform: scale(1.1);
}

.node-bg {
  transition: all 0.3s ease;
}

.node:hover .node-bg {
  filter: brightness(1.3);
}

.node.active .node-bg {
  filter: brightness(1.5) drop-shadow(0 0 10px currentColor);
}

.selection-ring {
  animation: pulse-glow 1.5s ease-in-out infinite;
}

.node-label {
  pointer-events: none;
}

.service-details {
  margin: 0;
}

.detail-card {
  padding: 20px;
  position: relative;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 2px solid;
}

.detail-title {
  font-family: var(--font-sans);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.detail-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--neon-cyan);
  letter-spacing: 0.1em;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--neon-cyan);
  border-radius: 50%;
  animation: pulse-glow 1.5s ease-in-out infinite;
}

.detail-description {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.detail-tech {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tech-title {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.15em;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  padding: 6px 14px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid;
  border-radius: 4px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.service-card {
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.service-card:hover {
  transform: translateY(-2px);
}

.service-card.active {
  border-color: var(--neon-cyan);
}

.card-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
}

.card-title {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  padding-left: 12px;
}

.card-desc {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.card-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mini-tag {
  padding: 3px 8px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.mini-tag.more {
  color: var(--neon-purple);
  background: rgba(185, 103, 255, 0.1);
}

.metrics-section {
  padding: 20px;
  position: relative;
}

.metrics-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--neon-purple);
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}

.metrics-title svg {
  width: 18px;
  height: 18px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-value {
  font-family: var(--font-sans);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--neon-cyan);
}

.metric-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.metric-bar {
  height: 4px;
  background: rgba(0, 245, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple));
  border-radius: 2px;
}

@media (max-width: 768px) {
  .diagram-section {
    padding: 16px;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
