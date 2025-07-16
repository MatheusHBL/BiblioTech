
<template>
  <div class="bg-white p-4 rounded-lg shadow-md">
    <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchValue"
            type="text"
            :placeholder="placeholder"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            @keyup.enter="handleSearch"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div v-if="showCategoryFilter" class="w-full md:w-48">
        <select 
          v-model="selectedCategoryValue"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          @change="handleFilterChange"
        >
          <option value="">Todas as categorias</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
      <div v-if="showAvailabilityFilter" class="w-full md:w-48">
        <select 
          v-model="availabilityValue"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          @change="handleFilterChange"
        >
          <option value="">Disponibilidade</option>
          <option value="available">Disponíveis</option>
          <option value="all">Todos</option>
        </select>
      </div>
      
      <div v-if="showStatusFilter" class="w-full md:w-48">
        <select 
          v-model="statusValue"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          @change="handleFilterChange"
        >
          <option value="">Todos os status</option>
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
      
      <button 
        v-if="showSearchButton"
        @click="handleSearch"
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 md:hidden lg:block"
      >
        Buscar
      </button>
      
      <button 
        @click="clearFilters"
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
      >
        Limpar filtros
      </button>
    </div>
    
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-4">
      <div 
        v-if="searchValue" 
        class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center"
      >
        Busca: {{ searchValue }}
        <button @click="clearSearch" class="ml-1 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div 
        v-if="selectedCategoryValue" 
        class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center"
      >
        Categoria: {{ selectedCategoryValue }}
        <button @click="clearCategory" class="ml-1 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div 
        v-if="availabilityValue" 
        class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center"
      >
        {{ availabilityValue === 'available' ? 'Somente disponíveis' : 'Todos os livros' }}
        <button @click="clearAvailability" class="ml-1 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div 
        v-if="statusValue" 
        class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center"
      >
        Status: {{ getStatusLabel(statusValue) }}
        <button @click="clearStatus" class="ml-1 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  initialSearch: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar por título, autor...'
  },
  
  showCategoryFilter: {
    type: Boolean,
    default: true
  },
  categories: {
    type: Array,
    default: () => []
  },
  initialCategory: {
    type: String,
    default: ''
  },
  
  showAvailabilityFilter: {
    type: Boolean,
    default: false
  },
  initialAvailability: {
    type: String,
    default: ''
  },
  
  showStatusFilter: {
    type: Boolean,
    default: false
  },
  statusOptions: {
    type: Array,
    default: () => []
  },
  initialStatus: {
    type: String,
    default: ''
  },
  
  showSearchButton: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['search', 'filter-change', 'clear']);

const searchValue = ref(props.initialSearch);
const selectedCategoryValue = ref(props.initialCategory);
const availabilityValue = ref(props.initialAvailability);
const statusValue = ref(props.initialStatus);

const hasActiveFilters = computed(() => {
  return searchValue.value || selectedCategoryValue.value || availabilityValue.value || statusValue.value;
});

const getStatusLabel = (value) => {
  const statusOption = props.statusOptions.find(option => option.value === value);
  return statusOption ? statusOption.label : value;
};

const handleSearch = () => {
  emit('search', searchValue.value);
};

const handleFilterChange = () => {
  emit('filter-change', {
    category: selectedCategoryValue.value,
    availability: availabilityValue.value,
    status: statusValue.value
  });
};

const clearSearch = () => {
  searchValue.value = '';
  handleSearch();
};

const clearCategory = () => {
  selectedCategoryValue.value = '';
  handleFilterChange();
};

const clearAvailability = () => {
  availabilityValue.value = '';
  handleFilterChange();
};

const clearStatus = () => {
  statusValue.value = '';
  handleFilterChange();
};

const clearFilters = () => {
  searchValue.value = '';
  selectedCategoryValue.value = '';
  availabilityValue.value = '';
  statusValue.value = '';
  
  emit('clear');
};

watch(() => props.initialSearch, (newValue) => {
  searchValue.value = newValue;
});

watch(() => props.initialCategory, (newValue) => {
  selectedCategoryValue.value = newValue;
});

watch(() => props.initialAvailability, (newValue) => {
  availabilityValue.value = newValue;
});

watch(() => props.initialStatus, (newValue) => {
  statusValue.value = newValue;
});
</script>
