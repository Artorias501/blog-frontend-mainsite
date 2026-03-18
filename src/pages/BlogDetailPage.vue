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
    <article class="post-article glass-panel">
      <header class="post-header">
        <RouterLink to="/articles" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Articles
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
          <span class="meta-divider">|</span>
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
      </header>

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
      </div>

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
          <span>AI_SUMMARY</span>
          <span class="ai-badge">
            <span class="badge-dot"></span>
            GENERATED
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
      <h2>POST_NOT_FOUND</h2>
      <p>The requested post does not exist in the system.</p>
      <RouterLink to="/" class="glow-button cyan">Return Home</RouterLink>
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

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--neon-cyan);
  text-decoration: none;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.back-link svg {
  width: 16px;
  height: 16px;
}

.back-link:hover {
  color: var(--neon-purple);
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

.toc-section {
  margin-bottom: 32px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
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
