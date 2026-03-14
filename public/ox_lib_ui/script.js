/**
 * ox_lib Liquid Glass UI - JavaScript Controller
 * iOS 26 Inspired Design for FiveM
 * Compatible with ox_lib NUI callbacks
 */

// ============================================
// NOTIFICATION SYSTEM
// ============================================
const NotificationManager = {
  container: null,
  queue: [],
  maxVisible: 5,

  init() {
    this.container = document.getElementById('notification-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
    }
  },

  show(data) {
    const { id, type = 'info', title, description, duration = 5000, icon, position = 'top-right' } = data;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.dataset.id = id || Date.now();
    
    const iconMap = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
    };

    notification.innerHTML = `
      <div class="notification-icon">${icon || iconMap[type] || iconMap.info}</div>
      <div class="notification-content">
        ${title ? `<div class="notification-title">${title}</div>` : ''}
        ${description ? `<div class="notification-description">${description}</div>` : ''}
      </div>
      <div class="notification-progress"><div class="notification-progress-bar"></div></div>
    `;

    this.container.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add('show');
      const progressBar = notification.querySelector('.notification-progress-bar');
      progressBar.style.animation = `progress ${duration}ms linear forwards`;
    });

    // Auto remove
    setTimeout(() => this.hide(notification.dataset.id), duration);
    
    return notification.dataset.id;
  },

  hide(id) {
    const notification = this.container.querySelector(`[data-id="${id}"]`);
    if (notification) {
      notification.classList.remove('show');
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 300);
    }
  }
};

