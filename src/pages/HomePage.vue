<script setup lang="ts">
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()
</script>

<template>
  <div class="home-page">
    <section class="hero-section glass-panel">
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
          <RouterLink to="/articles" class="glow-button cyan">
            <svg
              class="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            View Articles
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
            Architecture
          </RouterLink>
        </div>
      </div>
      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>
    </section>

    <section class="featured-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-decoration">&lt;</span>
          FEATURED_POSTS
          <span class="title-decoration">/&gt;</span>
        </h2>
      </div>
      <div class="featured-grid">
        <RouterLink
          v-for="post in blogStore.recentPosts"
          :key="post.id"
          :to="`/blog/${post.id}`"
          class="featured-card glass-panel"
        >
          <div class="card-glow"></div>
          <div class="card-content">
            <div class="card-meta">
              <span class="meta-item">{{ post.createdAt }}</span>
              <span class="meta-divider">|</span>
              <span class="meta-item">{{ post.readTime }} min</span>
            </div>
            <h3 class="card-title">{{ post.title }}</h3>
            <p class="card-summary">{{ post.summary }}</p>
            <div class="card-tags">
              <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="corner-decoration top-left"></div>
          <div class="corner-decoration top-right"></div>
          <div class="corner-decoration bottom-left"></div>
          <div class="corner-decoration bottom-right"></div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hero-section {
  padding: 48px 40px;
  position: relative;
}

.hero-content {
  max-width: 600px;
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
  font-size: clamp(2.5rem, 6vw, 4rem);
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
  font-size: 0.9rem;
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
  gap: 20px;
  margin-bottom: 32px;
  padding: 16px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: fit-content;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-family: var(--font-sans);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--neon-cyan);
}

.stat-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.15em;
}

.stat-divider {
  width: 1px;
  height: 32px;
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

.featured-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-title {
  font-family: var(--font-sans);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.1em;
}

.title-decoration {
  color: var(--neon-cyan);
  opacity: 0.7;
}

.featured-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.featured-card {
  padding: 24px;
  position: relative;
  text-decoration: none;
  transition: all 0.3s ease;
  overflow: hidden;
}

.featured-card:hover {
  transform: translateX(4px);
  border-color: var(--neon-cyan);
}

.featured-card:hover .card-glow {
  opacity: 1;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(to bottom, var(--neon-cyan), var(--neon-purple));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
}

.meta-divider {
  color: var(--neon-purple);
  opacity: 0.5;
}

.card-title {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  transition: color 0.3s ease;
}

.featured-card:hover .card-title {
  color: var(--neon-cyan);
}

.card-summary {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  font-size: 0.65rem;
  font-family: var(--font-mono);
  color: var(--neon-purple);
  background: rgba(185, 103, 255, 0.1);
  border: 1px solid rgba(185, 103, 255, 0.2);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 32px 24px;
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
