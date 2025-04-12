<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Cabeçalho -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">{{ isAdmin ? 'Gerenciamento de Reservas' : 'Minhas Reservas' }}</h1>
      <p class="text-gray-600 mt-2">{{ isAdmin ? 'Gerencie todas as reservas da biblioteca' : 'Gerencie suas reservas de livros' }}</p>
    </div>
    
    <!-- Ferramentas de busca e filtro -->
    <div class="mb-6">
      <BookSearch 
        :initial-search="searchQuery"
        :show-category-filter="false"
        :show-status-filter="true"
        :status-options="statusOptions"
        :initial-status="statusFilter"
        @search="handleSearch"
        @filter-change="handleFilterChange"
        @clear="clearFilters"
      />
    </div>
    
    <!-- Lista de reservas -->
    <ReservationList 
      :reservations="filteredReservations"
      :loading="loading"
      :current-page="currentPage"
      :total-pages="totalPages"
      :items-per-page="itemsPerPage"
      :total-items="totalItems"
      @cancel="handleCancelReservation"
      @convert="handleConvertToLoan"
      @view="handleViewReservation"
      @page-change="handlePageChange"
    />
    
    <!-- Modal de conversão para empréstimo (apenas admin) -->
    <div v-if="showLoanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4">Converter Reserva em Empréstimo</h3>
        <p>Você está prestes a converter a reserva do livro <span class="font-semibold">{{ selectedReservation?.titulo }}</span> em um empréstimo.</p>
        
        <!-- Formulário simplificado -->
        <div class="mt-4 space-y-4">
          <div>
            <label for="loanDate" class="block text-sm font-medium text-gray-700 mb-1">Data do Empréstimo</label>
            <input
              id="loanDate"
              v-model="loanData.loanDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label for="returnDate" class="block text-sm font-medium text-gray-700 mb-1">Data de Devolução Prevista</label>
            <input
              id="returnDate"
              v-model="loanData.returnDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="closeLoanModal"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button 
            @click="confirmConvertToLoan"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Confirmar Empréstimo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReservationStore } from '../stores/reservations';
import { useAuthStore } from '../stores/auth';
import { useLoanStore } from '../stores/loans';
import ReservationList from '../components/reservations/ReservationList.vue';
import BookSearch from '../components/books/BookSearch.vue';

const router = useRouter();
const reservationStore = useReservationStore();
const authStore = useAuthStore();
const loanStore = useLoanStore();

// Estado
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showLoanModal = ref(false);
const selectedReservation = ref(null);

// Dados do empréstimo
const loanData = ref({
  loanDate: new Date().toISOString().slice(0, 10),
  returnDate: (() => {
    const date = new Date();
    date.setDate(date.getDate() + 15); // Padrão: 15 dias
    return date.toISOString().slice(0, 10);
  })()
});

// Computed properties
const isAdmin = computed(() => authStore.isAdmin);

const statusOptions = [
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Concluída', label: 'Concluída' },
  { value: 'Cancelada', label: 'Cancelada' }
];

const reservations = computed(() => {
  // Se for admin, mostra todas as reservas, caso contrário, apenas as do usuário
  return isAdmin.value ? reservationStore.reservations : reservationStore.userReservations;
});

// Filtragem de reservas
const filteredReservations = computed(() => {
  let result = [...reservations.value];
  
  // Filtro por busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(reservation => 
      reservation.titulo?.toLowerCase().includes(query) || 
      reservation.nome_usuario?.toLowerCase().includes(query)
    );
  }
  
  // Filtro por status
  if (statusFilter.value) {
    result = result.filter(reservation => reservation.status === statusFilter.value);
  }
  
  return result;
});

// Paginação
const totalItems = computed(() => filteredReservations.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

// Métodos
const loadReservations = async () => {
  loading.value = true;
  
  try {
    if (isAdmin.value) {
      await reservationStore.fetchAllReservations();
    } else {
      await reservationStore.fetchUserReservations();
    }
  } catch (error) {
    console.error('Erro ao carregar reservas:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
};

const handleFilterChange = (filters) => {
  statusFilter.value = filters.status;
  currentPage.value = 1;
};

const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  currentPage.value = 1;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handleViewReservation = (reservation) => {
  router.push(`/books/${reservation.id_livro_fk}`);
};

// Cancelamento de reserva
const handleCancelReservation = async (reservation) => {
  try {
    loading.value = true;
    
    const result = await reservationStore.cancelReservation(reservation.id_reserva);
    
    if (result.success) {
      alert(`Reserva de "${reservation.titulo}" cancelada com sucesso.`);
    } else {
      alert(`Erro ao cancelar reserva: ${result.error}`);
    }
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    alert('Ocorreu um erro ao cancelar a reserva.');
  } finally {
    loading.value = false;
  }
};

// Conversão de reserva para empréstimo (apenas admin)
const handleConvertToLoan = (reservation) => {
  selectedReservation.value = reservation;
  showLoanModal.value = true;
};

const closeLoanModal = () => {
  showLoanModal.value = false;
  selectedReservation.value = null;
};

const confirmConvertToLoan = async () => {
  try {
    loading.value = true;
    
    const result = await reservationStore.convertToLoan(
      selectedReservation.value.id_reserva, 
      {
        data_emprestimo: loanData.value.loanDate,
        data_prevista_devolucao: loanData.value.returnDate
      }
    );
    
    if (result.success) {
      alert(`Reserva convertida em empréstimo com sucesso.`);
      closeLoanModal();
      
      // Recarregar dados
      await loadReservations();
      
      // Opcional: redirecionar para página de empréstimos
      // router.push('/loans');
    } else {
      alert(`Erro ao converter reserva: ${result.error}`);
    }
  } catch (error) {
    console.error('Erro ao converter reserva em empréstimo:', error);
    alert('Ocorreu um erro ao converter a reserva em empréstimo.');
  } finally {
    loading.value = false;
  }
};

// Carregar dados na inicialização
onMounted(() => {
  // Use dados mockados para desenvolvimento
  reservationStore.initMockData();
  
  // Ou carregue do servidor quando tiver a API
  // loadReservations();
});
</script>