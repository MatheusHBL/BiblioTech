
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Meu Perfil</h1>
      <p class="text-gray-600 mt-2">Gerencie suas informações pessoais e preferências</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center">
              <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl font-bold">
                {{ userInitials }}
              </div>
              <div class="ml-4">
                <h2 class="text-lg font-semibold">{{ user.nome }}</h2>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
                <span class="inline-block mt-1 px-2 py-1 bg-gray-100 text-xs rounded-full">
                  {{ user.tipo_usuario }}
                </span>
              </div>
            </div>
          </div>
          
          <nav class="p-4">
            <ul class="space-y-2">
              <li>
                <button 
                  @click="activeTab = 'personal'"
                  :class="[
                    'w-full text-left px-4 py-2 rounded-md flex items-center',
                    activeTab === 'personal' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Informações Pessoais
                </button>
              </li>
              <li>
                <button 
                  @click="activeTab = 'activity'"
                  :class="[
                    'w-full text-left px-4 py-2 rounded-md flex items-center',
                    activeTab === 'activity' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Histórico de Atividades
                </button>
              </li>
              <li>
                <button 
                  @click="activeTab = 'security'"
                  :class="[
                    'w-full text-left px-4 py-2 rounded-md flex items-center',
                    activeTab === 'security' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Segurança
                </button>
              </li>
              <li>
                <button 
                  @click="activeTab = 'preferences'"
                  :class="[
                    'w-full text-left px-4 py-2 rounded-md flex items-center',
                    activeTab === 'preferences' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Preferências
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="md:col-span-2">
        <div class="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <div v-if="activeTab === 'personal'">
            <h2 class="text-xl font-semibold mb-6">Informações Pessoais</h2>
            
            <form @submit.prevent="updateProfile" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input 
                  id="name"
                  v-model="formData.nome"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  id="email"
                  v-model="formData.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input 
                  id="phone"
                  v-model="formData.telefone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <textarea 
                  id="address"
                  v-model="formData.endereco"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                ></textarea>
              </div>
              
              <div>
                <button 
                  type="submit"
                  class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
          
          <div v-if="activeTab === 'activity'">
            <h2 class="text-xl font-semibold mb-6">Histórico de Atividades</h2>
            
            <div class="space-y-4">
              <div v-if="activities.length === 0" class="text-center py-8 text-gray-500">
                Nenhuma atividade registrada.
              </div>
              
              <div v-else v-for="(activity, index) in activities" :key="index" class="border-b border-gray-200 pb-4 mb-4 last:border-0">
                <div class="flex items-start">
                  <div class="flex-shrink-0 mt-1">
                    <div v-if="activity.type === 'reservation'" class="p-2 bg-blue-100 text-blue-500 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div v-else-if="activity.type === 'loan'" class="p-2 bg-green-100 text-green-500 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div v-else-if="activity.type === 'return'" class="p-2 bg-purple-100 text-purple-500 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
                      </svg>
                    </div>
                  </div>
                  
                  <div class="ml-4 flex-1">
                    <div class="flex justify-between">
                      <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                      <p class="text-sm text-gray-500">{{ activity.date }}</p>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">{{ activity.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="activeTab === 'security'">
            <h2 class="text-xl font-semibold mb-6">Segurança</h2>
            
            <form @submit.prevent="updatePassword" class="space-y-6">
              <div>
                <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                <input 
                  id="current-password"
                  v-model="passwordData.currentPassword"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                <input 
                  id="new-password"
                  v-model="passwordData.newPassword"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                <input 
                  id="confirm-password"
                  v-model="passwordData.confirmPassword"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <button 
                  type="submit"
                  class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Alterar Senha
                </button>
              </div>
            </form>
            
            <div class="mt-8 pt-6 border-t border-gray-200">
              <h3 class="text-lg font-medium mb-4">Sessões Ativas</h3>
              
              <div class="bg-gray-100 p-4 rounded-md mb-4">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-medium">Sessão Atual</p>
                    <p class="text-sm text-gray-500">Navegador: Chrome - Windows</p>
                    <p class="text-sm text-gray-500">Último acesso: Agora</p>
                  </div>
                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Ativo</span>
                </div>
              </div>
              
              <button class="text-red-600 hover:text-red-800 font-medium">
                Encerrar Todas as Sessões
              </button>
            </div>
          </div>
          
          <div v-if="activeTab === 'preferences'">
            <h2 class="text-xl font-semibold mb-6">Preferências</h2>
            
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium mb-4">Notificações</h3>
                
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Notificações por Email</p>
                      <p class="text-sm text-gray-500">Receba atualizações sobre empréstimos e reservas</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="preferences.emailNotifications" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Lembretes de Devolução</p>
                      <p class="text-sm text-gray-500">Receba lembretes antes da data de devolução</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="preferences.returnReminders" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="text-lg font-medium mb-4">Aparência</h3>
                
                <div class="grid grid-cols-3 gap-4">
                  <button 
                    @click="preferences.theme = 'light'"
                    class="border rounded-md p-4 text-center"
                    :class="{'border-primary ring-2 ring-primary/30': preferences.theme === 'light'}"
                  >
                    <div class="w-full h-12 bg-white border border-gray-200 rounded mb-2"></div>
                    <span class="text-sm font-medium">Claro</span>
                  </button>
                  
                  <button 
                    @click="preferences.theme = 'dark'"
                    class="border rounded-md p-4 text-center"
                    :class="{'border-primary ring-2 ring-primary/30': preferences.theme === 'dark'}"
                  >
                    <div class="w-full h-12 bg-gray-800 border border-gray-700 rounded mb-2"></div>
                    <span class="text-sm font-medium">Escuro</span>
                  </button>
                  
                  <button 
                    @click="preferences.theme = 'system'"
                    class="border rounded-md p-4 text-center"
                    :class="{'border-primary ring-2 ring-primary/30': preferences.theme === 'system'}"
                  >
                    <div class="w-full h-12 bg-gradient-to-r from-white to-gray-800 border rounded mb-2"></div>
                    <span class="text-sm font-medium">Sistema</span>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 class="text-lg font-medium mb-4">Idioma</h3>
                
                <select 
                  v-model="preferences.language"
                  class="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (United States)</option>
                  <option value="es">Español</option>
                </select>
              </div>
              
              <div>
                <button 
                  @click="savePreferences"
                  class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Salvar Preferências
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showAlert" class="fixed inset-x-0 bottom-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
      <div class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">{{ alertMessage }}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button @click="showAlert = false" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <span class="sr-only">Fechar</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const activeTab = ref('personal');
