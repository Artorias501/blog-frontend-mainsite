<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const route = useRoute()
const blogStore = useBlogStore()

const isBlogDetailPage = computed(() => route.name === 'BlogDetail')
const currentPostId = computed(() => {
  const id = parseInt(route.params.id as string)
  return isNaN(id) ? null : id
})

const currentPost = computed(() => {
  if (!currentPostId.value) return null
  return blogStore.getPostById(currentPostId.value)
})

const tocItems = computed(() => {
  if (!currentPost.value?.content) return []
  const headings = currentPost.value.content.match(/^#{1,3}\s.+$/gm) || []
  return headings.map((h) => {
    const level = (h.match(/^#+/) || [''])[0].length
    const text = h.replace(/^#+\s/, '')
    const id = text.toLowerCase().replace(/\s+/g, '-')
    return { level, text, id }
  })
})

const activeSection = computed(() => '')

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <aside class="left-sidebar">
    <div v-if="isBlogDetailPage && currentPost" class="blog-nav-card glass-panel">
      <div class="card-header">
        <RouterLink to="/articles" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          返回文章列表
        </RouterLink>
      </div>

      <div class="toc-section" v-if="tocItems.length > 0">
        <div class="toc-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span>目录</span>
        </div>
        <nav class="toc-nav">
          <button
            v-for="item in tocItems"
            :key="item.id"
            :class="['toc-item', `level-${item.level}`, { active: activeSection === item.id }]"
            @click="scrollToSection(item.id)"
          >
            {{ item.text }}
          </button>
        </nav>
      </div>

      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>
    </div>

    <template v-else>
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
            <span class="stat-label">文章</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">12</span>
            <span class="stat-label">标签</span>
          </div>
        </div>
        <div class="corner-decoration top-left"></div>
        <div class="corner-decoration top-right"></div>
        <div class="corner-decoration bottom-left"></div>
        <div class="corner-decoration bottom-right"></div>
      </div>
    </template>
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

.blog-nav-card {
  padding: 20px;
  position: relative;
}

.blog-nav-card .card-header {
  margin-bottom: 20px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--neon-cyan);
  text-decoration: none;
  transition: all 0.3s ease;
}

.back-link svg {
  width: 16px;
  height: 16px;
}

.back-link:hover {
  color: var(--neon-purple);
}

.toc-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--neon-cyan);
  letter-spacing: 0.15em;
}

.toc-header svg {
  width: 16px;
  height: 16px;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-item {
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: left;
  background: transparent;
  border: none;
  border-left: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toc-item:hover {
  color: var(--neon-cyan);
  background: rgba(0, 245, 255, 0.05);
}

.toc-item.active {
  color: var(--neon-cyan);
  border-left-color: var(--neon-cyan);
  background: rgba(0, 245, 255, 0.1);
}

.toc-item.level-2 {
  padding-left: 20px;
}

.toc-item.level-3 {
  padding-left: 32px;
  font-size: 0.7rem;
}

.profile-card {
  padding: 20px;
  text-align: center;
  position: relative;
}

.profile-card .card-header {
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
