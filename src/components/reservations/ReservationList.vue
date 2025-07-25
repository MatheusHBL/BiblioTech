
<template>
  <div>
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="reservations.length === 0" class="text-center my-8">
      <p class="text-gray-500 text-lg">Nenhuma reserva encontrada.</p>
      <slot name="empty"></slot>
    </div>
    
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Livro
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data da Reserva
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="reservation in reservations" :key="reservation.id_reserva" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 bg-gray-300 rounded">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ reservation.titulo }}</div>
                    <div class="text-sm text-gray-500">{{ reservation.autor }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ reservation.nome_usuario }}</div>
                <div v-if="reservation.tipo_usuario" class="text-sm text-gray-500">{{ reservation.tipo_usuario }}</div>
                <div v-if="reservation.email_usuario" class="text-sm text-gray-500">{{ reservation.email_usuario }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(reservation.data_reserva, true) }}</div>
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
                <div class="flex space-x-3">
                  <button 
                    v-if="reservation.status === 'Pendente' && isAdmin"
                    @click="$emit('convert', reservation)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Converter em Empréstimo
                  </button>
                  
                  <button 
                    v-if="reservation.status === 'Pendente'"
                    @click="$emit('cancel', reservation)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Cancelar
                  </button>
                  
                  <button 
                    @click="$emit('view', reservation)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    Detalhes
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="totalPages > 1" class="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-700">
          Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a 
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span> de 
          <span class="font-medium">{{ totalItems }}</span> resultados
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="$emit('page-change', currentPage - 1)"
            :disabled="currentPage === 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            class="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Anterior
          </button>
          <span class="text-sm text-gray-700">{{ currentPage }} de {{ totalPages }}</span>
          <button 
            @click="$emit('page-change', currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            class="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4">Confirmar Cancelamento</h3>
        <p>Você está prestes a cancelar a reserva do livro <span class="font-semibold">{{ selectedReservation?.titulo }}</span> 
          feita por <span class="font-semibold">{{ selectedReservation?.nome_usuario }}</span>.</p>
        <p class="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="closeCancelModal"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Voltar
          </button>
          <button 
            @click="confirmCancel"
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
import { defineProps, defineEmits, computed, ref } from 'vue';
import { formatDate } from '../../utils/formatters';
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  reservations: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  totalItems: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['cancel', 'convert', 'view', 'page-change']);

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);

const showCancelModal = ref(false);
const selectedReservation = ref(null);

const openCancelModal = (reservation) => {
  selectedReservation.value = reservation;
  showCancelModal.value = true;
};

const closeCancelModal = () => {
  showCancelModal.value = false;
  selectedReservation.value = null;
};

const confirmCancel = () => {
  emit('cancel', selectedReservation.value);
  closeCancelModal();
};

defineExpose({ openCancelModal });
</script>
