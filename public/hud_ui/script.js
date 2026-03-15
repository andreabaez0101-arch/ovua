// ============================================
// DOPA HUD - FiveM JavaScript
// 12 Different HUD Styles + Settings Panel
// ============================================

// Default Settings
let hudSettings = {
  style: 'circles-outline',
  colorScheme: 'default',
  statusPosition: 'left',
  speedoPosition: 'right',
  showMoney: true,
  showCompass: true,
  showPlayerInfo: true,
  scale: 1,
  opacity: 1
};

// Color Schemes
const colorSchemes = {
  default: { health: '#ef4444', armor: '#3b82f6', food: '#f97316', water: '#06b6d4', stamina: '#eab308', oxygen: '#8b5cf6', stress: '#ec4899' },
  red: { health: '#ef4444', armor: '#f87171', food: '#fb923c', water: '#fca5a5', stamina: '#fcd34d', oxygen: '#f9a8d4', stress: '#fb7185' },
  blue: { health: '#60a5fa', armor: '#3b82f6', food: '#38bdf8', water: '#22d3ee', stamina: '#a78bfa', oxygen: '#818cf8', stress: '#c084fc' },
  green: { health: '#22c55e', armor: '#4ade80', food: '#a3e635', water: '#2dd4bf', stamina: '#fde047', oxygen: '#34d399', stress: '#86efac' },
  purple: { health: '#a855f7', armor: '#8b5cf6', food: '#c084fc', water: '#e879f9', stamina: '#f472b6', oxygen: '#a78bfa', stress: '#d946ef' },
  orange: { health: '#f97316', armor: '#fb923c', food: '#fbbf24', water: '#facc15', stamina: '#fcd34d', oxygen: '#fdba74', stress: '#f59e0b' }
};

// Style configurations
const styles = [
  { id: 'bars', name: 'Barras' },
  { id: 'bars-vertical', name: 'Barras V' },
  { id: 'circles-outline', name: 'Circulos' },
  { id: 'circles-fill', name: 'Circ. Lleno' },
  { id: 'circles-glow', name: 'Circ. Glow' },
  { id: 'pills', name: 'Pills' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'modern-cards', name: 'Moderno' },
  { id: 'compact', name: 'Compacto' },
  { id: 'neon', name: 'Neon' },
  { id: 'gradient', name: 'Gradiente' },
  { id: 'classic', name: 'Clasico' }
];

// HUD State
let hudState = {
  health: 100,
  armor: 75,
  hunger: 85,
  thirst: 60,
  stamina: 100,
  oxygen: 100,
  stress: 15,
  cash: 56000,
  bank: 156000,
  voiceRange: 'normal',
  talking: false,
  inVehicle: false,
  speed: 0,
  fuel: 72,
  gear: 'P',
  rpm: 0,
  heading: 'N',
  streetName: 'Vinewood Blvd',
  playerId: 252,
  serverName: 'dopa server',
  playerCount: '128/256'
};

// SVG Icons
const icons = {
  health: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  armor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
  food: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
  water: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>',
  stamina: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  oxygen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
  stress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>'
};

