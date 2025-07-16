
<template>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Acervo de Livros</h1>
        <p class="text-gray-600 mt-2">Explore nossa coleção de livros disponíveis para empréstimo</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por título, autor..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="w-full md:w-48">
            <select 
              v-model="selectedCategory"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todas as categorias</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <button 
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Limpar filtros
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="flex justify-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="filteredBooks.length === 0" class="text-center my-12">
        <p class="text-gray-500 text-lg">Nenhum livro encontrado com os filtros selecionados.</p>
        <button 
          @click="clearFilters"
          class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Limpar filtros
        </button>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <BookCard 
          v-for="book in filteredBooks" 
          :key="book.id_livro" 
          :book="book"
          :is-offered="book.id_livro % 3 === 0"
          @reserve="handleReserve"
        />
      </div>
      
      <div v-if="filteredBooks.length > 0" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button 
            class="p-2 rounded-md border border-gray-300 hover:bg-gray-100"
            :disabled="currentPage === 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <span class="px-4 py-2">Página {{ currentPage }} de {{ totalPages }}</span>
          
          <button 
            class="p-2 rounded-md border border-gray-300 hover:bg-gray-100"
            :disabled="currentPage === totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>
      
      <div v-if="showReserveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold mb-4">Confirmar Reserva</h3>
          <p>Você está prestes a reservar o livro <span class="font-semibold">{{ selectedBook?.titulo }}</span>.</p>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="showReserveModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button 
              @click="confirmReservation"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Confirmar Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useBookStore } from '../stores/books';
  import BookCard from '../components/books/BookCard.vue';
  import axios from '../utils/axios';
  
  const bookStore = useBookStore();
  
  const loading = ref(false);
  const searchQuery = ref('');
  const selectedCategory = ref('');
  const currentPage = ref(1);
  const itemsPerPage = 12; 
  
  const showReserveModal = ref(false);
  const selectedBook = ref(null);
  
  const books = computed(() => bookStore.books);
  const categories = computed(() => bookStore.categories);
  
  const filteredBooks = computed(() => {
    let result = [...books.value];
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(book => 
        book.titulo.toLowerCase().includes(query) || 
        book.autor.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory.value) {
      result = result.filter(book => book.categoria === selectedCategory.value);
    }
    
    return result;
  });
  
  const totalPages = computed(() => {
    return Math.ceil(filteredBooks.value.length / itemsPerPage);
  });
  
  const clearFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = '';
    currentPage.value = 1;
  };
  
  const handleReserve = (book) => {
    selectedBook.value = book;
    showReserveModal.value = true;
  };
  
  const confirmReservation = () => {
    alert(`Reserva confirmada para o livro "${selectedBook.value.titulo}"`);
    showReserveModal.value = false;
    selectedBook.value = null;
  };
  
  onMounted(async () => {
    loading.value = true;
    await bookStore.fetchBooks();
    loading.value = false;
  });
  
  watch([searchQuery, selectedCategory], () => {
    currentPage.value = 1;
  });
  </script>
