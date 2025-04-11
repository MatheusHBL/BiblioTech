<template>
    <div class="container mx-auto px-4 py-8">
      <!-- Cabeçalho -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Minhas Reservas</h1>
        <p class="text-gray-600 mt-2">Gerencie suas reservas de livros</p>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <!-- Sem reservas -->
      <div v-else-if="reservations.length === 0" class="bg-white p-8 rounded-lg shadow-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Nenhuma reserva encontrada</h2>
        <p class="text-gray-600 mb-6">Você ainda não possui nenhuma reserva de livro.</p>
        <router-link to="/books" class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          Explorar acervo
        </router-link>
      </div>
      
      <!-- Lista de reservas -->
      <div v-else>
        <!-- Filtros e busca (simplificados) -->
        <div class="mb-6 bg-white p-4 rounded-lg shadow-md">
          <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por título..."
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select 
              v-model="statusFilter"
              class="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos os status</option>
              <option value="Pendente">Pendente</option>
              <option value="Concluída">Concluída</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>
        
        <!-- Tabela de reservas -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livro
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data da Reserva
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="reservation in filteredReservations" :key="reservation.id_reserva" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0 bg-gray-300 rounded">
                        <!-- Placeholder para imagem -->
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ reservation.titulo }}</div>
                        <div class="text-sm text-gray-500">{{ reservation.autor }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(reservation.data_reserva) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="reservation.status === 'Pendente'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pendente
                    </span>
                    <span v-else-if="reservation.status === 'Concluída'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Concluída
                    </span>
                    <span v-else-if="reservation.status === 'Cancelada'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Cancelada
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      v-if="reservation.status === 'Pendente'"
                      @click="handleCancelReservation(reservation)"
                      class="text-red-600 hover:text-red-900 mr-3"
                    >
                      Cancelar
                    </button>
                    <button 
                      @click="handleViewDetails(reservation)"
                      class="text-primary hover:text-primary/80"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Modal de cancelamento -->
      <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold mb-4">Cancelar Reserva</h3>
          <p>Tem certeza que deseja cancelar a reserva do livro <span class="font-semibold">{{ selectedReservation?.titulo }}</span>?</p>
          <p class="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="showCancelModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Voltar
            </button>
            <button 
              @click="confirmCancelReservation"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Confirmar Cancelamento
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  // Estado da página
  const loading = ref(true);
  const searchQuery = ref('');
  const statusFilter = ref('');
  const showCancelModal = ref(false);
  const selectedReservation = ref(null);
  
  // Dados mockados para desenvolvimento
  const reservations = ref([
    {
      id_reserva: 1,
      id_livro_fk: 1,
      titulo: 'Dragon World',
      autor: 'Robin Parrish',
      data_reserva: '2025-04-10T14:30:00',
      status: 'Pendente'
    },
    {
      id_reserva: 2,
      id_livro_fk: 6,
      titulo: 'The Hunter House',
      autor: 'Rakib Jon',
      data_reserva: '2025-04-05T09:15:00',
      status: 'Concluída'
    },
    {
      id_reserva: 3,
      id_livro_fk: 2,
      titulo: 'Blue in the Water',
      autor: 'Unknown',
      data_reserva: '2025-03-20T16:45:00',
      status: 'Cancelada'
    }
  ]);
  
  // Reservas filtradas com base nos critérios de busca
  const filteredReservations = computed(() => {
    let result = [...reservations.value];
    
    // Filtro por busca
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(reservation => 
        reservation.titulo.toLowerCase().includes(query)
      );
    }
    
    // Filtro por status
    if (statusFilter.value) {
      result = result.filter(reservation => reservation.status === statusFilter.value);
    }
    
    return result;
  });
  
  // Formatação de data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Métodos
  const handleCancelReservation = (reservation) => {
    selectedReservation.value = reservation;
    showCancelModal.value = true;
  };
  
  const confirmCancelReservation = () => {
    // Aqui seria a chamada para a API para cancelar a reserva
    // Por enquanto, apenas simulamos a alteração localmente
    
    const index = reservations.value.findIndex(r => r.id_reserva === selectedReservation.value.id_reserva);
    if (index !== -1) {
      reservations.value[index].status = 'Cancelada';
    }
    
    showCancelModal.value = false;
    selectedReservation.value = null;
  };
  
  const handleViewDetails = (reservation) => {
    router.push(`/books/${reservation.id_livro_fk}`);
  };
  
  // Carregamento inicial (simulado)
  onMounted(() => {
    // Simula carregamento de dados
    setTimeout(() => {
      loading.value = false;
    }, 500);
  });
  </script>