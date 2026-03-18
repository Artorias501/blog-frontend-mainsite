<script setup lang="ts">
import { useBlogStore } from '@/stores/blog'
import ParticleBackground from '@/components/ParticleBackground.vue'
import BlogCard from '@/components/BlogCard.vue'

const blogStore = useBlogStore()
</script>

<template>
  <div class="home-page">
    <ParticleBackground />

    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">SYSTEM_ONLINE</div>
        <h1 class="hero-title">
          <span class="title-line">
            <span class="glitch-text" data-text="AI BLOG">AI BLOG</span>
          </span>
          <span class="title-line">
            <span class="highlight">SYSTEM</span>
          </span>
        </h1>
        <p class="hero-subtitle">
          <span class="subtitle-bracket">[</span>
          High Performance · Distributed · AI Powered
          <span class="subtitle-bracket">]</span>
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">{{ blogStore.posts.length }}</span>
            <span class="stat-label">POSTS</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">99.9%</span>
            <span class="stat-label">UPTIME</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">&lt;50ms</span>
            <span class="stat-label">LATENCY</span>
          </div>
        </div>
        <div class="hero-actions">
          <RouterLink to="/" class="glow-button cyan">
            <svg
              class="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Enter System
          </RouterLink>
          <RouterLink to="/architecture" class="glow-button purple">
            <svg
              class="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            View Architecture
          </RouterLink>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-ring ring-1"></div>
        <div class="visual-ring ring-2"></div>
        <div class="visual-ring ring-3"></div>
        <div class="visual-core">
          <span class="core-text">AI</span>
        </div>
      </div>
    </section>

    <section class="blog-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-decoration">&lt;</span>
          LATEST_POSTS
          <span class="title-decoration">/&gt;</span>
        </h2>
        <p class="section-desc">Recent articles from the system database</p>
      </div>

      <div class="blog-grid">
        <BlogCard v-for="post in blogStore.posts" :key="post.id" :post="post" />
      </div>
    </section>

    <div class="grid-lines">
      <div class="grid-line" v-for="n in 6" :key="n"></div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  position: relative;
  min-height: calc(100vh - 200px);
}

.hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 0;
  position: relative;
}

.hero-content {
  max-width: 600px;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--neon-cyan);
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid var(--neon-cyan);
  border-radius: 4px;
  margin-bottom: 24px;
  animation: pulse-glow 2s ease-in-out infinite;
}

.hero-title {
  font-family: var(--font-sans);
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 20px;
}

.title-line {
  display: block;
}

.glitch-text {
  position: relative;
  color: var(--text-primary);
  text-shadow:
    0 0 10px rgba(0, 245, 255, 0.5),
    0 0 20px rgba(0, 245, 255, 0.3);
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch-text::before {
  color: var(--neon-cyan);
  animation: glitch 3s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
}

.glitch-text::after {
  color: var(--neon-pink);
  animation: glitch 2s infinite reverse;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
}

.highlight {
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
}

.hero-subtitle {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--text-secondary);
  letter-spacing: 0.1em;
  margin-bottom: 32px;
}

.subtitle-bracket {
  color: var(--neon-purple);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
  padding: 16px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-family: var(--font-sans);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--neon-cyan);
}

.stat-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.15em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.glow-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.hero-visual {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  opacity: 0.3;
}

.ring-1 {
  width: 100%;
  height: 100%;
  border-color: var(--neon-cyan);
  animation: float 4s ease-in-out infinite;
}

.ring-2 {
  width: 75%;
  height: 75%;
  border-color: var(--neon-purple);
  animation: float 4s ease-in-out infinite reverse;
  animation-delay: 1s;
}

.ring-3 {
  width: 50%;
  height: 50%;
  border-color: var(--neon-pink);
  animation: float 4s ease-in-out infinite;
  animation-delay: 2s;
}

.visual-core {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
  border-radius: 50%;
  box-shadow:
    0 0 30px rgba(0, 245, 255, 0.5),
    0 0 60px rgba(185, 103, 255, 0.3);
  animation: pulse-glow 2s ease-in-out infinite;
}

.core-text {
  font-family: var(--font-sans);
  font-size: 2rem;
  font-weight: 900;
  color: var(--bg-primary);
}

.blog-section {
  padding: 60px 0;
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-family: var(--font-sans);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.title-decoration {
  color: var(--neon-cyan);
  opacity: 0.7;
}

.section-desc {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.grid-lines {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.03;
}

.grid-line {
  position: absolute;
  width: 1px;
  height: 100%;
  background: var(--neon-cyan);
}

.grid-line:nth-child(1) {
  left: 10%;
}
.grid-line:nth-child(2) {
  left: 25%;
}
.grid-line:nth-child(3) {
  left: 40%;
}
.grid-line:nth-child(4) {
  left: 55%;
}
.grid-line:nth-child(5) {
  left: 70%;
}
.grid-line:nth-child(6) {
  left: 85%;
}

@media (max-width: 1024px) {
  .hero {
    flex-direction: column;
    text-align: center;
  }

  .hero-content {
    margin-bottom: 40px;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-visual {
    width: 200px;
    height: 200px;
  }

  .visual-core {
    width: 80px;
    height: 80px;
  }

  .core-text {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    flex-wrap: wrap;
    gap: 16px;
  }

  .stat-divider {
    display: none;
  }

  .hero-actions {
    flex-direction: column;
  }

  .glow-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
