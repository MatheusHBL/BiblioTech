<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Gerenciamento de Livros</h1>
      <p class="text-gray-600 mt-2">Cadastre e gerencie os livros da biblioteca</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Editar Livro' : 'Novo Livro' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="titulo" class="block text-sm font-medium text-gray-700 mb-1">Título do Livro</label>
            <input
              id="titulo"
              v-model="formData.titulo"
              type="text"
              required
              placeholder="Digite o título do livro"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-if="errors.titulo" class="mt-1 text-sm text-red-600">{{ errors.titulo }}</p>
          </div>

          <div>
            <label for="isbn" class="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
            <input
              id="isbn"
              v-model="formData.isbn"
              type="text"
              required
              placeholder="Ex: 978-3-16-148410-0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-if="errors.isbn" class="mt-1 text-sm text-red-600">{{ errors.isbn }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="editora" class="block text-sm font-medium text-gray-700 mb-1">Editora</label>
            <select
              id="editora"
              v-model="formData.id_editora_fk"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecione uma editora</option>
              <option v-for="editora in editoras" :key="editora.id_editora" :value="editora.id_editora">
                {{ editora.nome }}
              </option>
            </select>
            <p v-if="errors.id_editora_fk" class="mt-1 text-sm text-red-600">{{ errors.id_editora_fk }}</p>
          </div>

          <div>
            <label for="ano" class="block text-sm font-medium text-gray-700 mb-1">Ano de Publicação</label>
            <input
              id="ano"
              v-model="formData.ano_publicacao"
              type="number"
              min="1800"
              :max="currentYear"
              required
              placeholder="Ex: 2023"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-if="errors.ano_publicacao" class="mt-1 text-sm text-red-600">{{ errors.ano_publicacao }}</p>
          </div>
        </div>

        <div>
          <label for="autores" class="block text-sm font-medium text-gray-700 mb-1">Autores</label>
          <div class="space-y-2">
            <div class="flex flex-wrap gap-2">
              <span v-for="autor in selectedAuthors" :key="autor.id_autor" 
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                {{ autor.nome }}
                <button @click="removeAuthor(autor)" class="ml-2 focus:outline-none">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
            <select
              id="autores"
              v-model="selectedAuthorId"
              @change="addAuthor"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecione um autor para adicionar</option>
              <option v-for="autor in availableAuthors" :key="autor.id_autor" :value="autor.id_autor">
                {{ autor.nome }}
              </option>
            </select>
          </div>
          <p v-if="errors.autores" class="mt-1 text-sm text-red-600">{{ errors.autores }}</p>
        </div>

        <div>
          <label for="categorias" class="block text-sm font-medium text-gray-700 mb-1">Categorias</label>
          <div class="space-y-2">
            <div class="flex flex-wrap gap-2">
              <span v-for="categoria in selectedCategories" :key="categoria.id_categoria" 
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                {{ categoria.descricao }}
                <button @click="removeCategory(categoria)" class="ml-2 focus:outline-none">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
            <select
              id="categorias"
              v-model="selectedCategoryId"
              @change="addCategory"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecione uma categoria para adicionar</option>
              <option v-for="categoria in availableCategories" :key="categoria.id_categoria" :value="categoria.id_categoria">
                {{ categoria.descricao }}
              </option>
            </select>
          </div>
          <p v-if="errors.categorias" class="mt-1 text-sm text-red-600">{{ errors.categorias }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="quantidade" class="block text-sm font-medium text-gray-700 mb-1">Quantidade Disponível</label>
            <input
              id="quantidade"
              v-model="formData.quantidade_disponivel"
              type="number"
              min="1"
              required
              placeholder="Ex: 3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p v-if="errors.quantidade_disponivel" class="mt-1 text-sm text-red-600">{{ errors.quantidade_disponivel }}</p>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button 
            v-if="isEditing"
            type="button"
            @click="cancelEdit"
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
            <span v-else>{{ isEditing ? 'Atualizar' : 'Cadastrar' }}</span>
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-medium">Livros Cadastrados</h3>
        <div class="text-sm text-gray-500">Total: {{ books.length }} livros</div>
      </div>
      
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="books.length === 0" class="p-8 text-center text-gray-500">
        Nenhum livro cadastrado ainda.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor(es)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Editora</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponível</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="book in books" :key="book.id_livro" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ book.titulo }}</div>
                <div class="text-sm text-gray-500">{{ book.categorias?.join(', ') }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ book.autores?.join(', ') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ book.isbn }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ book.editora }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ book.ano_publicacao }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  book.quantidade_disponivel > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ book.quantidade_disponivel }} unidades
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="editBook(book)"
                  class="text-primary hover:text-primary/80"
                >
                  Editar
                </button>
                <button 
                  @click="deleteBook(book)"
                  class="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir o livro <span class="font-semibold">{{ bookToDelete?.titulo }}</span>?</p>
        <p class="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita e removerá todas as referências deste livro.</p>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button 
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const loading = ref(false);
const isSubmitting = ref(false);
const isEditing = ref(false);
const showDeleteModal = ref(false);
const bookToDelete = ref(null);
const books = ref([]);

