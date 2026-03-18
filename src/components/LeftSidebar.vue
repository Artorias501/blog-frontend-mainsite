<script setup lang="ts">
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()
</script>

<template>
  <aside class="left-sidebar">
    <div class="profile-card glass-panel">
      <div class="card-header">
        <h2 class="card-title">Art's Blog</h2>
        <p class="card-subtitle">text to edit...</p>
      </div>
      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>
    </div>

    <div class="author-card glass-panel">
      <div class="avatar-wrapper">
        <div class="avatar">
          <span class="avatar-text">A</span>
        </div>
        <div class="avatar-glow"></div>
      </div>
      <h3 class="author-name">Artorias</h3>
      <div class="author-stats">
        <div class="stat">
          <span class="stat-value">{{ blogStore.posts.length }}</span>
          <span class="stat-label">Articles</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-value">12</span>
          <span class="stat-label">Tags</span>
        </div>
      </div>
      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>
    </div>
  </aside>
</template>

<style scoped>
.left-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 80px;
  height: fit-content;
}

.profile-card {
  padding: 20px;
  text-align: center;
  position: relative;
}

.card-header {
  margin-bottom: 0;
}

.card-title {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--neon-cyan);
  letter-spacing: 0.1em;
  margin-bottom: 8px;
  text-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
}

.card-subtitle {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.author-card {
  padding: 24px 20px;
  text-align: center;
  position: relative;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.avatar-text {
  font-family: var(--font-sans);
  font-size: 2rem;
  font-weight: 700;
  color: var(--bg-primary);
}

.avatar-glow {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
  opacity: 0.3;
  filter: blur(8px);
  z-index: 0;
}

.author-name {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: 0.05em;
}

.author-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.stat {
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
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: linear-gradient(to bottom, transparent, var(--neon-purple), transparent);
}

@media (max-width: 1200px) {
  .left-sidebar {
    display: none;
  }
}
</style>
