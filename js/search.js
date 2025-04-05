/**
 * Gestionnaire de recherche
 */
const SearchManager = {
  // Éléments DOM
  searchInput: null,
  searchResults: null,
  
  // État
  searchTimer: null,
  searchMinLength: 2,
  searchDebounceTime: 300,
  
  // Initialisation
  init: function() {
    // Récupérer les éléments DOM
    this.searchInput = document.getElementById('searchInput');
    
    // Configurer les événements
    this.setupEventListeners();
    
    console.log('Gestionnaire de recherche initialisé');
  },
  
  // Configuration des écouteurs d'événements
  setupEventListeners: function() {
    if (!this.searchInput) return;
    
    // Événement de saisie pour la recherche
    this.searchInput.addEventListener('input', this.handleSearchInput.bind(this));
    
    // Événement de touche pour les raccourcis
    document.addEventListener('keydown', this.handleSearchKeydown.bind(this));
    
    // Nettoyer la recherche au clic sur l'icône de recherche
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
      searchIcon.addEventListener('click', this.clearSearch.bind(this));
    }
  },
  
  // Gestionnaire de saisie de recherche
  handleSearchInput: function() {
    // Annuler le timer précédent
    clearTimeout(this.searchTimer);
    
    // Configurer un nouveau timer (debounce)
    this.searchTimer = setTimeout(() => {
      this.performSearch();
    }, this.searchDebounceTime);
  },
  
  // Gestionnaire de touches pour la recherche
  handleSearchKeydown: function(event) {
    // Raccourci Ctrl+K ou Cmd+K pour focus sur la recherche
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput.focus();
    }
    
    // Touche Échap pour effacer et quitter la recherche
    if (event.key === 'Escape' && document.activeElement === this.searchInput) {
      this.clearSearch();
      this.searchInput.blur();
    }
  },
  
  // Effectuer la recherche
  performSearch: function() {
    const query = this.searchInput.value.trim().toLowerCase();
    
    // Ne rien faire si la requête est trop courte
    if (query.length < this.searchMinLength) {
      this.resetSearch();
      return;
    }
    
    // Récupérer tous les services
    const services = document.querySelectorAll('.service');
    
    // Filtrer les services
    let matchCount = 0;
    
    services.forEach(service => {
      const name = service.querySelector('.service-name')?.textContent.toLowerCase() || '';
      const description = service.querySelector('.service-description')?.textContent.toLowerCase() || '';
      
      // Vérifier si le service correspond à la requête
      const isMatch = 
        name.includes(query) || 
        description.includes(query);
      
      // Afficher ou masquer le service
      service.style.display = isMatch ? '' : 'none';
      
      // Compter les correspondances
      if (isMatch) matchCount++;
    });
    
    // Ajuster les conteneurs de catégories
    this.updateCategoryVisibility();
    
    // Afficher les résultats
    this.displaySearchResults(matchCount, query);
  },
  
  // Mettre à jour la visibilité des catégories
  updateCategoryVisibility: function() {
    const categories = document.querySelectorAll('#serviceGroups .service-group');
    
    categories.forEach(category => {
      const visibleServices = category.querySelectorAll('.service[style="display: "]');
      category.style.display = visibleServices.length > 0 ? '' : 'none';
    });
  },
  
  // Afficher les résultats de recherche
  displaySearchResults: function(count, query) {
    // Créer ou obtenir le conteneur de résultats
    if (!this.searchResults) {
      this.searchResults = document.createElement('div');
      this.searchResults.className = 'search-results';
      
      // Positionner après l'entrée de recherche
      this.searchInput.parentNode.appendChild(this.searchResults);
    }
    
    // Afficher le conteneur seulement s'il y a une requête
    if (query.length < this.searchMinLength) {
      this.searchResults.style.display = 'none';
      return;
    }
    
    // Mettre à jour le contenu
    this.searchResults.innerHTML = `
      <div class="search-results-header">
        <span class="search-results-count">${count} résultat${count !== 1 ? 's' : ''}</span>
        <button class="search-results-close">×</button>
      </div>
    `;
    
    // Ajouter un gestionnaire de fermeture
    const closeButton = this.searchResults.querySelector('.search-results-close');
    if (closeButton) {
      closeButton.addEventListener('click', this.clearSearch.bind(this));
    }
    
    // Afficher les résultats
    this.searchResults.style.display = 'block';
  },
  
  // Réinitialiser la recherche
  resetSearch: function() {
    // Afficher tous les services
    const services = document.querySelectorAll('.service');
    services.forEach(service => {
      service.style.display = '';
    });
    
    // Afficher toutes les catégories
    const categories = document.querySelectorAll('#serviceGroups .service-group');
    categories.forEach(category => {
      category.style.display = '';
    });
    
    // Masquer les résultats de recherche
    if (this.searchResults) {
      this.searchResults.style.display = 'none';
    }
  },
  
  // Effacer la recherche
  clearSearch: function() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    
    this.resetSearch();
  }
};

// Initialiser le gestionnaire de recherche au chargement du document
document.addEventListener('DOMContentLoaded', () => {
  SearchManager.init();
});