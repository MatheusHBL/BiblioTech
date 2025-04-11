<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Seleção de usuário -->
      <div>
        <label for="user" class="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
        <div class="relative">
          <select 
            id="user"
            v-model="formData.userId"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="" disabled>Selecione um usuário</option>
            <option v-for="user in users" :key="user.id_usuario" :value="user.id_usuario">
              {{ user.nome }} ({{ user.tipo_usuario }})
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <p v-if="errors.userId" class="mt-1 text-sm text-red-600">{{ errors.userId }}</p>
      </div>
      
      <!-- Seleção de livro -->
      <div>
        <label for="book" class="block text-sm font-medium text-gray-700 mb-1">Livro</label>
        <div class="relative">
          <select 
            id="book"
            v-model="formData.bookId"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="" disabled>Selecione um livro</option>
            <option v-for="book in availableBooks" :key="book.id_livro" :value="book.id_livro">
              {{ book.titulo }} ({{ book.quantidade_disponivel }} disponível)
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <p v-if="errors.bookId" class="mt-1 text-sm text-red-600">{{ errors.bookId }}</p>
      </div>
      
      <!-- Datas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="loanDate" class="block text-sm font-medium text-gray-700 mb-1">Data do Empréstimo</label>
          <input
            id="loanDate"
            v-model="formData.loanDate"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p v-if="errors.loanDate" class="mt-1 text-sm text-red-600">{{ errors.loanDate }}</p>
        </div>
        <div>
          <label for="returnDate" class="block text-sm font-medium text-gray-700 mb-1">Previsão de Devolução</label>
          <input
            id="returnDate"
            v-model="formData.returnDate"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p v-if="errors.returnDate" class="mt-1 text-sm text-red-600">{{ errors.returnDate }}</p>
        </div>
      </div>
      
      <!-- Observações (opcional) -->
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea
          id="notes"
          v-model="formData.notes"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        ></textarea>
      </div>
      
      <!-- Botões de ação -->
      <div class="flex justify-end space-x-3">
        <button 
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <span v-if="isSubmitting">Processando...</span>
          <span v-else>{{ submitButtonText }}</span>
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, onMounted, computed } from 'vue';
  import { useValidation } from '../../utils/validation';
  
  const props = defineProps({
    users: {
      type: Array,
      required: true
    },
    availableBooks: {
      type: Array,
      required: true
    },
    initialData: {
      type: Object,
      default: () => ({})
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isSubmitting: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['submit', 'cancel']);
  
  // Hook de validação
  const { validateDate } = useValidation();
  
  // Estado do formulário
  const formData = ref({
    userId: props.initialData.id_usuario_fk || '',
    bookId: props.initialData.id_livro_fk || '',
    loanDate: props.initialData.data_emprestimo || new Date().toISOString().substr(0, 10),
    returnDate: props.initialData.data_prevista_devolucao || '',
    notes: props.initialData.observacoes || ''
  });
  
  // Estado de erros
  const errors = ref({
    userId: '',
    bookId: '',
    loanDate: '',
    returnDate: ''
  });
  
  // Texto do botão de envio
  const submitButtonText = computed(() => {
    return props.isEdit ? 'Atualizar Empréstimo' : 'Registrar Empréstimo';
  });
  
  // Métodos
  const validateForm = () => {
    let isValid = true;
    errors.value = {
      userId: '',
      bookId: '',
      loanDate: '',
      returnDate: ''
    };
    
    // Validação do usuário
    if (!formData.value.userId) {
      errors.value.userId = 'Selecione um usuário';
      isValid = false;
    }
    
    // Validação do livro
    if (!formData.value.bookId) {
      errors.value.bookId = 'Selecione um livro';
      isValid = false;
    }
    
    // Validação da data de empréstimo
    const loanDateError = validateDate(formData.value.loanDate);
    if (loanDateError) {
      errors.value.loanDate = loanDateError;
      isValid = false;
    }
    
    // Validação da data de devolução
    const returnDateError = validateDate(formData.value.returnDate);
    if (returnDateError) {
      errors.value.returnDate = returnDateError;
      isValid = false;
    }
    
    // Validação da relação entre datas
    if (isValid && new Date(formData.value.returnDate) <= new Date(formData.value.loanDate)) {
      errors.value.returnDate = 'A data de devolução deve ser posterior à data de empréstimo';
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // Emit do evento submit com os dados do formulário
    emit('submit', { ...formData.value });
  };
  
  // Configuração de data padrão para devolução (se não estiver em modo de edição)
  onMounted(() => {
    if (!props.isEdit && !formData.value.returnDate) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 15); // 15 dias de prazo padrão
      formData.value.returnDate = defaultDate.toISOString().substr(0, 10);
    }
  });
  </script>