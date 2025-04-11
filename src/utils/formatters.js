/**
 * Formata uma data para exibição no formato brasileiro
 * @param {string|Date} date - Data a ser formatada
 * @param {boolean} includeTime - Se deve incluir o horário
 * @returns {string} Data formatada
 */
export const formatDate = (date, includeTime = false) => {
    if (!date) return '-';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Verifica se a data é válida
    if (isNaN(dateObj.getTime())) {
      return '-';
    }
    
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Intl.DateTimeFormat('pt-BR', options).format(dateObj);
  };
  
  /**
   * Formata um valor para exibição como moeda brasileira
   * @param {number} value - Valor a ser formatado
   * @returns {string} Valor formatado como moeda
   */
  export const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  /**
   * Formata um número de telefone para o padrão brasileiro
   * @param {string} phone - Número de telefone
   * @returns {string} Telefone formatado
   */
  export const formatPhone = (phone) => {
    if (!phone) return '';
    
    // Remove caracteres não numéricos
    const digits = phone.replace(/\D/g, '');
    
    // Verifica o tamanho para decidir o formato
    if (digits.length === 11) {
      // Celular com DDD: (99) 99999-9999
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
      // Telefone fixo com DDD: (99) 9999-9999
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 9) {
      // Celular sem DDD: 99999-9999
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else if (digits.length === 8) {
      // Telefone fixo sem DDD: 9999-9999
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }
    
    // Se não se encaixar em nenhum padrão, retorna como está
    return phone;
  };
  
  /**
   * Formata um ISBN adicionando hífens nos lugares apropriados
   * @param {string} isbn - ISBN a ser formatado
   * @returns {string} ISBN formatado
   */
  export const formatISBN = (isbn) => {
    if (!isbn) return '';
    
    // Remove caracteres não alfanuméricos
    const clean = isbn.replace(/[^\dX]/gi, '');
    
    // Verifica se é ISBN-10 ou ISBN-13
    if (clean.length === 10) {
      // ISBN-10: 9-999-99999-X
      return `${clean.slice(0, 1)}-${clean.slice(1, 4)}-${clean.slice(4, 9)}-${clean.slice(9)}`;
    } else if (clean.length === 13) {
      // ISBN-13: 978-9-999-99999-9
      return `${clean.slice(0, 3)}-${clean.slice(3, 4)}-${clean.slice(4, 7)}-${clean.slice(7, 12)}-${clean.slice(12)}`;
    }
    
    // Se não se encaixar em nenhum padrão, retorna como está
    return isbn;
  };
  
  /**
   * Trunca um texto para o tamanho máximo especificado, adicionando reticências
   * @param {string} text - Texto a ser truncado
   * @param {number} maxLength - Tamanho máximo
   * @returns {string} Texto truncado
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  };
  
  /**
   * Capitaliza a primeira letra de cada palavra no texto
   * @param {string} text - Texto a ser capitalizado
   * @returns {string} Texto capitalizado
   */
  export const capitalizeWords = (text) => {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Formata o nome do autor para exibição (sobrenome, nome)
   * @param {string} authorName - Nome completo do autor
   * @returns {string} Nome formatado
   */
  export const formatAuthorName = (authorName) => {
    if (!authorName) return '';
    
    const parts = authorName.trim().split(' ');
    
    // Se tiver apenas uma palavra, retorna como está
    if (parts.length === 1) return authorName;
    
    // Pega o último nome (sobrenome) e os demais nomes
    const lastName = parts[parts.length - 1];
    const firstNames = parts.slice(0, -1).join(' ');
    
    return `${lastName}, ${firstNames}`;
  };
  
  /**
   * Formata o status de um empréstimo ou reserva para exibição
   * @param {string} status - Status a ser formatado
   * @returns {Object} Objeto com o texto e a classe CSS correspondente
   */
  export const formatStatus = (status) => {
    if (!status) return { text: 'Desconhecido', class: 'bg-gray-100 text-gray-800' };
    
    switch (status.toLowerCase()) {
      case 'ativo':
        return { text: 'Ativo', class: 'bg-blue-100 text-blue-800' };
      case 'devolvido':
        return { text: 'Devolvido', class: 'bg-green-100 text-green-800' };
      case 'atrasado':
        return { text: 'Atrasado', class: 'bg-red-100 text-red-800' };
      case 'pendente':
        return { text: 'Pendente', class: 'bg-yellow-100 text-yellow-800' };
      case 'concluída':
        return { text: 'Concluída', class: 'bg-green-100 text-green-800' };
      case 'cancelada':
        return { text: 'Cancelada', class: 'bg-red-100 text-red-800' };
      default:
        return { text: status, class: 'bg-gray-100 text-gray-800' };
    }
  };
  
  /**
   * Calcula e formata o tempo restante até uma data
   * @param {string|Date} date - Data alvo
   * @returns {string} Descrição do tempo restante
   */
  export const formatTimeRemaining = (date) => {
    if (!date) return '-';
    
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    
    // Verifica se a data é válida
    if (isNaN(targetDate.getTime())) {
      return '-';
    }
    
    const now = new Date();
    const diffInMs = targetDate.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) {
      return `${Math.abs(diffInDays)} dias atrasado`;
    } else if (diffInDays === 0) {
      return 'Hoje';
    } else if (diffInDays === 1) {
      return 'Amanhã';
    } else {
      return `${diffInDays} dias restantes`;
    }
  };
  
  export default {
    formatDate,
    formatCurrency,
    formatPhone,
    formatISBN,
    truncateText,
    capitalizeWords,
    formatAuthorName,
    formatStatus,
    formatTimeRemaining
  };