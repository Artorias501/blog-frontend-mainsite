<script setup lang="ts">
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()
</script>

<template>
  <div class="articles-page">
    <header class="page-header glass-panel">
      <h1 class="page-title">
        <span class="title-decoration">&lt;</span>
        所有文章
        <span class="title-decoration">/&gt;</span>
      </h1>
      <p class="page-subtitle">浏览系统中的所有文章</p>
      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>
    </header>

    <div class="articles-list">
      <RouterLink
        v-for="post in blogStore.posts"
        :key="post.id"
        :to="`/blog/${post.id}`"
        class="article-card glass-panel"
      >
        <div class="card-indicator"></div>
        <div class="card-main">
          <div class="card-header">
            <h2 class="card-title">{{ post.title }}</h2>
            <div class="card-meta">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {{ post.createdAt }}
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {{ post.readTime }} 分钟阅读
              </span>
            </div>
          </div>
          <p class="card-summary">{{ post.summary }}</p>
          <div class="card-footer">
            <div class="card-tags">
              <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <span class="read-more">
              阅读更多
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </div>
        </div>
        <div class="corner-decoration top-left"></div>
        <div class="corner-decoration top-right"></div>
        <div class="corner-decoration bottom-left"></div>
        <div class="corner-decoration bottom-right"></div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.articles-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  padding: 32px;
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

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
  display: flex;
  padding: 24px;
  position: relative;
  text-decoration: none;
  transition: all 0.3s ease;
  overflow: hidden;
}

.article-card:hover {
  transform: translateX(4px);
  border-color: var(--neon-cyan);
}

.article-card:hover .card-indicator {
  background: var(--neon-cyan);
  box-shadow: 0 0 15px var(--neon-cyan);
}

.article-card:hover .card-title {
  color: var(--neon-cyan);
}

.card-indicator {
  width: 4px;
  background: var(--neon-purple);
  border-radius: 2px;
  margin-right: 24px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.card-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.card-title {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  transition: color 0.3s ease;
}

.card-meta {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
}

.meta-item svg {
  width: 14px;
  height: 14px;
  color: var(--neon-cyan-dim);
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

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
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
  transition: all 0.3s ease;
}

.tag:hover {
  background: rgba(185, 103, 255, 0.2);
  border-color: var(--neon-purple);
}

.read-more {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--neon-cyan);
  letter-spacing: 0.1em;
  flex-shrink: 0;
}

.read-more svg {
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
}

.article-card:hover .read-more svg {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .article-card {
    padding: 20px;
  }

  .card-indicator {
    margin-right: 16px;
  }

  .card-header {
    flex-direction: column;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
