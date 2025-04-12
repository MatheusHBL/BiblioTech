<template>
  <div class="min-h-screen bg-light-bg flex flex-col">
    <!-- Navegação pública na página inicial -->
    <PublicNavbar v-if="!isAuthenticated || isHomePage" />
    
    <!-- Navegação para usuários autenticados nas outras páginas -->
    <Navbar v-if="isAuthenticated && !isHomePage" />
    
    <!-- Conteúdo principal -->
    <main class="flex-grow">
      <router-view />
    </main>
    
    <!-- Rodapé público na página inicial -->
    <PublicFooter v-if="!isAuthenticated || isHomePage" />
    
    <!-- Rodapé para usuários autenticados nas outras páginas -->
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

// Forçar o modo público na inicialização
onMounted(() => {
  // Se estiver na rota inicial, já está ok
  if (isHomePage.value) return;
  
  // Se tentar acessar uma rota protegida sem estar autenticado, redirecionar para home
  if (!isAuthenticated.value && route.meta?.requiresAuth) {
    router.push('/');
  }
});

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