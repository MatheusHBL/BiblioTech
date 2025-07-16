
<template>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">{{ isEdit ? 'Editar Categoria' : 'Cadastrar Nova Categoria' }}</h1>
        <p class="text-gray-600 mt-2">Preencha os dados para {{ isEdit ? 'atualizar a' : 'cadastrar uma nova' }} categoria</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
            <input 
              id="description"
              v-model="formData.descricao"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-if="errors.descricao" class="mt-1 text-sm text-red-600">{{ errors.descricao }}</p>
          </div>
          
          <div>
            <label for="color" class="block text-sm font-medium text-gray-700 mb-1">Cor (opcional)</label>
            <div class="flex items-center space-x-3">
              <input 
                id="color"
                v-model="formData.cor"
                type="color"
                class="h-10 w-14 border border-gray-300 rounded-md"
              />
              <span class="text-sm text-gray-600">{{ formData.cor }}</span>
            </div>
          </div>
          
          <div>
            <label for="detailed-description" class="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada (opcional)</label>
            <textarea 
              id="detailed-description"
              v-model="formData.descricao_detalhada"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
          </div>
          
          <div>
            <label for="parent-category" class="block text-sm font-medium text-gray-700 mb-1">Categoria Pai (opcional)</label>
            <select
              id="parent-category"
              v-model="formData.categoria_pai_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option :value="null">Nenhuma (categoria principal)</option>
              <option v-for="category in availableParentCategories" :key="category.id" :value="category.id">
                {{ category.descricao }}
              </option>
            </select>
            <p class="mt-1 text-sm text-gray-500">Se esta for uma subcategoria, selecione a categoria pai</p>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              @click="$router.go(-1)"
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
              <span v-else>{{ isEdit ? 'Atualizar' : 'Cadastrar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
  const isEdit = computed(() => !!route.params.id);
  
  const formData = ref({
    descricao: '',
    cor: '#e77e6c',
    descricao_detalhada: '',
    categoria_pai_id: null
  });
  
  const availableParentCategories = ref([
    { id: 1, descricao: 'Aventura' },
    { id: 2, descricao: 'Biografia' },
    { id: 3, descricao: 'Ciência' },
    { id: 4, descricao: 'Ficção Científica' },
    { id: 5, descricao: 'Romance' }
  ]);
  
  const errors = ref({});
  const isSubmitting = ref(false);
  
  const filteredParentCategories = computed(() => {
    if (isEdit.value) {
      const currentId = parseInt(route.params.id);
      return availableParentCategories.value.filter(cat => cat.id !== currentId);
    }
    return availableParentCategories.value;
  });
  
  onMounted(async () => {
    if (isEdit.value) {
      try {
        const categoryId = parseInt(route.params.id);
        
        const mockCategories = [
          { 
            id: 1, 
            descricao: 'Aventura', 
            cor: '#ff0000',
            descricao_detalhada: 'Livros de aventura e ação...',
            categoria_pai_id: null
          }
        ];
        
        const category = mockCategories.find(c => c.id === categoryId);
        
        if (category) {
          formData.value = { ...category };
        }
      } catch (error) {
        console.error('Erro ao carregar dados da categoria:', error);
      }
    }
    
  });
  
  const handleSubmit = async () => {
    const validationErrors = {};
    
    if (!formData.value.descricao) {
      validationErrors.descricao = 'O nome da categoria é obrigatório';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      errors.value = validationErrors;
      return;
    }
    
    try {
      isSubmitting.value = true;
      
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      alert(`Categoria ${isEdit.value ? 'atualizada' : 'cadastrada'} com sucesso!`);
      
      router.push('/admin/categories');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>
