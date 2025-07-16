
<template>
  <footer class="bg-gray-800 text-white py-6">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <div class="font-bold text-xl text-primary">BIBLIOTECH</div>
          <p class="text-sm text-gray-400 mt-1">Seu sistema de gerenciamento de biblioteca</p>
        </div>
        
        <div class="flex space-x-6">
          <a href="#" class="text-gray-400 hover:text-primary">Termos de Serviço</a>
          <a href="#" class="text-gray-400 hover:text-primary">Política de Privacidade</a>
        </div>
      </div>
      
      <div class="relative border-t border-gray-700 mt-6 pt-6 text-sm text-gray-400">
        <div class="flex justify-between items-center">
          <div class="w-1/3"></div>
          <div class="absolute left-1/2 transform -translate-x-1/2">
            <p>&copy; {{ currentYear }} Bibliotech. Todos os direitos reservados.</p>
          </div>
          <div class="w-1/3 text-right text-gray-800">
            <p>Matheus H. Barbosa L.</p>
            <p>Withor L. Barbosa L.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>
