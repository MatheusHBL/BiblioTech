
import { defineStore } from 'pinia';
import { ref, computed, watch, onUnmounted } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const THEME_STORAGE_KEY = 'theme';
  const THEMES = { DARK: 'dark', LIGHT: 'light', SYSTEM: 'system' };
  const THEME_CLASSES = [THEMES.DARK, THEMES.LIGHT];
  
  const theme = ref(getInitialTheme());
  const isDark = computed(() => theme.value === THEMES.DARK);
  
  watch(theme, applyTheme, { immediate: true });
  
  function getInitialTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) return savedTheme;
    
    return getSystemPreference();
  }
  
  function getSystemPreference() {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches 
      ? THEMES.DARK 
      : THEMES.LIGHT;
  }
  
  function setTheme(newTheme) {
    if (newTheme === THEMES.SYSTEM) {
      localStorage.removeItem(THEME_STORAGE_KEY);
      theme.value = getSystemPreference();
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      theme.value = newTheme;
    }
  }
  
  function toggleTheme() {
    setTheme(theme.value === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  }
  
  function applyTheme() {
    const currentTheme = theme.value;
    
    document.documentElement.classList.remove(...THEME_CLASSES);
    document.documentElement.classList.add(currentTheme);
    
    const isDarkMode = currentTheme === THEMES.DARK;
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#f8f9fa';
    document.body.style.color = isDarkMode ? '#e0e0e0' : '#333333';
    
    document.body.classList.toggle('dark-theme', isDarkMode);
    
    const containers = document.querySelectorAll('.bg-light-bg, .min-h-screen');
    containers.forEach(container => {
      container.classList.toggle('dark-mode-forced', isDarkMode);
    });
  }
  
  function setupSystemThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        theme.value = e.matches ? THEMES.DARK : THEMES.LIGHT;
      }
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }
    
    onUnmounted(() => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    });
  }
  
  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    setupSystemThemeListener
  };
});