// Initialize HUD
function initHUD() {
  loadSettings();
  renderStatus();
  renderSettingsPanel();
  updateAllElements();
  setupEventListeners();
}

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('dopaHudSettings');
  if (saved) {
    hudSettings = { ...hudSettings, ...JSON.parse(saved) };
  }
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem('dopaHudSettings', JSON.stringify(hudSettings));
  // Send to FiveM
  fetch(`https://${GetParentResourceName()}/saveSettings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hudSettings)
  }).catch(() => {});
}

// Render status elements based on current style
function renderStatus() {
  const container = document.getElementById('status-container');
  if (!container) return;
  
  const colors = colorSchemes[hudSettings.colorScheme];
  const statuses = [
    { id: 'health', value: hudState.health, color: colors.health, label: 'Health', visible: true },
    { id: 'armor', value: hudState.armor, color: colors.armor, label: 'Armor', visible: hudState.armor > 0 },
    { id: 'food', value: hudState.hunger, color: colors.food, label: 'Food', visible: true },
    { id: 'water', value: hudState.thirst, color: colors.water, label: 'Water', visible: true },
    { id: 'stamina', value: hudState.stamina, color: colors.stamina, label: 'Stamina', visible: true },
    { id: 'oxygen', value: hudState.oxygen, color: colors.oxygen, label: 'Oxygen', visible: hudState.oxygen < 100 },
    { id: 'stress', value: hudState.stress, color: colors.stress, label: 'Stress', visible: hudState.stress > 0 }
  ];
  
  // Set container classes based on style
  container.className = 'status-container';
  if (hudSettings.statusPosition === 'right') container.classList.add('pos-right');
  if (['circles-outline', 'circles-fill', 'circles-glow', 'modern-cards'].includes(hudSettings.style)) {
    container.classList.add('horizontal');
  }
  if (hudSettings.style === 'bars-vertical') {
    container.classList.add('vertical-bars');
  }
  
  container.innerHTML = statuses.filter(s => s.visible).map(s => renderStatusItem(s)).join('');
}

// Render individual status item based on style
function renderStatusItem(status) {
  const { id, value, color, label } = status;
  const icon = icons[id];
  const critical = (id === 'health' && value <= 20) || (id === 'food' && value <= 20) || (id === 'water' && value <= 20) || (id === 'stress' && value >= 80);
  const criticalClass = critical ? ' critical' : '';
  
  switch (hudSettings.style) {
    case 'bars':
      return `<div class="status-bars-h${criticalClass}" data-id="${id}">
        <div class="icon" style="background:${color}15;color:${color}">${icon}</div>
        <div class="bar-wrapper"><div class="bar"><div class="bar-fill" style="width:${value}%;background:linear-gradient(90deg,${color}80,${color});box-shadow:0 0 8px ${color}60"></div></div></div>
        <span class="value">${Math.round(value)}%</span>
      </div>`;
      
    case 'bars-vertical':
      return `<div class="status-bars-v${criticalClass}" data-id="${id}">
        <div class="icon" style="color:${color}">${icon}</div>
        <div class="bar-v"><div class="bar-fill-v" style="height:${value}%;background:${color};box-shadow:0 0 6px ${color}60"></div></div>
        <span class="value">${Math.round(value)}</span>
      </div>`;
      
    case 'circles-outline':
      const circumference = 2 * Math.PI * 20;
      const offset = circumference - (value / 100) * circumference;
      return `<div class="status-circle-outline${criticalClass}" data-id="${id}">
        <svg class="ring" viewBox="0 0 48 48"><circle class="ring-bg" cx="24" cy="24" r="20"/><circle class="ring-fill" cx="24" cy="24" r="20" stroke="${color}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" style="filter:drop-shadow(0 0 6px ${color}80)"/></svg>
        <div class="icon" style="color:${color}">${icon}</div>
      </div>`;
      
    case 'circles-fill':
      return `<div class="status-circle-fill${criticalClass}" data-id="${id}">
        <div class="bg" style="background:conic-gradient(${color} ${value * 3.6}deg, rgba(255,255,255,0.06) 0deg)"></div>
        <div class="inner"></div>
        <div class="content"><div class="icon" style="color:${color}">${icon}</div><span class="value">${Math.round(value)}</span></div>
      </div>`;
      
    case 'circles-glow':
      const circGlow = 2 * Math.PI * 22;
      const offsetGlow = circGlow - (value / 100) * circGlow;
      return `<div class="status-circle-glow${criticalClass}" data-id="${id}">
        <div class="glow" style="background:radial-gradient(circle,${color}20 0%,transparent 70%)"></div>
        <svg class="ring" viewBox="0 0 64 64"><circle class="ring-bg" cx="32" cy="32" r="22"/><circle class="ring-fill" cx="32" cy="32" r="22" stroke="${color}" stroke-dasharray="${circGlow}" stroke-dashoffset="${offsetGlow}" style="filter:drop-shadow(0 0 10px ${color}) drop-shadow(0 0 20px ${color}60)"/></svg>
        <div class="content"><div class="icon" style="color:${color};filter:drop-shadow(0 0 4px ${color})">${icon}</div><span class="value" style="color:${color}">${Math.round(value)}</span></div>
      </div>`;
      
    case 'pills':
      const segments = 5;
      const filled = Math.ceil((value / 100) * segments);
      let segsHtml = '';
      for (let i = 0; i < segments; i++) {
        segsHtml += `<div class="segment${i < filled ? ' active' : ''}" style="${i < filled ? `background:${color};box-shadow:0 0 6px ${color}60` : ''}"></div>`;
      }
      return `<div class="status-pills${criticalClass}" data-id="${id}">
        <div class="icon" style="color:${color}">${icon}</div>
        <div class="segments">${segsHtml}</div>
      </div>`;
      
    case 'minimal':
      return `<div class="status-minimal${criticalClass}" data-id="${id}">
        <div class="icon" style="color:${color}">${icon}</div>
        <span class="value" style="color:${color};text-shadow:0 0 8px ${color}60,0 1px 2px rgba(0,0,0,0.8)">${Math.round(value)}</span>
      </div>`;
      
    case 'modern-cards':
      return `<div class="status-modern${criticalClass}" data-id="${id}">
        <div class="icon-wrap" style="background:${color}20">${icon.replace('currentColor', color)}</div>
        <div class="bar"><div class="bar-fill" style="width:${value}%;background:${color};box-shadow:0 0 8px ${color}60"></div></div>
        <span class="label">${label}</span>
      </div>`;
      
    case 'compact':
      return `<div class="status-compact${criticalClass}" data-id="${id}">
        <div class="icon" style="color:${color}">${icon}</div>
        <div class="bar"><div class="bar-fill" style="width:${value}%;background:${color}"></div></div>
      </div>`;
      
    case 'neon':
      return `<div class="status-neon${criticalClass}" data-id="${id}" style="border:1px solid ${color}50;box-shadow:0 0 15px ${color}30,inset 0 0 20px ${color}10">
        <div class="icon" style="color:${color};filter:drop-shadow(0 0 6px ${color})">${icon}</div>
        <div class="bar-wrapper"><div class="bar" style="border:1px solid ${color}30"><div class="bar-fill" style="width:${value}%;background:linear-gradient(90deg,${color}60,${color});box-shadow:0 0 10px ${color},inset 0 0 5px rgba(255,255,255,0.3)"></div></div></div>
        <span class="value" style="color:${color};text-shadow:0 0 8px ${color}">${Math.round(value)}%</span>
      </div>`;
      
    case 'gradient':
      return `<div class="status-gradient${criticalClass}" data-id="${id}" style="background:linear-gradient(135deg,${color}15 0%,${color}05 100%);border:1px solid ${color}25">
        <div class="icon-wrap" style="background:${color}25">${icon.replace('currentColor', color)}</div>
        <div class="bar-wrapper"><div class="bar"><div class="bar-fill" style="width:${value}%;background:linear-gradient(90deg,${color}90,${color})"></div></div></div>
        <span class="value" style="color:${color}">${Math.round(value)}%</span>
      </div>`;
      
    case 'classic':
      return `<div class="status-classic${criticalClass}" data-id="${id}">
        <div class="icon" style="color:${color}">${icon}</div>
        <div class="bar"><div class="bar-fill" style="width:${value}%;background:${color}"></div></div>
        <span class="value">${Math.round(value)}%</span>
      </div>`;
      
    default:
      return '';
  }
}

// Render settings panel
function renderSettingsPanel() {
  // Style grid
  const styleGrid = document.getElementById('style-grid');
  if (styleGrid) {
    styleGrid.innerHTML = styles.map(s => `
      <button class="style-btn${hudSettings.style === s.id ? ' active' : ''}" data-style="${s.id}">
        <div class="style-preview">${getStylePreview(s.id)}</div>
        <span class="name">${s.name}</span>
        <div class="check">${icons.check}</div>
      </button>
    `).join('');
  }
  
  // Color schemes
  const colorSchemesEl = document.getElementById('color-schemes');
  if (colorSchemesEl) {
    colorSchemesEl.innerHTML = Object.keys(colorSchemes).map(scheme => {
      const cols = Object.values(colorSchemes[scheme]).slice(0, 4);
      return `<button class="color-btn${hudSettings.colorScheme === scheme ? ' active' : ''}" data-scheme="${scheme}">
        <div class="color-dots">${cols.map(c => `<div class="color-dot" style="background:${c}"></div>`).join('')}</div>
        <span class="name">${scheme}</span>
      </button>`;
    }).join('');
  }
  
  // Status position buttons
  const statusPosBtns = document.getElementById('status-pos-btns');
  if (statusPosBtns) {
    statusPosBtns.innerHTML = ['left', 'right'].map(pos => 
      `<button class="pos-btn${hudSettings.statusPosition === pos ? ' active' : ''}" data-pos="status" data-value="${pos}">${pos === 'left' ? 'Izquierda' : 'Derecha'}</button>`
    ).join('');
  }
  
  // Speedo position buttons
  const speedoPosBtns = document.getElementById('speedo-pos-btns');
  if (speedoPosBtns) {
    speedoPosBtns.innerHTML = ['left', 'center', 'right'].map(pos => 
      `<button class="pos-btn${hudSettings.speedoPosition === pos ? ' active' : ''}" data-pos="speedo" data-value="${pos}">${pos === 'left' ? 'Izq' : pos === 'center' ? 'Centro' : 'Der'}</button>`
    ).join('');
  }
  
  // Toggle buttons
  const toggleBtns = document.getElementById('toggle-btns');
  if (toggleBtns) {
    toggleBtns.innerHTML = [
      { key: 'showMoney', label: 'Dinero' },
      { key: 'showCompass', label: 'Brujula' },
      { key: 'showPlayerInfo', label: 'Info Jugador' }
    ].map(t => `<button class="toggle-btn${hudSettings[t.key] ? ' active' : ''}" data-toggle="${t.key}">
      ${hudSettings[t.key] ? icons.eye : icons.eyeOff}
      ${t.label}
    </button>`).join('');
  }
  
  // Sliders
  const scaleSlider = document.getElementById('scale-slider');
  const opacitySlider = document.getElementById('opacity-slider');
  if (scaleSlider) scaleSlider.value = hudSettings.scale;
  if (opacitySlider) opacitySlider.value = hudSettings.opacity;
  updateSliderLabels();
}

// Get style preview HTML
function getStylePreview(style) {
  const previewColors = ['#ef4444', '#3b82f6', '#22c55e', '#f97316'];
  switch (style) {
    case 'bars':
      return previewColors.slice(0, 3).map((c, i) => `<div style="width:48px;height:6px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden"><div style="width:${[85, 60, 45][i]}%;height:100%;background:${c};border-radius:99px"></div></div>`).join('');
    case 'bars-vertical':
      return previewColors.map((c, i) => `<div style="width:6px;height:32px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;display:flex;flex-direction:column-reverse"><div style="width:100%;height:${[85, 60, 45, 75][i]}%;background:${c};border-radius:99px"></div></div>`).join('');
    case 'circles-outline':
    case 'circles-fill':
    case 'circles-glow':
      return previewColors.slice(0, 3).map(c => `<div style="width:24px;height:24px;border-radius:50%;border:2px solid ${c};opacity:0.8"></div>`).join('');
    case 'pills':
      return previewColors.slice(0, 2).map(c => `<div style="display:flex;gap:2px">${[1,2,3].map(j => `<div style="width:8px;height:4px;border-radius:99px;background:${j <= 2 ? c : 'rgba(255,255,255,0.1)'}"></div>`).join('')}</div>`).join('');
    case 'minimal':
      return previewColors.slice(0, 3).map((c, i) => `<span style="font-size:10px;font-weight:700;color:${c}">${[85, 60, 45][i]}</span>`).join('');
    case 'modern-cards':
      return previewColors.slice(0, 2).map(c => `<div style="width:32px;height:40px;background:rgba(255,255,255,0.05);border-radius:8px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center"><div style="width:12px;height:12px;border-radius:4px;background:${c}30"></div></div>`).join('');
    case 'compact':
      return previewColors.map(c => `<div style="width:24px;height:2px;background:${c};border-radius:99px"></div>`).join('');
    case 'neon':
      return previewColors.slice(0, 2).map((c, i) => `<div style="width:40px;height:8px;border-radius:4px;border:1px solid ${c}50;box-shadow:0 0 4px ${c}40;overflow:hidden"><div style="width:${[70, 50][i]}%;height:100%;background:${c}"></div></div>`).join('');
    case 'gradient':
      return previewColors.slice(0, 2).map(c => `<div style="width:40px;height:12px;border-radius:8px;background:linear-gradient(135deg,${c}30 0%,${c}10 100%)"></div>`).join('');
    case 'classic':
      return previewColors.slice(0, 3).map((c, i) => `<div style="width:32px;height:8px;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:2px;overflow:hidden"><div style="width:${[85, 60, 45][i]}%;height:100%;background:${c}"></div></div>`).join('');
    default:
      return '';
  }
}

// Update slider labels
function updateSliderLabels() {
  const scaleVal = document.getElementById('scale-val');
  const opacityVal = document.getElementById('opacity-val');
  if (scaleVal) scaleVal.textContent = hudSettings.scale.toFixed(1) + 'x';
  if (opacityVal) opacityVal.textContent = Math.round(hudSettings.opacity * 100) + '%';
}

// Update all HUD elements
function updateAllElements() {
  // Apply scale and opacity
  document.body.style.transform = `scale(${hudSettings.scale})`;
  document.body.style.transformOrigin = 'bottom left';
  document.body.style.opacity = hudSettings.opacity;
  
  // Update visibility
  const moneyDisplay = document.getElementById('money-display');
  const compass = document.getElementById('compass');
  const playerInfo = document.getElementById('player-info');
  
  if (moneyDisplay) moneyDisplay.style.display = hudSettings.showMoney ? 'flex' : 'none';
  if (compass) compass.style.display = hudSettings.showCompass ? 'flex' : 'none';
  if (playerInfo) playerInfo.style.display = hudSettings.showPlayerInfo ? 'flex' : 'none';
  
  // Update voice indicator position
  const voiceIndicator = document.getElementById('voice-indicator');
  if (voiceIndicator) {
    voiceIndicator.classList.toggle('pos-right', hudSettings.statusPosition === 'right');
  }
  
  // Update speedometer
  updateSpeedometer();
  
  // Update money display style
  if (moneyDisplay) {
    moneyDisplay.classList.toggle('minimal', hudSettings.style === 'minimal');
  }
}

// Update speedometer based on style
function updateSpeedometer() {
  const speedoBars = document.getElementById('speedometer-bars');
  const speedoCircles = document.getElementById('speedometer-circles');
  
  const useCircles = ['circles-outline', 'circles-fill', 'circles-glow', 'neon'].includes(hudSettings.style);
  
  if (speedoBars) {
    speedoBars.style.display = !useCircles && hudState.inVehicle ? 'block' : 'none';
    speedoBars.className = `speedometer-bars pos-${hudSettings.speedoPosition}`;
  }
  
  if (speedoCircles) {
    speedoCircles.style.display = useCircles && hudState.inVehicle ? 'flex' : 'none';
    speedoCircles.className = `speedometer-circles pos-${hudSettings.speedoPosition}`;
  }
}

// Setup event listeners
function setupEventListeners() {
  // Settings panel events
  document.getElementById('settings-overlay')?.addEventListener('click', closeSettings);
  document.getElementById('close-settings')?.addEventListener('click', closeSettings);
  document.getElementById('cancel-settings')?.addEventListener('click', closeSettings);
  document.getElementById('save-settings')?.addEventListener('click', () => {
    saveSettings();
    closeSettings();
  });
  
  // Style buttons
  document.getElementById('style-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.style-btn');
    if (btn) {
      hudSettings.style = btn.dataset.style;
      renderStatus();
      renderSettingsPanel();
      updateAllElements();
    }
  });
  
  // Color scheme buttons
  document.getElementById('color-schemes')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.color-btn');
    if (btn) {
      hudSettings.colorScheme = btn.dataset.scheme;
      renderStatus();
      renderSettingsPanel();
    }
  });
  
  // Position buttons
  document.querySelectorAll('.position-btns').forEach(container => {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.pos-btn');
      if (btn) {
        const posType = btn.dataset.pos;
        const value = btn.dataset.value;
        if (posType === 'status') hudSettings.statusPosition = value;
        else if (posType === 'speedo') hudSettings.speedoPosition = value;
        renderStatus();
        renderSettingsPanel();
        updateAllElements();
      }
    });
  });
  
  // Toggle buttons
  document.getElementById('toggle-btns')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-btn');
    if (btn) {
      const key = btn.dataset.toggle;
      hudSettings[key] = !hudSettings[key];
      renderSettingsPanel();
      updateAllElements();
    }
  });
  
  // Sliders
  document.getElementById('scale-slider')?.addEventListener('input', (e) => {
    hudSettings.scale = parseFloat(e.target.value);
    updateSliderLabels();
    updateAllElements();
  });
  
  document.getElementById('opacity-slider')?.addEventListener('input', (e) => {
    hudSettings.opacity = parseFloat(e.target.value);
    updateSliderLabels();
    updateAllElements();
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSettings();
  });
}

// Open settings panel
function openSettings() {
  const panel = document.getElementById('hud-settings');
  if (panel) panel.style.display = 'flex';
}

// Close settings panel
function closeSettings() {
  const panel = document.getElementById('hud-settings');
  if (panel) panel.style.display = 'none';
  // Notify FiveM
  fetch(`https://${GetParentResourceName()}/closeSettings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  }).catch(() => {});
}

