
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import reservationService from '../services/reservationService';

export const useReservationStore = defineStore('reservations', () => {
  const reservations = ref([]);
  const userReservations = ref([]);
  const currentReservation = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  const pendingReservations = computed(() => reservations.value.filter(reservation => reservation.status === 'Pendente'));
  const completedReservations = computed(() => reservations.value.filter(reservation => reservation.status === 'Concluída'));
  const canceledReservations = computed(() => reservations.value.filter(reservation => reservation.status === 'Cancelada'));
  
  const userPendingReservations = computed(() => userReservations.value.filter(reservation => reservation.status === 'Pendente'));
  
  const getReservationById = computed(() => {
    return (id) => reservations.value.find(reservation => reservation.id_reserva === parseInt(id));
  });
  
  async function fetchAllReservations(params = {}) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await reservationService.getAllReservations(params);
      reservations.value = data.reservations || [];
      
      loading.value = false;
      return { success: true, data };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao carregar reservas';
      return { success: false, error: err };
    }
  }
  
  async function fetchUserReservations(params = {}) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await reservationService.getUserReservations(params);
      userReservations.value = data.reservations || [];
      
      loading.value = false;
      return { success: true, data };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao carregar suas reservas';
      return { success: false, error: err };
    }
  }
  
  async function fetchReservationById(id) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await reservationService.getReservationById(id);
      currentReservation.value = data.reservation;
      
      loading.value = false;
      return { success: true, reservation: data.reservation };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao carregar detalhes da reserva';
      return { success: false, error: err };
    }
  }
  
  async function createReservation(reservationData) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await reservationService.createReservation(reservationData);
      
      if (reservations.value.length > 0) {
        reservations.value.unshift(data.reservation);
      }
      
      if (userReservations.value.length > 0) {
        userReservations.value.unshift(data.reservation);
      }
      
      loading.value = false;
      return { success: true, reservation: data.reservation };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao criar reserva';
      return { success: false, error: err };
    }
  }
  
  async function cancelReservation(id) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await reservationService.cancelReservation(id);
      
      const index = reservations.value.findIndex(reservation => reservation.id_reserva === parseInt(id));
      if (index !== -1) {
        reservations.value[index] = data.reservation;
      }
      
      const userIndex = userReservations.value.findIndex(reservation => reservation.id_reserva === parseInt(id));
      if (userIndex !== -1) {
        userReservations.value[userIndex] = data.reservation;
      }
      
      if (currentReservation.value && currentReservation.value.id_reserva === parseInt(id)) {
        currentReservation.value = data.reservation;
      }
      
      loading.value = false;
      return { success: true, reservation: data.reservation };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao cancelar reserva';
      return { success: false, error: err };
    }
  }
  
  async function updateReservationStatus(id, status) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await reservationService.updateReservationStatus(id, status);
      
      const index = reservations.value.findIndex(reservation => reservation.id_reserva === parseInt(id));
      if (index !== -1) {
        reservations.value[index] = data.reservation;
      }
      
      if (currentReservation.value && currentReservation.value.id_reserva === parseInt(id)) {
        currentReservation.value = data.reservation;
      }
      
      loading.value = false;
      return { success: true, reservation: data.reservation };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao atualizar status';
      return { success: false, error: err };
    }
  }
  
  async function convertToLoan(id, loanData = {}) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await reservationService.convertToLoan(id, loanData);
      
      const index = reservations.value.findIndex(reservation => reservation.id_reserva === parseInt(id));
      if (index !== -1) {
        reservations.value[index] = data.reservation;
      }
      
      if (currentReservation.value && currentReservation.value.id_reserva === parseInt(id)) {
        currentReservation.value = data.reservation;
      }
      
      loading.value = false;
      return { success: true, reservation: data.reservation, loan: data.loan };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao converter reserva em empréstimo';
      return { success: false, error: err };
    }
  }
  
  function initMockData() {
    reservations.value = [
      {
        id_reserva: 1,
        id_livro_fk: 1,
        titulo: 'Dragon World',
        autor: 'Robin Parrish',
        id_usuario_fk: 1,
        nome_usuario: 'João Silva',
        data_reserva: '2025-04-10T14:30:00',
        status: 'Pendente'
      },
      {
        id_reserva: 2,
        id_livro_fk: 6,
        titulo: 'The Hunter House',
        autor: 'Rakib Jon',
        id_usuario_fk: 2,
        nome_usuario: 'Maria Souza',
        data_reserva: '2025-04-05T09:15:00',
        status: 'Concluída'
      },
      {
        id_reserva: 3,
        id_livro_fk: 2,
        titulo: 'Blue in the Water',
        autor: 'Unknown',
        id_usuario_fk: 3,
        nome_usuario: 'Carlos Mendes',
        data_reserva: '2025-03-20T16:45:00',
        status: 'Cancelada'
      }
    ];
    
    userReservations.value = [
      {
        id_reserva: 1,
        id_livro_fk: 1,
        titulo: 'Dragon World',
        autor: 'Robin Parrish',
        data_reserva: '2025-04-10T14:30:00',
        status: 'Pendente'
      }
    ];
  }
  
  return {
    reservations,
    userReservations,
    currentReservation,
    loading,
    error,
    pendingReservations,
    completedReservations,
    canceledReservations,
    userPendingReservations,
    getReservationById,
    fetchAllReservations,
    fetchUserReservations,
    fetchReservationById,
    createReservation,
    cancelReservation,
    updateReservationStatus,
    convertToLoan,
    initMockData
  };
});

export default useReservationStore;
