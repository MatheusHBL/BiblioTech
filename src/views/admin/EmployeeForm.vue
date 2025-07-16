<template>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">{{ isEdit ? 'Editar' : 'Cadastrar' }} Funcionário</h1>
        <router-link to="/admin/employees" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
          Voltar para Lista
        </router-link>
      </div>
  
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nome -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              id="name"
              v-model="formData.nome"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p v-if="errors.nome" class="mt-1 text-sm text-red-600">{{ errors.nome }}</p>
          </div>
  
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>
  
          <!-- Senha (apenas para novo funcionário) -->
          <div v-if="!isEdit">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              id="password"
              v-model="formData.senha"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p v-if="errors.senha" class="mt-1 text-sm text-red-600">{{ errors.senha }}</p>
          </div>
  
          <!-- Cargo -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
            <input
              id="role"
              v-model="formData.cargo"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
  
          <!-- Botões de ação -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$router.back()"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              {{ isSubmitting ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useValidation } from '../../utils/validation';
  
  const route = useRoute();
  const router = useRouter();
  const { validateEmail, validatePassword, validateName } = useValidation();
  
  const isEdit = computed(() => route.name === 'edit-employee');
  const employeeId = computed(() => route.params.id);
  const isSubmitting = ref(false);
  
  // Estado inicial do formulário
  const formData = ref({
    nome: '',
    email: '',
    senha: '',
    cargo: ''
  });
  
  // Estado de erros
  const errors = ref({
    nome: '',
    email: '',
    senha: ''
  });
  
  // Validação do formulário
  const validateForm = () => {
    let isValid = true;
    errors.value = {
      nome: '',
      email: '',
      senha: ''
    };
  
    // Validação do nome
    const nameError = validateName(formData.value.nome);
    if (nameError) {
      errors.value.nome = nameError;
      isValid = false;
    }
  
    // Validação do email
    const emailError = validateEmail(formData.value.email);
    if (emailError) {
      errors.value.email = emailError;
      isValid = false;
    }
  
    // Validação da senha (apenas para novo funcionário)
    if (!isEdit.value) {
      const passwordError = validatePassword(formData.value.senha);
      if (passwordError) {
        errors.value.senha = passwordError;
        isValid = false;
      }
    }
  
    return isValid;
  };
  
  // Carregar dados para edição
  const loadEmployeeData = async () => {
    if (isEdit.value && employeeId.value) {
      try {
        // Em um projeto real, aqui você faria uma chamada API para buscar os dados do funcionário
        // Por enquanto, simulamos com dados mockados
        const mockEmployee = {
          id_funcionario: parseInt(employeeId.value),
          nome: 'Funcionário Exemplo',
          email: 'funcionario@bibliotech.com',
          cargo: 'Bibliotecário'
        };
  
        formData.value = {
          nome: mockEmployee.nome,
          email: mockEmployee.email,
          cargo: mockEmployee.cargo,
          senha: '' // Não carregamos a senha por segurança
        };
      } catch (error) {
        console.error('Erro ao carregar dados do funcionário:', error);
        alert('Não foi possível carregar os dados do funcionário. Verifique sua conexão e tente novamente.');
      }
    }
  };
  
  // Método para enviar o formulário
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      isSubmitting.value = true;
  
      // Em um projeto real, aqui você faria uma chamada API para salvar/atualizar o funcionário
      // Por enquanto, apenas simulamos o sucesso da operação
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula um atraso de rede
  
      // Simula um sucesso
      alert(`Funcionário ${isEdit.value ? 'atualizado' : 'cadastrado'} com sucesso!`);
      router.push('/admin/employees');
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      alert(`Erro ao ${isEdit.value ? 'atualizar' : 'cadastrar'} funcionário. Tente novamente.`);
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // Carregar dados ao montar o componente
  onMounted(loadEmployeeData);
  </script>