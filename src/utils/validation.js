/**
 * Utilitários para validação de formulários
 */
export const useValidation = () => {
    /**
     * Valida um endereço de email
     * @param {string} email - Email a ser validado
     * @returns {string|null} Mensagem de erro ou null se válido
     */
    const validateEmail = (email) => {
      if (!email) {
        return 'O email é obrigatório';
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return 'Email inválido';
      }
      
      return null;
    };
  
    /**
     * Valida uma senha
     * @param {string} password - Senha a ser validada
     * @returns {string|null} Mensagem de erro ou null se válida
     */
    const validatePassword = (password) => {
      if (!password) {
        return 'A senha é obrigatória';
      }
      
      if (password.length < 6) {
        return 'A senha deve ter pelo menos 6 caracteres';
      }
      
      return null;
    };
  
    /**
     * Valida um nome
     * @param {string} name - Nome a ser validado
     * @returns {string|null} Mensagem de erro ou null se válido
     */
    const validateName = (name) => {
      if (!name) {
        return 'O nome é obrigatório';
      }
      
      if (name.length < 3) {
        return 'O nome deve ter pelo menos 3 caracteres';
      }
      
      return null;
    };
  
    /**
     * Valida um número de telefone
     * @param {string} phone - Telefone a ser validado
     * @returns {string|null} Mensagem de erro ou null se válido
     */
    const validatePhone = (phone) => {
      // Só valida se o telefone foi fornecido (não é obrigatório)
      if (!phone) {
        return null;
      }
      
      // Remove caracteres não numéricos para validação
      const phoneDigits = phone.replace(/\D/g, '');
      
      // Verifica se o telefone tem pelo menos 10 dígitos (DDD + número)
      if (phoneDigits.length < 10) {
        return 'Telefone inválido';
      }
      
      return null;
    };
  
    /**
     * Valida um ISBN
     * @param {string} isbn - ISBN a ser validado
     * @returns {string|null} Mensagem de erro ou null se válido
     */
    const validateISBN = (isbn) => {
      if (!isbn) {
        return 'O ISBN é obrigatório';
      }
      
      // Remove hífens e espaços
      const cleanISBN = isbn.replace(/[-\s]/g, '');
      
      // Valida ISBN-10 ou ISBN-13
      if (cleanISBN.length !== 10 && cleanISBN.length !== 13) {
        return 'O ISBN deve ter 10 ou 13 dígitos';
      }
      
      // Para validação completa de ISBN, seria necessário um algoritmo mais complexo
      // que verifica o dígito de verificação
      
      return null;
    };
  
    /**
     * Valida uma data
     * @param {string} date - Data a ser validada (formato YYYY-MM-DD)
     * @returns {string|null} Mensagem de erro ou null se válida
     */
    const validateDate = (date) => {
      if (!date) {
        return 'A data é obrigatória';
      }
      
      // Verifica se a data está no formato correto
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return 'Formato de data inválido. Use YYYY-MM-DD';
      }
      
      // Verifica se a data é válida
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Data inválida';
      }
      
      return null;
    };
  
    /**
     * Valida se uma data é futura
     * @param {string} date - Data a ser validada (formato YYYY-MM-DD)
     * @returns {string|null} Mensagem de erro ou null se válida
     */
    const validateFutureDate = (date) => {
      const dateError = validateDate(date);
      if (dateError) {
        return dateError;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset das horas para comparação apenas de data
      
      const dateObj = new Date(date);
      if (dateObj < today) {
        return 'A data deve ser futura';
      }
      
      return null;
    };
  
    return {
      validateEmail,
      validatePassword,
      validateName,
      validatePhone,
      validateISBN,
      validateDate,
      validateFutureDate
    };
  };
  
  export default useValidation;