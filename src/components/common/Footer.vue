<template>
    <footer class="bg-gray-800 text-white py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <div class="font-bold text-xl text-primary">BIBLIOTECH</div>
            <p class="text-sm text-gray-400 mt-1">Seu sistema de gerenciamento de biblioteca</p>
          </div>
          
          <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
            <div>
              <h4 class="font-medium text-gray-300 mb-2">Links Rápidos</h4>
              <ul class="space-y-1 text-sm">
                <li><router-link to="/books" class="text-gray-400 hover:text-primary">Acervo</router-link></li>
                <li><router-link to="/reservations" class="text-gray-400 hover:text-primary">Reservas</router-link></li>
                <li><router-link to="/profile" class="text-gray-400 hover:text-primary">Meu Perfil</router-link></li>
              </ul>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-300 mb-2">Contato</h4>
              <ul class="space-y-1 text-sm">
                <li class="text-gray-400">Email: contato@bibliotech.com</li>
                <li class="text-gray-400">Telefone: (11) 4321-1234</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {{ currentYear }} Bibliotech. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const currentYear = computed(() => new Date().getFullYear());
  </script>