const showAlert = ref(false);
const alertMessage = ref('');

const user = ref({
  id_usuario: 1,
  nome: 'Matheus Henrique Barbosa de Lima',
  email: 'matheus.teste@gmail.com',
  telefone: '(69) 99999-9999',
  endereco: 'Rua Exemplo, 123, Bairro Centro, Ji-Paraná - RO',
  tipo_usuario: 'Estudante'
});

const formData = ref({
  nome: user.value.nome,
  email: user.value.email,
  telefone: user.value.telefone,
  endereco: user.value.endereco
});

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const preferences = ref({
  emailNotifications: true,
  returnReminders: true,
  theme: 'system',
  language: 'pt-BR'
});

const activities = ref([
  {
    type: 'reservation',
    title: 'Reserva confirmada',
    description: 'Você reservou o livro "Dragon World"',
    date: '15/04/2025'
  },
  {
    type: 'loan',
    title: 'Empréstimo realizado',
    description: 'Você pegou emprestado o livro "The Hunter House"',
    date: '10/04/2025'
  },
  {
    type: 'return',
    title: 'Devolução realizada',
    description: 'Você devolveu o livro "Blue in the Water"',
    date: '05/04/2025'
  }
]);

const userInitials = computed(() => {
  if (!user.value.nome) return '';
  
  const names = user.value.nome.split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
});

const updateProfile = async () => {
  try {
    user.value = { ...user.value, ...formData.value };
    
    showSuccessAlert('Informações pessoais atualizadas com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
  }
};

const updatePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    console.error('As senhas não coincidem');
    return;
  }
  
  try {
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    showSuccessAlert('Senha alterada com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
  }
};

const savePreferences = async () => {
  try {
    showSuccessAlert('Preferências salvas com sucesso');
  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
  }
};

const showSuccessAlert = (message) => {
  alertMessage.value = message;
  showAlert.value = true;
  
  setTimeout(() => {
    showAlert.value = false;
  }, 5000);
};

onMounted(async () => {
  formData.value = {
    nome: user.value.nome,
    email: user.value.email,
    telefone: user.value.telefone,
    endereco: user.value.endereco
  };
});
</script>
