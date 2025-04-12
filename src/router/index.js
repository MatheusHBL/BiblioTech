import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Importação de views
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Books from '../views/Books.vue';
import BookDetail from '../views/BookDetail.vue';
import Loans from '../views/Loans.vue';
import Reservations from '../views/Reservations.vue';
import Profile from '../views/Profile.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Proteção de rotas 
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router