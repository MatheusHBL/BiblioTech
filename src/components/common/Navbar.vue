<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo e nome -->
        <router-link to="/dashboard" class="flex items-center">
          <div class="text-primary font-bold text-2xl">BIBLIOTECH</div>
        </router-link>

        <!-- Links de navegação -->
        <div class="hidden md:flex space-x-8">
          <router-link to="/dashboard" class="text-gray-700 hover:text-primary">Início</router-link>
          <router-link to="/books" class="text-gray-700 hover:text-primary">Acervo</router-link>
          <router-link to="/reservations" class="text-gray-700 hover:text-primary">Reservas</router-link>
          <template v-if="isAdmin">
            <router-link to="/loans" class="text-gray-700 hover:text-primary">Empréstimos</router-link>
          </template>
        </div>

        <!-- Usuário e ações -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button @click="toggleDropdown" class="flex items-center space-x-2 text-gray-700 hover:text-primary focus:outline-none">
              <span>{{ userName }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Perfil</router-link>
              <a href="#" @click.prevent="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sair</a>
            </div>
          </div>
        </div>

        <!-- Menu móvel -->
        <div class="md:hidden">
          <button @click="toggleMobileMenu" class="text-gray-700 hover:text-primary focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Menu móvel (expandido) -->
      <div v-if="showMobileMenu" class="md:hidden mt-4 space-y-2">
        <router-link to="/dashboard" class="block py-2 text-gray-700 hover:text-primary">Início</router-link>
        <router-link to="/books" class="block py-2 text-gray-700 hover:text-primary">Acervo</router-link>
        <router-link to="/reservations" class="block py-2 text-gray-700 hover:text-primary">Reservas</router-link>
        <template v-if="isAdmin">
          <router-link to="/loans" class="block py-2 text-gray-700 hover:text-primary">Empréstimos</router-link>
        </template>
        <router-link to="/profile" class="block py-2 text-gray-700 hover:text-primary">Perfil</router-link>
        <a href="#" @click.prevent="logout" class="block py-2 text-gray-700 hover:text-primary">Sair</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Estado para controlar os dropdowns
const showDropdown = ref(false);
const showMobileMenu = ref(false);

// Computed properties
const isAdmin = computed(() => authStore.isAdmin);
const userName = computed(() => authStore.userName || 'Usuário');

// Métodos
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const logout = () => {
  authStore.logout();
  router.push('/');
};

// Fechar dropdown quando clicar fora
const closeDropdown = (event) => {
  if (showDropdown.value && !event.target.closest('.relative')) {
    showDropdown.value = false;
  }
};

// Event listeners
onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>