import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Views públicas
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Books from '../views/Books.vue';
import BookDetail from '../views/BookDetail.vue';
import Loans from '../views/Loans.vue';
import Reservations from '../views/Reservations.vue';
import Profile from '../views/Profile.vue';

// Views administrativas
import Corredor from '../views/admin/Corredor.vue';
import Estante from '../views/admin/Estante.vue';
import Prateleira from '../views/admin/Prateleira.vue';
import Categories from '../views/admin/Categories.vue';
import Authors from '../views/admin/Authors.vue';
import BookForm from '../views/admin/BookForm.vue';
import PublisherForm from '../views/admin/PublisherForm.vue';
import AuthorForm from '../views/admin/AuthorForm.vue';
import EmployeeForm from '../views/admin/EmployeeForm.vue';
import CategoryForm from '../views/admin/CategoryForm.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/books',
    name: 'books',
    component: Books,
    meta: { requiresAuth: true }
  },
  {
    path: '/books/:id',
    name: 'book-detail',
    component: BookDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/loans',
    name: 'loans',
    component: Loans,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/reservations',
    name: 'reservations',
    component: Reservations,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  },

  // Rotas administrativas
  {
    path: '/admin/corredores',
    name: 'admin-corredor',
    component: Corredor,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/estantes',
    name: 'admin-estante',
    component: Estante,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/prateleiras',
    name: 'admin-prateleira',
    component: Prateleira,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/categorias',
    name: 'admin-categoria',
    component: Categories,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/autores',
    name: 'admin-autor',
    component: Authors,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/livros',
    name: 'admin-livro',
    component: BookForm,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/editoras',
    name: 'admin-editora',
    component: PublisherForm,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/autor-form',
    name: 'admin-autor-form',
    component: AuthorForm,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/funcionarios',
    name: 'admin-funcionario',
    component: EmployeeForm,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/categoria-form',
    name: 'admin-categoria-form',
    component: CategoryForm,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;