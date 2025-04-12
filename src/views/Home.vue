<template>
    <div class="min-h-screen flex flex-col">
      <!-- Navbar simplificada para público (não autenticado) -->
      <!-- <nav class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3">
          <div class="flex justify-between items-center">
            <div class="text-primary font-bold text-2xl flex items-center">
              <span class="text-primary">BIBLIOTECH</span>
            </div>
  
            <div class="flex space-x-4">
              <router-link to="/login" class="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors">
                Entrar
              </router-link>
              <router-link to="/register" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                Criar Conta
              </router-link>
            </div>
          </div>
        </div>
      </nav> -->
  
      <!-- Hero section -->
      <div class="bg-gray-100 py-16">
        <div class="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between">
          <div class="lg:w-1/2 mb-10 lg:mb-0">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Sua biblioteca <span class="text-primary">digital</span> em um só lugar
            </h1>
            <p class="text-lg text-gray-600 mb-8">
              Acesse seu acervo, gerencie empréstimos e reservas com facilidade. Uma plataforma completa para gerenciamento de biblioteca.
            </p>
            <div class="flex flex-wrap gap-4">
              <router-link to="/register" class="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium">
                Começar Agora
              </router-link>
              <router-link to="/login" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium">
                Saiba Mais
              </router-link>
            </div>
          </div>
          
          <!-- Placeholder para imagem -->
          <div class="lg:w-1/2 flex justify-center">
            <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div class="bg-gray-200 rounded-lg h-64 flex items-center justify-center text-gray-400">
                Imagem de Biblioteca
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Features section -->
      <div class="py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Funcionalidades Principais</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Gerenciamento de Acervo</h3>
              <p class="text-gray-600">
                Cadastre e organize todos os livros da biblioteca com informações detalhadas, categorias, autores e disponibilidade.
              </p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Reservas Simplificadas</h3>
              <p class="text-gray-600">
                Usuários podem facilmente reservar livros, verificar disponibilidade e gerenciar suas próprias reservas.
              </p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Controle de Empréstimos</h3>
              <p class="text-gray-600">
                Administradores podem registrar empréstimos, devoluções e monitorar atrasos de forma organizada.
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Testimonials section -->
      <div class="bg-gray-100 py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">O Que Nossos Usuários Dizem</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="flex items-center mb-4">
                <div class="bg-gray-200 rounded-full w-12 h-12 mr-4"></div>
                <div>
                  <h4 class="font-semibold">Maria Silva</h4>
                  <p class="text-sm text-gray-500">Estudante</p>
                </div>
              </div>
              <p class="text-gray-600">
                "O Bibliotech facilitou muito minha vida acadêmica. Agora consigo reservar livros de forma rápida e organizar minhas leituras."
              </p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="flex items-center mb-4">
                <div class="bg-gray-200 rounded-full w-12 h-12 mr-4"></div>
                <div>
                  <h4 class="font-semibold">Carlos Mendes</h4>
                  <p class="text-sm text-gray-500">Professor</p>
                </div>
              </div>
              <p class="text-gray-600">
                "Como professor, encontro no Bibliotech uma ferramenta essencial para organizar as leituras recomendadas aos meus alunos."
              </p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <div class="flex items-center mb-4">
                <div class="bg-gray-200 rounded-full w-12 h-12 mr-4"></div>
                <div>
                  <h4 class="font-semibold">Ana Oliveira</h4>
                  <p class="text-sm text-gray-500">Bibliotecária</p>
                </div>
              </div>
              <p class="text-gray-600">
                "O sistema simplificou nossos processos, reduzindo erros e tornando a gestão da biblioteca muito mais eficiente."
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- CTA section -->
      <div class="py-16">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se aos milhares de usuários que já estão utilizando o Bibliotech para gerenciar suas bibliotecas de forma eficiente.
          </p>
          <router-link to="/register" class="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium text-lg">
            Criar Conta Grátis
          </router-link>
        </div>
      </div>
  
      <!-- Footer -->
      <!-- <footer class="bg-gray-800 text-white py-12 mt-auto">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between mb-8">
            <div class="mb-8 md:mb-0">
              <div class="font-bold text-2xl text-primary mb-4">BIBLIOTECH</div>
              <p class="text-gray-400 max-w-xs">
                Sistema completo para gerenciamento de bibliotecas, desenvolvido com foco em usabilidade e eficiência.
              </p>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 class="font-semibold text-lg mb-4">Produto</h4>
                <ul class="space-y-2">
                  <li><a href="#" class="text-gray-400 hover:text-primary">Recursos</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-primary">Preços</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-primary">Demonstração</a></li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-semibold text-lg mb-4">Suporte</h4>
                <ul class="space-y-2">
                  <li><a href="#" class="text-gray-400 hover:text-primary">Documentação</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-primary">Tutoriais</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-primary">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-semibold text-lg mb-4">Contato</h4>
                <ul class="space-y-2">
                  <li><a href="#" class="text-gray-400 hover:text-primary">Email</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-primary">Telefone</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-primary">Endereço</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="pt-8 border-t border-gray-700 text-center md:flex md:justify-between md:text-left">
            <p class="text-gray-400 mb-4 md:mb-0">&copy; 2025 Bibliotech. Todos os direitos reservados.</p>
            <div class="flex justify-center md:justify-end space-x-6">
              <a href="#" class="text-gray-400 hover:text-primary">Termos de Serviço</a>
              <a href="#" class="text-gray-400 hover:text-primary">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </footer> -->
    </div>
  </template>
  
  <script setup>
  // Sem lógica adicional necessária para a página inicial
  </script>