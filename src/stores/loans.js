import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import loanService from '../services/loanService';

export const useLoanStore = defineStore('loans', () => {
  // Estado
  const loans = ref([]);
  const userLoans = ref([]);
  const currentLoan = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  // Getters
  const activeLoans = computed(() => loans.value.filter(loan => loan.status === 'Ativo'));
  const overdueLoans = computed(() => loans.value.filter(loan => loan.status === 'Atrasado'));
  const returnedLoans = computed(() => loans.value.filter(loan => loan.status === 'Devolvido'));
  
  const userActiveLoans = computed(() => userLoans.value.filter(loan => loan.status === 'Ativo'));
  const userOverdueLoans = computed(() => userLoans.value.filter(loan => loan.status === 'Atrasado'));
  
  const getLoanById = computed(() => {
    return (id) => loans.value.find(loan => loan.id_emprestimo === parseInt(id));
  });
  
  // Ações
  async function fetchAllLoans(params = {}) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await loanService.getAllLoans(params);
      loans.value = data.loans || [];
      
      loading.value = false;
      return { success: true, data };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao carregar empréstimos';
      return { success: false, error: err };
    }
  }
  
  async function fetchUserLoans(params = {}) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await loanService.getUserLoans(params);
      userLoans.value = data.loans || [];
      
      loading.value = false;
      return { success: true, data };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao carregar seus empréstimos';
      return { success: false, error: err };
    }
  }
  
  async function fetchLoanById(id) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await loanService.getLoanById(id);
      currentLoan.value = data.loan;
      
      loading.value = false;
      return { success: true, loan: data.loan };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao carregar detalhes do empréstimo';
      return { success: false, error: err };
    }
  }
  
  async function createLoan(loanData) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await loanService.createLoan(loanData);
      
      // Adiciona o novo empréstimo à lista se a requisição for bem-sucedida
      loans.value.unshift(data.loan);
      
      loading.value = false;
      return { success: true, loan: data.loan };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao criar empréstimo';
      return { success: false, error: err };
    }
  }
  
  async function returnBook(id) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await loanService.returnBook(id);
      
      // Atualiza o empréstimo na lista
      const index = loans.value.findIndex(loan => loan.id_emprestimo === parseInt(id));
      if (index !== -1) {
        loans.value[index] = data.loan;
      }
      
      // Atualiza também na lista de empréstimos do usuário se necessário
      const userIndex = userLoans.value.findIndex(loan => loan.id_emprestimo === parseInt(id));
      if (userIndex !== -1) {
        userLoans.value[userIndex] = data.loan;
      }
      
      // Atualiza o empréstimo atual se estiver visualizando
      if (currentLoan.value && currentLoan.value.id_emprestimo === parseInt(id)) {
        currentLoan.value = data.loan;
      }
      
      loading.value = false;
      return { success: true, loan: data.loan };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao registrar devolução';
      return { success: false, error: err };
    }
  }
  
  async function updateLoanStatus(id, status) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await loanService.updateLoanStatus(id, status);
      
      // Atualiza o empréstimo na lista
      const index = loans.value.findIndex(loan => loan.id_emprestimo === parseInt(id));
      if (index !== -1) {
        loans.value[index] = data.loan;
      }
      
      // Atualiza o empréstimo atual se estiver visualizando
      if (currentLoan.value && currentLoan.value.id_emprestimo === parseInt(id)) {
        currentLoan.value = data.loan;
      }
      
      loading.value = false;
      return { success: true, loan: data.loan };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao atualizar status';
      return { success: false, error: err };
    }
  }
  
  async function extendLoan(id, newReturnDate) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await loanService.extendLoan(id, newReturnDate);
      
      // Atualiza o empréstimo na lista
      const index = loans.value.findIndex(loan => loan.id_emprestimo === parseInt(id));
      if (index !== -1) {
        loans.value[index] = data.loan;
      }
      
      // Atualiza também na lista de empréstimos do usuário se necessário
      const userIndex = userLoans.value.findIndex(loan => loan.id_emprestimo === parseInt(id));
      if (userIndex !== -1) {
        userLoans.value[userIndex] = data.loan;
      }
      
      // Atualiza o empréstimo atual se estiver visualizando
      if (currentLoan.value && currentLoan.value.id_emprestimo === parseInt(id)) {
        currentLoan.value = data.loan;
      }
      
      loading.value = false;
      return { success: true, loan: data.loan };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao estender prazo';
      return { success: false, error: err };
    }
  }
  
  async function fetchOverdueLoans(params = {}) {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await loanService.getOverdueLoans(params);
      
      loading.value = false;
      return { success: true, loans: data.loans || [] };
    } catch (err) {
      loading.value = false;
      error.value = err.message || 'Erro ao carregar empréstimos atrasados';
      return { success: false, error: err };
    }
  }
  
  // Mock de dados para desenvolvimento sem API
  function initMockData() {
    loans.value = [
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
    ];
    
    userLoans.value = [
      {
        id_emprestimo: 1,
        id_livro_fk: 1,
        id_usuario_fk: 1,
        titulo: 'Dragon World',
        autor: 'Robin Parrish',
        data_emprestimo: '2025-04-01',
        data_prevista_devolucao: '2025-04-15',
        data_devolucao: null,
        status: 'Ativo'
      }
    ];
  }
  
  return {
    loans,
    userLoans,
    currentLoan,
    loading,
    error,
    activeLoans,
    overdueLoans,
    returnedLoans,
    userActiveLoans,
    userOverdueLoans,
    getLoanById,
    fetchAllLoans,
    fetchUserLoans,
    fetchLoanById,
    createLoan,
    returnBook,
    updateLoanStatus,
    extendLoan,
    fetchOverdueLoans,
    initMockData
  };
});

export default useLoanStore;