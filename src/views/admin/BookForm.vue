<template>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">{{ isEdit ? 'Editar' : 'Cadastrar' }} Livro</h1>
        <router-link to="/books" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
          Voltar para Lista
        </router-link>
      </div>
  
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-6">
              <!-- Título -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  id="title"
                  v-model="formData.titulo"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p v-if="errors.titulo" class="mt-1 text-sm text-red-600">{{ errors.titulo }}</p>
              </div>
  
              <!-- ISBN -->
              <div>
                <label for="isbn" class="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                  id="isbn"
                  v-model="formData.isbn"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p v-if="errors.isbn" class="mt-1 text-sm text-red-600">{{ errors.isbn }}</p>
              </div>
  
              <!-- Ano de Publicação -->
              <div>
                <label for="year" class="block text-sm font-medium text-gray-700 mb-1">Ano de Publicação</label>
                <input
                  id="year"
                  v-model="formData.ano_publicacao"
                  type="number"
                  min="1000"
                  max="9999"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p v-if="errors.ano_publicacao" class="mt-1 text-sm text-red-600">{{ errors.ano_publicacao }}</p>
              </div>
  
              <!-- Quantidade Disponível -->
              <div>
                <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">Quantidade Disponível</label>
                <input
                  id="quantity"
                  v-model="formData.quantidade_disponivel"
                  type="number"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
  
              <!-- Editora -->
              <div>
                <label for="publisher" class="block text-sm font-medium text-gray-700 mb-1">Editora</label>
                <select
                  id="publisher"
                  v-model="formData.id_editora_fk"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" disabled>Selecione uma editora</option>
                  <option v-for="editora in editoras" :key="editora.id_editora" :value="editora.id_editora">
                    {{ editora.nome }}
                  </option>
                </select>
              </div>
            </div>
  
            <div class="space-y-6">
              <!-- Imagem do Livro -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Imagem da Capa</label>
                <div class="mt-1 flex flex-col items-center space-y-4">
                  <div 
                    class="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50"
                    @click="$refs.fileInput.click()"
                  >
                    <img 
                      v-if="imagePreview" 
                      :src="imagePreview" 
                      alt="Preview" 
                      class="h-full object-contain"
                    />
                    <div v-else class="space-y-1 text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="text-sm text-gray-500">Clique para selecionar uma imagem</p>
                      <p class="text-xs text-gray-500">PNG, JPG, GIF até 5MB</p>
                    </div>
                  </div>
                  <input 
                    ref="fileInput" 
                    type="file" 
                    class="hidden" 
                    accept="image/*" 
                    @change="handleImageUpload"
                  />
                  <button
                    v-if="imagePreview"
                    type="button"
                    @click="removeImage"
                    class="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                  >
                    Remover Imagem
                  </button>
                </div>
              </div>
  
              <!-- Autores (múltiplos) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Autores</label>
                <div class="space-y-2">
                  <div v-for="(_, index) in formData.autores" :key="index" class="flex space-x-2">
                    <select
                      v-model="formData.autores[index]"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="" disabled>Selecione um autor</option>
                      <option v-for="autor in autores" :key="autor.id_autor" :value="autor.id_autor">
                        {{ autor.nome }}
                      </option>
                    </select>
                    <button
                      type="button"
                      @click="removeAutor(index)"
                      class="px-2 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addAutor"
                    class="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    + Adicionar autor
                  </button>
                </div>
              </div>
  
              <!-- Categorias (múltiplas) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categorias</label>
                <div class="space-y-2">
                  <div v-for="(_, index) in formData.categorias" :key="index" class="flex space-x-2">
                    <select
                      v-model="formData.categorias[index]"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="" disabled>Selecione uma categoria</option>
                      <option v-for="categoria in categorias" :key="categoria.id_categoria" :value="categoria.id_categoria">
                        {{ categoria.descricao }}
                      </option>
                    </select>
                    <button
                      type="button"
                      @click="removeCategoria(index)"
                      class="px-2 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addCategoria"
                    class="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    + Adicionar categoria
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Descrição (opcional) -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
            <textarea
              id="description"
              v-model="formData.descricao"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
  
          <!-- Botões de ação -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$router.back()"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              {{ isSubmitting ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useValidation } from '../../utils/validation';
  
  const route = useRoute();
  const router = useRouter();
  const { validateISBN } = useValidation();
  
  const isEdit = computed(() => route.name === 'edit-book');
  const bookId = computed(() => route.params.id);
  const isSubmitting = ref(false);
  const imagePreview = ref(null);
  const imageFile = ref(null);
  
  // Dados mockados para categorias, autores e editoras
  const categorias = ref([
    { id_categoria: 1, descricao: 'Aventura' },
    { id_categoria: 2, descricao: 'Biografia' },
    { id_categoria: 3, descricao: 'Crianças' },
    { id_categoria: 4, descricao: 'Ficção Científica' },
    { id_categoria: 5, descricao: 'Romance' },
  ]);
  
  const autores = ref([
    { id_autor: 1, nome: 'J.K. Rowling' },
    { id_autor: 2, nome: 'George R.R. Martin' },
    { id_autor: 3, nome: 'J.R.R. Tolkien' },
    { id_autor: 4, nome: 'Agatha Christie' },
    { id_autor: 5, nome: 'Stephen King' },
  ]);
  
  const editoras = ref([
    { id_editora: 1, nome: 'Companhia das Letras' },
    { id_editora: 2, nome: 'Editora Rocco' },
    { id_editora: 3, nome: 'Penguin Random House' },
    { id_editora: 4, nome: 'Editora Intrínseca' },
    { id_editora: 5, nome: 'Editora Aleph' },
  ]);
  
  // Estado inicial do formulário
  const formData = ref({
    titulo: '',
    isbn: '',
    id_editora_fk: '',
    ano_publicacao: new Date().getFullYear(),
    quantidade_disponivel: 1,
    autores: [''],
    categorias: [''],
    descricao: ''
  });
  
  // Estado de erros
  const errors = ref({
    titulo: '',
    isbn: '',
    ano_publicacao: '',
  });
  
  // Métodos para gerenciar autores e categorias
  const addAutor = () => {
    formData.value.autores.push('');
  };
  
  const removeAutor = (index) => {
    if (formData.value.autores.length > 1) {
      formData.value.autores.splice(index, 1);
    }
  };
  
  const addCategoria = () => {
    formData.value.categorias.push('');
  };
  
  const removeCategoria = (index) => {
    if (formData.value.categorias.length > 1) {
      formData.value.categorias.splice(index, 1);
    }
  };
  
  // Manipulador de upload de imagem
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Verificar tipo de arquivo
    if (!file.type.match('image.*')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }
    
    // Verificar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter menos de 5MB.');
      return;
    }
    
    // Atualizar preview e armazenar arquivo
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    imagePreview.value = null;
    imageFile.value = null;
    if (this.$refs.fileInput) {
      this.$refs.fileInput.value = '';
    }
  };
  
  // Validação do formulário
  const validateForm = () => {
    let isValid = true;
    errors.value = {
      titulo: '',
      isbn: '',
      ano_publicacao: '',
    };
  
    // Validação do título
    if (!formData.value.titulo.trim()) {
      errors.value.titulo = 'O título é obrigatório';
      isValid = false;
    }
  
    // Validação do ISBN
    const isbnError = validateISBN(formData.value.isbn);
    if (isbnError) {
      errors.value.isbn = isbnError;
      isValid = false;
    }
  
    // Validação do ano
    const currentYear = new Date().getFullYear();
    if (formData.value.ano_publicacao < 1000 || formData.value.ano_publicacao > currentYear) {
      errors.value.ano_publicacao = `O ano deve estar entre 1000 e ${currentYear}`;
      isValid = false;
    }
  
    return isValid;
  };
  
  // Carregar dados para edição
  const loadBookData = async () => {
    if (isEdit.value && bookId.value) {
      try {
        // Em um projeto real, aqui você faria uma chamada API para buscar os dados do livro
        // Por enquanto, simulamos com dados mockados
        const mockBook = {
          id_livro: parseInt(bookId.value),
          titulo: 'O Senhor dos Anéis',
          isbn: '9788533613379',
          id_editora_fk: 2,
          ano_publicacao: 2001,
          quantidade_disponivel: 3,
          descricao: 'Um clássico da literatura fantástica.',
          autores: [1, 3],
          categorias: [1, 4]
        };
  
        formData.value = {
          titulo: mockBook.titulo,
          isbn: mockBook.isbn,
          id_editora_fk: mockBook.id_editora_fk,
          ano_publicacao: mockBook.ano_publicacao,
          quantidade_disponivel: mockBook.quantidade_disponivel,
          descricao: mockBook.descricao,
          autores: mockBook.autores,
          categorias: mockBook.categorias
        };
  
        // Simular uma imagem existente
        imagePreview.value = 'https://via.placeholder.com/500x750?text=Cover+Image';
      } catch (error) {
        console.error('Erro ao carregar dados do livro:', error);
        alert('Não foi possível carregar os dados do livro. Verifique sua conexão e tente novamente.');
      }
    }
  };
  
  // Método para enviar o formulário
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      isSubmitting.value = true;
  
      // Em um projeto real, aqui você faria uma chamada API para salvar/atualizar o livro
      // incluindo o upload da imagem se houver
      // Por enquanto, apenas simulamos o sucesso da operação
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula um atraso de rede
  
      // Simula um sucesso
      alert(`Livro ${isEdit.value ? 'atualizado' : 'cadastrado'} com sucesso!`);
      router.push('/admin/books');
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      alert(`Erro ao ${isEdit.value ? 'atualizar' : 'cadastrar'} livro. Tente novamente.`);
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // Carregar dados ao montar o componente
  onMounted(loadBookData);
  </script>