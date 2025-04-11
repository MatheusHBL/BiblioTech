<template>
    <div class="w-full overflow-hidden">
      <div 
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * slideWidth}px)` }"
      >
        <div 
          v-for="book in books" 
          :key="book.id_livro"
          class="min-w-[280px] bg-white rounded-lg shadow-md overflow-hidden mx-2 flex-shrink-0"
        >
          <div class="h-64 bg-gray-200 overflow-hidden">
            <!-- Placeholder para imagem do livro -->
            <div class="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500">
              <span class="text-sm">Imagem do Livro</span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-1 truncate">{{ book.titulo }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ book.autor }}</p>
            <div class="flex justify-between items-center">
              <span class="text-primary font-medium">{{ book.categoria }}</span>
              <router-link 
                :to="{ name: 'book-detail', params: { id: book.id_livro }}" 
                class="text-sm font-medium text-primary hover:underline"
              >
                Ver detalhes
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Controles de navegação -->
      <div class="flex justify-center mt-4 space-x-2">
        <button 
          @click="prevSlide" 
          class="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
          :disabled="currentIndex === 0"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          @click="nextSlide" 
          class="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
          :disabled="currentIndex >= maxIndex"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex >= maxIndex }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useBookStore } from '../../stores/books';
  
  const props = defineProps({
    books: {
      type: Array,
      required: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 5000
    }
  });
  
  const bookStore = useBookStore();
  const currentIndex = ref(0);
  const slideWidth = ref(300); // Largura de cada slide (ajustar conforme necessário)
  const containerWidth = ref(0);
  const autoPlayInterval = ref(null);
  
  // Computed para determinar o índice máximo
  const maxIndex = computed(() => {
    if (containerWidth.value === 0) return 0;
    return Math.max(0, props.books.length - Math.floor(containerWidth.value / slideWidth.value));
  });
  
  // Métodos para navegação do carrossel
  const nextSlide = () => {
    if (currentIndex.value < maxIndex.value) {
      currentIndex.value++;
    } else {
      // Volta para o início quando chegar ao fim
      currentIndex.value = 0;
    }
  };
  
  const prevSlide = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    } else {
      // Vai para o final quando estiver no início
      currentIndex.value = maxIndex.value;
    }
  };
  
  // Inicia o autoplay
  const startAutoPlay = () => {
    if (props.autoPlay && props.books.length > 1) {
      autoPlayInterval.value = setInterval(() => {
        nextSlide();
      }, props.interval);
    }
  };
  
  // Pausa o autoplay
  const stopAutoPlay = () => {
    if (autoPlayInterval.value) {
      clearInterval(autoPlayInterval.value);
    }
  };
  
  // Atualiza a largura do container quando a janela é redimensionada
  const updateContainerWidth = () => {
    const container = document.querySelector('.trending-books-container');
    if (container) {
      containerWidth.value = container.offsetWidth;
    }
  };
  
  // Lifecycle hooks
  onMounted(() => {
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    startAutoPlay();
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateContainerWidth);
    stopAutoPlay();
  });
  </script>