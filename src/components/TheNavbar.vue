<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const mobileMenuOpen = ref(false)

const navItems = [
  { path: '/', label: 'HOME', icon: '⌂' },
  { path: '/architecture', label: 'ARCHITECTURE', icon: '◇' },
]

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="navbar glass-panel">
    <div class="navbar-content">
      <RouterLink to="/" class="logo" @click="closeMobileMenu">
        <span class="logo-bracket">[</span>
        <span class="logo-text">AI_BLOG</span>
        <span class="logo-bracket">]</span>
      </RouterLink>

      <div class="nav-links" :class="{ open: mobileMenuOpen }">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          @click="closeMobileMenu"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </div>

      <button class="mobile-toggle" @click="toggleMobileMenu">
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
      </button>
    </div>
    <div class="navbar-decoration"></div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 12px 24px;
  margin-bottom: 20px;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.logo {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-sans);
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
}

.logo-bracket {
  color: var(--neon-cyan);
  opacity: 0.7;
}

.logo-text {
  color: var(--text-primary);
  letter-spacing: 0.1em;
}

.logo:hover .logo-text {
  text-shadow: var(--glow-cyan);
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: var(--neon-cyan);
  border-color: var(--border-color);
  background: rgba(0, 245, 255, 0.05);
}

.nav-link.router-link-active {
  color: var(--neon-cyan);
  border-color: var(--neon-cyan);
  background: rgba(0, 245, 255, 0.1);
  box-shadow: var(--glow-cyan);
}

.nav-icon {
  font-size: 1rem;
  opacity: 0.7;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}

.toggle-bar {
  width: 20px;
  height: 2px;
  background: var(--neon-cyan);
  transition: all 0.3s ease;
}

.navbar-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
  opacity: 0.3;
}

@media (max-width: 768px) {
  .nav-links {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    padding: 20px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .mobile-toggle {
    display: flex;
  }
}
</style>
