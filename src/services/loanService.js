import api from './api';

export const reservationService = {
  /**
   * Obtém todas as reservas do usuário logado
   * @param {Object} params - Parâmetros de busca e paginação
   * @returns {Promise} Promessa com a lista de reservas
   */
  async getUserReservations(params = {}) {
    try {
      const response = await api.get('/reservations/user', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Obtém todas as reservas (admin)
   * @param {Object} params - Parâmetros de busca e paginação
   * @returns {Promise} Promessa com a lista de todas as reservas
   */
  async getAllReservations(params = {}) {
    try {
      const response = await api.get('/reservations', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Obtém detalhes de uma reserva específica
   * @param {number} id - ID da reserva
   * @returns {Promise} Promessa com os dados da reserva
   */
  async getReservationById(id) {
    try {
      const response = await api.get(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Cria uma nova reserva
   * @param {Object} reservationData - Dados da reserva
   * @returns {Promise} Promessa com os dados da reserva criada
   */
  async createReservation(reservationData) {
    try {
      const response = await api.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Atualiza o status de uma reserva
   * @param {number} id - ID da reserva
   * @param {string} status - Novo status da reserva ('Pendente', 'Concluída', 'Cancelada')
   * @returns {Promise} Promessa com os dados da reserva atualizada
   */
  async updateReservationStatus(id, status) {
    try {
      const response = await api.patch(`/reservations/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Cancela uma reserva
   * @param {number} id - ID da reserva
   * @returns {Promise} Promessa indicando sucesso da operação
   */
  async cancelReservation(id) {
    try {
      const response = await api.post(`/reservations/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Converte uma reserva em empréstimo (admin)
   * @param {number} id - ID da reserva
   * @param {Object} loanData - Dados adicionais para o empréstimo
   * @returns {Promise} Promessa com os dados do empréstimo criado
   */
  async convertToLoan(id, loanData = {}) {
    try {
      const response = await api.post(`/reservations/${id}/convert`, loanData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default reservationService;