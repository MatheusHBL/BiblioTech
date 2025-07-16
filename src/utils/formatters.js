
export const formatDate = (date, includeTime = false) => {
    if (!date) return '-';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
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
  
  export const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  export const formatPhone = (phone) => {
    if (!phone) return '';
    
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 9) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else if (digits.length === 8) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }
    
    return phone;
  };
  
  export const formatISBN = (isbn) => {
    if (!isbn) return '';
    
    const clean = isbn.replace(/[^\dX]/gi, '');
    
    if (clean.length === 10) {
      return `${clean.slice(0, 1)}-${clean.slice(1, 4)}-${clean.slice(4, 9)}-${clean.slice(9)}`;
    } else if (clean.length === 13) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 4)}-${clean.slice(4, 7)}-${clean.slice(7, 12)}-${clean.slice(12)}`;
    }
    
    return isbn;
  };
  
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  };
  
  export const capitalizeWords = (text) => {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  export const formatAuthorName = (authorName) => {
    if (!authorName) return '';
    
    const parts = authorName.trim().split(' ');
    
    if (parts.length === 1) return authorName;
    
    const lastName = parts[parts.length - 1];
    const firstNames = parts.slice(0, -1).join(' ');
    
    return `${lastName}, ${firstNames}`;
  };
  
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
  
  export const formatTimeRemaining = (date) => {
    if (!date) return '-';
    
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    
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
