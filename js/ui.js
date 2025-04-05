/**
 * Gestion de l'interface utilisateur
 */
const UIManager = {
  // Éléments DOM
  elements: {},
  
  // État
  state: {
    isGridView: true,
    isMenuOpen: false,
    activeSection: null
  },
  
  // Initialisation
  init: function() {
    // Récupérer les éléments DOM
    this.cacheElements();
    
    // Configurer les événements
    this.setupEventListeners();
    
    // Initialiser l'état de l'UI
    this.initUIState();
    
    console.log('UI initialisée avec succès');
  },
  
  // Récupérer les éléments DOM
  cacheElements: function() {
    this.elements = {
      viewToggle: document.getElementById('viewToggle'),
      servicesGrid: document.getElementById('servicesGrid'),
      editFavoritesBtn: document.getElementById('editFavoritesBtn'),
      themeSwitch: document.getElementById('themeSwitch'),
      searchInput: document.getElementById('searchInput')
    };
  },
  
  // Configurer les événements
  setupEventListeners: function() {
    // Basculer la vue
    if (this.elements.viewToggle) {
      this.elements.viewToggle.addEventListener('click', this.toggleView.bind(this));
    }
    
    // Gérer le clic sur le bouton d'édition des favoris
    if (this.elements.editFavoritesBtn) {
      this.elements.editFavoritesBtn.addEventListener('click', this.toggleFavoritesEdit.bind(this));
    }
    
    // Gestionnaire de redimensionnement
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Initialiser le gestionnaire de défilement
    this.initScrollHandler();
  },
  
  // Initialiser l'état de l'UI
  initUIState: function() {
    // Charger les préférences utilisateur
    const savedView = localStorage.getItem('mserv_ui_view');
    if (savedView) {
      this.state.isGridView = savedView === 'grid';
      this.updateViewUI();
    }
    
    // Initialiser l'UI responsive
    this.handleResize();
  },
  
  // Gestionnaire de défilement
  initScrollHandler: function() {
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', () => {
      const currentScrollPosition = window.scrollY;
      
      // Déterminer la direction du défilement
      const isScrollingDown = currentScrollPosition > lastScrollPosition;
      
      // Appliquer des effets UI basés sur le défilement
      if (isScrollingDown && currentScrollPosition > 100) {
        document.body.classList.add('scrolling-down');
      } else {
        document.body.classList.remove('scrolling-down');
      }
      
      // Mémoriser la position de défilement
      lastScrollPosition = currentScrollPosition;
    });
  },
  
  // Basculer la vue (grille/liste)
  toggleView: function() {
    this.state.isGridView = !this.state.isGridView;
    
    // Sauvegarder la préférence
    localStorage.setItem('mserv_ui_view', this.state.isGridView ? 'grid' : 'list');
    
    // Mettre à jour l'UI
    this.updateViewUI();
  },
  
  // Mettre à jour l'UI selon la vue
  updateViewUI: function() {
    if (!this.elements.viewToggle || !this.elements.servicesGrid) return;
    
    // Mettre à jour l'icône du bouton
    this.elements.viewToggle.innerHTML = this.state.isGridView
      ? '<i class="fas fa-list"></i><span>Vue liste</span>'
      : '<i class="fas fa-th-large"></i><span>Vue grille</span>';
    
    // Mettre à jour la classe de la grille
    this.elements.servicesGrid.classList.toggle('grid-view', this.state.isGridView);
    this.elements.servicesGrid.classList.toggle('list-view', !this.state.isGridView);
  },
  
  // Basculer l'édition des favoris
  toggleFavoritesEdit: function() {
    // Logique d'édition des favoris
    console.log('Édition des favoris');
  },
  
  // Gestionnaire de redimensionnement
  handleResize: function() {
    const width = window.innerWidth;
    
    // Appliquer des classes basées sur la taille de l'écran
    document.body.classList.toggle('mobile-view', width < 768);
    document.body.classList.toggle('tablet-view', width >= 768 && width < 1024);
    document.body.classList.toggle('desktop-view', width >= 1024);
    
    // Ajuster l'UI pour mobile si nécessaire
    if (width < 768) {
      this.adjustForMobile();
    }
  },
  
  // Ajustements pour mobile
  adjustForMobile: function() {
    // Simplifier l'interface pour les petits écrans
    if (this.state.isGridView) {
      // Forcer la vue liste sur mobile
      this.state.isGridView = false;
      this.updateViewUI();
    }
  },
  
  // Afficher une notification
  showNotification: function(message, type = 'info', duration = 3000) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="notification-icon fas fa-${this.getNotificationIcon(type)}"></i>
        <span class="notification-message">${message}</span>
      </div>
    `;
    
    // Ajouter au document
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Supprimer après un délai
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);
  },
  
  // Obtenir l'icône de notification
  getNotificationIcon: function(type) {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-circle';
      case 'warning': return 'exclamation-triangle';
      default: return 'info-circle';
    }
  }
};

// Initialiser l'UI au chargement du document
document.addEventListener('DOMContentLoaded', () => {
  UIManager.init();
});