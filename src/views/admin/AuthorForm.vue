
<template>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">{{ isEdit ? 'Editar Autor' : 'Cadastrar Novo Autor' }}</h1>
        <p class="text-gray-600 mt-2">Preencha os dados para {{ isEdit ? 'atualizar o' : 'cadastrar um novo' }} autor</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input 
              id="name"
              v-model="formData.nome"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-if="errors.nome" class="mt-1 text-sm text-red-600">{{ errors.nome }}</p>
          </div>
          
          <div>
            <label for="pseudonym" class="block text-sm font-medium text-gray-700 mb-1">Pseudônimo (opcional)</label>
            <input 
              id="pseudonym"
              v-model="formData.pseudonimo"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento (opcional)</label>
            <input 
              id="birthdate"
              v-model="formData.data_nascimento"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label for="nationality" class="block text-sm font-medium text-gray-700 mb-1">Nacionalidade (opcional)</label>
            <input 
              id="nationality"
              v-model="formData.nacionalidade"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label for="biography" class="block text-sm font-medium text-gray-700 mb-1">Biografia (opcional)</label>
            <textarea 
              id="biography"
              v-model="formData.biografia"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
          </div>
          
          <div>
            <label for="website" class="block text-sm font-medium text-gray-700 mb-1">Website ou Redes Sociais (opcional)</label>
            <input 
              id="website"
              v-model="formData.website"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
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
    nome: '',
    pseudonimo: '',
    data_nascimento: '',
    nacionalidade: '',
    biografia: '',
    website: ''
  });
  
  const errors = ref({});
  const isSubmitting = ref(false);
  
  onMounted(async () => {
    if (isEdit.value) {
      try {
        const authorId = parseInt(route.params.id);
        
        const mockAuthors = [
          { 
            id: 1, 
            nome: 'Carlos Drummond de Andrade', 
            pseudonimo: 'Drummond', 
            data_nascimento: '1902-10-31',
            nacionalidade: 'Brasileiro',
            biografia: 'Carlos Drummond de Andrade foi um poeta, contista e cronista brasileiro...',
            website: 'https://exemplo.com/drummond'
          }
        ];
        
        const author = mockAuthors.find(a => a.id === authorId);
        
        if (author) {
          formData.value = { ...author };
        }
      } catch (error) {
        console.error('Erro ao carregar dados do autor:', error);
      }
    }
  });
  
  const handleSubmit = async () => {
    const validationErrors = {};
    
    if (!formData.value.nome) {
      validationErrors.nome = 'O nome do autor é obrigatório';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      errors.value = validationErrors;
      return;
    }
    
    try {
      isSubmitting.value = true;
      
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      alert(`Autor ${isEdit.value ? 'atualizado' : 'cadastrado'} com sucesso!`);
      
      router.push('/admin/authors');
    } catch (error) {
      console.error('Erro ao salvar autor:', error);
      alert('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>
