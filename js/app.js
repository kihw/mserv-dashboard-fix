/**
 * Application principale
 * Coordonne l'initialisation des différents modules
 */
const App = {
  // Modules
  modules: {
    ui: null,
    services: null,
    theme: null,
    search: null,
    system: null
  },
  
  // État
  state: {
    initialized: false,
    version: '3.0.0',
    debug: true
  },
  
  // Initialisation
  init: function() {
    console.log(`mserv.wtf Dashboard v${this.state.version} - Initialisation`);
    
    // Initialiser les modules
    this.initModules();
    
    // Ajouter un gestionnaire d'erreurs global
    this.setupErrorHandling();
    
    // Marquer comme initialisé
    this.state.initialized = true;
    
    console.log('Application initialisée avec succès');
  },
  
  // Initialiser les modules
  initModules: function() {
    // Références aux modules globaux
    this.modules = {
      ui: window.UIManager || null,
      services: window.ServicesManager || null,
      theme: window.ThemeManager || null,
      search: window.SearchManager || null,
      system: window.SystemManager || null
    };
    
    // Vérifier les modules requis
    const requiredModules = ['services', 'theme'];
    const missingModules = requiredModules.filter(module => !this.modules[module]);
    
    if (missingModules.length > 0) {
      console.warn(`Modules requis manquants: ${missingModules.join(', ')}`);
      this.showInitializationError();
      return;
    }
    
    // Initialiser les modules s'ils ne l'ont pas déjà été
    for (const [name, module] of Object.entries(this.modules)) {
      if (module && typeof module.init === 'function' && !module.initialized) {
        try {
          module.init();
          console.log(`Module ${name} initialisé`);
        } catch (error) {
          console.error(`Erreur lors de l'initialisation du module ${name}:`, error);
        }
      }
    }
  },
  
  // Configurer la gestion des erreurs
  setupErrorHandling: function() {
    window.addEventListener('error', (event) => {
      console.error('Erreur non gérée:', event.error);
      
      if (this.state.debug) {
        // En mode debug, afficher une notification
        this.showErrorNotification(`Erreur: ${event.message}`);
      }
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Promesse rejetée non gérée:', event.reason);
      
      if (this.state.debug) {
        // En mode debug, afficher une notification
        this.showErrorNotification('Erreur de promesse non gérée');
      }
    });
  },
  
  // Afficher une notification d'erreur
  showErrorNotification: function(message) {
    if (this.modules.ui && this.modules.ui.showNotification) {
      this.modules.ui.showNotification(message, 'error');
    } else {
      // Méthode de secours si le module UI n'est pas disponible
      const notification = document.createElement('div');
      notification.className = 'error-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas fa-exclamation-circle"></i>
          <span>${message}</span>
        </div>
      `;
      
      // Style de la notification
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #f44336;
        color: white;
        padding: 15px;
        border-radius: 4px;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      `;
      
      // Ajouter au body
      document.body.appendChild(notification);
      
      // Supprimer après 5 secondes
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 5000);
    }
  },
  
  // Afficher une erreur d'initialisation
  showInitializationError: function() {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'initialization-error';
    errorContainer.innerHTML = `
      <div class="error-content">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Erreur d'initialisation</h3>
        <p>Impossible d'initialiser certains modules requis. Veuillez recharger la page ou contacter l'administrateur.</p>
        <button id="reload-btn">Recharger</button>
      </div>
    `;
    
    // Style du conteneur
    errorContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    
    // Style du contenu
    const errorContent = errorContainer.querySelector('.error-content');
    if (errorContent) {
      errorContent.style.cssText = `
        background-color: var(--bg-secondary, #1a1a1a);
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
        text-align: center;
      `;
    }
    
    // Ajouter au body
    document.body.appendChild(errorContainer);
    
    // Gestionnaire de rechargement
    const reloadBtn = document.getElementById('reload-btn');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }
};

// Initialiser l'application au chargement du document
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});