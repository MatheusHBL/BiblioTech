
export const useValidation = () => {
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
  
    const validatePassword = (password) => {
      if (!password) {
        return 'A senha é obrigatória';
      }
      
      if (password.length < 6) {
        return 'A senha deve ter pelo menos 6 caracteres';
      }
      
      return null;
    };
  
    const validateName = (name) => {
      if (!name) {
        return 'O nome é obrigatório';
      }
      
      if (name.length < 3) {
        return 'O nome deve ter pelo menos 3 caracteres';
      }
      
      return null;
    };
  
    const validatePhone = (phone) => {
      if (!phone) {
        return null;
      }
      
      const phoneDigits = phone.replace(/\D/g, '');
      
      if (phoneDigits.length < 10) {
        return 'Telefone inválido';
      }
      
      return null;
    };
  
    const validateISBN = (isbn) => {
      if (!isbn) {
        return 'O ISBN é obrigatório';
      }
      
      const cleanISBN = isbn.replace(/[-\s]/g, '');
      
      if (cleanISBN.length !== 10 && cleanISBN.length !== 13) {
        return 'O ISBN deve ter 10 ou 13 dígitos';
      }
      
      return null;
    };
  
    const validateDate = (date) => {
      if (!date) {
        return 'A data é obrigatória';
      }
      
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return 'Formato de data inválido. Use YYYY-MM-DD';
      }
      
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Data inválida';
      }
      
      return null;
    };
  
    const validateFutureDate = (date) => {
      const dateError = validateDate(date);
      if (dateError) {
        return dateError;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
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
