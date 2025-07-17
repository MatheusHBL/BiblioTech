<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <div class="text-primary font-bold text-2xl flex items-center">
            <span class="text-primary">BIBLIOTECH</span>
          </div>
        </router-link>

        <!-- Navegação desktop -->
        <div class="hidden md:flex space-x-8">
          <router-link to="/dashboard" class="text-gray-700 hover:text-primary">Início</router-link>
          <router-link to="/books" class="text-gray-700 hover:text-primary">Acervo</router-link>
          <router-link to="/reservations" class="text-gray-700 hover:text-primary">Reservas</router-link>

          <template v-if="isAdmin">
            <router-link to="/loans" class="text-gray-700 hover:text-primary">Empréstimos</router-link>
            <div class="relative" ref="adminMenuRef">
              <button
                @click="toggleAdminMenu"
                class="text-gray-700 hover:text-primary flex items-center"
                :aria-expanded="showAdminMenu"
              >
                Cadastros
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div v-if="showAdminMenu" class="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <router-link to="/admin/categorias" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Categorias</router-link>
                <router-link to="/admin/autores" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Autores</router-link>
                <router-link to="/admin/editoras" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editoras</router-link>
                <router-link to="/admin/livros" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cadastrar Livro</router-link>
                <router-link to="/admin/funcionarios" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Funcionários</router-link>
              </div>
            </div>
          </template>
        </div>

        <!-- Usuário -->
        <div class="flex items-center space-x-4 relative" ref="userMenuRef">
          <button
            @click="toggleDropdown"
            class="flex items-center space-x-2 text-gray-700 hover:text-primary focus:outline-none"
            :aria-expanded="showDropdown"
          >
            <span>{{ userName }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- CORRIGIDO: dropdown aparece abaixo corretamente -->
          <div v-if="showDropdown" class="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Perfil</router-link>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sair</button>
          </div>
        </div>

        <!-- Botão menu mobile -->
        <div class="md:hidden">
          <button @click="toggleMobileMenu" class="text-gray-700 hover:text-primary focus:outline-none">
            <template v-if="!showMobileMenu">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </template>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </template>
          </button>
        </div>
      </div>

      <!-- Menu Mobile -->
      <div v-if="showMobileMenu" class="md:hidden mt-4 space-y-2">
        <router-link to="/dashboard" class="block py-2 text-gray-700 hover:text-primary">Início</router-link>
        <router-link to="/books" class="block py-2 text-gray-700 hover:text-primary">Acervo</router-link>
        <router-link to="/reservations" class="block py-2 text-gray-700 hover:text-primary">Reservas</router-link>
        <template v-if="isAdmin">
          <router-link to="/loans" class="block py-2 text-gray-700 hover:text-primary">Empréstimos</router-link>
        </template>
        <router-link to="/profile" class="block py-2 text-gray-700 hover:text-primary">Perfil</router-link>
        <button @click="logout" class="block w-full text-left py-2 text-gray-700 hover:text-primary">Sair</button>
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

const showDropdown = ref(false);
const showMobileMenu = ref(false);
const showAdminMenu = ref(false);

const userMenuRef = ref(null);
const adminMenuRef = ref(null);

const isAdmin = computed(() => authStore.isAdmin);
const userName = computed(() => authStore.userName || 'Usuário');

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const toggleAdminMenu = () => {
  showAdminMenu.value = !showAdminMenu.value;
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};

const handleClickOutside = (event) => {
  if (
    showDropdown.value &&
    userMenuRef.value &&
    !userMenuRef.value.contains(event.target)
  ) {
    showDropdown.value = false;
  }

  if (
    showAdminMenu.value &&
    adminMenuRef.value &&
    !adminMenuRef.value.contains(event.target)
  ) {
    showAdminMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
