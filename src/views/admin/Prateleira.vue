<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Cabeçalho -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Gerenciar Prateleiras</h1>
      <p class="text-gray-600">Gerencie as prateleiras da biblioteca organizadas por estantes</p>
    </div>

    <!-- Ações principais -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <!-- Busca -->
      <div class="flex-1 max-w-md">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar prateleiras..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Filtro por estante -->
      <div class="w-full sm:w-auto">
        <select 
          v-model="selectedEstante"
          class="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todas as estantes</option>
          <option v-for="estante in estantes" :key="estante.id" :value="estante.id">
            {{ estante.codigo }} - {{ estante.descricao }}
          </option>
        </select>
      </div>

      <!-- Botão adicionar -->
      <button
        @click="openModal()"
        class="w-full sm:w-auto bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nova Prateleira
      </button>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total de Prateleiras</p>
            <p class="text-2xl font-semibold text-gray-900">{{ prateleiras.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Prateleiras Ativas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ activeCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H9m0 0H7m2 0v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Estantes em Uso</p>
            <p class="text-2xl font-semibold text-gray-900">{{ uniqueEstantes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de prateleiras -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estante
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacidade
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="prateleira in filteredPrateleiras" :key="prateleira.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ prateleira.codigo }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ prateleira.descricao }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ getEstanteNome(prateleira.estante_id) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ prateleira.capacidade }} livros</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="prateleira.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ prateleira.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="openModal(prateleira)"
                  class="text-primary hover:text-primary/80 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="toggleStatus(prateleira)"
                  :class="prateleira.ativo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'"
                >
                  {{ prateleira.ativo ? 'Desativar' : 'Ativar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Estado vazio -->
        <div v-if="filteredPrateleiras.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma prateleira encontrada</h3>
          <p class="mt-1 text-sm text-gray-500">Comece criando uma nova prateleira.</p>
        </div>
      </div>
    </div>

    <!-- Modal de cadastro/edição -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <!-- Cabeçalho do modal -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingPrateleira ? 'Editar Prateleira' : 'Nova Prateleira' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Formulário -->
          <form @submit.prevent="savePrateleira" class="space-y-4">
            <!-- Código -->
            <div>
              <label for="codigo" class="block text-sm font-medium text-gray-700 mb-1">
                Código *
              </label>
              <input
                id="codigo"
                v-model="form.codigo"
                type="text"
                required
                maxlength="10"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: P001"
              />
              <p v-if="errors.codigo" class="mt-1 text-sm text-red-600">{{ errors.codigo }}</p>
            </div>

            <!-- Descrição -->
            <div>
              <label for="descricao" class="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <input
                id="descricao"
                v-model="form.descricao"
                type="text"
                required
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Descrição da prateleira"
              />
              <p v-if="errors.descricao" class="mt-1 text-sm text-red-600">{{ errors.descricao }}</p>
            </div>

            <!-- Estante -->
            <div>
              <label for="estante" class="block text-sm font-medium text-gray-700 mb-1">
                Estante *
              </label>
              <select
                id="estante"
                v-model="form.estante_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione uma estante</option>
                <option v-for="estante in estantes" :key="estante.id" :value="estante.id">
                  {{ estante.codigo }} - {{ estante.descricao }}
                </option>
              </select>
              <p v-if="errors.estante_id" class="mt-1 text-sm text-red-600">{{ errors.estante_id }}</p>
            </div>

            <!-- Capacidade -->
            <div>
              <label for="capacidade" class="block text-sm font-medium text-gray-700 mb-1">
                Capacidade (número de livros) *
              </label>
              <input
                id="capacidade"
                v-model.number="form.capacidade"
                type="number"
                required
                min="1"
                max="1000"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="50"
              />
              <p v-if="errors.capacidade" class="mt-1 text-sm text-red-600">{{ errors.capacidade }}</p>
            </div>

            <!-- Status -->
            <div>
              <label class="flex items-center">
                <input
                  v-model="form.ativo"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700">Prateleira ativa</span>
              </label>
            </div>

            <!-- Botões de ação -->
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                {{ isSubmitting ? 'Salvando...' : (editingPrateleira ? 'Atualizar' : 'Criar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Toast de notificação -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Estado da aplicação
const prateleiras = ref([]);
const estantes = ref([]);
const searchQuery = ref('');
const selectedEstante = ref('');
const showModal = ref(false);
const editingPrateleira = ref(null);
const isSubmitting = ref(false);
const showToast = ref(false);
const toastMessage = ref('');

// Formulário
const form = ref({
  codigo: '',
  descricao: '',
  estante_id: '',
  capacidade: 50,
  ativo: true
});

const errors = ref({
  codigo: '',
  descricao: '',
  estante_id: '',
  capacidade: ''
});

// Dados mockados para demonstração
const mockPrateleiras = [
  {
    id: 1,
    codigo: 'P001',
    descricao: 'Prateleira Superior - Ficção',
    estante_id: 1,
    capacidade: 50,
    ativo: true
  },
  {
    id: 2,
    codigo: 'P002',
    descricao: 'Prateleira Inferior - Ficção',
    estante_id: 1,
    capacidade: 45,
    ativo: true
  },
  {
    id: 3,
    codigo: 'P003',
    descricao: 'Prateleira Superior - Não Ficção',
    estante_id: 2,
    capacidade: 60,
    ativo: true
  },
  {
    id: 4,
    codigo: 'P004',
    descricao: 'Prateleira do Meio - Não Ficção',
    estante_id: 2,
    capacidade: 55,
    ativo: false
  }
];

const mockEstantes = [
  { id: 1, codigo: 'E001', descricao: 'Estante Central - Ficção' },
  { id: 2, codigo: 'E002', descricao: 'Estante Lateral - Não Ficção' },
  { id: 3, codigo: 'E003', descricao: 'Estante Entrada - Periódicos' }
];

// Computed properties
const filteredPrateleiras = computed(() => {
  let filtered = prateleiras.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      p => p.codigo.toLowerCase().includes(query) || 
           p.descricao.toLowerCase().includes(query)
    );
  }

  if (selectedEstante.value) {
    filtered = filtered.filter(p => p.estante_id === parseInt(selectedEstante.value));
  }

  return filtered;
});

const activeCount = computed(() => {
  return prateleiras.value.filter(p => p.ativo).length;
});

const uniqueEstantes = computed(() => {
  const estanteIds = new Set(prateleiras.value.map(p => p.estante_id));
  return estanteIds.size;
});

// Métodos
const getEstanteNome = (estanteId) => {
  const estante = estantes.value.find(e => e.id === estanteId);
  return estante ? `${estante.codigo} - ${estante.descricao}` : 'N/A';
};

const openModal = (prateleira = null) => {
  editingPrateleira.value = prateleira;
  if (prateleira) {
    form.value = { ...prateleira };
  } else {
    resetForm();
  }
  showModal.value = true;
  errors.value = {
    codigo: '',
    descricao: '',
    estante_id: '',
    capacidade: ''
  };
};

const closeModal = () => {
  showModal.value = false;
  editingPrateleira.value = null;
  resetForm();
};

const resetForm = () => {
  form.value = {
    codigo: '',
    descricao: '',
    estante_id: '',
    capacidade: 50,
    ativo: true
  };
};

const validateForm = () => {
  errors.value = {
    codigo: '',
    descricao: '',
    estante_id: '',
    capacidade: ''
  };

  let isValid = true;

  if (!form.value.codigo.trim()) {
    errors.value.codigo = 'Código é obrigatório';
    isValid = false;
  } else if (form.value.codigo.length < 2) {
    errors.value.codigo = 'Código deve ter pelo menos 2 caracteres';
    isValid = false;
  } else {
    // Verificar se código já existe
    const exists = prateleiras.value.some(
      p => p.codigo.toLowerCase() === form.value.codigo.toLowerCase() && 
           p.id !== editingPrateleira.value?.id
    );
    if (exists) {
      errors.value.codigo = 'Este código já está em uso';
      isValid = false;
    }
  }

  if (!form.value.descricao.trim()) {
    errors.value.descricao = 'Descrição é obrigatória';
    isValid = false;
  }

  if (!form.value.estante_id) {
    errors.value.estante_id = 'Selecione uma estante';
    isValid = false;
  }

  if (!form.value.capacidade || form.value.capacidade < 1) {
    errors.value.capacidade = 'Capacidade deve ser maior que 0';
    isValid = false;
  }

  return isValid;
};

const savePrateleira = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingPrateleira.value) {
      // Atualizar prateleira existente
      const index = prateleiras.value.findIndex(p => p.id === editingPrateleira.value.id);
      if (index !== -1) {
        prateleiras.value[index] = { ...form.value, id: editingPrateleira.value.id };
      }
      showToastMessage('Prateleira atualizada com sucesso!');
    } else {
      // Criar nova prateleira
      const newPrateleira = {
        ...form.value,
        id: Date.now() // Simular ID
      };
      prateleiras.value.push(newPrateleira);
      showToastMessage('Prateleira criada com sucesso!');
    }

    closeModal();
  } catch (error) {
    console.error('Erro ao salvar prateleira:', error);
    showToastMessage('Erro ao salvar prateleira!');
  } finally {
    isSubmitting.value = false;
  }
};

const toggleStatus = async (prateleira) => {
  try {
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    prateleira.ativo = !prateleira.ativo;
    showToastMessage(`Prateleira ${prateleira.ativo ? 'ativada' : 'desativada'} com sucesso!`);
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    showToastMessage('Erro ao alterar status da prateleira!');
  }
};

const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// Carregar dados iniciais
onMounted(() => {
  // Simular carregamento de dados da API
  prateleiras.value = [...mockPrateleiras];
  estantes.value = [...mockEstantes];
});
</script>