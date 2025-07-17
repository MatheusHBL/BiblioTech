<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Cabeçalho -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Gestão de Estantes</h1>
      <p class="text-gray-600 mt-2">Gerencie as estantes da biblioteca</p>
    </div>

    <!-- Seção de Cadastro -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">
        {{ editingEstante ? 'Editar Estante' : 'Nova Estante' }}
      </h2>
      
      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="corredor" class="block text-sm font-medium text-gray-700 mb-1">Corredor</label>
            <select
              id="corredor"
              v-model="form.corredor_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="" disabled>Selecione um corredor</option>
              <option v-for="corredor in corredores" :key="corredor.id" :value="corredor.id">
                {{ corredor.nome }}
              </option>
            </select>
            <p v-if="errors.corredor_id" class="mt-1 text-sm text-red-600">{{ errors.corredor_id }}</p>
          </div>
          
          <div>
            <label for="numero" class="block text-sm font-medium text-gray-700 mb-1">Número da Estante</label>
            <input
              id="numero"
              v-model="form.numero"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex: E01"
            />
            <p v-if="errors.numero" class="mt-1 text-sm text-red-600">{{ errors.numero }}</p>
          </div>
          
          <div>
            <label for="descricao" class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input
              id="descricao"
              v-model="form.descricao"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex: Romance"
            />
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            v-if="editingEstante"
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
            {{ isSubmitting ? 'Salvando...' : (editingEstante ? 'Atualizar' : 'Cadastrar') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de Estantes -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Estantes Cadastradas</h3>
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <!-- Lista -->
      <div v-else-if="estantes.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Corredor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
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
            <tr v-for="estante in estantesWithCorredor" :key="estante.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ estante.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ estante.corredor_nome }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ estante.numero }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ estante.descricao || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="editEstante(estante)"
                  class="text-primary hover:text-primary/80"
                >
                  Editar
                </button>
                <button
                  @click="deleteEstante(estante.id)"
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
        <p class="text-gray-500">Nenhuma estante cadastrada</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Estados
const estantes = ref([]);
const corredores = ref([]);
const loading = ref(false);
const isSubmitting = ref(false);
const editingEstante = ref(null);
const errors = ref({});

// Formulário
const form = ref({
  corredor_id: '',
  numero: '',
  descricao: ''
});

// Dados mockados
const mockCorredores = [
  { id: 1, nome: 'Corredor A' },
  { id: 2, nome: 'Corredor B' },
  { id: 3, nome: 'Corredor C' }
];

const mockEstantes = [
  { id: 1, corredor_id: 1, numero: 'E01', descricao: 'Romance' },
  { id: 2, corredor_id: 1, numero: 'E02', descricao: 'Ficção Científica' },
  { id: 3, corredor_id: 2, numero: 'E01', descricao: 'História' }
];

// Computed
const estantesWithCorredor = computed(() => {
  return estantes.value.map(estante => {
    const corredor = corredores.value.find(c => c.id === estante.corredor_id);
    return {
      ...estante,
      corredor_nome: corredor ? corredor.nome : 'N/A'
    };
  });
});

// Métodos
const loadData = async () => {
  loading.value = true;
  try {
    // Simulação de chamadas API
    await new Promise(resolve => setTimeout(resolve, 500));
    corredores.value = [...mockCorredores];
    estantes.value = [...mockEstantes];
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  errors.value = {};
  
  if (!form.value.corredor_id) {
    errors.value.corredor_id = 'Corredor é obrigatório';
    return false;
  }
  
  if (!form.value.numero.trim()) {
    errors.value.numero = 'Número é obrigatório';
    return false;
  }
  
  return true;
};

const submitForm = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingEstante.value) {
      const index = estantes.value.findIndex(e => e.id === editingEstante.value.id);
      if (index !== -1) {
        estantes.value[index] = { ...editingEstante.value, ...form.value };
      }
    } else {
      const newEstante = {
        id: Math.max(...estantes.value.map(e => e.id), 0) + 1,
        ...form.value
      };
      estantes.value.push(newEstante);
    }
    
    resetForm();
  } catch (error) {
    console.error('Erro ao salvar estante:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const editEstante = (estante) => {
  editingEstante.value = estante;
  form.value = { ...estante };
};

const cancelEdit = () => {
  resetForm();
};

const deleteEstante = async (id) => {
  if (!confirm('Tem certeza que deseja excluir esta estante?')) return;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    estantes.value = estantes.value.filter(e => e.id !== id);
  } catch (error) {
    console.error('Erro ao excluir estante:', error);
  }
};

const resetForm = () => {
  form.value = { corredor_id: '', numero: '', descricao: '' };
  editingEstante.value = null;
  errors.value = {};
};

onMounted(() => {
  loadData();
});
</script>