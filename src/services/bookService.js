
import api from './api';

export const bookService = {
  async getBooks(params = {}) {
    try {
      const response = await api.get('/books', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  async getBookById(id) {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

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

  async getBooksByCategory(categoryId, params = {}) {
    try {
      const response = await api.get(`/categories/${categoryId}/books`, { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  async getAuthors(params = {}) {
    try {
      const response = await api.get('/authors', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  async getPublishers(params = {}) {
    try {
      const response = await api.get('/publishers', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  async createBook(bookData) {
    try {
      const response = await api.post('/books', bookData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  async updateBook(id, bookData) {
    try {
      const response = await api.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

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