const autores = ref([]);
const categorias = ref([]);
const editoras = ref([]);

const selectedAuthors = ref([]);
const selectedCategories = ref([]);
const selectedAuthorId = ref('');
const selectedCategoryId = ref('');

const formData = ref({
  id_livro: null,
  titulo: '',
  isbn: '',
  id_editora_fk: '',
  ano_publicacao: '',
  quantidade_disponivel: 1
});

const errors = ref({
  titulo: '',
  isbn: '',
  id_editora_fk: '',
  ano_publicacao: '',
  quantidade_disponivel: '',
  autores: '',
  categorias: ''
});

const currentYear = computed(() => new Date().getFullYear());

const availableAuthors = computed(() => {
  return autores.value.filter(autor => 
    !selectedAuthors.value.some(selected => selected.id_autor === autor.id_autor)
  );
});

const availableCategories = computed(() => {
  return categorias.value.filter(categoria => 
    !selectedCategories.value.some(selected => selected.id_categoria === categoria.id_categoria)
  );
});

const mockData = {
  autores: [
    { id_autor: 1, nome: 'J.K. Rowling' },
    { id_autor: 2, nome: 'Machado de Assis' },
    { id_autor: 3, nome: 'Clarice Lispector' },
    { id_autor: 4, nome: 'Stephen King' }
  ],
  categorias: [
    { id_categoria: 1, descricao: 'Ficção' },
    { id_categoria: 2, descricao: 'Romance' },
    { id_categoria: 3, descricao: 'Terror' },
    { id_categoria: 4, descricao: 'Clássicos' }
  ],
  editoras: [
    { id_editora: 1, nome: 'Companhia das Letras' },
    { id_editora: 2, nome: 'Record' },
    { id_editora: 3, nome: 'Suma' },
    { id_editora: 4, nome: 'Rocco' }
  ],
  books: [
    {
      id_livro: 1,
      titulo: 'Harry Potter e a Pedra Filosofal',
      isbn: '978-85-325-1101-4',
      id_editora_fk: 1,
      editora: 'Rocco',
      ano_publicacao: 2000,
      quantidade_disponivel: 3,
      autores: ['J.K. Rowling'],
      categorias: ['Ficção']
    },
    {
      id_livro: 2,
      titulo: 'Dom Casmurro',
      isbn: '978-85-359-0277-5',
      id_editora_fk: 1,
      editora: 'Companhia das Letras',
      ano_publicacao: 1899,
      quantidade_disponivel: 2,
      autores: ['Machado de Assis'],
      categorias: ['Clássicos', 'Romance']
    }
  ]
};

const loadData = async () => {
  try {
    loading.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    autores.value = [...mockData.autores];
    categorias.value = [...mockData.categorias];
    editoras.value = [...mockData.editoras];
    books.value = [...mockData.books];
    
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  } finally {
    loading.value = false;
  }
};

const addAuthor = () => {
  if (selectedAuthorId.value) {
    const autor = autores.value.find(a => a.id_autor == selectedAuthorId.value);
    if (autor && !selectedAuthors.value.some(a => a.id_autor === autor.id_autor)) {
      selectedAuthors.value.push(autor);
    }
    selectedAuthorId.value = '';
  }
};

const removeAuthor = (autor) => {
  selectedAuthors.value = selectedAuthors.value.filter(a => a.id_autor !== autor.id_autor);
};

