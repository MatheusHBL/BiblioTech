
<template>
  <div class="min-h-screen bg-light-bg flex flex-col">
    <PublicNavbar v-if="!isAuthenticated || isHomePage" />
    
    <Navbar v-if="isAuthenticated && !isHomePage" />
    
    <main class="flex-grow">
      <router-view />
    </main>
    
    <PublicFooter v-if="!isAuthenticated || isHomePage" />
    
    <Footer v-if="isAuthenticated && !isHomePage" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import PublicNavbar from './components/common/PublicNavbar.vue';
import Navbar from './components/common/Navbar.vue';
import PublicFooter from './components/common/PublicFooter.vue';
import Footer from './components/common/Footer.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isHomePage = computed(() => route.path === '/');

onMounted(() => {
  if (isHomePage.value) return;
  
  if (!isAuthenticated.value && route.meta?.requiresAuth) {
    router.push('/');
  }
});

</script>
