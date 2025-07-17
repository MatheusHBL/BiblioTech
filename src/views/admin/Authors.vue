<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Gerenciamento de Autores</h1>
      <p class="text-gray-600 mt-2">Cadastre e gerencie os autores dos livros da biblioteca</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Editar Autor' : 'Novo Autor' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome do Autor</label>
          <input
            id="name"
            v-model="formData.nome"
            type="text"
            required
            placeholder="Ex: J.K. Rowling, Machado de Assis..."
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

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium">Autores Cadastrados</h3>
      </div>
      
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="authors.length === 0" class="p-8 text-center text-gray-500">
        Nenhum autor cadastrado ainda.
      </div>
      
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
            <tr v-for="author in authors" :key="author.id_autor" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ author.id_autor }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ author.nome }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ author.total_livros || 0 }} livros
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="editAuthor(author)"
                  class="text-primary hover:text-primary/80"
                >
                  Editar
                </button>
                <button 
                  @click="deleteAuthor(author)"
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

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir o autor <span class="font-semibold">{{ authorToDelete?.nome }}</span>?</p>
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

const loading = ref(false);
const isSubmitting = ref(false);
const isEditing = ref(false);
const showDeleteModal = ref(false);
const authorToDelete = ref(null);
const authors = ref([]);

const formData = ref({
  id_autor: null,
  nome: ''
});

const errors = ref({
  nome: ''
});

const mockAuthors = [
  { id_autor: 1, nome: 'J.K. Rowling', total_livros: 7 },
  { id_autor: 2, nome: 'Machado de Assis', total_livros: 12 },
  { id_autor: 3, nome: 'Clarice Lispector', total_livros: 8 },
  { id_autor: 4, nome: 'Gabriel García Márquez', total_livros: 5 },
  { id_autor: 5, nome: 'Stephen King', total_livros: 15 }
];

const loadAuthors = async () => {
  try {
    loading.value = true;
    
    const response = await api.get('/authors');
    authors.value = response.data;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    authors.value = [...mockAuthors];
    
  } catch (error) {
    console.error('Erro ao carregar autores:', error);
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
      await api.put(`/authors/${formData.value.id_autor}`, formData.value);
      
      const index = authors.value.findIndex(a => a.id_autor === formData.value.id_autor);
      if (index !== -1) {
        authors.value[index] = { ...authors.value[index], ...formData.value };
      }
    } else {
      await api.post('/authors', formData.value);
      
      const newAuthor = {
        id_autor: Date.now(),
        nome: formData.value.nome,
        total_livros: 0
      };
      authors.value.unshift(newAuthor);
    }

    resetForm();
  } catch (error) {
    console.error('Erro ao salvar autor:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const editAuthor = (author) => {
  formData.value = { ...author };
  isEditing.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const deleteAuthor = (author) => {
  authorToDelete.value = author;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    await api.delete(`/authors/${authorToDelete.value.id_autor}`);
    
    authors.value = authors.value.filter(a => a.id_autor !== authorToDelete.value.id_autor);
    showDeleteModal.value = false;
    authorToDelete.value = null;
  } catch (error) {
    console.error('Erro ao excluir autor:', error);
  }
};

const resetForm = () => {
  formData.value = {
    id_autor: null,
    nome: ''
  };
  errors.value = { nome: '' };
  isEditing.value = false;
};

onMounted(() => {
  loadAuthors();
});
</script>