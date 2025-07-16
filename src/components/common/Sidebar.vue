
<template>
  <div
    class="bg-white shadow-md overflow-hidden transition-all duration-300"
    :class="{ 
      'fixed inset-y-0 left-0 z-30 w-64 transform': true,
      '-translate-x-full': !isOpen,
      'translate-x-0': isOpen
    }"
  >
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-primary font-bold text-xl">BIBLIOTECH</div>
        <button 
          @click="toggleSidebar"
          class="text-gray-500 hover:text-gray-700 md:hidden focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-bold">
          {{ userInitials }}
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
          <p class="text-xs text-gray-500">{{ userType }}</p>
        </div>
      </div>
    </div>
    
    <nav class="p-4">
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</p>
      <ul class="space-y-1">
        <li>
          <router-link 
            to="/dashboard" 
            class="flex items-center px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 
              'bg-primary/10 text-primary': isActive('/dashboard'),
              'text-gray-700 hover:bg-gray-100': !isActive('/dashboard')
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link 
            to="/books" 
            class="flex items-center px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 
              'bg-primary/10 text-primary': isActive('/books'),
              'text-gray-700 hover:bg-gray-100': !isActive('/books')
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Acervo
          </router-link>
        </li>
        <li>
          <router-link 
            to="/reservations" 
            class="flex items-center px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 
              'bg-primary/10 text-primary': isActive('/reservations'),
              'text-gray-700 hover:bg-gray-100': !isActive('/reservations')
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Reservas
          </router-link>
        </li>
        <li v-if="isAdmin">
          <router-link 
            to="/loans" 
            class="flex items-center px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 
              'bg-primary/10 text-primary': isActive('/loans'),
              'text-gray-700 hover:bg-gray-100': !isActive('/loans')
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Empréstimos
          </router-link>
        </li>
      </ul>
      
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">Sua Conta</p>
      <ul class="space-y-1">
        <li>
          <router-link 
            to="/profile" 
            class="flex items-center px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 
              'bg-primary/10 text-primary': isActive('/profile'),
              'text-gray-700 hover:bg-gray-100': !isActive('/profile')
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Meu Perfil
          </router-link>
        </li>
        <li>
          <button 
            @click="handleLogout" 
            class="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </li>
      </ul>
    </nav>
  </div>
  
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
    @click="toggleSidebar"
  ></div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle']);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const userName = computed(() => authStore.userName || 'Usuário');
const userType = computed(() => {
  const type = authStore.user?.tipo_usuario;
  if (type === 'Estudante') return 'Estudante';
  if (type === 'Professor') return 'Professor';
  if (type === 'Funcionario') return 'Administrador';
  return 'Usuário Comum';
});

const isAdmin = computed(() => authStore.isAdmin);

const userInitials = computed(() => {
  if (!userName.value) return '';
  
  const names = userName.value.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
});

const isActive = (path) => {
  return route.path.startsWith(path);
};

const toggleSidebar = () => {
  emit('toggle');
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
