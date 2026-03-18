<script setup lang="ts">
interface PostProp {
  id: number
  title: string
  summary: string
  tags: string[]
  createdAt: string
  readTime: number
}

const props = defineProps<{ post: PostProp }>()
const { id, title, summary, tags, createdAt, readTime } = props.post
</script>

<template>
  <article class="blog-card glass-panel">
    <div class="card-glow"></div>
    <div class="card-content">
      <div class="card-meta">
        <span class="meta-item">
          <svg
            class="meta-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {{ createdAt }}
        </span>
        <span class="meta-item">
          <svg
            class="meta-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {{ readTime }} min read
        </span>
      </div>

      <h3 class="card-title">{{ title }}</h3>

      <p class="card-summary">{{ summary }}</p>

      <div class="card-tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <RouterLink :to="`/blog/${id}`" class="read-more">
        <span>READ_MORE</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </RouterLink>
    </div>

    <div class="corner-decoration top-left"></div>
    <div class="corner-decoration top-right"></div>
    <div class="corner-decoration bottom-left"></div>
    <div class="corner-decoration bottom-right"></div>
  </article>
</template>

<style scoped>
.blog-card {
  position: relative;
  padding: 24px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.blog-card:hover {
  transform: translateY(-4px);
  border-color: var(--neon-cyan);
}

.blog-card:hover .card-glow {
  opacity: 1;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple), var(--neon-pink));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.meta-icon {
  width: 14px;
  height: 14px;
  color: var(--neon-cyan-dim);
}

.card-title {
  font-family: var(--font-sans);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
  letter-spacing: 0.02em;
}

.blog-card:hover .card-title {
  color: var(--neon-cyan);
  text-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
}

.card-summary {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  font-size: 0.7rem;
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 8px 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--neon-cyan);
  text-decoration: none;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
}

.read-more svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.read-more:hover {
  text-shadow: var(--glow-cyan);
}

.read-more:hover svg {
  transform: translateX(4px);
}
</style>
