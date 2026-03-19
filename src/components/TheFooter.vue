<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer glass-panel">
    <div class="footer-content">
      <div class="footer-section">
        <div class="footer-logo">
          <span class="logo-bracket">[</span>
          <span class="logo-text">ARTORIAS'S BLOG</span>
          <span class="logo-bracket">]</span>
        </div>
        <p class="footer-tagline">高性能 · 分布式</p>
      </div>

      <div class="footer-section">
        <h4 class="footer-title">系统信息</h4>
        <div class="system-info">
          <span class="info-item">
            <span class="info-label">状态:</span>
            <span class="info-value status-online">在线</span>
          </span>
          <span class="info-item">
            <span class="info-label">版本:</span>
            <span class="info-value">v1.0.0</span>
          </span>
        </div>
      </div>

      <div class="footer-section">
        <h4 class="footer-title">技术栈</h4>
        <div class="tech-badges">
          <span class="tech-badge">Vue 3</span>
          <span class="tech-badge">Go</span>
          <span class="tech-badge">Redis</span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="terminal-line">
        <span class="prompt">></span>
        <span class="command">echo "© {{ currentYear }} ARTORIAS'S BLOG"</span>
      </div>
    </div>

    <div class="corner-decoration top-left"></div>
    <div class="corner-decoration top-right"></div>
    <div class="corner-decoration bottom-left"></div>
    <div class="corner-decoration bottom-right"></div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  padding: 40px 24px 20px;
  position: relative;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-sans);
  font-size: 1.25rem;
  font-weight: 700;
}

.footer-logo .logo-bracket {
  color: var(--neon-purple);
  opacity: 0.7;
}

.footer-logo .logo-text {
  color: var(--text-primary);
  letter-spacing: 0.1em;
}

.footer-tagline {
  font-size: 0.875rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.footer-title {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--neon-cyan);
  letter-spacing: 0.2em;
  margin-bottom: 8px;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  gap: 8px;
  font-size: 0.875rem;
}

.info-label {
  color: var(--text-muted);
}

.info-value {
  color: var(--text-secondary);
}

.status-online {
  color: var(--neon-cyan);
  animation: pulse-glow 2s ease-in-out infinite;
}

.tech-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-badge {
  padding: 4px 12px;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--neon-purple);
  background: rgba(185, 103, 255, 0.1);
  border: 1px solid rgba(185, 103, 255, 0.3);
  border-radius: 4px;
}

.footer-bottom {
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.terminal-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.prompt {
  color: var(--neon-cyan);
}

.command {
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
