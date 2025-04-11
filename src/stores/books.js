import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookStore = defineStore('books', () => {
  // Estado
  const books = ref([])
  const loading = ref(false)
  const error = ref(null)
  const categories = ref([])
  
  // Dados mockados para desenvolvimento inicial
  const mockBooks = [
    {
      id_livro: 1,
      titulo: 'Dragon World',
      isbn: '9783161484100',
      id_editora_fk: 1,
      ano_publicacao: 2022,
      quantidade_disponivel: 3,
      autor: 'Robin Parrish',
      categoria: 'Aventura',
      preco: 15.00, // Para exibição na UI
      imagem: '/src/assets/images/dragon-world.jpg'
    },
    {
      id_livro: 2,
      titulo: 'Blue in the Water',
      isbn: '9783161484101',
      id_editora_fk: 2,
      ano_publicacao: 2021,
      quantidade_disponivel: 2,
      autor: 'Unknown',
      categoria: 'Aventura',
      preco: 12.00, // Para exibição na UI
      imagem: '/src/assets/images/blue-water.jpg'
    },
    {
      id_livro: 3,
      titulo: 'Animals Life',
      isbn: '9783161484102',
      id_editora_fk: 1,
      ano_publicacao: 2023,
      quantidade_disponivel: 5,
      autor: 'Bowen Greenwood',
      categoria: 'Crianças',
      preco: 15.00, // Para exibição na UI
      imagem: '/src/assets/images/animals-life.jpg'
    },
    {
      id_livro: 4,
      titulo: 'Memorise',
      isbn: '9783161484103',
      id_editora_fk: 3,
      ano_publicacao: 2020,
      quantidade_disponivel: 1,
      autor: 'Lando Pigose',
      categoria: 'Biografia',
      preco: 15.00, // Para exibição na UI
      imagem: '/src/assets/images/memorise.jpg'
    },
    {
      id_livro: 5,
      titulo: 'Olio',
      isbn: '9783161484104',
      id_editora_fk: 2,
      ano_publicacao: 2019,
      quantidade_disponivel: 2,
      autor: 'Madhu Sashon',
      categoria: 'Biografia',
      preco: 35.00, // Para exibição na UI
      imagem: '/src/assets/images/olio.jpg'
    },
    {
      id_livro: 6,
      titulo: 'The Hunter House',
      isbn: '9783161484105',
      id_editora_fk: 1,
      ano_publicacao: 2022,
      quantidade_disponivel: 4,
      autor: 'Rakib Jon',
      categoria: 'Romance',
      preco: 20.00, // Para exibição na UI
      imagem: '/src/assets/images/hunter-house.jpg'
    }
  ]
  
  // Inicializa os dados mockados
  books.value = mockBooks
  categories.value = ['Aventura', 'Biografia', 'Crianças', 'Cozinhar', 'Romance']
  
  // Getters
  const trendingBooks = computed(() => {
    // Simulação de livros em destaque
    return books.value.slice(0, 4)
  })
  
  const getBookById = computed(() => {
    return (id) => books.value.find(book => book.id_livro === parseInt(id))
  })
  
  const getBooksByCategory = computed(() => {
    return (category) => books.value.filter(book => book.categoria === category)
  })
  
  // Ações
  async function fetchBooks() {
    try {
      loading.value = true
      error.value = null
      
      // Aqui seria a chamada para a API
      // Por enquanto, usamos os dados mockados
      
      loading.value = false
      return { success: true }
    } catch (err) {
      loading.value = false
      error.value = err.message
      return { success: false, error: err.message }
    }
  }
  
  async function fetchBookById(id) {
    try {
      loading.value = true
      error.value = null
      
      // Aqui seria a chamada para a API
      // Por enquanto, usamos os dados mockados
      const book = books.value.find(b => b.id_livro === parseInt(id))
      
      loading.value = false
      return { success: true, book }
    } catch (err) {
      loading.value = false
      error.value = err.message
      return { success: false, error: err.message }
    }
  }
  
  async function searchBooks(query) {
    try {
      loading.value = true
      error.value = null
      
      // Aqui seria a chamada para a API
      // Por enquanto, filtramos os dados mockados
      const filteredBooks = books.value.filter(
        book => book.titulo.toLowerCase().includes(query.toLowerCase()) || 
                book.autor.toLowerCase().includes(query.toLowerCase())
      )
      
      loading.value = false
      return { success: true, books: filteredBooks }
    } catch (err) {
      loading.value = false
      error.value = err.message
      return { success: false, error: err.message }
    }
  }
  
  return {
    books,
    loading,
    error,
    categories,
    trendingBooks,
    getBookById,
    getBooksByCategory,
    fetchBooks,
    fetchBookById,
    searchBooks
  }
})