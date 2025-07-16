
<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <router-link to="/" class="flex items-center">
          <div class="text-primary font-bold text-2xl">BIBLIOTECH</div>
        </router-link>

        <div class="flex items-center space-x-4">
          <router-link to="/login" class="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors">
            Entrar
          </router-link>
          <router-link to="/register" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Criar Conta
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>