// FiveM NUI Message Handler
window.addEventListener('message', (event) => {
  const data = event.data;
  
  switch (data.action) {
    case 'updateStatus':
      if (data.health !== undefined) hudState.health = data.health;
      if (data.armor !== undefined) hudState.armor = data.armor;
      if (data.hunger !== undefined) hudState.hunger = data.hunger;
      if (data.thirst !== undefined) hudState.thirst = data.thirst;
      if (data.stamina !== undefined) hudState.stamina = data.stamina;
      if (data.oxygen !== undefined) hudState.oxygen = data.oxygen;
      if (data.stress !== undefined) hudState.stress = data.stress;
      renderStatus();
      break;
      
    case 'updateMoney':
      if (data.cash !== undefined) {
        hudState.cash = data.cash;
        const cashEl = document.getElementById('cash-value');
        if (cashEl) cashEl.textContent = '$' + hudState.cash.toLocaleString();
      }
      if (data.bank !== undefined) {
        hudState.bank = data.bank;
        const bankEl = document.getElementById('bank-value');
        if (bankEl) bankEl.textContent = '$' + hudState.bank.toLocaleString();
      }
      break;
      
    case 'updateVehicle':
      hudState.inVehicle = data.inVehicle || false;
      if (data.speed !== undefined) hudState.speed = data.speed;
      if (data.fuel !== undefined) hudState.fuel = data.fuel;
      if (data.gear !== undefined) hudState.gear = data.gear;
      if (data.rpm !== undefined) hudState.rpm = data.rpm;
      updateSpeedometer();
      updateSpeedoValues();
      break;
      
    case 'updateVoice':
      if (data.range !== undefined) hudState.voiceRange = data.range;
      if (data.talking !== undefined) hudState.talking = data.talking;
      updateVoiceIndicator();
      break;
      
    case 'updateLocation':
      if (data.heading !== undefined) hudState.heading = data.heading;
      if (data.streetName !== undefined) hudState.streetName = data.streetName;
      updateCompass();
      break;
      
    case 'updatePlayerInfo':
      if (data.playerId !== undefined) {
        hudState.playerId = data.playerId;
        const pidEl = document.getElementById('player-id-value');
        if (pidEl) pidEl.textContent = hudState.playerId;
      }
      if (data.serverName !== undefined) {
        hudState.serverName = data.serverName;
        const snEl = document.getElementById('server-name');
        if (snEl) snEl.textContent = hudState.serverName;
      }
      if (data.playerCount !== undefined) {
        hudState.playerCount = data.playerCount;
        const pcEl = document.getElementById('player-count');
        if (pcEl) pcEl.textContent = hudState.playerCount;
      }
      break;
      
    case 'openSettings':
      openSettings();
      break;
      
    case 'closeSettings':
      closeSettings();
      break;
      
    case 'toggleHud':
      document.body.style.display = data.visible ? 'block' : 'none';
      break;
      
    case 'loadSettings':
      if (data.settings) {
        hudSettings = { ...hudSettings, ...data.settings };
        renderStatus();
        renderSettingsPanel();
        updateAllElements();
      }
      break;
  }
});

