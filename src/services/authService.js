import api from './api';

export const authService = {
  /**
   * Realiza o login do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} Promessa com os dados do usuário e token
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} Promessa com os dados do usuário registrado
   */
  async register(userData, password) {
    try {
      const response = await api.post('/auth/register', { ...userData, password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Faz logout do usuário
   * @returns {Promise} Promessa indicando sucesso do logout
   */
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Obtém dados do perfil do usuário logado
   * @returns {Promise} Promessa com os dados do perfil
   */
  async getUserProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Atualiza os dados do perfil do usuário
   * @param {Object} profileData - Novos dados do perfil
   * @returns {Promise} Promessa com os dados atualizados
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Altera a senha do usuário
   * @param {Object} passwordData - Objeto com senhas atual e nova
   * @returns {Promise} Promessa indicando sucesso da operação
   */
  async updatePassword(passwordData) {
    try {
      const response = await api.put('/auth/password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default authService;