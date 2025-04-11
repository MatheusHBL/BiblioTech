<template>
    <div class="container mx-auto px-4 py-8">
      <!-- Navegação de volta -->
      <div class="mb-6">
        <router-link to="/books" class="flex items-center text-primary hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para o acervo
        </router-link>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <!-- Erro -->
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>{{ error }}</p>
      </div>
      
      <!-- Conteúdo principal -->
      <div v-else-if="book" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="md:flex">
          <!-- Imagem do livro -->
          <div class="md:w-1/3 bg-gray-200">
            <!-- Placeholder para imagem -->
            <div class="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500 min-h-80">
              <span class="text-sm">Imagem do Livro</span>
            </div>
          </div>
          
          <!-- Detalhes do livro -->
          <div class="md:w-2/3 p-6">
            <div class="mb-6">
              <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ book.titulo }}</h1>
              <p class="text-xl text-gray-600">por <span class="font-medium">{{ book.autor }}</span></p>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p class="text-sm text-gray-500">Categoria</p>
                <p class="font-medium text-primary">{{ book.categoria }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Ano de Publicação</p>
                <p class="font-medium">{{ book.ano_publicacao }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">ISBN</p>
                <p class="font-medium">{{ book.isbn }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Disponibilidade</p>
                <p v-if="book.quantidade_disponivel > 0" class="font-medium text-green-600">
                  {{ book.quantidade_disponivel }} unidade(s) disponível(is)
                </p>
                <p v-else class="font-medium text-red-600">
                  Indisponível
                </p>
              </div>
            </div>
            
            <!-- Descrição (mockada, pois não temos essa informação no banco de dados) -->
            <div class="mb-6">
              <h2 class="text-xl font-semibold mb-2">Descrição</h2>
              <p class="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, 
                nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl nec ultricies lacinia,
                nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
            </div>
            
            <!-- Ações -->
            <div class="flex space-x-4">
              <button 
                v-if="book.quantidade_disponivel > 0"
                @click="handleReserve"
                class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Reservar
              </button>
              <button 
                v-else
                disabled
                class="px-6 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
              >
                Indisponível
              </button>
            </div>
          </div>
        </div>
        
        <!-- Informações adicionais -->
        <div class="p-6 border-t border-gray-200">
          <h2 class="text-xl font-semibold mb-4">Informações Adicionais</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Status de empréstimos -->
            <div>
              <h3 class="text-lg font-medium mb-2">Status de Disponibilidade</h3>
              <div class="bg-gray-100 p-4 rounded-md">
                <div class="flex items-center mb-2">
                  <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span class="text-sm">Disponível para empréstimo</span>
                </div>
                <p class="text-sm text-gray-600">
                  Este livro está disponível para empréstimo imediato ou reserva.
                </p>
              </div>
            </div>
            
            <!-- Localização na biblioteca -->
            <div>
              <h3 class="text-lg font-medium mb-2">Localização</h3>
              <div class="bg-gray-100 p-4 rounded-md">
                <p class="text-sm mb-1"><span class="font-medium">Seção:</span> {{ book.categoria }}</p>
                <p class="text-sm mb-1"><span class="font-medium">Prateleira:</span> A-12</p>
                <p class="text-sm text-gray-600">
                  Caso não encontre, solicite ajuda a um funcionário.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Livros relacionados (opcional) -->
        <div class="p-6 border-t border-gray-200">
          <h2 class="text-xl font-semibold mb-4">Você também pode gostar</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="(relatedBook, index) in relatedBooks" :key="index" class="bg-gray-100 p-3 rounded-md">
              <div class="text-center py-4 bg-gray-200 rounded mb-3">
                <span class="text-sm text-gray-500">Imagem</span>
              </div>
              <h4 class="font-medium text-sm mb-1 truncate">{{ relatedBook.titulo }}</h4>
              <p class="text-xs text-gray-600">{{ relatedBook.autor }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Livro não encontrado -->
      <div v-else class="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Livro não encontrado</h2>
        <p class="text-gray-600 mb-6">O livro que você está procurando não existe ou foi removido.</p>
        <router-link to="/books" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          Voltar para o acervo
        </router-link>
      </div>
      
      <!-- Modal de reserva (simplificado) -->
      <div v-if="showReserveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold mb-4">Confirmar Reserva</h3>
          <p>Você está prestes a reservar o livro <span class="font-semibold">{{ book?.titulo }}</span>.</p>
          
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
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useBookStore } from '../stores/books';
  
  const route = useRoute();
  const router = useRouter();
  const bookStore = useBookStore();
  
  // Estado
  const loading = ref(true);
  const error = ref(null);
  const showReserveModal = ref(false);
  
  // Dados do livro
  const bookId = computed(() => route.params.id);
  const book = computed(() => bookStore.getBookById(bookId.value));
  
  // Livros relacionados (simulação)
  const relatedBooks = ref([]);
  
  // Carregar os dados do livro
  const loadBookData = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      // Carrega o livro específico
      const result = await bookStore.fetchBookById(bookId.value);
      
      if (!result.success) {
        error.value = 'Erro ao carregar dados do livro.';
      }
      
      // Simula livros relacionados (mesma categoria)
      if (book.value) {
        const sameCategoryBooks = bookStore.getBooksByCategory(book.value.categoria)
          .filter(b => b.id_livro !== parseInt(bookId.value))
          .slice(0, 4);
        
        relatedBooks.value = sameCategoryBooks;
      }
    } catch (err) {
      console.error('Erro ao carregar livro:', err);
      error.value = 'Ocorreu um erro ao carregar os dados do livro.';
    } finally {
      loading.value = false;
    }
  };
  
  // Métodos para reserva
  const handleReserve = () => {
    showReserveModal.value = true;
  };
  
  const confirmReservation = () => {
    // Aqui seria a chamada para a API para criar a reserva
    // Por enquanto, apenas simulamos com um alerta
    alert(`Reserva confirmada para o livro "${book.value.titulo}"`);
    showReserveModal.value = false;
    router.push('/reservations');
  };
  
  // Carregar dados quando o componente é montado
  onMounted(() => {
    loadBookData();
  });
  </script>