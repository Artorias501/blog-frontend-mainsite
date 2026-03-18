<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const route = useRoute()
const blogStore = useBlogStore()

const post = computed(() => {
  const id = parseInt(route.params.id as string)
  return blogStore.getPostById(id)
})

const activeSection = ref('')

const tocItems = computed(() => {
  if (!post.value?.content) return []
  const headings = post.value.content.match(/^#{1,3}\s.+$/gm) || []
  return headings.map((h) => {
    const level = (h.match(/^#+/) || [''])[0].length
    const text = h.replace(/^#+\s/, '')
    const id = text.toLowerCase().replace(/\s+/g, '-')
    return { level, text, id }
  })
})

function scrollToSection(id: string) {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  if (!post.value) return
  document.title = `${post.value.title} | AI Blog System`
})
</script>

<template>
  <div class="blog-detail-page" v-if="post">
    <header class="post-header glass-panel">
      <div class="header-content">
        <RouterLink to="/" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Posts
        </RouterLink>

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
          <span class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {{ post.readTime }} min read
          </span>
        </div>

        <h1 class="post-title">{{ post.title }}</h1>

        <div class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
    </header>

    <div class="content-layout">
      <aside class="toc-panel glass-panel">
        <div class="toc-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span>TABLE_OF_CONTENTS</span>
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
        <div class="corner-decoration bottom-left"></div>
        <div class="corner-decoration bottom-right"></div>
      </aside>

      <article class="post-content glass-panel">
        <div class="markdown-body" v-html="post.content"></div>
        <div class="corner-decoration top-left"></div>
        <div class="corner-decoration top-right"></div>
        <div class="corner-decoration bottom-left"></div>
        <div class="corner-decoration bottom-right"></div>
      </article>

      <aside class="info-panel glass-panel">
        <div class="info-section">
          <div class="info-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>AI_SUMMARY</span>
          </div>
          <div class="ai-badge">
            <span class="badge-dot"></span>
            <span>GENERATED</span>
          </div>
          <p class="ai-summary" v-if="post.aiSummary">
            {{ post.aiSummary }}
          </p>
          <p class="ai-summary" v-else>AI summary is being processed...</p>
        </div>

        <div class="info-section">
          <div class="info-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
              />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <span>TAGS</span>
          </div>
          <div class="tag-list">
            <span v-for="tag in post.tags" :key="tag" class="info-tag">{{ tag }}</span>
          </div>
        </div>

        <div class="info-section">
          <div class="info-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>METADATA</span>
          </div>
          <div class="metadata-list">
            <div class="metadata-item">
              <span class="meta-key">POST_ID:</span>
              <span class="meta-value">{{ post.id }}</span>
            </div>
            <div class="metadata-item">
              <span class="meta-key">CREATED:</span>
              <span class="meta-value">{{ post.createdAt }}</span>
            </div>
            <div class="metadata-item">
              <span class="meta-key">READ_TIME:</span>
              <span class="meta-value">{{ post.readTime }} min</span>
            </div>
            <div class="metadata-item">
              <span class="meta-key">STATUS:</span>
              <span class="meta-value status-online">PUBLISHED</span>
            </div>
          </div>
        </div>

        <div class="corner-decoration top-left"></div>
        <div class="corner-decoration top-right"></div>
        <div class="corner-decoration bottom-left"></div>
        <div class="corner-decoration bottom-right"></div>
      </aside>
    </div>
  </div>

  <div class="not-found" v-else>
    <div class="not-found-content glass-panel">
      <div class="error-code">404</div>
      <h2>POST_NOT_FOUND</h2>
      <p>The requested post does not exist in the system.</p>
      <RouterLink to="/" class="glow-button cyan">Return Home</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.blog-detail-page {
  position: relative;
  z-index: 1;
}

.post-header {
  padding: 32px;
  margin-bottom: 32px;
  position: relative;
}

.header-content {
  max-width: 800px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--neon-cyan);
  text-decoration: none;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.back-link svg {
  width: 18px;
  height: 18px;
}

.back-link:hover {
  color: var(--neon-purple);
  text-shadow: var(--glow-purple);
}

.post-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.meta-item svg {
  width: 14px;
  height: 14px;
  color: var(--neon-cyan-dim);
}

.post-title {
  font-family: var(--font-sans);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
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

.content-layout {
  display: grid;
  grid-template-columns: 250px 1fr 280px;
  gap: 24px;
  position: relative;
}

.toc-panel {
  position: sticky;
  top: 100px;
  height: fit-content;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  padding: 20px;
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
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
  font-size: 0.8rem;
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
  padding-left: 24px;
}

.toc-item.level-3 {
  padding-left: 36px;
  font-size: 0.75rem;
}

.post-content {
  padding: 40px;
  position: relative;
}

.markdown-body {
  font-family: var(--font-mono);
  font-size: 0.95rem;
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
  font-size: 1.75rem;
}

.markdown-body :deep(h2) {
  font-size: 1.5rem;
  color: var(--neon-cyan);
}

.markdown-body :deep(h3) {
  font-size: 1.25rem;
  border-bottom: none;
}

.markdown-body :deep(p) {
  margin-bottom: 1.2em;
}

.markdown-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.9em;
  padding: 2px 6px;
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid rgba(0, 245, 255, 0.2);
  border-radius: 4px;
  color: var(--neon-cyan);
}

.markdown-body :deep(pre) {
  margin: 1.5em 0;
  padding: 20px;
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
  font-size: 0.65rem;
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

.info-panel {
  position: sticky;
  top: 100px;
  height: fit-content;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--neon-purple);
  letter-spacing: 0.15em;
}

.info-header svg {
  width: 16px;
  height: 16px;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--neon-cyan);
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid rgba(0, 245, 255, 0.2);
  border-radius: 4px;
  width: fit-content;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: var(--neon-cyan);
  border-radius: 50%;
  animation: pulse-glow 1.5s ease-in-out infinite;
}

.ai-summary {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-secondary);
  padding: 12px;
  background: rgba(0, 245, 255, 0.05);
  border-radius: 4px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.info-tag {
  padding: 4px 10px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--neon-purple);
  background: rgba(185, 103, 255, 0.1);
  border: 1px solid rgba(185, 103, 255, 0.2);
  border-radius: 4px;
}

.metadata-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metadata-item {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.meta-key {
  color: var(--text-muted);
}

.meta-value {
  color: var(--text-secondary);
}

.meta-value.status-online {
  color: var(--neon-cyan);
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
  font-size: 6rem;
  font-weight: 900;
  color: var(--neon-pink);
  text-shadow: var(--glow-pink);
  line-height: 1;
  margin-bottom: 16px;
}

.not-found-content h2 {
  font-family: var(--font-sans);
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.not-found-content p {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

@media (max-width: 1200px) {
  .content-layout {
    grid-template-columns: 1fr 280px;
  }

  .toc-panel {
    display: none;
  }
}

@media (max-width: 768px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .info-panel {
    position: static;
    order: -1;
  }

  .post-content {
    padding: 24px;
  }

  .post-header {
    padding: 24px;
  }
}
</style>
