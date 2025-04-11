import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  
  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.tipo_usuario === 'Funcionario')
  const userName = computed(() => user.value?.nome || '')
  
  // Ações
  function setUser(userData) {
    user.value = userData
  }
  
  function setToken(tokenValue) {
    token.value = tokenValue
    localStorage.setItem('token', tokenValue)
  }
  
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }
  
  // Funções que serão conectadas com a API futuramente
  async function login(email, password) {
    try {
      // Simulação de login - será substituído pela chamada API
      const mockUser = {
        id_usuario: 1,
        nome: 'Usuário Teste',
        email: email,
        tipo_usuario: email.includes('admin') ? 'Funcionario' : 'Estudante'
      }
      
      setUser(mockUser)
      setToken('mock-jwt-token')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  async function register(userData) {
    try {
      // Simulação de registro - será substituído pela chamada API
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    userName,
    login,
    register,
    logout,
    setUser,
    setToken
  }
})