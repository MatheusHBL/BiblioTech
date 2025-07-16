
<template>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Gerenciamento de Empréstimos</h1>
        <p class="text-gray-600 mt-2">Controle todos os empréstimos da biblioteca</p>
      </div>
      
      <div v-if="loading" class="flex justify-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <div v-else>
        <div class="mb-6 bg-white p-4 rounded-lg shadow-md">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div class="w-full md:w-64">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar por título ou usuário..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select 
                v-model="statusFilter"
                class="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos os status</option>
                <option value="Ativo">Ativo</option>
                <option value="Devolvido">Devolvido</option>
                <option value="Atrasado">Atrasado</option>
              </select>
            </div>
            
            <button
              @click="showNewLoanModal = true"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Novo Empréstimo
              </div>
            </button>
          </div>
        </div>
        
        <div v-if="filteredLoans.length === 0" class="bg-white p-8 rounded-lg shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Nenhum empréstimo encontrado</h2>
          <p class="text-gray-600 mb-6">Não existem empréstimos com os filtros selecionados.</p>
          <button 
            @click="clearFilters"
            class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Limpar filtros
          </button>
        </div>
        
        <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livro
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empréstimo
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previsão de Devolução
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
                <tr v-for="loan in filteredLoans" :key="loan.id_emprestimo" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0 bg-gray-300 rounded">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ loan.titulo }}</div>
                        <div class="text-sm text-gray-500">{{ loan.autor }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ loan.nome_usuario }}</div>
                    <div class="text-sm text-gray-500">{{ loan.tipo_usuario }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(loan.data_emprestimo) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(loan.data_prevista_devolucao) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="loan.status === 'Ativo'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Ativo
                    </span>
                    <span v-else-if="loan.status === 'Devolvido'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Devolvido
                    </span>
                    <span v-else-if="loan.status === 'Atrasado'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Atrasado
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      v-if="loan.status === 'Ativo' || loan.status === 'Atrasado'"
                      @click="handleReturnBook(loan)"
                      class="text-green-600 hover:text-green-900 mr-3"
                    >
                      Devolver
                    </button>
                    <button 
                      @click="handleViewDetails(loan)"
                      class="text-primary hover:text-primary/80"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div class="flex-1 flex justify-between sm:hidden">
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Anterior
              </button>
              <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Próximo
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando <span class="font-medium">1</span> a <span class="font-medium">{{ filteredLoans.length }}</span> de <span class="font-medium">{{ filteredLoans.length }}</span> resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span class="sr-only">Anterior</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span class="sr-only">Próximo</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="showReturnModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold mb-4">Confirmar Devolução</h3>
          <p>Você está prestes a registrar a devolução do livro <span class="font-semibold">{{ selectedLoan?.titulo }}</span> 
          emprestado para <span class="font-semibold">{{ selectedLoan?.nome_usuario }}</span>.</p>
          
          <div class="mt-4 bg-gray-50 p-3 rounded">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-gray-500">Data do empréstimo</p>
                <p class="text-sm font-medium">{{ formatDate(selectedLoan?.data_emprestimo) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Previsão de devolução</p>
                <p class="text-sm font-medium">{{ formatDate(selectedLoan?.data_prevista_devolucao) }}</p>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="showReturnModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button 
              @click="confirmReturn"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Confirmar Devolução
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="showNewLoanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold mb-4">Novo Empréstimo</h3>
          
          <form @submit.prevent="createLoan">
            <div class="space-y-4">
              <div>
                <label for="user" class="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                <select 
                  id="user"
                  v-model="newLoan.userId"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" disabled>Selecione um usuário</option>
                  <option v-for="user in users" :key="user.id_usuario" :value="user.id_usuario">
                    {{ user.nome }} ({{ user.tipo_usuario }})
                  </option>
                </select>
              </div>
              
              <div>
                <label for="book" class="block text-sm font-medium text-gray-700 mb-1">Livro</label>
                <select 
                  id="book"
                  v-model="newLoan.bookId"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" disabled>Selecione um livro</option>
                  <option v-for="book in availableBooks" :key="book.id_livro" :value="book.id_livro">
                    {{ book.titulo }} ({{ book.quantidade_disponivel }} disponível)
                  </option>
                </select>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="loanDate" class="block text-sm font-medium text-gray-700 mb-1">Data do Empréstimo</label>
                  <input
                    id="loanDate"
                    v-model="newLoan.loanDate"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label for="returnDate" class="block text-sm font-medium text-gray-700 mb-1">Previsão de Devolução</label>
                  <input
                    id="returnDate"
                    v-model="newLoan.returnDate"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button 
                type="button"
                @click="showNewLoanModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Registrar Empréstimo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useBookStore } from '../stores/books';
  
  const router = useRouter();
  const bookStore = useBookStore();
  
  const loading = ref(true);
  const searchQuery = ref('');
  const statusFilter = ref('');
  const showReturnModal = ref(false);
  const showNewLoanModal = ref(false);
  const selectedLoan = ref(null);
  
  const loans = ref([
    {
      id_emprestimo: 1,
      id_livro_fk: 1,
      id_usuario_fk: 1,
      titulo: 'Dragon World',
      autor: 'Robin Parrish',
      nome_usuario: 'João Silva',
      tipo_usuario: 'Estudante',
      data_emprestimo: '2025-04-01',
      data_prevista_devolucao: '2025-04-15',
      data_devolucao: null,
      status: 'Ativo'
    },
    {
      id_emprestimo: 2,
      id_livro_fk: 3,
      id_usuario_fk: 2,
      titulo: 'Animals Life',
      autor: 'Bowen Greenwood',
      nome_usuario: 'Maria Souza',
      tipo_usuario: 'Professor',
      data_emprestimo: '2025-03-20',
      data_prevista_devolucao: '2025-04-10',
      data_devolucao: null,
      status: 'Atrasado'
    },
    {
      id_emprestimo: 3,
      id_livro_fk: 4,
      id_usuario_fk: 3,
      titulo: 'Memorise',
      autor: 'Lando Pigose',
      nome_usuario: 'Carlos Mendes',
      tipo_usuario: 'Comum',
      data_emprestimo: '2025-03-15',
      data_prevista_devolucao: '2025-03-30',
      data_devolucao: '2025-03-28',
      status: 'Devolvido'
    }
  ]);
  
  const newLoan = ref({
    userId: '',
    bookId: '',
    loanDate: new Date().toISOString().substr(0, 10), 
    returnDate: ''
  });
  
  const users = ref([
    { id_usuario: 1, nome: 'João Silva', tipo_usuario: 'Estudante' },
    { id_usuario: 2, nome: 'Maria Souza', tipo_usuario: 'Professor' },
    { id_usuario: 3, nome: 'Carlos Mendes', tipo_usuario: 'Comum' },
    { id_usuario: 4, nome: 'Ana Oliveira', tipo_usuario: 'Estudante' }
  ]);
  
  const availableBooks = computed(() => {
    return bookStore.books.filter(book => book.quantidade_disponivel > 0);
  });
  
  const filteredLoans = computed(() => {
    let result = [...loans.value];
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(loan => 
        loan.titulo.toLowerCase().includes(query) || 
        loan.nome_usuario.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter.value) {
      result = result.filter(loan => loan.status === statusFilter.value);
    }
    
    return result;
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  const clearFilters = () => {
    searchQuery.value = '';
    statusFilter.value = '';
  };
  
  const handleReturnBook = (loan) => {
    selectedLoan.value = loan;
    showReturnModal.value = true;
  };
  
  const confirmReturn = () => {
    const index = loans.value.findIndex(l => l.id_emprestimo === selectedLoan.value.id_emprestimo);
    if (index !== -1) {
      loans.value[index].status = 'Devolvido';
      loans.value[index].data_devolucao = new Date().toISOString().substr(0, 10);
    }
    
    showReturnModal.value = false;
    selectedLoan.value = null;
  };
  
  const handleViewDetails = (loan) => {
    router.push(`/books/${loan.id_livro_fk}`);
  };
  
  const createLoan = () => {
    const userObj = users.value.find(u => u.id_usuario === parseInt(newLoan.value.userId));
    const bookObj = bookStore.getBookById(newLoan.value.bookId);
    
    if (userObj && bookObj) {
      const newLoanObj = {
        id_emprestimo: loans.value.length + 1,
        id_livro_fk: bookObj.id_livro,
        id_usuario_fk: userObj.id_usuario,
        titulo: bookObj.titulo,
        autor: bookObj.autor,
        nome_usuario: userObj.nome,
        tipo_usuario: userObj.tipo_usuario,
        data_emprestimo: newLoan.value.loanDate,
        data_prevista_devolucao: newLoan.value.returnDate,
        data_devolucao: null,
        status: 'Ativo'
      };
      
      loans.value.unshift(newLoanObj);
      
      newLoan.value = {
        userId: '',
        bookId: '',
        loanDate: new Date().toISOString().substr(0, 10),
        returnDate: ''
      };
      
      showNewLoanModal.value = false;
    }
  };
  
  onMounted(async () => {
    await bookStore.fetchBooks();
    loading.value = false;
    
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 15);
    newLoan.value.returnDate = defaultDate.toISOString().substr(0, 10);
  });
  </script>
