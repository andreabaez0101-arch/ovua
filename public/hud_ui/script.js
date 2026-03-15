/* ========================================
   dopa - hud
   FiveM HUD JavaScript
   ======================================== */

// State
const state = {
  health: 100,
  armor: 75,
  hunger: 85,
  thirst: 60,
  stamina: 100,
  oxygen: 100,
  stress: 0,
  cash: 12500,
  bank: 85420,
  playerId: 156,
  serverName: 'dopa server',
  playerCount: '128/256',
  voiceRange: 'normal', // whisper, normal, shout
  isTalking: false,
  inVehicle: false,
  speed: 0,
  fuel: 75,
  gear: 'D',
  heading: 'N',
  streetName: 'Vinewood Blvd',
  isUnderwater: false,
  showOxygen: false,
  showStress: false
};

// DOM Elements
const elements = {
  statusBars: null,
  moneyDisplay: null,
  playerInfo: null,
  voiceIndicator: null,
  speedometer: null,
  compass: null,
  notifications: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  setupEventListeners();
  updateUI();
  
  // Demo: simulate some changes
  startDemo();
});

function cacheElements() {
  elements.statusBars = document.querySelector('.status-bars');
  elements.moneyDisplay = document.querySelector('.money-display');
  elements.playerInfo = document.querySelector('.player-info');
  elements.voiceIndicator = document.querySelector('.voice-indicator');
  elements.speedometer = document.querySelector('.speedometer');
  elements.compass = document.querySelector('.compass');
  elements.notifications = document.getElementById('notifications');
}

function setupEventListeners() {
  // Listen for NUI messages from FiveM
  window.addEventListener('message', (event) => {
    const data = event.data;
    
    switch (data.action) {
      case 'updateStatus':
        updateStatus(data);
        break;
      case 'updateMoney':
        updateMoney(data);
        break;
      case 'updateVoice':
        updateVoice(data);
        break;
      case 'updateVehicle':
        updateVehicle(data);
        break;
      case 'updateCompass':
        updateCompass(data);
        break;
      case 'showNotification':
        showNotification(data);
        break;
      case 'updatePlayerInfo':
        updatePlayerInfo(data);
        break;
      case 'setVisible':
        setVisible(data.visible);
        break;
    }
  });

  // Keyboard shortcuts for demo
  document.addEventListener('keydown', (e) => {
    if (e.key === 'v' || e.key === 'V') {
      cycleVoiceRange();
    }
  });
}

// Update Functions
function updateStatus(data) {
  if (data.health !== undefined) {
    state.health = data.health;
    updateStatusBar('health', data.health);
  }
  if (data.armor !== undefined) {
    state.armor = data.armor;
    updateStatusBar('armor', data.armor);
  }
  if (data.hunger !== undefined) {
    state.hunger = data.hunger;
    updateStatusBar('hunger', data.hunger);
  }
  if (data.thirst !== undefined) {
    state.thirst = data.thirst;
    updateStatusBar('thirst', data.thirst);
  }
  if (data.stamina !== undefined) {
    state.stamina = data.stamina;
    updateStatusBar('stamina', data.stamina);
  }
  if (data.oxygen !== undefined) {
    state.oxygen = data.oxygen;
    state.showOxygen = data.oxygen < 100;
    updateStatusBar('oxygen', data.oxygen);
    toggleStatusVisibility('oxygen', state.showOxygen);
  }
  if (data.stress !== undefined) {
    state.stress = data.stress;
    state.showStress = data.stress > 0;
    updateStatusBar('stress', data.stress);
    toggleStatusVisibility('stress', state.showStress);
  }
}

function updateStatusBar(type, value) {
  const item = document.querySelector(`.status-item[data-type="${type}"]`);
  if (!item) return;
  
  const fill = item.querySelector('.status-fill');
  const valueEl = item.querySelector('.status-value');
  
  if (fill) fill.style.width = `${Math.max(0, Math.min(100, value))}%`;
  if (valueEl) valueEl.textContent = Math.round(value);
  
  // Add critical class for low values
  if (value <= 20) {
    item.classList.add('critical');
  } else {
    item.classList.remove('critical');
  }
}

