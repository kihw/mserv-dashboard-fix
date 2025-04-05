/**
 * Gestion du thème
 */
const ThemeManager = {
  // Thèmes
  themes: {
    light: {
      primaryBg: '#f5f5f7',
      secondaryBg: '#ffffff',
      tertiaryBg: '#f0f0f2',
      primaryText: '#1d1d1f',
      secondaryText: '#333333',
      accentColor: '#7371fc'
    },
    dark: {
      primaryBg: '#121212',
      secondaryBg: '#1a1a1a',
      tertiaryBg: '#232323',
      primaryText: '#ffffff',
      secondaryText: '#e0e0e0',
      accentColor: '#7371fc'
    }
  },
  
  // État
  currentTheme: 'dark',
  
  // Élément du DOM
  themeSwitch: null,
  themeIcon: null,
  
  // Initialisation
  init: function() {
    // Récupérer les éléments DOM
    this.themeSwitch = document.getElementById('themeSwitch');
    this.themeIcon = document.getElementById('themeIcon');
    
    // Charger le thème enregistré ou le thème par défaut
    this.loadSavedTheme();
    
    // Configurer les événements
    this.setupEventListeners();
    
    console.log('Gestionnaire de thème initialisé');
  },
  
  // Charge le thème enregistré ou détermine le thème de l'utilisateur
  loadSavedTheme: function() {
    // Vérifier s'il y a un thème sauvegardé
    const savedTheme = localStorage.getItem('mserv_theme');
    
    if (savedTheme) {
      // Utiliser le thème sauvegardé
      this.currentTheme = savedTheme;
    } else {
      // Utiliser la préférence du système
      this.currentTheme = this.getSystemTheme();
    }
    
    // Appliquer le thème
    this.applyTheme(this.currentTheme);
  },
  
  // Configuration des écouteurs d'événements
  setupEventListeners: function() {
    // Basculer le thème lors du clic sur le commutateur
    if (this.themeSwitch) {
      this.themeSwitch.addEventListener('click', this.toggleTheme.bind(this));
    }
    
    // Surveiller les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Mettre à jour seulement si le thème est sur "auto"
      if (localStorage.getItem('mserv_theme') === 'auto') {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
      }
    });
  },
  
  // Récupère le thème du système
  getSystemTheme: function() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  
  // Bascule entre les thèmes clair et sombre
  toggleTheme: function() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.currentTheme);
    
    // Sauvegarder la préférence
    localStorage.setItem('mserv_theme', this.currentTheme);
  },
  
  // Applique le thème
  applyTheme: function(theme) {
    // Mettre à jour les classes du body
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    
    // Mettre à jour l'icône du thème
    this.updateThemeIcon(theme);
    
    // Appliquer les couleurs du thème aux variables CSS
    this.updateCSSVariables(theme);
    
    // Mettre à jour la méta-tag de couleur du thème pour les mobiles
    this.updateThemeColorMeta(theme);
    
    console.log(`Thème appliqué: ${theme}`);
  },
  
  // Met à jour l'icône du thème
  updateThemeIcon: function(theme) {
    if (!this.themeIcon) return;
    
    if (theme === 'dark') {
      this.themeIcon.className = 'fas fa-moon';
    } else {
      this.themeIcon.className = 'fas fa-sun';
    }
    
    // Mettre à jour la position du curseur
    if (this.themeSwitch) {
      this.themeSwitch.classList.toggle('active', theme === 'light');
    }
  },
  
  // Met à jour les variables CSS
  updateCSSVariables: function(theme) {
    const themeValues = this.themes[theme];
    
    for (const [key, value] of Object.entries(themeValues)) {
      // Convertir camelCase en kebab-case pour les variables CSS
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      document.documentElement.style.setProperty(`--${cssVar}`, value);
    }
  },
  
  // Met à jour la méta-tag de couleur du thème pour les mobiles
  updateThemeColorMeta: function(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const themeColor = theme === 'dark' ? this.themes.dark.secondaryBg : this.themes.light.secondaryBg;
    
    if (metaThemeColor) {
      metaThemeColor.content = themeColor;
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = themeColor;
      document.head.appendChild(meta);
    }
  }
};

// Initialiser le gestionnaire de thème au chargement du document
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
});