const addCategory = () => {
  if (selectedCategoryId.value) {
    const categoria = categorias.value.find(c => c.id_categoria == selectedCategoryId.value);
    if (categoria && !selectedCategories.value.some(c => c.id_categoria === categoria.id_categoria)) {
      selectedCategories.value.push(categoria);
    }
    selectedCategoryId.value = '';
  }
};

const removeCategory = (categoria) => {
  selectedCategories.value = selectedCategories.value.filter(c => c.id_categoria !== categoria.id_categoria);
};

const validateForm = () => {
  let isValid = true;
  errors.value = {
    titulo: '',
    isbn: '',
    id_editora_fk: '',
    ano_publicacao: '',
    quantidade_disponivel: '',
    autores: '',
    categorias: ''
  };

  if (!formData.value.titulo.trim()) {
    errors.value.titulo = 'O título é obrigatório';
    isValid = false;
  }

  if (!formData.value.isbn.trim()) {
    errors.value.isbn = 'O ISBN é obrigatório';
    isValid = false;
  }

  if (!formData.value.id_editora_fk) {
    errors.value.id_editora_fk = 'Selecione uma editora';
    isValid = false;
  }

  if (!formData.value.ano_publicacao) {
    errors.value.ano_publicacao = 'O ano de publicação é obrigatório';
    isValid = false;
  }

  if (!formData.value.quantidade_disponivel || formData.value.quantidade_disponivel < 1) {
    errors.value.quantidade_disponivel = 'A quantidade deve ser pelo menos 1';
    isValid = false;
  }

  if (selectedAuthors.value.length === 0) {
    errors.value.autores = 'Selecione pelo menos um autor';
    isValid = false;
  }

  if (selectedCategories.value.length === 0) {
    errors.value.categorias = 'Selecione pelo menos uma categoria';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    isSubmitting.value = true;

    const bookData = {
      ...formData.value,
      autores: selectedAuthors.value.map(a => a.id_autor),
      categorias: selectedCategories.value.map(c => c.id_categoria)
    };

    if (isEditing.value) {
      const index = books.value.findIndex(b => b.id_livro === formData.value.id_livro);
      if (index !== -1) {
        const editora = editoras.value.find(e => e.id_editora == formData.value.id_editora_fk);
        books.value[index] = {
          ...bookData,
          id_livro: formData.value.id_livro,
          editora: editora?.nome,
          autores: selectedAuthors.value.map(a => a.nome),
          categorias: selectedCategories.value.map(c => c.descricao)
        };
      }
    } else {
      const editora = editoras.value.find(e => e.id_editora == formData.value.id_editora_fk);
      const newBook = {
        ...bookData,
        id_livro: Date.now(),
        editora: editora?.nome,
        autores: selectedAuthors.value.map(a => a.nome),
        categorias: selectedCategories.value.map(c => c.descricao)
      };
      books.value.unshift(newBook);
    }

    resetForm();
  } catch (error) {
    console.error('Erro ao salvar livro:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const editBook = (book) => {
  formData.value = {
    id_livro: book.id_livro,
    titulo: book.titulo,
    isbn: book.isbn,
    id_editora_fk: book.id_editora_fk,
    ano_publicacao: book.ano_publicacao,
    quantidade_disponivel: book.quantidade_disponivel
  };

  selectedAuthors.value = book.autores.map(nomeAutor => 
    autores.value.find(a => a.nome === nomeAutor)
  ).filter(Boolean);

  selectedCategories.value = book.categorias.map(nomeCategoria => 
    categorias.value.find(c => c.descricao === nomeCategoria)
  ).filter(Boolean);

  isEditing.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const deleteBook = (book) => {
  bookToDelete.value = book;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    books.value = books.value.filter(b => b.id_livro !== bookToDelete.value.id_livro);
    showDeleteModal.value = false;
    bookToDelete.value = null;
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
  }
};

const resetForm = () => {
  formData.value = {
    id_livro: null,
    titulo: '',
    isbn: '',
    id_editora_fk: '',
    ano_publicacao: '',
    quantidade_disponivel: 1
  };
  selectedAuthors.value = [];
  selectedCategories.value = [];
  selectedAuthorId.value = '';
  selectedCategoryId.value = '';
  errors.value = {};
  isEditing.value = false;
};

onMounted(() => {
  loadData();
});
</script>