function toggleStatusVisibility(type, visible) {
  const item = document.querySelector(`.status-item[data-type="${type}"]`);
  if (item) {
    item.classList.toggle('hidden', !visible);
  }
}

function updateMoney(data) {
  if (data.cash !== undefined) {
    state.cash = data.cash;
    const cashEl = document.getElementById('cash-value');
    if (cashEl) cashEl.textContent = formatMoney(data.cash);
  }
  if (data.bank !== undefined) {
    state.bank = data.bank;
    const bankEl = document.getElementById('bank-value');
    if (bankEl) bankEl.textContent = formatMoney(data.bank);
  }
}

function formatMoney(amount) {
  return '$' + amount.toLocaleString('en-US');
}

function updateVoice(data) {
  if (data.range !== undefined) {
    state.voiceRange = data.range;
    const indicator = elements.voiceIndicator;
    if (indicator) {
      indicator.setAttribute('data-range', data.range);
      const modeText = indicator.querySelector('.voice-mode');
      if (modeText) {
        const modes = { whisper: 'Whisper', normal: 'Normal', shout: 'Shout' };
        modeText.textContent = modes[data.range] || 'Normal';
      }
    }
  }
  if (data.talking !== undefined) {
    state.isTalking = data.talking;
    const indicator = elements.voiceIndicator;
    if (indicator) {
      indicator.classList.toggle('talking', data.talking);
    }
  }
}

function cycleVoiceRange() {
  const ranges = ['whisper', 'normal', 'shout'];
  const currentIndex = ranges.indexOf(state.voiceRange);
  const nextIndex = (currentIndex + 1) % ranges.length;
  updateVoice({ range: ranges[nextIndex] });
}

function updateVehicle(data) {
  if (data.inVehicle !== undefined) {
    state.inVehicle = data.inVehicle;
    const speedometer = elements.speedometer;
    if (speedometer) {
      speedometer.classList.toggle('hidden', !data.inVehicle);
    }
  }
  if (data.speed !== undefined) {
    state.speed = data.speed;
    const speedValue = document.querySelector('.speed-value');
    if (speedValue) speedValue.textContent = Math.round(data.speed);
  }
  if (data.fuel !== undefined) {
    state.fuel = data.fuel;
    const fuelFill = document.querySelector('.fuel-fill');
    const fuelValue = document.querySelector('.fuel-value');
    if (fuelFill) fuelFill.style.width = `${data.fuel}%`;
    if (fuelValue) fuelValue.textContent = `${Math.round(data.fuel)}%`;
  }
  if (data.gear !== undefined) {
    state.gear = data.gear;
    const gearValue = document.querySelector('.gear-value');
    if (gearValue) gearValue.textContent = data.gear;
  }
}

function updateCompass(data) {
  if (data.heading !== undefined) {
    state.heading = data.heading;
    updateCompassDirection(data.heading);
  }
  if (data.streetName !== undefined) {
    state.streetName = data.streetName;
    const streetEl = document.querySelector('.street-name');
    if (streetEl) streetEl.textContent = data.streetName;
  }
}

function updateCompassDirection(heading) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const directionEls = document.querySelectorAll('.compass-direction');
  
  directionEls.forEach(el => {
    el.classList.remove('active');
    if (el.getAttribute('data-dir') === heading) {
      el.classList.add('active');
    }
  });
}

function updatePlayerInfo(data) {
  if (data.playerId !== undefined) {
    state.playerId = data.playerId;
    const idValue = document.querySelector('.id-value');
    if (idValue) idValue.textContent = data.playerId;
  }
  if (data.serverName !== undefined) {
    state.serverName = data.serverName;
    const serverEl = document.querySelector('.server-name');
    if (serverEl) serverEl.textContent = data.serverName;
  }
  if (data.playerCount !== undefined) {
    state.playerCount = data.playerCount;
    const countEl = document.querySelector('.player-count');
    if (countEl) countEl.textContent = data.playerCount;
  }
}

