<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const route = useRoute()
const blogStore = useBlogStore()

const post = computed(() => {
  const id = parseInt(route.params.id as string)
  return blogStore.getPostById(id)
})

onMounted(() => {
  if (!post.value) return
  document.title = `${post.value.title} | Artorias's Blog`
})
</script>

<template>
  <div class="blog-detail-page" v-if="post">
    <article class="post-article glass-panel">
      <header class="post-header">
        <div class="post-meta">
          <span class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {{ post.createdAt }}
          </span>
          <span class="meta-divider">|</span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {{ post.readTime }} 分钟阅读
          </span>
        </div>

        <h1 class="post-title">{{ post.title }}</h1>

        <div class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </header>

      <div class="post-content">
        <div class="markdown-body" v-html="post.content"></div>
      </div>

      <div class="ai-summary-section" v-if="post.aiSummary">
        <div class="summary-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span>AI 摘要</span>
          <span class="ai-badge">
            <span class="badge-dot"></span>
            已生成
          </span>
        </div>
        <p class="ai-summary-text">{{ post.aiSummary }}</p>
      </div>

      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>
    </article>
  </div>

  <div class="not-found" v-else>
    <div class="not-found-content glass-panel">
      <div class="error-code">404</div>
      <h2>文章未找到</h2>
      <p>请求的文章不存在。</p>
      <RouterLink to="/" class="glow-button cyan">返回首页</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.blog-detail-page {
  display: flex;
  flex-direction: column;
}

.post-article {
  padding: 32px;
  position: relative;
}

.post-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.meta-item svg {
  width: 14px;
  height: 14px;
  color: var(--neon-cyan-dim);
}

.meta-divider {
  color: var(--neon-purple);
  opacity: 0.5;
}

.post-title {
  font-family: var(--font-sans);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 16px;
  letter-spacing: 0.02em;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--neon-purple);
  background: rgba(185, 103, 255, 0.1);
  border: 1px solid rgba(185, 103, 255, 0.2);
  border-radius: 4px;
}

.post-content {
  margin-bottom: 32px;
}

.markdown-body {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.8;
  color: var(--text-primary);
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  font-family: var(--font-sans);
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 2em;
  margin-bottom: 1em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid var(--border-color);
}

.markdown-body :deep(h1) {
  font-size: 1.5rem;
}

.markdown-body :deep(h2) {
  font-size: 1.25rem;
  color: var(--neon-cyan);
}

.markdown-body :deep(h3) {
  font-size: 1.1rem;
  border-bottom: none;
}

.markdown-body :deep(p) {
  margin-bottom: 1.2em;
}

.markdown-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.85em;
  padding: 2px 6px;
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid rgba(0, 245, 255, 0.2);
  border-radius: 4px;
  color: var(--neon-cyan);
}

.markdown-body :deep(pre) {
  margin: 1.5em 0;
  padding: 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow-x: auto;
  position: relative;
}

.markdown-body :deep(pre)::before {
  content: 'CODE';
  position: absolute;
  top: 8px;
  right: 12px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
  border: none;
  color: var(--text-primary);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 1em 0;
  padding-left: 2em;
}

.markdown-body :deep(li) {
  margin-bottom: 0.5em;
}

.markdown-body :deep(blockquote) {
  margin: 1.5em 0;
  padding: 12px 20px;
  background: rgba(185, 103, 255, 0.1);
  border-left: 3px solid var(--neon-purple);
  color: var(--text-secondary);
}

.markdown-body :deep(strong) {
  color: var(--neon-cyan);
  font-weight: 600;
}

.ai-summary-section {
  padding: 20px;
  background: rgba(0, 245, 255, 0.05);
  border: 1px solid rgba(0, 245, 255, 0.2);
  border-radius: 8px;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--neon-cyan);
  letter-spacing: 0.15em;
}

.summary-header svg {
  width: 16px;
  height: 16px;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 0.6rem;
  color: var(--neon-cyan);
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid rgba(0, 245, 255, 0.2);
  border-radius: 4px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: var(--neon-cyan);
  border-radius: 50%;
  animation: pulse-glow 1.5s ease-in-out infinite;
}

.ai-summary-text {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.not-found-content {
  text-align: center;
  padding: 48px;
}

.error-code {
  font-family: var(--font-sans);
  font-size: 5rem;
  font-weight: 900;
  color: var(--neon-pink);
  text-shadow: var(--glow-pink);
  line-height: 1;
  margin-bottom: 16px;
}

.not-found-content h2 {
  font-family: var(--font-sans);
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.not-found-content p {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .post-article {
    padding: 24px;
  }
}
</style>