// ============================================
// CONTEXT MENU SYSTEM
// ============================================
const ContextMenu = {
  element: null,
  isOpen: false,
  currentIndex: 0,
  items: [],

  init() {
    this.element = document.getElementById('context-menu');
    this.setupKeyboardNavigation();
  },

  open(data) {
    const { title, items, canClose = true } = data;
    this.items = items;
    this.currentIndex = 0;
    
    const menuContent = this.element.querySelector('.context-menu-content');
    const menuTitle = this.element.querySelector('.context-menu-title');
    const menuItems = this.element.querySelector('.context-menu-items');
    
    menuTitle.textContent = title || 'Menu';
    menuItems.innerHTML = '';
    
    items.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = `context-menu-item ${item.disabled ? 'disabled' : ''} ${index === 0 ? 'active' : ''}`;
      itemEl.dataset.index = index;
      
      const iconHtml = item.icon ? `<div class="context-menu-item-icon">${this.getIcon(item.icon)}</div>` : '';
      const arrowHtml = item.menu ? '<div class="context-menu-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>' : '';
      const metaHtml = item.metadata ? `<div class="context-menu-meta">${item.metadata}</div>` : '';
      
      itemEl.innerHTML = `
        ${iconHtml}
        <div class="context-menu-item-content">
          <span class="context-menu-item-title">${item.title}</span>
          ${item.description ? `<span class="context-menu-item-desc">${item.description}</span>` : ''}
        </div>
        ${metaHtml}
        ${arrowHtml}
      `;
      
      itemEl.addEventListener('click', () => this.selectItem(index));
      itemEl.addEventListener('mouseenter', () => this.setActiveIndex(index));
      
      menuItems.appendChild(itemEl);
    });
    
    this.element.classList.add('show');
    this.isOpen = true;
  },

  close() {
    this.element.classList.remove('show');
    this.isOpen = false;
    this.sendNUI('contextMenu:close');
  },

  selectItem(index) {
    const item = this.items[index];
    if (item && !item.disabled) {
      if (item.menu) {
        this.open({ title: item.title, items: item.menu });
      } else {
        this.close();
        this.sendNUI('contextMenu:select', { id: item.id, index });
      }
    }
  },

  setActiveIndex(index) {
    this.currentIndex = index;
    const items = this.element.querySelectorAll('.context-menu-item');
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          this.setActiveIndex(Math.max(0, this.currentIndex - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.setActiveIndex(Math.min(this.items.length - 1, this.currentIndex + 1));
          break;
        case 'Enter':
          e.preventDefault();
          this.selectItem(this.currentIndex);
          break;
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          this.close();
          break;
      }
    });
  },

  getIcon(name) {
    const icons = {
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>',
      home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
      settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
      phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
      key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
      map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>'
    };
    return icons[name] || icons.settings;
  },

  sendNUI(event, data = {}) {
    if (typeof fetch !== 'undefined') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

// ============================================
// INPUT DIALOG SYSTEM
// ============================================
const InputDialog = {
  element: null,
  isOpen: false,
  rows: [],

  init() {
    this.element = document.getElementById('input-dialog');
  },

  open(data) {
    const { title, rows } = data;
    this.rows = rows;
    
    const dialogTitle = this.element.querySelector('.input-dialog-title');
    const dialogRows = this.element.querySelector('.input-dialog-rows');
    
    dialogTitle.textContent = title || 'Input';
    dialogRows.innerHTML = '';
    
    rows.forEach((row, index) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'input-row';
      
      let inputHtml = '';
      
      switch(row.type) {
        case 'input':
        case 'text':
          inputHtml = `<input type="${row.password ? 'password' : 'text'}" 
            class="input-field" 
            placeholder="${row.placeholder || ''}" 
            ${row.default ? `value="${row.default}"` : ''}
            ${row.required ? 'required' : ''}
            data-index="${index}">`;
          break;
        case 'number':
          inputHtml = `<input type="number" 
            class="input-field" 
            placeholder="${row.placeholder || ''}" 
            ${row.default ? `value="${row.default}"` : ''}
            ${row.min !== undefined ? `min="${row.min}"` : ''}
            ${row.max !== undefined ? `max="${row.max}"` : ''}
            data-index="${index}">`;
          break;
        case 'checkbox':
          inputHtml = `<label class="checkbox-wrapper">
            <input type="checkbox" ${row.checked ? 'checked' : ''} data-index="${index}">
            <span class="checkbox-custom"></span>
          </label>`;
          break;
        case 'select':
          inputHtml = `<select class="input-field select-field" data-index="${index}">
            ${row.options.map(opt => `<option value="${opt.value}" ${opt.value === row.default ? 'selected' : ''}>${opt.label || opt.value}</option>`).join('')}
          </select>`;
          break;
        case 'slider':
          inputHtml = `<div class="slider-wrapper">
            <input type="range" 
              class="slider-field" 
              min="${row.min || 0}" 
              max="${row.max || 100}" 
              value="${row.default || 50}"
              data-index="${index}">
            <span class="slider-value">${row.default || 50}</span>
          </div>`;
          break;
        case 'color':
          inputHtml = `<input type="color" class="color-field" value="${row.default || '#c0c0c0'}" data-index="${index}">`;
          break;
        case 'date':
          inputHtml = `<input type="date" class="input-field" value="${row.default || ''}" data-index="${index}">`;
          break;
        case 'textarea':
          inputHtml = `<textarea class="input-field textarea-field" 
            placeholder="${row.placeholder || ''}"
            rows="${row.rows || 3}"
            data-index="${index}">${row.default || ''}</textarea>`;
          break;
        default:
          inputHtml = `<input type="text" class="input-field" placeholder="${row.placeholder || ''}" data-index="${index}">`;
      }
      
      rowEl.innerHTML = `
        <label class="input-label">${row.label || ''}</label>
        ${row.description ? `<p class="input-description">${row.description}</p>` : ''}
        ${inputHtml}
      `;
      
      dialogRows.appendChild(rowEl);
    });

    // Setup slider value updates
    this.element.querySelectorAll('.slider-field').forEach(slider => {
      slider.addEventListener('input', (e) => {
        e.target.nextElementSibling.textContent = e.target.value;
      });
    });
    
    this.element.classList.add('show');
    this.isOpen = true;
    
    // Focus first input
    const firstInput = this.element.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
  },

  close() {
    this.element.classList.remove('show');
    this.isOpen = false;
  },

  submit() {
    const values = [];
    const inputs = this.element.querySelectorAll('[data-index]');
    
    inputs.forEach(input => {
      const row = this.rows[input.dataset.index];
      let value;
      
      if (input.type === 'checkbox') {
        value = input.checked;
      } else if (input.type === 'number' || input.type === 'range') {
        value = parseFloat(input.value);
      } else {
        value = input.value;
      }
      
      values.push(value);
    });
    
    this.close();
    this.sendNUI('inputDialog:submit', values);
  },

  sendNUI(event, data = {}) {
    if (typeof fetch !== 'undefined' && typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

// ============================================
// PROGRESS BAR SYSTEM
// ============================================
const ProgressBar = {
  element: null,
  isActive: false,
  animationId: null,

  init() {
    this.element = document.getElementById('progress-bar');
  },

  start(data) {
    const { label, duration, useWhileDead, allowRagdoll, allowCuffed, allowSwimming, canCancel } = data;
    
    const labelEl = this.element.querySelector('.progress-label');
    const fillEl = this.element.querySelector('.progress-fill');
    const percentEl = this.element.querySelector('.progress-percent');
    
    labelEl.textContent = label || 'Loading...';
    fillEl.style.width = '0%';
    percentEl.textContent = '0%';
    
    this.element.classList.add('show');
    this.isActive = true;
    
    const startTime = Date.now();
    const animate = () => {
      if (!this.isActive) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      fillEl.style.width = `${progress}%`;
      percentEl.textContent = `${Math.round(progress)}%`;
      
      if (progress < 100) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.complete(true);
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  },

  cancel() {
    if (this.isActive) {
      this.complete(false);
    }
  },

  complete(success) {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    const fillEl = this.element.querySelector('.progress-fill');
    fillEl.classList.add(success ? 'success' : 'fail');
    
    setTimeout(() => {
      this.element.classList.remove('show');
      fillEl.classList.remove('success', 'fail');
      fillEl.style.width = '0%';
      this.isActive = false;
      
      this.sendNUI('progressBar:complete', { success });
    }, 300);
  },

  sendNUI(event, data = {}) {
    if (typeof fetch !== 'undefined' && typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

// ============================================
// CIRCLE PROGRESS SYSTEM
// ============================================
const CircleProgress = {
  element: null,
  isActive: false,

  init() {
    this.element = document.getElementById('circle-progress');
  },

  start(data) {
    const { label, duration } = data;
    
    const labelEl = this.element.querySelector('.circle-label');
    const circle = this.element.querySelector('.circle-progress-ring');
    const percentEl = this.element.querySelector('.circle-percent');
    
    labelEl.textContent = label || '';
    
    const circumference = 2 * Math.PI * 54;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    
    this.element.classList.add('show');
    this.isActive = true;
    
    const startTime = Date.now();
    const animate = () => {
      if (!this.isActive) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const offset = circumference * (1 - progress);
      
      circle.style.strokeDashoffset = offset;
      percentEl.textContent = `${Math.round(progress * 100)}%`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.complete(true);
      }
    };
    
    requestAnimationFrame(animate);
  },

  complete(success) {
    setTimeout(() => {
      this.element.classList.remove('show');
      this.isActive = false;
    }, 300);
  }
};

// ============================================
// RADIAL MENU SYSTEM
// ============================================
const RadialMenu = {
  element: null,
  isOpen: false,
  items: [],
  selectedIndex: -1,

  init() {
    this.element = document.getElementById('radial-menu');
    this.setupMouseTracking();
  },

  open(data) {
    const { items } = data;
    this.items = items;
    this.selectedIndex = -1;
    
    const itemsContainer = this.element.querySelector('.radial-items');
    itemsContainer.innerHTML = '';
    
    const angleStep = 360 / items.length;
    const radius = 120;
    
    items.forEach((item, index) => {
      const angle = (angleStep * index - 90) * (Math.PI / 180);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      const itemEl = document.createElement('div');
      itemEl.className = 'radial-item';
      itemEl.dataset.index = index;
      itemEl.style.transform = `translate(${x}px, ${y}px)`;
      
      itemEl.innerHTML = `
        <div class="radial-item-icon">${this.getIcon(item.icon)}</div>
        <div class="radial-item-label">${item.label}</div>
      `;
      
      itemEl.addEventListener('click', () => this.selectItem(index));
      itemEl.addEventListener('mouseenter', () => this.highlightItem(index));
      itemEl.addEventListener('mouseleave', () => this.highlightItem(-1));
      
      itemsContainer.appendChild(itemEl);
    });
    
    this.element.classList.add('show');
    this.isOpen = true;
  },

  close() {
    this.element.classList.remove('show');
    this.isOpen = false;
    this.sendNUI('radialMenu:close');
  },

  highlightItem(index) {
    this.selectedIndex = index;
    const items = this.element.querySelectorAll('.radial-item');
    const centerLabel = this.element.querySelector('.radial-center-label');
    
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    
    if (index >= 0 && this.items[index]) {
      centerLabel.textContent = this.items[index].label;
    } else {
      centerLabel.textContent = '';
    }
  },

  selectItem(index) {
    const item = this.items[index];
    if (item) {
      this.close();
      this.sendNUI('radialMenu:select', { id: item.id, index });
    }
  },

  setupMouseTracking() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') {
        this.close();
      }
    });
  },

  getIcon(name) {
    return ContextMenu.getIcon(name);
  },

  sendNUI(event, data = {}) {
    if (typeof fetch !== 'undefined' && typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

// ============================================
// SKILL CHECK SYSTEM
// ============================================
const SkillCheck = {
  element: null,
  isActive: false,
  difficulty: 'easy',
  keys: ['E'],
  currentZone: null,
  indicator: null,
  speed: 1,
  animationId: null,

  difficulties: {
    easy: { size: 50, speed: 0.8 },
    medium: { size: 35, speed: 1 },
    hard: { size: 25, speed: 1.3 },
    extreme: { size: 15, speed: 1.6 }
  },

  init() {
    this.element = document.getElementById('skill-check');
    this.setupKeyListener();
  },

  start(data) {
    const { difficulty = 'easy', keys = ['E'], inputs = 1 } = data;
    
    this.difficulty = difficulty;
    this.keys = Array.isArray(keys) ? keys : [keys];
    
    const config = this.difficulties[difficulty] || this.difficulties.easy;
    this.speed = config.speed;
    
    // Set key display
    const keyEl = this.element.querySelector('.skill-key');
    keyEl.textContent = this.keys[0];
    
    // Create target zone
    const zoneStart = 70 + Math.random() * 20; // Random position between 70-90%
    const zoneEl = this.element.querySelector('.skill-zone');
    zoneEl.style.left = `${zoneStart}%`;
    zoneEl.style.width = `${config.size}px`;
    
    this.currentZone = {
      start: zoneStart,
      end: zoneStart + (config.size / 3.4) // Convert px to approximate %
    };
    
    // Reset indicator
    this.indicator = this.element.querySelector('.skill-indicator');
    this.indicator.style.left = '0%';
    this.indicator.classList.remove('success', 'fail');
    
    this.element.classList.add('show');
    this.isActive = true;
    
    this.animate();
  },

  animate() {
    let position = 0;
    const speed = this.speed * 0.5;
    
    const move = () => {
      if (!this.isActive) return;
      
      position += speed;
      this.indicator.style.left = `${position}%`;
      
      if (position >= 100) {
        this.fail();
      } else {
        this.animationId = requestAnimationFrame(move);
      }
    };
    
    this.animationId = requestAnimationFrame(move);
  },

  check() {
    if (!this.isActive) return;
    
    const position = parseFloat(this.indicator.style.left);
    
    if (position >= this.currentZone.start && position <= this.currentZone.end) {
      this.success();
    } else {
      this.fail();
    }
  },

  success() {
    cancelAnimationFrame(this.animationId);
    this.indicator.classList.add('success');
    this.isActive = false;
    
    setTimeout(() => {
      this.element.classList.remove('show');
      this.sendNUI('skillCheck:complete', { success: true });
    }, 500);
  },

  fail() {
    cancelAnimationFrame(this.animationId);
    this.indicator.classList.add('fail');
    this.isActive = false;
    
    // Shake animation
    this.element.querySelector('.skill-check-container').classList.add('shake');
    
    setTimeout(() => {
      this.element.classList.remove('show');
      this.element.querySelector('.skill-check-container').classList.remove('shake');
      this.sendNUI('skillCheck:complete', { success: false });
    }, 500);
  },

  setupKeyListener() {
    document.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      
      if (this.keys.includes(e.key.toUpperCase()) || this.keys.includes(e.key)) {
        e.preventDefault();
        this.check();
      }
    });
  },

  sendNUI(event, data = {}) {
    if (typeof fetch !== 'undefined' && typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

// ============================================
// TEXT UI SYSTEM
// ============================================
const TextUI = {
  element: null,
  isVisible: false,

  init() {
    this.element = document.getElementById('text-ui');
  },

  show(data) {
    const { text, icon, position = 'right-center', style = {} } = data;
    
    const textEl = this.element.querySelector('.text-ui-text');
    const iconEl = this.element.querySelector('.text-ui-icon');
    
    textEl.innerHTML = text;
    
    if (icon) {
      iconEl.innerHTML = ContextMenu.getIcon(icon);
      iconEl.style.display = 'flex';
    } else {
      iconEl.style.display = 'none';
    }
    
    // Apply position
    this.element.className = 'text-ui';
    this.element.classList.add(`position-${position}`);
    
    // Apply custom styles
    if (style.backgroundColor) {
      this.element.style.setProperty('--text-ui-bg', style.backgroundColor);
    }
    if (style.color) {
      this.element.style.color = style.color;
    }
    
    this.element.classList.add('show');
    this.isVisible = true;
  },

  hide() {
    this.element.classList.remove('show');
    this.isVisible = false;
  }
};

// ============================================
// ALERT DIALOG SYSTEM
// ============================================
const AlertDialog = {
  element: null,
  isOpen: false,
  callback: null,

  init() {
    this.element = document.getElementById('alert-dialog');
  },

  open(data) {
    const { header, content, centered = true, cancel = true, labels = {} } = data;
    
    const headerEl = this.element.querySelector('.alert-header');
    const contentEl = this.element.querySelector('.alert-content');
    const confirmBtn = this.element.querySelector('.alert-confirm');
    const cancelBtn = this.element.querySelector('.alert-cancel');
    
    headerEl.textContent = header || 'Alert';
    contentEl.innerHTML = content || '';
    confirmBtn.textContent = labels.confirm || 'Confirm';
    cancelBtn.textContent = labels.cancel || 'Cancel';
    
    cancelBtn.style.display = cancel ? 'flex' : 'none';
    
    this.element.classList.add('show');
    this.isOpen = true;
  },

  confirm() {
    this.close();
    this.sendNUI('alertDialog:confirm', { confirmed: true });
  },

  cancel() {
    this.close();
    this.sendNUI('alertDialog:confirm', { confirmed: false });
  },

  close() {
    this.element.classList.remove('show');
    this.isOpen = false;
  },

  sendNUI(event, data = {}) {
    if (typeof fetch !== 'undefined' && typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

// ============================================
// MENU SYSTEM
// ============================================
const Menu = {
  element: null,
  isOpen: false,
  items: [],
  currentIndex: 0,
  history: [],

  init() {
    this.element = document.getElementById('menu');
    this.setupKeyboardNavigation();
  },

  open(data) {
    const { id, title, items, position = 'top-left' } = data;
    this.items = items;
    this.currentIndex = 0;
    
    const titleEl = this.element.querySelector('.menu-title');
    const itemsEl = this.element.querySelector('.menu-items');
    
    titleEl.textContent = title || 'Menu';
    itemsEl.innerHTML = '';
    
    items.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = `menu-item ${item.disabled ? 'disabled' : ''} ${index === 0 ? 'active' : ''}`;
      itemEl.dataset.index = index;
      
      let rightContent = '';
      if (item.values) {
        rightContent = `<div class="menu-item-values">
          <span class="menu-arrow-left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></span>
          <span class="menu-value">${item.values[item.defaultIndex || 0]}</span>
          <span class="menu-arrow-right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></span>
        </div>`;
      } else if (item.checked !== undefined) {
        rightContent = `<div class="menu-checkbox ${item.checked ? 'checked' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
        </div>`;
      } else if (item.progress !== undefined) {
        rightContent = `<div class="menu-progress"><div class="menu-progress-fill" style="width: ${item.progress}%"></div></div>`;
      }
      
      const iconHtml = item.icon ? `<div class="menu-item-icon">${ContextMenu.getIcon(item.icon)}</div>` : '';
      
      itemEl.innerHTML = `
        ${iconHtml}
        <div class="menu-item-content">
          <span class="menu-item-title">${item.title}</span>
          ${item.description ? `<span class="menu-item-desc">${item.description}</span>` : ''}
        </div>
        ${rightContent}
      `;
      
      itemEl.addEventListener('click', () => this.selectItem(index));
      itemEl.addEventListener('mouseenter', () => this.setActiveIndex(index));
      
      itemsEl.appendChild(itemEl);
    });
    
    // Position
    this.element.className = 'menu';
    this.element.classList.add(`position-${position}`);
    
    this.element.classList.add('show');
    this.isOpen = true;
  },

  close() {
    this.element.classList.remove('show');
    this.isOpen = false;
    this.sendNUI('menu:close');
  },

  selectItem(index) {
    const item = this.items[index];
    if (item && !item.disabled) {
      if (item.checked !== undefined) {
        item.checked = !item.checked;
        const checkbox = this.element.querySelectorAll('.menu-item')[index].querySelector('.menu-checkbox');
        checkbox.classList.toggle('checked');
      }
      this.sendNUI('menu:select', { id: item.id, index, checked: item.checked });
    }
  },

  setActiveIndex(index) {
    this.currentIndex = index;
    const items = this.element.querySelectorAll('.menu-item');
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          this.setActiveIndex(Math.max(0, this.currentIndex - 1));
          this.scrollToActive();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          this.setActiveIndex(Math.min(this.items.length - 1, this.currentIndex + 1));
          this.scrollToActive();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.changeValue(-1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.changeValue(1);
          break;
        case 'Enter':
          e.preventDefault();
          this.selectItem(this.currentIndex);
          break;
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          this.close();
          break;
      }
    });
  },

  changeValue(direction) {
    const item = this.items[this.currentIndex];
    if (item && item.values) {
      const currentIdx = item.defaultIndex || 0;
      const newIdx = Math.max(0, Math.min(item.values.length - 1, currentIdx + direction));
      item.defaultIndex = newIdx;
      
      const valueEl = this.element.querySelectorAll('.menu-item')[this.currentIndex].querySelector('.menu-value');
      valueEl.textContent = item.values[newIdx];
      
      this.sendNUI('menu:change', { id: item.id, index: this.currentIndex, value: newIdx });
    }
  },

  scrollToActive() {
    const activeItem = this.element.querySelector('.menu-item.active');
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  sendNUI(event, data = {}) {
    if (typeof fetch !== 'undefined' && typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

// ============================================
// NUI MESSAGE HANDLER
// ============================================
window.addEventListener('message', (event) => {
  const data = event.data;
  
  switch(data.action) {
    // Notifications
    case 'notify':
      NotificationManager.show(data);
      break;
    case 'hideNotification':
      NotificationManager.hide(data.id);
      break;
      
    // Context Menu
    case 'showContext':
      ContextMenu.open(data);
      break;
    case 'hideContext':
      ContextMenu.close();
      break;
      
    // Input Dialog
    case 'openInput':
      InputDialog.open(data);
      break;
    case 'closeInput':
      InputDialog.close();
      break;
      
    // Progress Bar
    case 'progress':
      if (data.duration) {
        ProgressBar.start(data);
      } else {
        ProgressBar.cancel();
      }
      break;
    case 'progressCancel':
      ProgressBar.cancel();
      break;
      
    // Circle Progress
    case 'circleProgress':
      CircleProgress.start(data);
      break;
      
    // Radial Menu
    case 'openRadial':
      RadialMenu.open(data);
      break;
    case 'closeRadial':
      RadialMenu.close();
      break;
      
    // Skill Check
    case 'skillCheck':
      SkillCheck.start(data);
      break;
      
    // Text UI
    case 'textUi':
      TextUI.show(data);
      break;
    case 'hideTextUi':
      TextUI.hide();
      break;
      
    // Alert Dialog
    case 'alertDialog':
      AlertDialog.open(data);
      break;
    case 'closeAlertDialog':
      AlertDialog.close();
      break;
      
    // Menu
    case 'openMenu':
      Menu.open(data);
      break;
    case 'closeMenu':
      Menu.close();
      break;
  }
});

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  NotificationManager.init();
  ContextMenu.init();
  InputDialog.init();
  ProgressBar.init();
  CircleProgress.init();
  RadialMenu.init();
  SkillCheck.init();
  TextUI.init();
  AlertDialog.init();
  Menu.init();
});

// Helper function for FiveM
function GetParentResourceName() {
  return window.GetParentResourceName ? window.GetParentResourceName() : 'ox_lib';
}
