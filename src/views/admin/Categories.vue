<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Cabeçalho -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Gerenciamento de Categorias</h1>
      <p class="text-gray-600 mt-2">Cadastre e gerencie as categorias de livros da biblioteca</p>
    </div>

    <!-- Formulário de cadastro/edição -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Editar Categoria' : 'Nova Categoria' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Descrição da Categoria</label>
          <input
            id="description"
            v-model="formData.descricao"
            type="text"
            required
            placeholder="Ex: Ficção Científica, História, Romance..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p v-if="errors.descricao" class="mt-1 text-sm text-red-600">{{ errors.descricao }}</p>
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

    <!-- Lista de categorias -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium">Categorias Cadastradas</h3>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <!-- Lista vazia -->
      <div v-else-if="categories.length === 0" class="p-8 text-center text-gray-500">
        Nenhuma categoria cadastrada ainda.
      </div>
      
      <!-- Tabela de categorias -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livros</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="category in categories" :key="category.id_categoria" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.id_categoria }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ category.descricao }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ category.total_livros || 0 }} livros
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="editCategory(category)"
                  class="text-primary hover:text-primary/80"
                >
                  Editar
                </button>
                <button 
                  @click="deleteCategory(category)"
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
        <p>Tem certeza que deseja excluir a categoria <span class="font-semibold">{{ categoryToDelete?.descricao }}</span>?</p>
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
const categoryToDelete = ref(null);
const categories = ref([]);

// Estado do formulário
const formData = ref({
  id_categoria: null,
  descricao: ''
});

const errors = ref({
  descricao: ''
});

// Dados mockados para desenvolvimento
const mockCategories = [
  { id_categoria: 1, descricao: 'Ficção Científica', total_livros: 15 },
  { id_categoria: 2, descricao: 'Romance', total_livros: 23 },
  { id_categoria: 3, descricao: 'História', total_livros: 8 },
  { id_categoria: 4, descricao: 'Biografia', total_livros: 12 },
  { id_categoria: 5, descricao: 'Aventura', total_livros: 18 }
];

// Métodos
const loadCategories = async () => {
  try {
    loading.value = true;
    
    // Simulação de chamada API
    // const response = await api.get('/categories');
    // categories.value = response.data;
    
    // Mock data para desenvolvimento
    await new Promise(resolve => setTimeout(resolve, 500));
    categories.value = [...mockCategories];
    
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  let isValid = true;
  errors.value = { descricao: '' };

  if (!formData.value.descricao.trim()) {
    errors.value.descricao = 'A descrição é obrigatória';
    isValid = false;
  } else if (formData.value.descricao.length < 3) {
    errors.value.descricao = 'A descrição deve ter pelo menos 3 caracteres';
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
      // await api.put(`/categories/${formData.value.id_categoria}`, formData.value);
      
      const index = categories.value.findIndex(c => c.id_categoria === formData.value.id_categoria);
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], ...formData.value };
      }
    } else {
      // Simulação de criação
      // await api.post('/categories', formData.value);
      
      const newCategory = {
        id_categoria: Date.now(), // Mock ID
        descricao: formData.value.descricao,
        total_livros: 0
      };
      categories.value.unshift(newCategory);
    }

    resetForm();
  } catch (error) {
    console.error('Erro ao salvar categoria:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const editCategory = (category) => {
  formData.value = { ...category };
  isEditing.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const deleteCategory = (category) => {
  categoryToDelete.value = category;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    // Simulação de exclusão
    // await api.delete(`/categories/${categoryToDelete.value.id_categoria}`);
    
    categories.value = categories.value.filter(c => c.id_categoria !== categoryToDelete.value.id_categoria);
    showDeleteModal.value = false;
    categoryToDelete.value = null;
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
  }
};

const resetForm = () => {
  formData.value = {
    id_categoria: null,
    descricao: ''
  };
  errors.value = { descricao: '' };
  isEditing.value = false;
};

// Carrega dados ao montar o componente
onMounted(() => {
  loadCategories();
});
</script>