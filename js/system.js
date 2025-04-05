/**
 * Gestionnaire d'informations système
 * Simule des informations de système pour la démo
 */
const SystemManager = {
  // Éléments DOM
  elements: {},
  
  // Intervalle de mise à jour
  updateInterval: null,
  
  // Valeurs actuelles
  currentValues: {
    cpuUsage: 12,
    ramUsage: 4.2,
    diskUsage: 75,
    temperature: 34,
    networkSpeed: 12.4,
    activeServices: 18,
    totalServices: 18
  },
  
  // Initialisation
  init: function() {
    // Récupérer les éléments DOM
    this.cacheElements();
    
    // Mettre à jour les valeurs initiales
    this.updateSystemInfo();
    
    // Configurer les mises à jour périodiques
    this.setupPeriodicUpdates();
    
    console.log('Gestionnaire système initialisé');
  },
  
  // Récupérer les éléments DOM
  cacheElements: function() {
    this.elements = {
      cpuUsage: document.getElementById('cpu-usage'),
      ramUsage: document.getElementById('ram-usage'),
      diskUsage: document.getElementById('disk-usage'),
      temperature: document.getElementById('temperature'),
      networkSpeed: document.getElementById('network-speed'),
      activeServices: document.getElementById('active-services'),
      totalServices: document.getElementById('total-services'),
      weatherTitle: document.querySelector('.weather-title'),
      weatherDesc: document.querySelector('.weather-desc'),
      weatherIcon: document.querySelector('.weather-icon i')
    };
  },
  
  // Configurer les mises à jour périodiques
  setupPeriodicUpdates: function() {
    // Mettre à jour les valeurs toutes les 5 secondes
    this.updateInterval = setInterval(() => {
      this.simulateSystemChanges();
      this.updateSystemInfo();
    }, 5000);
  },
  
  // Simuler des changements dans les valeurs système
  simulateSystemChanges: function() {
    // CPU: variation de ±3%
    this.currentValues.cpuUsage = this.clamp(
      this.currentValues.cpuUsage + this.randomVariation(3),
      0, 100
    );
    
    // RAM: variation de ±0.5 GB
    this.currentValues.ramUsage = parseFloat((
      this.currentValues.ramUsage + this.randomVariation(0.5)
    ).toFixed(1));
    this.currentValues.ramUsage = this.clamp(this.currentValues.ramUsage, 2, 16);
    
    // Disque: variation de ±1%
    this.currentValues.diskUsage = this.clamp(
      this.currentValues.diskUsage + this.randomVariation(1),
      30, 95
    );
    
    // Température: variation de ±2°C
    this.currentValues.temperature = this.clamp(
      this.currentValues.temperature + this.randomVariation(2),
      30, 75
    );
    
    // Vitesse réseau: variation de ±2 MB/s
    this.currentValues.networkSpeed = parseFloat((
      this.currentValues.networkSpeed + this.randomVariation(2)
    ).toFixed(1));
    this.currentValues.networkSpeed = this.clamp(this.currentValues.networkSpeed, 0.1, 100);
    
    // Services: occasionnellement changer le nombre de services actifs
    if (Math.random() < 0.1) { // 10% de chances
      const diff = Math.random() < 0.7 ? 0 : (Math.random() < 0.5 ? -1 : 1);
      this.currentValues.activeServices = this.clamp(
        this.currentValues.activeServices + diff,
        this.currentValues.totalServices - 5,
        this.currentValues.totalServices
      );
    }
  },
  
  // Mettre à jour les informations système dans l'interface
  updateSystemInfo: function() {
    // Mettre à jour les valeurs dans le DOM
    this.updateElementValue('cpuUsage', Math.round(this.currentValues.cpuUsage));
    this.updateElementValue('ramUsage', this.currentValues.ramUsage);
    this.updateElementValue('diskUsage', Math.round(this.currentValues.diskUsage));
    this.updateElementValue('temperature', Math.round(this.currentValues.temperature));
    this.updateElementValue('networkSpeed', this.currentValues.networkSpeed);
    this.updateElementValue('activeServices', this.currentValues.activeServices);
    this.updateElementValue('totalServices', this.currentValues.totalServices);
    
    // Mettre à jour les statuts
    this.updateSystemStatus();
  },
  
  // Mettre à jour un élément DOM avec une valeur
  updateElementValue: function(elementName, value) {
    const element = this.elements[elementName];
    if (element) {
      element.textContent = value;
    }
  },
  
  // Mettre à jour les statuts des systèmes
  updateSystemStatus: function() {
    // Statut CPU
    this.updateStatusClass(
      this.elements.cpuUsage?.parentElement,
      this.getStatusLevel(this.currentValues.cpuUsage, 70, 90)
    );
    
    // Statut disque
    this.updateStatusClass(
      this.elements.diskUsage?.parentElement,
      this.getStatusLevel(this.currentValues.diskUsage, 80, 90)
    );
    
    // Statut température
    this.updateStatusClass(
      this.elements.temperature?.parentElement,
      this.getStatusLevel(this.currentValues.temperature, 50, 70)
    );
    
    // Statut services
    const serviceRatio = this.currentValues.activeServices / this.currentValues.totalServices;
    this.updateStatusClass(
      this.elements.activeServices?.parentElement,
      this.getStatusLevel(100 - serviceRatio * 100, 20, 50)
    );
    
    // Mettre à jour la carte météo
    this.updateWeatherCard();
  },
  
  // Mettre à jour les classes de statut d'un élément
  updateStatusClass: function(element, status) {
    if (!element) return;
    
    element.classList.remove('status-good', 'status-warning', 'status-error');
    
    switch (status) {
      case 'good':
        element.classList.add('status-good');
        break;
      case 'warning':
        element.classList.add('status-warning');
        break;
      case 'error':
        element.classList.add('status-error');
        break;
    }
  },
  
  // Obtenir le niveau de statut en fonction d'une valeur et de seuils
  getStatusLevel: function(value, warningThreshold, errorThreshold) {
    if (value >= errorThreshold) {
      return 'error';
    } else if (value >= warningThreshold) {
      return 'warning';
    } else {
      return 'good';
    }
  },
  
  // Mettre à jour la carte météo
  updateWeatherCard: function() {
    if (!this.elements.weatherTitle || !this.elements.weatherDesc || !this.elements.weatherIcon) return;
    
    // Déterminer l'état global du système
    const statuses = {
      cpu: this.getStatusLevel(this.currentValues.cpuUsage, 70, 90),
      disk: this.getStatusLevel(this.currentValues.diskUsage, 80, 90),
      temp: this.getStatusLevel(this.currentValues.temperature, 50, 70),
      services: this.getStatusLevel(100 - (this.currentValues.activeServices / this.currentValues.totalServices * 100), 20, 50)
    };
    
    // Compter les statuts
    const statusCounts = {
      error: Object.values(statuses).filter(s => s === 'error').length,
      warning: Object.values(statuses).filter(s => s === 'warning').length,
      good: Object.values(statuses).filter(s => s === 'good').length
    };
    
    // Déterminer le statut global
    let globalStatus = 'good';
    let weatherTitle = 'Système en bonne santé';
    let weatherDesc = 'Tous les services sont opérationnels';
    let weatherIcon = 'fa-sun';
    
    if (statusCounts.error > 0) {
      globalStatus = 'error';
      weatherTitle = 'Problèmes système détectés';
      weatherDesc = `${statusCounts.error} problème(s) critique(s) à résoudre`;
      weatherIcon = 'fa-cloud-showers-heavy';
    } else if (statusCounts.warning > 0) {
      globalStatus = 'warning';
      weatherTitle = 'Quelques avertissements';
      weatherDesc = `${statusCounts.warning} point(s) à surveiller`;
      weatherIcon = 'fa-cloud-sun';
    }
    
    // Mettre à jour la carte météo
    this.elements.weatherTitle.textContent = weatherTitle;
    this.elements.weatherDesc.textContent = weatherDesc;
    this.elements.weatherIcon.className = `fas ${weatherIcon}`;
    
    // Mettre à jour la classe de la carte
    const weatherCard = this.elements.weatherTitle.closest('.weather-card');
    if (weatherCard) {
      this.updateStatusClass(weatherCard, globalStatus);
    }
  },
  
  // Variation aléatoire dans l'intervalle [-range, range]
  randomVariation: function(range) {
    return (Math.random() * 2 - 1) * range;
  },
  
  // Limite une valeur dans un intervalle donné
  clamp: function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
};

// Initialiser le gestionnaire système au chargement du document
document.addEventListener('DOMContentLoaded', () => {
  SystemManager.init();
});