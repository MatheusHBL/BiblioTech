import { createPinia } from 'pinia';

// Criando a instância do Pinia
const pinia = createPinia();

// Aqui você pode adicionar plugins se necessário
// Por exemplo, para persistência de estado:
// import { createPersistedState } from 'pinia-plugin-persistedstate';
// pinia.use(createPersistedState);

export default pinia;

// Re-export dos stores individuais para facilitar importações
export * from './auth';
export * from './books';
export * from './loans';
export * from './reservations';