/**
 * Gestion des services
 */
const ServicesManager = {
  // État
  services: [],
  categories: [],
  favorites: [],
  
  // Éléments DOM
  elements: {
    servicesGrid: document.getElementById('servicesGrid'),
    serviceGroups: document.getElementById('serviceGroups'),
    favoritesGrid: document.getElementById('favoritesGrid')
  },
  
  // Initialisation
  init: async function() {
    try {
      // Charger les services depuis le fichier de configuration
      await this.loadServices();
      
      // Charger les favoris
      this.loadFavorites();
      
      // Rendre les services
      this.renderServices();
      
      // Rendre les favoris
      this.renderFavorites();
      
      console.log('Services initialisés avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des services', error);
    }
  },
  
  // Chargement des services
  loadServices: async function() {
    try {
      const response = await fetch('/config/services.json');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des services');
      }
      
      const data = await response.json();
      
      this.services = data.default_services || [];
      this.categories = data.categories || [];
      
      console.log(`${this.services.length} services chargés`);
    } catch (error) {
      console.error('Erreur lors du chargement des services', error);
      // Utiliser des données de secours si nécessaire
    }
  },
  
  // Chargement des favoris
  loadFavorites: function() {
    const storedFavorites = localStorage.getItem('mserv_favorites');
    if (storedFavorites) {
      try {
        this.favorites = JSON.parse(storedFavorites);
      } catch (error) {
        console.error('Erreur lors du chargement des favoris', error);
        this.favorites = [];
      }
    } else {
      // Favoris par défaut
      this.favorites = ['jellyfin', 'portainer', 'gitea', 'nextcloud'];
    }
  },
  
  // Sauvegarde des favoris
  saveFavorites: function() {
    try {
      localStorage.setItem('mserv_favorites', JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris', error);
    }
  },
  
  // Ajout d'un favori
  addFavorite: function(serviceId) {
    if (!this.favorites.includes(serviceId)) {
      this.favorites.push(serviceId);
      this.saveFavorites();
      this.renderFavorites();
    }
  },
  
  // Suppression d'un favori
  removeFavorite: function(serviceId) {
    this.favorites = this.favorites.filter(id => id !== serviceId);
    this.saveFavorites();
    this.renderFavorites();
  },
  
  // Rendu des services
  renderServices: function() {
    if (!this.elements.servicesGrid) return;
    
    // Vider la grille
    this.elements.servicesGrid.innerHTML = '';
    
    // Ajouter chaque service
    this.services.forEach(service => {
      const serviceCard = this.createServiceCard(service);
      this.elements.servicesGrid.appendChild(serviceCard);
    });
    
    // Rendre les groupes de services par catégorie
    this.renderServiceGroups();
  },
  
  // Rendu des groupes de services par catégorie
  renderServiceGroups: function() {
    if (!this.elements.serviceGroups) return;
    
    // Vider les groupes
    this.elements.serviceGroups.innerHTML = '';
    
    // Regrouper les services par catégorie
    const servicesByCategory = {};
    this.categories.forEach(category => {
      servicesByCategory[category.id] = [];
    });
    
    this.services.forEach(service => {
      if (servicesByCategory[service.category]) {
        servicesByCategory[service.category].push(service);
      }
    });
    
    // Créer un groupe pour chaque catégorie
    this.categories.forEach(category => {
      const services = servicesByCategory[category.id];
      if (services && services.length > 0) {
        const groupElement = this.createCategoryGroup(category, services);
        this.elements.serviceGroups.appendChild(groupElement);
      }
    });
  },
  
  // Création d'un groupe de catégorie
  createCategoryGroup: function(category, services) {
    const groupElement = document.createElement('div');
    groupElement.className = 'service-group';
    groupElement.dataset.category = category.id;
    
    // En-tête de groupe
    const groupHeader = document.createElement('div');
    groupHeader.className = 'section-header';
    groupHeader.innerHTML = `
      <div class="section-title">
        <i class="fas fa-${category.icon}"></i>
        <span>${category.name}</span>
      </div>
    `;
    
    // Corps du groupe
    const groupBody = document.createElement('div');
    groupBody.className = 'dashboard group-body';
    
    // Ajouter les services
    services.forEach(service => {
      const serviceCard = this.createServiceCard(service);
      groupBody.appendChild(serviceCard);
    });
    
    groupElement.appendChild(groupHeader);
    groupElement.appendChild(groupBody);
    
    return groupElement;
  },
  
  // Création d'une carte de service
  createServiceCard: function(service) {
    const card = document.createElement('a');
    card.href = `https://${service.url}`;
    card.className = 'service';
    card.dataset.id = service.id;
    card.dataset.category = service.category;
    card.target = '_blank';
    
    // Icône du service
    let iconHtml = '';
    if (service.icon) {
      iconHtml = `<img src="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/${service.icon}.svg" alt="${service.name}" width="24" height="24">`;
    } else {
      iconHtml = '<i class="fas fa-link"></i>';
    }
    
    card.innerHTML = `
      <div class="service-icon">
        ${iconHtml}
      </div>
      <div class="service-details">
        <h3 class="service-name">${service.name}</h3>
        <p class="service-description">${service.description}</p>
      </div>
    `;
    
    // Ajouter la gestion des favoris
    card.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (this.favorites.includes(service.id)) {
        this.removeFavorite(service.id);
      } else {
        this.addFavorite(service.id);
      }
    });
    
    return card;
  },
  
  // Rendu des favoris
  renderFavorites: function() {
    if (!this.elements.favoritesGrid) return;
    
    // Vider la grille
    this.elements.favoritesGrid.innerHTML = '';
    
    // Ajouter chaque favori
    this.favorites.forEach(favoriteId => {
      const service = this.services.find(s => s.id === favoriteId);
      if (service) {
        const favoriteCard = this.createFavoriteCard(service);
        this.elements.favoritesGrid.appendChild(favoriteCard);
      }
    });
    
    // Ajouter le bouton d'édition
    const editButton = this.createEditFavoritesButton();
    this.elements.favoritesGrid.appendChild(editButton);
  },
  
  // Création d'une carte de favori
  createFavoriteCard: function(service) {
    const card = document.createElement('a');
    card.href = `https://${service.url}`;
    card.className = 'favorite-item';
    card.dataset.id = service.id;
    card.target = '_blank';
    
    // Icône du service
    let iconHtml = '';
    if (service.icon) {
      iconHtml = `<img src="https://cdn.jsdelivr.net/gh/selfhst/icons/svg/${service.icon}.svg" alt="${service.name}" width="32" height="32">`;
    } else {
      iconHtml = '<i class="fas fa-link"></i>';
    }
    
    card.innerHTML = `
      <div class="favorite-item-icon">
        ${iconHtml}
      </div>
      <div class="favorite-item-name">${service.name}</div>
    `;
    
    return card;
  },
  
  // Création du bouton d'édition des favoris
  createEditFavoritesButton: function() {
    const button = document.createElement('button');
    button.className = 'add-favorite';
    button.id = 'edit-favorites-btn';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14"></path>
      </svg>
      <span>Ajouter</span>
    `;
    
    button.addEventListener('click', () => {
      console.log('Éditer les favoris');
      // Logique d'édition des favoris à implémenter
    });
    
    return button;
  }
};

// Initialiser les services au chargement du document
document.addEventListener('DOMContentLoaded', () => {
  ServicesManager.init();
});