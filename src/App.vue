<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
import LeftSidebar from '@/components/LeftSidebar.vue'
import RightSidebar from '@/components/RightSidebar.vue'
import ParticleBackground from '@/components/ParticleBackground.vue'
</script>

<template>
  <div class="app-wrapper">
    <div class="scan-line"></div>
    <ParticleBackground />
    <TheNavbar />
    <main class="main-content">
      <div class="layout-container">
        <LeftSidebar />
        <div class="content-area">
          <RouterView v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
        <RightSidebar />
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<style>
@import '@/styles/global.css';

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
}

.layout-container {
  display: grid;
  grid-template-columns: 220px 1fr 240px;
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  padding: 0 40px;
}

.content-area {
  min-width: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1200px) {
  .layout-container {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }

  .layout-container {
    padding: 0;
  }
}
</style>