// Update speedometer values
function updateSpeedoValues() {
  // Bar style
  const speedVal = document.getElementById('speed-value');
  const fuelVal = document.getElementById('fuel-value');
  const gearVal = document.getElementById('gear-value');
  
  if (speedVal) speedVal.textContent = Math.round(hudState.speed);
  if (fuelVal) fuelVal.textContent = Math.round(hudState.fuel) + '%';
  if (gearVal) gearVal.textContent = hudState.gear;
  
  const rpmFill = document.getElementById('rpm-fill');
  if (rpmFill) {
    const rpmPercent = (hudState.rpm / 9000) * 100;
    rpmFill.style.width = rpmPercent + '%';
    rpmFill.classList.toggle('high', hudState.rpm > 7000);
  }
  
  const fuelFill = document.getElementById('fuel-fill');
  if (fuelFill) fuelFill.style.width = hudState.fuel + '%';
  
  // Circle style
  const speedCircle = document.getElementById('speed-circle');
  const gearCircle = document.getElementById('gear-circle');
  const fuelValCircle = document.getElementById('fuel-val-circle');
  
  if (speedCircle) speedCircle.textContent = Math.round(hudState.speed);
  if (gearCircle) gearCircle.textContent = hudState.gear;
  if (fuelValCircle) fuelValCircle.textContent = Math.round(hudState.fuel) + '%';
  
  const speedRing = document.getElementById('speed-ring');
  if (speedRing) {
    const circumference = 2 * Math.PI * 42;
    const maxSpeed = 220;
    const speedPercent = Math.min(hudState.speed / maxSpeed, 1);
    const offset = circumference - speedPercent * circumference;
    speedRing.style.strokeDasharray = circumference;
    speedRing.style.strokeDashoffset = offset;
    speedRing.style.stroke = hudState.speed > 160 ? '#ef4444' : hudState.speed > 100 ? '#f97316' : '#3b82f6';
  }
  
  const fuelCircle = document.getElementById('fuel-circle');
  if (fuelCircle) fuelCircle.style.width = hudState.fuel + '%';
}

