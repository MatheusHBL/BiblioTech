<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <!-- Sem empréstimos -->
    <div v-else-if="loans.length === 0" class="text-center my-8">
      <p class="text-gray-500 text-lg">Nenhum empréstimo encontrado.</p>
      <slot name="empty"></slot>
    </div>
    
    <!-- Tabela de empréstimos -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Livro
              </th>
              <th scope="col" v-if="showUserColumn" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empréstimo
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Previsão de Devolução
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
            <tr v-for="loan in loans" :key="loan.id_emprestimo" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 bg-gray-300 rounded">
                    <!-- Placeholder para imagem -->
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ loan.titulo }}</div>
                    <div class="text-sm text-gray-500">{{ loan.autor }}</div>
                  </div>
                </div>
              </td>
              <td v-if="showUserColumn" class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ loan.nome_usuario }}</div>
                <div class="text-sm text-gray-500">{{ loan.tipo_usuario }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(loan.data_emprestimo) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(loan.data_prevista_devolucao) }}</div>
                <div v-if="getDaysRemaining(loan.data_prevista_devolucao) < 0" class="text-sm text-red-600 font-medium">
                  {{ Math.abs(getDaysRemaining(loan.data_prevista_devolucao)) }} dias atrasado
                </div>
                <div v-else-if="getDaysRemaining(loan.data_prevista_devolucao) <= 3" class="text-sm text-amber-600">
                  {{ getDaysRemaining(loan.data_prevista_devolucao) }} dias restantes
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="loan.status === 'Ativo'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  Ativo
                </span>
                <span v-else-if="loan.status === 'Devolvido'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Devolvido
                </span>
                <span v-else-if="loan.status === 'Atrasado'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Atrasado
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button 
                    v-if="loan.status === 'Ativo' || loan.status === 'Atrasado'"
                    @click="$emit('return', loan)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Devolver
                  </button>
                  <button 
                    v-if="loan.status === 'Ativo'"
                    @click="$emit('extend', loan)"
                    class="text-primary hover:text-primary/80"
                  >
                    Estender
                  </button>
                  <button 
                    @click="$emit('view', loan)"
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
      
      <!-- Paginação (simplificada) -->
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
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Importar utilitário de formatação
import { formatDate } from '../../utils/formatters';

const props = defineProps({
  loans: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  showUserColumn: {
    type: Boolean,
    default: true
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

const emit = defineEmits(['return', 'extend', 'view', 'page-change']);

// Método para calcular dias restantes
const getDaysRemaining = (dueDate) => {
  if (!dueDate) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};
</script>