// Notifications
function showNotification(data) {
  const container = elements.notifications;
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${data.type || 'info'}`;
  
  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  };
  
  notification.innerHTML = `
    <div class="notification-icon">
      ${icons[data.type] || icons.info}
    </div>
    <div class="notification-content">
      ${data.title ? `<div class="notification-title">${data.title}</div>` : ''}
      <div class="notification-message">${data.message}</div>
    </div>
  `;
  
  container.appendChild(notification);
  
  // Auto remove after duration
  const duration = data.duration || 5000;
  setTimeout(() => {
    notification.classList.add('hiding');
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

function setVisible(visible) {
  const container = document.querySelector('.hud-container');
  if (container) {
    container.style.display = visible ? 'block' : 'none';
  }
}

function updateUI() {
  // Update all status bars
  updateStatusBar('health', state.health);
  updateStatusBar('armor', state.armor);
  updateStatusBar('hunger', state.hunger);
  updateStatusBar('thirst', state.thirst);
  updateStatusBar('stamina', state.stamina);
  updateStatusBar('oxygen', state.oxygen);
  updateStatusBar('stress', state.stress);
  
  // Update money
  updateMoney({ cash: state.cash, bank: state.bank });
  
  // Update voice
  updateVoice({ range: state.voiceRange, talking: state.isTalking });
  
  // Update compass
  updateCompassDirection(state.heading);
  
  // Hide oxygen and stress by default
  toggleStatusVisibility('oxygen', state.showOxygen);
  toggleStatusVisibility('stress', state.showStress);
  
  // Hide speedometer by default
  if (elements.speedometer) {
    elements.speedometer.classList.toggle('hidden', !state.inVehicle);
  }
}

// Demo Mode (for testing)
function startDemo() {
  // Show initial notification
  setTimeout(() => {
    showNotification({
      type: 'success',
      title: 'HUD Loaded',
      message: 'dopa - hud initialized successfully',
      duration: 3000
    });
  }, 500);
  
  // Simulate status changes
  setInterval(() => {
    // Random small changes to hunger and thirst
    if (Math.random() > 0.7) {
      const newHunger = Math.max(0, state.hunger - Math.random() * 2);
      updateStatus({ hunger: newHunger });
    }
    if (Math.random() > 0.8) {
      const newThirst = Math.max(0, state.thirst - Math.random() * 3);
      updateStatus({ thirst: newThirst });
    }
  }, 5000);
  
  // Simulate compass changes
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  let dirIndex = 0;
  setInterval(() => {
    dirIndex = (dirIndex + 1) % directions.length;
    updateCompass({ heading: directions[dirIndex] });
  }, 2000);
  
  // Demo: Enter vehicle after 5 seconds
  setTimeout(() => {
    updateVehicle({ inVehicle: true, speed: 0, fuel: 75, gear: 'P' });
    showNotification({
      type: 'info',
      title: 'Vehicle',
      message: 'You entered a vehicle',
      duration: 3000
    });
    
    // Simulate driving
    let speed = 0;
    const driveInterval = setInterval(() => {
      speed = Math.min(120, speed + Math.random() * 10);
      updateVehicle({ 
        speed: speed, 
        gear: speed > 60 ? 'D' : speed > 30 ? '2' : '1',
        fuel: state.fuel - 0.1
      });
      
      if (speed >= 120) {
        clearInterval(driveInterval);
        // Slow down
        const slowInterval = setInterval(() => {
          speed = Math.max(0, speed - Math.random() * 15);
          updateVehicle({ speed: speed, gear: speed > 0 ? 'D' : 'P' });
          if (speed <= 0) {
            clearInterval(slowInterval);
            setTimeout(() => {
              updateVehicle({ inVehicle: false });
            }, 2000);
          }
        }, 500);
      }
    }, 500);
  }, 5000);
}

// FiveM NUI Callback
function closeHUD() {
  fetch(`https://${GetParentResourceName()}/closeHUD`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
}

// Utility function for FiveM resource name
function GetParentResourceName() {
  return window.GetParentResourceName ? window.GetParentResourceName() : 'hud_ui';
}
