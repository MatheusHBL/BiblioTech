<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Cabeçalho -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Gestão de Corredores</h1>
      <p class="text-gray-600 mt-2">Gerencie os corredores da biblioteca</p>
    </div>

    <!-- Seção de Cadastro -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">
        {{ editingCorredor ? 'Editar Corredor' : 'Novo Corredor' }}
      </h2>
      
      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-1">Nome do Corredor</label>
            <input
              id="nome"
              v-model="form.nome"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex: Corredor A"
            />
            <p v-if="errors.nome" class="mt-1 text-sm text-red-600">{{ errors.nome }}</p>
          </div>
          
          <div>
            <label for="descricao" class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input
              id="descricao"
              v-model="form.descricao"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex: Literatura Nacional"
            />
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            v-if="editingCorredor"
            type="button"
            @click="cancelEdit"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Salvando...' : (editingCorredor ? 'Atualizar' : 'Cadastrar') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de Corredores -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Corredores Cadastrados</h3>
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <!-- Lista -->
      <div v-else-if="corredores.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="corredor in corredores" :key="corredor.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ corredor.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ corredor.nome }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ corredor.descricao || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="editCorredor(corredor)"
                  class="text-primary hover:text-primary/80"
                >
                  Editar
                </button>
                <button
                  @click="deleteCorredor(corredor.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Estado vazio -->
      <div v-else class="text-center py-8">
        <p class="text-gray-500">Nenhum corredor cadastrado</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Estados
const corredores = ref([]);
const loading = ref(false);
const isSubmitting = ref(false);
const editingCorredor = ref(null);
const errors = ref({});

// Formulário
const form = ref({
  nome: '',
  descricao: ''
});

// Dados mockados para desenvolvimento
const mockCorredores = [
  { id: 1, nome: 'Corredor A', descricao: 'Literatura Nacional' },
  { id: 2, nome: 'Corredor B', descricao: 'Literatura Internacional' },
  { id: 3, nome: 'Corredor C', descricao: 'Ciências Exatas' }
];

// Métodos
const loadCorredores = async () => {
  loading.value = true;
  try {
    // Simulação de chamada API
    await new Promise(resolve => setTimeout(resolve, 500));
    corredores.value = [...mockCorredores];
  } catch (error) {
    console.error('Erro ao carregar corredores:', error);
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  errors.value = {};
  
  if (!form.value.nome.trim()) {
    errors.value.nome = 'Nome é obrigatório';
    return false;
  }
  
  return true;
};

const submitForm = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  try {
    // Simulação de chamada API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingCorredor.value) {
      // Atualizar
      const index = corredores.value.findIndex(c => c.id === editingCorredor.value.id);
      if (index !== -1) {
        corredores.value[index] = { ...editingCorredor.value, ...form.value };
      }
    } else {
      // Criar
      const newCorredor = {
        id: Math.max(...corredores.value.map(c => c.id), 0) + 1,
        ...form.value
      };
      corredores.value.push(newCorredor);
    }
    
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar corredor:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const editCorredor = (corredor) => {
  editingCorredor.value = corredor;
  form.value = { ...corredor };
};

const cancelEdit = () => {
  resetForm();
};

const deleteCorredor = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este corredor?')) return;
  
  try {
    // Simulação de chamada API
    await new Promise(resolve => setTimeout(resolve, 500));
    corredores.value = corredores.value.filter(c => c.id !== id);
  } catch (error) {
    console.error('Erro ao excluir corredor:', error);
  }
};

const resetForm = () => {
  form.value = { nome: '', descricao: '' };
  editingCorredor.value = null;
  errors.value = {};
};

// Lifecycle
onMounted(() => {
  loadCorredores();
});
</script>