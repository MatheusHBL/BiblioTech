import api from './api';

export const bookService = {
  /**
   * Obtém todos os livros
   * @param {Object} params - Parâmetros de busca e paginação
   * @returns {Promise} Promessa com a lista de livros
   */
  async getBooks(params = {}) {
    try {
      const response = await api.get('/books', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Obtém um livro específico pelo ID
   * @param {number} id - ID do livro
   * @returns {Promise} Promessa com os dados do livro
   */
  async getBookById(id) {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Busca livros por termo de busca
   * @param {string} query - Termo de busca
   * @param {Object} params - Parâmetros adicionais
   * @returns {Promise} Promessa com os resultados da busca
   */
  async searchBooks(query, params = {}) {
    try {
      const response = await api.get('/books/search', { 
        params: { 
          q: query,
          ...params
        } 
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Obtém livros por categoria
   * @param {number} categoryId - ID da categoria
   * @param {Object} params - Parâmetros adicionais
   * @returns {Promise} Promessa com os livros da categoria
   */
  async getBooksByCategory(categoryId, params = {}) {
    try {
      const response = await api.get(`/categories/${categoryId}/books`, { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Obtém todas as categorias
   * @returns {Promise} Promessa com a lista de categorias
   */
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Obtém todos os autores
   * @param {Object} params - Parâmetros de busca e paginação
   * @returns {Promise} Promessa com a lista de autores
   */
  async getAuthors(params = {}) {
    try {
      const response = await api.get('/authors', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Obtém todas as editoras
   * @param {Object} params - Parâmetros de busca e paginação
   * @returns {Promise} Promessa com a lista de editoras
   */
  async getPublishers(params = {}) {
    try {
      const response = await api.get('/publishers', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Cria um novo livro (admin)
   * @param {Object} bookData - Dados do livro
   * @returns {Promise} Promessa com os dados do livro criado
   */
  async createBook(bookData) {
    try {
      const response = await api.post('/books', bookData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Atualiza um livro existente (admin)
   * @param {number} id - ID do livro
   * @param {Object} bookData - Novos dados do livro
   * @returns {Promise} Promessa com os dados do livro atualizado
   */
  async updateBook(id, bookData) {
    try {
      const response = await api.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Remove um livro (admin)
   * @param {number} id - ID do livro
   * @returns {Promise} Promessa indicando sucesso da operação
   */
  async deleteBook(id) {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default bookService;