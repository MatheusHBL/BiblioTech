
<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="relative h-60 bg-gray-200 overflow-hidden">
      <div class="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500">
        <span class="text-sm">Imagem do Livro</span>
      </div>
      
      <div 
        v-if="book.quantidade_disponivel > 0" 
        class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded"
      >
        Disponível
      </div>
      <div 
        v-else 
        class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
      >
        Indisponível
      </div>
      
      <div 
        v-if="isOffered" 
        class="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded"
      >
        Novo
      </div>
    </div>
    
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-1 truncate">{{ book.titulo }}</h3>
      <p class="text-gray-600 text-sm mb-2">{{ book.autor }}</p>
      
      <div class="flex justify-between items-center mb-3">
        <span class="text-primary text-sm font-medium">{{ book.categoria }}</span>
        <span class="text-gray-500 text-sm">{{ book.ano_publicacao }}</span>
      </div>
      
      <div class="flex justify-between items-center mt-2">
        <router-link 
          :to="{ name: 'book-detail', params: { id: book.id_livro }}" 
          class="text-sm font-medium text-primary hover:underline"
        >
          Ver detalhes
        </router-link>
        
        <button 
          v-if="book.quantidade_disponivel > 0"
          @click="handleReserve"
          class="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
        >
          Reservar
        </button>
        <button 
          v-else
          disabled
          class="text-xs bg-gray-300 text-gray-500 px-3 py-1 rounded cursor-not-allowed"
        >
          Indisponível
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  isOffered: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['reserve']);

const router = useRouter();
const authStore = useAuthStore();

const handleReserve = () => {
  if (authStore.isAuthenticated) {
    emit('reserve', props.book);
  } else {
    router.push('/login');
  }
};
</script>
