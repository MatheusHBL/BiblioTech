
import api from './api';

export const reservationService = {
  async getUserReservations(params = {}) {
    try {
      const response = await api.get('/reservations/user', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  async getAllReservations(params = {}) {
    try {
      const response = await api.get('/reservations', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  async getReservationById(id) {
    try {
      const response = await api.get(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  async createReservation(reservationData) {
    try {
      const response = await api.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  async updateReservationStatus(id, status) {
    try {
      const response = await api.patch(`/reservations/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  async cancelReservation(id) {
    try {
      const response = await api.post(`/reservations/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

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
