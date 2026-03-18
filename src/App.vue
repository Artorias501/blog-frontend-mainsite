<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<template>
  <div class="app-wrapper">
    <div class="scan-line"></div>
    <TheNavbar />
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
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
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
