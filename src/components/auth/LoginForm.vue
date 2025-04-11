<template>
  <form class="space-y-6" @submit.prevent="handleLogin">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email
      </label>
      <div class="mt-1">
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">
        Senha
      </label>
      <div class="mt-1">
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          v-model="rememberMe"
          class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label for="remember-me" class="ml-2 block text-sm text-gray-900">
          Lembrar de mim
        </label>
      </div>

      <div class="text-sm">
        <a href="#" class="font-medium text-primary hover:text-primary/80">
          Esqueceu sua senha?
        </a>
      </div>
    </div>

    <div>
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <span v-if="isLoading">Carregando...</span>
        <span v-else>Entrar</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useValidation } from '../utils/validation';

const emit = defineEmits(['login-success', 'login-error']);
const authStore = useAuthStore();
const { validateEmail, validatePassword } = useValidation();

// Estado do formulário
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const errors = ref({
  email: '',
  password: ''
});

// Validação do formulário
const validateForm = () => {
  let isValid = true;
  errors.value = {
    email: '',
    password: ''
  };

  const emailError = validateEmail(email.value);
  if (emailError) {
    errors.value.email = emailError;
    isValid = false;
  }

  const passwordError = validatePassword(password.value);
  if (passwordError) {
    errors.value.password = passwordError;
    isValid = false;
  }

  return isValid;
};

// Método para lidar com o login
const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    
    // Chama o método de login na store de autenticação
    const result = await authStore.login(email.value, password.value, rememberMe.value);
    
    if (result.success) {
      emit('login-success');
    } else {
      errors.value.password = result.error || 'Credenciais inválidas';
      emit('login-error', result.error);
    }
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    errors.value.password = 'Ocorreu um erro ao fazer login. Tente novamente.';
    emit('login-error', error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>