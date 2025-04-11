<template>
  <div class="min-h-screen bg-light-bg flex flex-col">
    <Navbar v-if="isAuthenticated" />
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import Navbar from './components/common/Navbar.vue';
import Footer from './components/common/Footer.vue';

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

// Redirecionamento automático para login se não autenticado
// (descomente quando tiver a lógica de autenticação implementada)
/*
import { watch } from 'vue';
watch(isAuthenticated, (newValue) => {
  if (!newValue && router.currentRoute.value.meta.requiresAuth) {
    router.push('/login');
  }
});
*/
</script>