
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.tipo_usuario === 'Funcionario',
    userName: (state) => state.user?.nome || ''
  },
  
  actions: {
    setUser(userData) {
      this.user = userData;
    },
    
    setToken(tokenValue) {
      this.token = tokenValue;
      localStorage.setItem('token', tokenValue);
    },
    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
    
    async login(email, password) {
      try {
        const adminCredentials = {
          email: 'admin@bibliotech.com',
          password: 'admin123'
        };
        
        const userCredentials = {
          email: 'user@bibliotech.com',
          password: 'user123'
        };
        
        if (email === adminCredentials.email && password === adminCredentials.password) {
          const adminUser = {
            id_usuario: 1,
            nome: 'Administrador',
            email: adminCredentials.email,
            tipo_usuario: 'Funcionario',
            telefone: '(11) 99999-9999',
            endereco: 'Rua da Biblioteca, 123'
          };
          
          this.setUser(adminUser);
          this.setToken('admin-mock-token');
          return { success: true, isAdmin: true };
        }
        
        else if (email === userCredentials.email && password === userCredentials.password) {
          const regularUser = {
            id_usuario: 2,
            nome: 'Usuário Padrão',
            email: userCredentials.email,
            tipo_usuario: 'Estudante',
            telefone: '(11) 88888-8888',
            endereco: 'Avenida dos Livros, 456'
          };
          
          this.setUser(regularUser);
          this.setToken('user-mock-token');
          return { success: true, isAdmin: false };
        }
        
        else {
          return { success: false, error: 'Credenciais inválidas' };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    
    async register(userData) {
      try {
        alert('Registro simulado com sucesso! Por favor, faça login com as credenciais pré-definidas.');
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  }
});
