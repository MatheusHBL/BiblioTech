<template>
    <div class="container mx-auto px-4 py-8">
      <!-- Cabeçalho -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">{{ isEdit ? 'Editar Editora' : 'Cadastrar Nova Editora' }}</h1>
        <p class="text-gray-600 mt-2">Preencha os dados para {{ isEdit ? 'atualizar a' : 'cadastrar uma nova' }} editora</p>
      </div>
      
      <!-- Formulário -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nome da Editora -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome da Editora</label>
            <input 
              id="name"
              v-model="formData.nome"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-if="errors.nome" class="mt-1 text-sm text-red-600">{{ errors.nome }}</p>
          </div>
          
          <!-- Email (opcional) -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email (opcional)</label>
            <input 
              id="email"
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>
          
          <!-- Telefone (opcional) -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefone (opcional)</label>
            <input 
              id="phone"
              v-model="formData.telefone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-if="errors.telefone" class="mt-1 text-sm text-red-600">{{ errors.telefone }}</p>
          </div>
          
          <!-- Website (opcional) -->
          <div>
            <label for="website" class="block text-sm font-medium text-gray-700 mb-1">Website (opcional)</label>
            <input 
              id="website"
              v-model="formData.website"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-if="errors.website" class="mt-1 text-sm text-red-600">{{ errors.website }}</p>
          </div>
          
          <!-- Observações (opcional) -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
            <textarea 
              id="notes"
              v-model="formData.observacoes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
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
  import { useValidation } from '../../utils/validation';
  
  const route = useRoute();
  const router = useRouter();
  const { validateEmail } = useValidation();
  
  // Verificar se é modo de edição
  const isEdit = computed(() => !!route.params.id);
  
  // Estado do formulário
  const formData = ref({
    nome: '',
    email: '',
    telefone: '',
    website: '',
    observacoes: ''
  });
  
  // Estado de erros e submissão
  const errors = ref({});
  const isSubmitting = ref(false);
  
  // Carregar dados se for edição
  onMounted(async () => {
    if (isEdit.value) {
      try {
        // Aqui seria uma chamada para API para buscar os dados da editora
        // Por enquanto, vamos simular com dados mockados
        
        const publisherId = parseInt(route.params.id);
        
        // Simulação de busca de dados (substituir por chamada API)
        // Aqui é apenas um exemplo, na implementação real você buscaria da API
        const mockPublishers = [
          { id: 1, nome: 'Editora Exemplo', email: 'contato@exemplo.com', telefone: '(11) 1234-5678', website: 'https://exemplo.com', observacoes: 'Observações de exemplo' }
        ];
        
        const publisher = mockPublishers.find(p => p.id === publisherId);
        
        if (publisher) {
          formData.value = { ...publisher };
        }
      } catch (error) {
        console.error('Erro ao carregar dados da editora:', error);
      }
    }
  });
  
  // Método para lidar com o envio do formulário
  const handleSubmit = async () => {
    // Validar os dados
    const validationErrors = {};
    
    if (!formData.value.nome) {
      validationErrors.nome = 'O nome da editora é obrigatório';
    }
    
    if (formData.value.email && validateEmail(formData.value.email)) {
      validationErrors.email = validateEmail(formData.value.email);
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
      alert(`Editora ${isEdit.value ? 'atualizada' : 'cadastrada'} com sucesso!`);
      
      // Redirecionar para a lista de editoras
      router.push('/admin/publishers');
    } catch (error) {
      console.error('Erro ao salvar editora:', error);
      alert('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      isSubmitting.value = false;
    }
  };
</script>