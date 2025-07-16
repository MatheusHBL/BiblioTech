<template>
    <div class="container mx-auto px-4 py-8">
      <!-- Cabeçalho -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">{{ isEdit ? 'Editar Categoria' : 'Cadastrar Nova Categoria' }}</h1>
        <p class="text-gray-600 mt-2">Preencha os dados para {{ isEdit ? 'atualizar a' : 'cadastrar uma nova' }} categoria</p>
      </div>
      
      <!-- Formulário -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nome da Categoria -->
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
          
          <!-- Cor (opcional) -->
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
          
          <!-- Descrição detalhada (opcional) -->
          <div>
            <label for="detailed-description" class="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada (opcional)</label>
            <textarea 
              id="detailed-description"
              v-model="formData.descricao_detalhada"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
          </div>
          
          <!-- Categoria pai (opcional) -->
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
          
          <!-- Botões de ação -->
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
  
  // Verificar se é modo de edição
  const isEdit = computed(() => !!route.params.id);
  
  // Estado do formulário
  const formData = ref({
    descricao: '',
    cor: '#e77e6c', // Cor padrão - mesma cor do tema
    descricao_detalhada: '',
    categoria_pai_id: null
  });
  
  // Lista de categorias disponíveis para serem pai
  const availableParentCategories = ref([
    { id: 1, descricao: 'Aventura' },
    { id: 2, descricao: 'Biografia' },
    { id: 3, descricao: 'Ciência' },
    { id: 4, descricao: 'Ficção Científica' },
    { id: 5, descricao: 'Romance' }
  ]);
  
  // Estado de erros e submissão
  const errors = ref({});
  const isSubmitting = ref(false);
  
  // Se estiver em modo de edição, removemos a categoria atual da lista de pais possíveis
  // para evitar ciclos (uma categoria não pode ser pai dela mesma)
  const filteredParentCategories = computed(() => {
    if (isEdit.value) {
      const currentId = parseInt(route.params.id);
      return availableParentCategories.value.filter(cat => cat.id !== currentId);
    }
    return availableParentCategories.value;
  });
  
  // Carregar dados se for edição
  onMounted(async () => {
    if (isEdit.value) {
      try {
        // Aqui seria uma chamada para API para buscar os dados da categoria
        // Por enquanto, vamos simular com dados mockados
        
        const categoryId = parseInt(route.params.id);
        
        // Simulação de busca de dados (substituir por chamada API)
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
    
    // Carregar categorias pais disponíveis (em implementação real, isso viria da API)
    // A lista já está mockada em availableParentCategories, então não fazemos nada aqui
  });
  
  // Método para lidar com o envio do formulário
  const handleSubmit = async () => {
    // Validar os dados
    const validationErrors = {};
    
    if (!formData.value.descricao) {
      validationErrors.descricao = 'O nome da categoria é obrigatório';
    }
    
    // Se houver erros, atualiza o estado e cancela o envio
    if (Object.keys(validationErrors).length > 0) {
      errors.value = validationErrors;
      return;
    }
    
    try {
      isSubmitting.value = true;
      
      // Na implementação real, aqui você enviaria os dados para a API
      // Simulação de envio (substituir por chamada API)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de chamada API
      
      // Alerta de sucesso (substituir por notificação mais elegante)
      alert(`Categoria ${isEdit.value ? 'atualizada' : 'cadastrada'} com sucesso!`);
      
      // Redirecionar para a lista de categorias
      router.push('/admin/categories');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>