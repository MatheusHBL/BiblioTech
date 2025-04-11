<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Cabeçalho -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-800">Bem-vindo, {{ userName }}!</h1>
      <p class="text-gray-600 mt-2">Confira as novidades e atividades na sua conta.</p>
    </div>

    <!-- Seção de Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Livros Disponíveis</h3>
        <p class="text-3xl font-bold text-primary">{{ stats.availableBooks }}</p>
        <p class="text-gray-500 text-sm mt-2">Total de livros no acervo</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Minhas Reservas</h3>
        <p class="text-3xl font-bold text-primary">{{ stats.userReservations }}</p>
        <p class="text-gray-500 text-sm mt-2">Reservas ativas</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Meus Empréstimos</h3>
        <p class="text-3xl font-bold text-primary">{{ stats.userLoans }}</p>
        <p class="text-gray-500 text-sm mt-2">Empréstimos ativos</p>
      </div>
    </div>

    <!-- Seção de Livros em Destaque -->
    <div class="mb-10">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Livros em Destaque</h2>
        <router-link to="/books" class="text-primary hover:underline">Ver todos</router-link>
      </div>
      
      <div class="trending-books-container">
        <TrendingBooks :books="trendingBooks" />
      </div>
    </div>

    <!-- Últimas Atividades -->
    <div class="mb-10">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Últimas Atividades</h2>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div v-if="activities.length === 0" class="p-6 text-center text-gray-500">
          Nenhuma atividade recente.
        </div>
        
        <ul v-else class="divide-y divide-gray-200">
          <li v-for="(activity, index) in activities" :key="index" class="p-4 hover:bg-gray-50">
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <!-- Ícones conforme o tipo de atividade -->
                <div v-if="activity.type === 'reservation'" class="p-2 bg-blue-100 text-blue-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div v-else-if="activity.type === 'loan'" class="p-2 bg-green-100 text-green-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div v-else-if="activity.type === 'return'" class="p-2 bg-purple-100 text-purple-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
                  </svg>
                </div>
              </div>
              
              <div class="ml-4 flex-1">
                <div class="flex justify-between">
                  <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-sm text-gray-500">{{ activity.date }}</p>
                </div>
                <p class="text-sm text-gray-500 mt-1">{{ activity.description }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Próximas Devoluções (se aplicável) -->
    <div v-if="upcomingReturns.length > 0">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Próximas Devoluções</h2>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <ul class="divide-y divide-gray-200">
          <li v-for="(item, index) in upcomingReturns" :key="index" class="p-4 hover:bg-gray-50">
            <div class="flex justify-between">
              <div>
                <p class="font-medium">{{ item.title }}</p>
                <p class="text-sm text-gray-500">Data de devolução: {{ item.returnDate }}</p>
              </div>
              <div v-if="item.daysLeft <= 3" class="text-red-500 text-sm font-medium">
                {{ item.daysLeft }} dias restantes
              </div>
              <div v-else class="text-gray-500 text-sm">
                {{ item.daysLeft }} dias restantes
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useBookStore } from '../stores/books';
import TrendingBooks from '../components/books/TrendingBooks.vue';

const authStore = useAuthStore();
const bookStore = useBookStore();

// Dados do usuário
const userName = computed(() => authStore.userName);

// Dados mockados para desenvolvimento
const stats = ref({
  availableBooks: 42,
  userReservations: 2,
  userLoans: 1
});

// Livros em destaque
const trendingBooks = computed(() => bookStore.trendingBooks);

// Atividades recentes
const activities = ref([
  {
    type: 'reservation',
    title: 'Reserva confirmada',
    description: 'Você reservou o livro "Dragon World"',
    date: '15/04/2025'
  },
  {
    type: 'loan',
    title: 'Empréstimo realizado',
    description: 'Você pegou emprestado o livro "The Hunter House"',
    date: '10/04/2025'
  },
  {
    type: 'return',
    title: 'Devolução realizada',
    description: 'Você devolveu o livro "Blue in the Water"',
    date: '05/04/2025'
  }
]);

// Próximas devoluções
const upcomingReturns = ref([
  {
    title: 'The Hunter House',
    returnDate: '25/04/2025',
    daysLeft: 14
  }
]);

// Carrega os dados quando o componente é montado
onMounted(async () => {
  await bookStore.fetchBooks();
});
</script>