// Update voice indicator
function updateVoiceIndicator() {
  const indicator = document.getElementById('voice-indicator');
  if (!indicator) return;
  
  indicator.classList.toggle('talking', hudState.talking);
  
  const levels = hudState.voiceRange === 'whisper' ? 1 : hudState.voiceRange === 'normal' ? 2 : 3;
  indicator.querySelectorAll('.voice-bar').forEach((bar, i) => {
    bar.classList.toggle('active', i < levels);
  });
  
  const label = indicator.querySelector('.voice-label');
  if (label) label.textContent = hudState.voiceRange.charAt(0).toUpperCase() + hudState.voiceRange.slice(1);
}

// Update compass
function updateCompass() {
  const dirs = document.querySelectorAll('.dir');
  dirs.forEach(dir => {
    dir.classList.toggle('active', dir.dataset.dir === hudState.heading);
  });
  
  const streetNameEl = document.getElementById('street-name');
  if (streetNameEl) streetNameEl.textContent = hudState.streetName;
}

// Demo: simulate vehicle entry for preview
function demoVehicle() {
  hudState.inVehicle = true;
  hudState.speed = 85;
  hudState.rpm = 4500;
  updateSpeedometer();
  updateSpeedoValues();
}

// Utility function for FiveM resource name
function GetParentResourceName() {
  return window.GetParentResourceName ? window.GetParentResourceName() : 'dopa-hud';
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initHUD();
  demoVehicle(); // For demo purposes
});
