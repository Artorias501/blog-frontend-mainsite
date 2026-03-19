<script setup lang="ts">
import { computed } from 'vue'
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()

const recentPosts = computed(() => blogStore.posts.slice(0, 5))

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <aside class="right-sidebar">
    <div class="recent-card glass-panel">
      <div class="card-header">
        <svg
          class="header-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <span class="header-title">最新文章</span>
      </div>

      <div class="posts-list">
        <RouterLink
          v-for="post in recentPosts"
          :key="post.id"
          :to="`/blog/${post.id}`"
          class="post-item"
        >
          <div class="post-indicator"></div>
          <div class="post-content">
            <h4 class="post-title">{{ post.title }}</h4>
            <span class="post-date">{{ formatDate(post.created_at) }}</span>
          </div>
        </RouterLink>
      </div>

      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>
    </div>
  </aside>
</template>

<style scoped>
.right-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.recent-card {
  padding: 20px;
  position: relative;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.header-icon {
  width: 16px;
  height: 16px;
  color: var(--neon-purple);
}

.header-title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--neon-purple);
  letter-spacing: 0.15em;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
  text-decoration: none;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.post-item:hover {
  background: rgba(0, 245, 255, 0.05);
  border-color: var(--border-color);
}

.post-item:hover .post-indicator {
  background: var(--neon-cyan);
  box-shadow: 0 0 10px var(--neon-cyan);
}

.post-item:hover .post-title {
  color: var(--neon-cyan);
}

.post-indicator {
  width: 3px;
  height: 100%;
  min-height: 40px;
  background: var(--neon-purple);
  border-radius: 2px;
  opacity: 0.5;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.post-content {
  flex: 1;
  min-width: 0;
}

.post-title {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.post-date {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

@media (max-width: 1200px) {
  .right-sidebar {
    display: none;
  }
}
</style>
