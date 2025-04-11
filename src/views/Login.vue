<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        BIBLIOTECH
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Faça login para acessar o sistema
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Não tem uma conta?
              </span>
            </div>
          </div>

          <div class="mt-6">
            <router-link
              to="/register"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Criar nova conta
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Importação corrigida

const router = useRouter();
const authStore = useAuthStore();

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

  if (!email.value) {
    errors.value.email = 'O email é obrigatório';
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.value.email = 'Email inválido';
    isValid = false;
  }

  if (!password.value) {
    errors.value.password = 'A senha é obrigatória';
    isValid = false;
  } else if (password.value.length < 6) {
    errors.value.password = 'A senha deve ter pelo menos 6 caracteres';
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
    const result = await authStore.login(email.value, password.value);
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      errors.value.password = 'Credenciais inválidas';
    }
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    errors.value.password = 'Ocorreu um erro ao fazer login. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
};
</script>