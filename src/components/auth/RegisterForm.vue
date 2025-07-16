
<template>
  <form class="space-y-6" @submit.prevent="handleRegister">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">
        Nome Completo
      </label>
      <div class="mt-1">
        <input
          id="name"
          v-model="name"
          name="name"
          type="text"
          autocomplete="name"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
    </div>

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
      <label for="phone" class="block text-sm font-medium text-gray-700">
        Telefone
      </label>
      <div class="mt-1">
        <input
          id="phone"
          v-model="phone"
          name="phone"
          type="tel"
          autocomplete="tel"
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
    </div>

    <div>
      <label for="userType" class="block text-sm font-medium text-gray-700">
        Tipo de Usuário
      </label>
      <div class="mt-1">
        <select
          id="userType"
          v-model="userType"
          name="userType"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="" disabled>Selecione uma opção</option>
          <option value="Estudante">Estudante</option>
          <option value="Professor">Professor</option>
          <option value="Comum">Comum</option>
        </select>
      </div>
      <p v-if="errors.userType" class="mt-1 text-sm text-red-600">{{ errors.userType }}</p>
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
          autocomplete="new-password"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
    </div>

    <div>
      <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700">
        Confirmar Senha
      </label>
      <div class="mt-1">
        <input
          id="passwordConfirmation"
          v-model="passwordConfirmation"
          name="passwordConfirmation"
          type="password"
          autocomplete="new-password"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <p v-if="errors.passwordConfirmation" class="mt-1 text-sm text-red-600">{{ errors.passwordConfirmation }}</p>
    </div>

    <div>
      <label for="address" class="block text-sm font-medium text-gray-700">
        Endereço
      </label>
      <div class="mt-1">
        <textarea
          id="address"
          v-model="address"
          name="address"
          rows="3"
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        ></textarea>
      </div>
    </div>

    <div class="flex items-center">
      <input
        id="terms"
        v-model="acceptTerms"
        name="terms"
        type="checkbox"
        required
        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
      />
      <label for="terms" class="ml-2 block text-sm text-gray-900">
        Eu concordo com os <a href="#" class="text-primary hover:text-primary/80">Termos de Serviço</a> e <a href="#" class="text-primary hover:text-primary/80">Política de Privacidade</a>
      </label>
    </div>
    <p v-if="errors.acceptTerms" class="mt-1 text-sm text-red-600">{{ errors.acceptTerms }}</p>

    <div>
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <span v-if="isLoading">Processando...</span>
        <span v-else>Criar Conta</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useValidation } from '../../utils/validation';

const emit = defineEmits(['register-success', 'register-error']);
const authStore = useAuthStore();
const { validateEmail, validatePassword, validateName, validatePhone } = useValidation();

const name = ref('');
const email = ref('');
const phone = ref('');
const userType = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const address = ref('');
const acceptTerms = ref(false);
const isLoading = ref(false);
const errors = ref({
  name: '',
  email: '',
  phone: '',
  userType: '',
  password: '',
  passwordConfirmation: '',
  acceptTerms: ''
});

const validateForm = () => {
  let isValid = true;
  errors.value = {
    name: '',
    email: '',
    phone: '',
    userType: '',
    password: '',
    passwordConfirmation: '',
    acceptTerms: ''
  };

  const nameError = validateName(name.value);
  if (nameError) {
    errors.value.name = nameError;
    isValid = false;
  }

  const emailError = validateEmail(email.value);
  if (emailError) {
    errors.value.email = emailError;
    isValid = false;
  }

  if (phone.value) {
    const phoneError = validatePhone(phone.value);
    if (phoneError) {
      errors.value.phone = phoneError;
      isValid = false;
    }
  }

  if (!userType.value) {
    errors.value.userType = 'Selecione um tipo de usuário';
    isValid = false;
  }

  const passwordError = validatePassword(password.value);
  if (passwordError) {
    errors.value.password = passwordError;
    isValid = false;
  }

  if (password.value !== passwordConfirmation.value) {
    errors.value.passwordConfirmation = 'As senhas não coincidem';
    isValid = false;
  }

  if (!acceptTerms.value) {
    errors.value.acceptTerms = 'Você deve aceitar os termos de serviço';
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    
    const userData = {
      nome: name.value,
      email: email.value,
      telefone: phone.value,
      tipo_usuario: userType.value,
      endereco: address.value
    };
    
    const result = await authStore.register(userData, password.value);
    
    if (result.success) {
      emit('register-success');
    } else {
      if (result.error === 'Email already in use') {
        errors.value.email = 'Este email já está em uso';
      } else {
        errors.value.password = result.error || 'Erro ao criar conta';
      }
      emit('register-error', result.error);
    }
  } catch (error) {
    console.error('Erro ao realizar registro:', error);
    errors.value.password = 'Ocorreu um erro ao criar sua conta. Tente novamente.';
    emit('register-error', error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
