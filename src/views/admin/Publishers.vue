<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Cabeçalho -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Gerenciamento de Editoras</h1>
      <p class="text-gray-600 mt-2">Cadastre e gerencie as editoras dos livros da biblioteca</p>
    </div>

    <!-- Formulário de cadastro/edição -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Editar Editora' : 'Nova Editora' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome da Editora</label>
          <input
            id="name"
            v-model="formData.nome"
            type="text"
            required
            placeholder="Ex: Companhia das Letras, Globo Livros..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p v-if="errors.nome" class="mt-1 text-sm text-red-600">{{ errors.nome }}</p>
        </div>

        <div class="flex justify-end space-x-3">
          <button 
            v-if="isEditing"
            type="button"
            @click="cancelEdit"
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
            <span v-else>{{ isEditing ? 'Atualizar' : 'Cadastrar' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de editoras -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium">Editoras Cadastradas</h3>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <!-- Lista vazia -->
      <div v-else-if="publishers.length === 0" class="p-8 text-center text-gray-500">
        Nenhuma editora cadastrada ainda.
      </div>
      
      <!-- Tabela de editoras -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livros</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="publisher in publishers" :key="publisher.id_editora" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ publisher.id_editora }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ publisher.nome }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ publisher.total_livros || 0 }} livros
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="editPublisher(publisher)"
                  class="text-primary hover:text-primary/80"
                >
                  Editar
                </button>
                <button 
                  @click="deletePublisher(publisher)"
                  class="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir a editora <span class="font-semibold">{{ publisherToDelete?.nome }}</span>?</p>
        <p class="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button 
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Estado do componente
const loading = ref(false);
const isSubmitting = ref(false);
const isEditing = ref(false);
const showDeleteModal = ref(false);
const publisherToDelete = ref(null);
const publishers = ref([]);

// Estado do formulário
const formData = ref({
  id_editora: null,
  nome: ''
});

const errors = ref({
  nome: ''
});

// Dados mockados para desenvolvimento
const mockPublishers = [
  { id_editora: 1, nome: 'Companhia das Letras', total_livros: 25 },
  { id_editora: 2, nome: 'Globo Livros', total_livros: 18 },
  { id_editora: 3, nome: 'Record', total_livros: 22 },
  { id_editora: 4, nome: 'Saraiva', total_livros: 14 },
  { id_editora: 5, nome: 'Penguin Random House', total_livros: 31 }
];

// Métodos
const loadPublishers = async () => {
  try {
    loading.value = true;
    
    // Simulação de chamada API
    // const response = await api.get('/publishers');
    // publishers.value = response.data;
    
    // Mock data para desenvolvimento
    await new Promise(resolve => setTimeout(resolve, 500));
    publishers.value = [...mockPublishers];
    
  } catch (error) {
    console.error('Erro ao carregar editoras:', error);
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  let isValid = true;
  errors.value = { nome: '' };

  if (!formData.value.nome.trim()) {
    errors.value.nome = 'O nome é obrigatório';
    isValid = false;
  } else if (formData.value.nome.length < 3) {
    errors.value.nome = 'O nome deve ter pelo menos 3 caracteres';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    isSubmitting.value = true;

    if (isEditing.value) {
      // Simulação de edição
      // await api.put(`/publishers/${formData.value.id_editora}`, formData.value);
      
      const index = publishers.value.findIndex(p => p.id_editora === formData.value.id_editora);
      if (index !== -1) {
        publishers.value[index] = { ...publishers.value[index], ...formData.value };
      }
    } else {
      // Simulação de criação
      // await api.post('/publishers', formData.value);
      
      const newPublisher = {
        id_editora: Date.now(), // Mock ID
        nome: formData.value.nome,
        total_livros: 0
      };
      publishers.value.unshift(newPublisher);
    }

    resetForm();
  } catch (error) {
    console.error('Erro ao salvar editora:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const editPublisher = (publisher) => {
  formData.value = { ...publisher };
  isEditing.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const deletePublisher = (publisher) => {
  publisherToDelete.value = publisher;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    // Simulação de exclusão
    // await api.delete(`/publishers/${publisherToDelete.value.id_editora}`);
    
    publishers.value = publishers.value.filter(p => p.id_editora !== publisherToDelete.value.id_editora);
    showDeleteModal.value = false;
    publisherToDelete.value = null;
  } catch (error) {
    console.error('Erro ao excluir editora:', error);
  }
};

const resetForm = () => {
  formData.value = {
    id_editora: null,
    nome: ''
  };
  errors.value = { nome: '' };
  isEditing.value = false;
};

// Carrega dados ao montar o componente
onMounted(() => {
  loadPublishers();
});
</script>