/**
 * ox_lib Liquid Glass UI - JavaScript Controller
 * iOS 26 Inspired Design for FiveM
 * Compatible with ox_lib NUI callbacks
 */

// ============================================
// ICON LIBRARY
// ============================================
const Icons = {
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
  receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>',
  error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 18L18 6M6 6l12 12"/></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 16h-1v-4h-1m1-4h.01"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>',
  door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
  hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"/></svg>',
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>',
  bike: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707"/></svg>',
};

// ============================================
// NOTIFICATION SYSTEM
// ============================================
const NotificationManager = {
  container: null,

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
    const { id, type = 'info', title, message, description, duration = 4000 } = data;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.dataset.id = id || Date.now();
    
    const iconHtml = Icons[type] || Icons.info;

    notification.innerHTML = `
      <div class="notification-icon">${iconHtml}</div>
      <div class="notification-content">
        <span class="notification-title">${title || message || description || ''}</span>
      </div>
    `;

    this.container.appendChild(notification);

    // Auto remove
    setTimeout(() => this.hide(notification.dataset.id), duration);
    
    return notification.dataset.id;
  },

  hide(id) {
    const notification = this.container.querySelector(`[data-id="${id}"]`);
    if (notification) {
      notification.classList.add('exiting');
      setTimeout(() => notification.remove(), 400);
    }
  }
};

// ============================================
// CONTEXT MENU SYSTEM
// ============================================
const ContextMenu = {
  element: null,
  itemsContainer: null,
  isOpen: false,
  currentIndex: 0,
  items: [],

  init() {
    this.element = document.getElementById('context-menu');
    this.itemsContainer = document.getElementById('context-items');
    this.setupKeyboardNavigation();
  },

  open(data) {
    const { title = 'Quick Actions', items = [], canClose = true } = data;
    this.items = items;
    this.currentIndex = 0;
    
    document.getElementById('context-title').textContent = title;
    this.itemsContainer.innerHTML = '';
    
    items.forEach((item, index) => {
      if (item.type === 'divider') {
        const divider = document.createElement('div');
        divider.className = 'context-divider';
        this.itemsContainer.appendChild(divider);
        return;
      }

      const itemEl = document.createElement('div');
      itemEl.className = `context-item ${item.disabled ? 'disabled' : ''} ${item.danger ? 'danger' : ''}`;
      itemEl.dataset.index = index;
      
      const iconHtml = item.icon ? `<div class="context-item-icon">${Icons[item.icon] || Icons.settings}</div>` : '';
      const keybindHtml = item.keybind ? `<span class="context-item-keybind">${item.keybind}</span>` : '';
      const arrowHtml = item.hasSubmenu ? `<span class="context-item-arrow">${Icons.arrow}</span>` : '';
      
      itemEl.innerHTML = `
        ${iconHtml}
        <span class="context-item-label">${item.label || item.title}</span>
        ${keybindHtml}
        ${arrowHtml}
      `;
      
      itemEl.addEventListener('click', () => this.selectItem(index));
      this.itemsContainer.appendChild(itemEl);
    });
    
    this.element.classList.remove('hidden');
    this.isOpen = true;
  },

  close() {
    this.element.classList.add('hidden');
    this.isOpen = false;
    this.sendNUI('contextMenu:close');
  },

  selectItem(index) {
    const item = this.items[index];
    if (item && !item.disabled && item.type !== 'divider') {
      if (item.menu) {
        this.open({ title: item.label, items: item.menu });
      } else {
        this.close();
        this.sendNUI('contextMenu:select', { id: item.id, index });
      }
    }
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      const selectableItems = this.items.filter(i => i.type !== 'divider');
      
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          this.currentIndex = Math.max(0, this.currentIndex - 1);
          this.highlightItem();
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.currentIndex = Math.min(selectableItems.length - 1, this.currentIndex + 1);
          this.highlightItem();
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

  highlightItem() {
    const items = this.itemsContainer.querySelectorAll('.context-item:not(.disabled)');
    items.forEach((item, i) => {
      item.style.background = i === this.currentIndex ? 'rgba(192, 192, 192, 0.1)' : '';
    });
  },

  sendNUI(event, data = {}) {
    if (typeof GetParentResourceName === 'function') {
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
  fieldsContainer: null,
  isOpen: false,
  rows: [],

  init() {
    this.element = document.getElementById('input-dialog');
    this.fieldsContainer = document.getElementById('input-fields');
  },

  open(data) {
    const { title = 'Input', subtitle = 'Enter details', rows = [] } = data;
    this.rows = rows;
    
    document.getElementById('input-title').textContent = title;
    document.getElementById('input-subtitle').textContent = subtitle;
    this.fieldsContainer.innerHTML = '';
    
    rows.forEach((row, index) => {
      const group = document.createElement('div');
      group.className = 'input-group';
      
      let inputHtml = '';
      
      switch(row.type) {
        case 'input':
        case 'text':
          inputHtml = `
            <label class="input-label">${row.label || ''}</label>
            <input type="${row.password ? 'password' : 'text'}" 
              class="input-field" 
              placeholder="${row.placeholder || ''}" 
              value="${row.default || ''}"
              data-index="${index}">
          `;
          break;
        case 'number':
          inputHtml = `
            <label class="input-label">${row.label || ''}</label>
            <input type="number" 
              class="input-field" 
              placeholder="${row.placeholder || ''}" 
              value="${row.default || ''}"
              ${row.min !== undefined ? `min="${row.min}"` : ''}
              ${row.max !== undefined ? `max="${row.max}"` : ''}
              data-index="${index}">
          `;
          break;
        case 'textarea':
          inputHtml = `
            <label class="input-label">${row.label || ''}</label>
            <textarea class="input-field" 
              placeholder="${row.placeholder || ''}"
              rows="${row.rows || 3}"
              data-index="${index}">${row.default || ''}</textarea>
          `;
          break;
        case 'select':
          const options = (row.options || []).map(opt => 
            `<option value="${opt.value}" ${opt.value === row.default ? 'selected' : ''}>${opt.label || opt.value}</option>`
          ).join('');
          inputHtml = `
            <label class="input-label">${row.label || ''}</label>
            <select class="input-field" data-index="${index}">${options}</select>
          `;
          break;
        case 'checkbox':
        case 'toggle':
          inputHtml = `
            <div class="toggle-group">
              <div class="toggle-info">
                <h4>${row.label || ''}</h4>
                ${row.description ? `<p>${row.description}</p>` : ''}
              </div>
              <div class="toggle-switch ${row.checked || row.default ? 'active' : ''}" data-index="${index}" onclick="InputDialog.toggleSwitch(this)">
                <div class="toggle-switch-handle"></div>
              </div>
            </div>
          `;
          break;
        case 'color':
          const colors = row.colors || [
            { id: 'black', color: '#1a1a1a' },
            { id: 'white', color: '#f5f5f5' },
            { id: 'red', color: '#ef4444' },
            { id: 'blue', color: '#3b82f6' },
            { id: 'silver', color: '#c0c0c0' },
          ];
          const colorButtons = colors.map(c => 
            `<button type="button" class="color-option ${c.id === row.default ? 'selected' : ''}" 
              style="background: ${c.color}; box-shadow: ${c.id === row.default ? `0 4px 12px ${c.color}40` : 'none'};"
              data-value="${c.id}"
              onclick="InputDialog.selectColor(this, ${index})"></button>`
          ).join('');
          inputHtml = `
            <label class="input-label">${row.label || ''}</label>
            <div class="color-selector" data-index="${index}">${colorButtons}</div>
          `;
          break;
        default:
          inputHtml = `
            <label class="input-label">${row.label || ''}</label>
            <input type="text" class="input-field" placeholder="${row.placeholder || ''}" data-index="${index}">
          `;
      }
      
      group.innerHTML = inputHtml;
      this.fieldsContainer.appendChild(group);
    });
    
    this.element.classList.remove('hidden');
    this.isOpen = true;
    
    // Focus first input
    const firstInput = this.fieldsContainer.querySelector('input, select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  },

  toggleSwitch(el) {
    el.classList.toggle('active');
  },

  selectColor(el, index) {
    const container = el.parentElement;
    container.querySelectorAll('.color-option').forEach(opt => {
      opt.classList.remove('selected');
      opt.style.boxShadow = 'none';
    });
    el.classList.add('selected');
    el.style.boxShadow = `0 4px 12px ${el.style.backgroundColor}40`;
  },

  close() {
    this.element.classList.add('hidden');
    this.isOpen = false;
  },

  submit() {
    const values = [];
    
    this.rows.forEach((row, index) => {
      let value;
      
      if (row.type === 'checkbox' || row.type === 'toggle') {
        const toggle = this.fieldsContainer.querySelector(`[data-index="${index}"].toggle-switch`);
        value = toggle ? toggle.classList.contains('active') : false;
      } else if (row.type === 'color') {
        const selected = this.fieldsContainer.querySelector(`[data-index="${index}"] .color-option.selected`);
        value = selected ? selected.dataset.value : row.default;
      } else {
        const input = this.fieldsContainer.querySelector(`[data-index="${index}"]`);
        if (input) {
          if (input.type === 'number') {
            value = parseFloat(input.value) || 0;
          } else {
            value = input.value;
          }
        }
      }
      
      values.push(value);
    });
    
    this.close();
    this.sendNUI('inputDialog:submit', values);
  },

  sendNUI(event, data = {}) {
    if (typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

// Global functions for onclick handlers
function closeInputDialog() { InputDialog.close(); }
function submitInputDialog() { InputDialog.submit(); }

// ============================================
// PROGRESS BAR SYSTEM
// ============================================
const ProgressBar = {
  element: null,
  isActive: false,
  animationId: null,
  startTime: null,
  duration: 0,

  init() {
    this.element = document.getElementById('progress-container');
  },

  start(data) {
    const { label, duration = 5000, subtitle = 'Please wait' } = data;
    this.duration = duration;
    
    document.getElementById('progress-title').textContent = label || 'Processing...';
    document.getElementById('progress-subtitle').textContent = subtitle;
    document.getElementById('progress-percent').textContent = '0%';
    
    const fillEl = document.getElementById('progress-fill');
    const iconEl = document.getElementById('progress-icon');
    
    fillEl.style.width = '0%';
    fillEl.classList.remove('success');
    iconEl.classList.remove('success');
    iconEl.innerHTML = `<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
    </svg>`;
    
    this.element.classList.remove('hidden');
    this.isActive = true;
    this.startTime = Date.now();
    
    this.animate();
  },

  animate() {
    if (!this.isActive) return;
    
    const elapsed = Date.now() - this.startTime;
    const progress = Math.min((elapsed / this.duration) * 100, 100);
    
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-percent').textContent = `${Math.round(progress)}%`;
    
    if (progress < 100) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.complete(true);
    }
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
    
    const fillEl = document.getElementById('progress-fill');
    const iconEl = document.getElementById('progress-icon');
    const titleEl = document.getElementById('progress-title');
    const subtitleEl = document.getElementById('progress-subtitle');
    
    if (success) {
      fillEl.classList.add('success');
      iconEl.classList.add('success');
      iconEl.innerHTML = Icons.success;
      titleEl.textContent = 'Completed!';
      subtitleEl.textContent = 'Transaction successful';
      document.getElementById('progress-percent').textContent = '100%';
    }
    
    setTimeout(() => {
      this.element.classList.add('hidden');
      this.isActive = false;
      this.sendNUI('progressBar:complete', { success });
    }, success ? 1000 : 300);
  },

  sendNUI(event, data = {}) {
    if (typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

// ============================================
// ALERT DIALOG SYSTEM
// ============================================
const AlertDialog = {
  element: null,
  isOpen: false,

  init() {
    this.element = document.getElementById('alert-dialog');
    this.setupKeyboard();
  },

  open(data) {
    const { header, title, content, message, labels = {} } = data;
    
    document.getElementById('alert-title').textContent = header || title || 'Confirm Action';
    document.getElementById('alert-message').textContent = content || message || 'Are you sure you want to proceed?';
    document.getElementById('alert-confirm').textContent = labels.confirm || 'Confirm';
    
    this.element.classList.remove('hidden');
    this.isOpen = true;
  },

  close() {
    this.element.classList.add('hidden');
    this.isOpen = false;
  },

  confirm() {
    this.close();
    this.sendNUI('alertDialog:confirm', { confirmed: true });
  },

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'Enter') {
        this.confirm();
      }
    });
  },

  sendNUI(event, data = {}) {
    if (typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

function closeAlertDialog() { AlertDialog.close(); }
function confirmAlert() { AlertDialog.confirm(); }

// ============================================
// MENU SYSTEM
// ============================================
const Menu = {
  element: null,
  itemsContainer: null,
  detailsPanel: null,
  isOpen: false,
  items: [],
  currentIndex: 0,
  selectedId: null,

  init() {
    this.element = document.getElementById('menu-container');
    this.itemsContainer = document.getElementById('menu-items');
    this.detailsPanel = document.getElementById('menu-details');
    this.setupKeyboardNavigation();
  },

  open(data) {
    const { title = 'Menu', subtitle = '', items = [] } = data;
    this.items = items;
    this.currentIndex = 0;
    this.selectedId = items[0]?.id || null;
    
    document.getElementById('menu-title').textContent = title;
    document.getElementById('menu-subtitle').textContent = subtitle;
    document.getElementById('menu-count').textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'}`;
    
    this.renderItems();
    this.updateDetails();
    
    this.element.classList.remove('hidden');
    this.isOpen = true;
  },

  renderItems(filter = '') {
    this.itemsContainer.innerHTML = '';
    
    const filteredItems = filter 
      ? this.items.filter(i => i.label.toLowerCase().includes(filter.toLowerCase()))
      : this.items;
    
    filteredItems.forEach((item, index) => {
      const isSelected = item.id === this.selectedId;
      const itemEl = document.createElement('div');
      itemEl.className = `menu-item ${isSelected ? 'selected' : ''} ${item.disabled ? 'disabled' : ''}`;
      itemEl.dataset.id = item.id;
      itemEl.dataset.index = index;
      
      const iconHtml = `<div class="menu-item-icon">${Icons[item.icon] || Icons.car}</div>`;
      
      itemEl.innerHTML = `
        ${iconHtml}
        <div class="menu-item-content">
          <span class="menu-item-label">${item.label}</span>
          ${item.description ? `<span class="menu-item-desc">${item.description}</span>` : ''}
        </div>
        <span class="menu-item-arrow">${Icons.arrow}</span>
      `;
      
      itemEl.addEventListener('click', () => {
        if (!item.disabled) {
          this.selectItem(item.id);
        }
      });
      
      itemEl.addEventListener('mouseenter', () => {
        if (!item.disabled) {
          this.hoverItem(item.id);
        }
      });
      
      this.itemsContainer.appendChild(itemEl);
    });
    
    document.getElementById('menu-count').textContent = `${filteredItems.length} ${filteredItems.length === 1 ? 'vehicle' : 'vehicles'}`;
  },

  selectItem(id) {
    this.selectedId = id;
    this.updateSelection();
    this.updateDetails();
  },

  hoverItem(id) {
    this.selectedId = id;
    this.updateSelection();
    this.updateDetails();
  },

  updateSelection() {
    const items = this.itemsContainer.querySelectorAll('.menu-item');
    items.forEach(item => {
      item.classList.toggle('selected', item.dataset.id === this.selectedId);
    });
  },

  updateDetails() {
    const item = this.items.find(i => i.id === this.selectedId);
    if (!item) {
      this.detailsPanel.classList.add('hidden');
      return;
    }
    
    this.detailsPanel.classList.remove('hidden');
    document.getElementById('details-title').textContent = item.label;
    document.getElementById('details-description').textContent = item.description || '';
    
    if (item.metadata) {
      document.getElementById('stat-speed').textContent = item.metadata.speed || '0%';
      document.getElementById('stat-speed-bar').style.width = item.metadata.speed || '0%';
      document.getElementById('stat-handling').textContent = item.metadata.handling || '0%';
      document.getElementById('stat-handling-bar').style.width = item.metadata.handling || '0%';
    }
  },

  close() {
    this.element.classList.add('hidden');
    this.isOpen = false;
    this.sendNUI('menu:close');
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      const selectableItems = this.items.filter(i => !i.disabled);
      const currentIdx = selectableItems.findIndex(i => i.id === this.selectedId);
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          if (currentIdx > 0) {
            this.selectItem(selectableItems[currentIdx - 1].id);
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          if (currentIdx < selectableItems.length - 1) {
            this.selectItem(selectableItems[currentIdx + 1].id);
          }
          break;
        case 'Enter':
          e.preventDefault();
          this.spawnVehicle();
          break;
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          this.close();
          break;
      }
    });
  },

  spawnVehicle() {
    if (this.selectedId) {
      this.close();
      this.sendNUI('menu:select', { id: this.selectedId });
    }
  },

  sendNUI(event, data = {}) {
    if (typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

function closeMenu() { Menu.close(); }
function filterMenuItems() {
  const filter = document.getElementById('menu-search-input').value;
  Menu.renderItems(filter);
}
function spawnVehicle() { Menu.spawnVehicle(); }

// ============================================
// TEXT UI SYSTEM
// ============================================
const TextUI = {
  rightContainer: null,
  leftContainer: null,
  activeItems: new Map(),

  init() {
    this.rightContainer = document.getElementById('textui-right');
    this.leftContainer = document.getElementById('textui-left');
  },

  show(data) {
    const { id = Date.now(), text, icon, position = 'right', active = false } = data;
    
    const container = position === 'left' ? this.leftContainer : this.rightContainer;
    
    // Remove existing if same id
    this.hide(id);
    
    const badge = document.createElement('div');
    badge.className = `textui-badge ${position === 'left' ? 'left' : ''} ${active ? 'active' : ''}`;
    badge.dataset.id = id;
    
    const iconHtml = icon ? `<div class="textui-icon">${Icons[icon] || Icons.info}</div>` : '';
    
    // Parse text to highlight keybinds [X]
    const formattedText = text.replace(/\[([^\]]+)\]/g, '<kbd>$1</kbd>');
    
    badge.innerHTML = `
      ${iconHtml}
      <span class="textui-text">${formattedText}</span>
    `;
    
    container.appendChild(badge);
    this.activeItems.set(id, badge);
    
    return id;
  },

  hide(id) {
    const badge = this.activeItems.get(id);
    if (badge) {
      badge.remove();
      this.activeItems.delete(id);
    }
  },

  setActive(id, active) {
    const badge = this.activeItems.get(id);
    if (badge) {
      badge.classList.toggle('active', active);
    }
  },

  hideAll() {
    this.activeItems.forEach((badge, id) => {
      badge.remove();
    });
    this.activeItems.clear();
  }
};

// ============================================
// SKILL CHECK SYSTEM
// ============================================
const SkillCheck = {
  element: null,
  isActive: false,
  angle: 0,
  speed: 4,
  targetStart: 70,
  targetEnd: 110,
  perfectStart: 85,
  perfectEnd: 95,
  animationId: null,
  result: null,

  init() {
    this.element = document.getElementById('skillcheck-container');
    this.setupKeyListener();
  },

  start(data = {}) {
    const { difficulty = 'easy' } = data;
    
    // Difficulty settings
    const difficulties = {
      easy: { speed: 3, targetSize: 40, perfectSize: 10 },
      medium: { speed: 4, targetSize: 30, perfectSize: 8 },
      hard: { speed: 5, targetSize: 25, perfectSize: 6 },
      extreme: { speed: 6, targetSize: 20, perfectSize: 4 }
    };
    
    const config = difficulties[difficulty] || difficulties.easy;
    this.speed = config.speed;
    
    // Random target position
    this.targetStart = 60 + Math.random() * 40;
    this.targetEnd = this.targetStart + config.targetSize;
    this.perfectStart = this.targetStart + (config.targetSize - config.perfectSize) / 2;
    this.perfectEnd = this.perfectStart + config.perfectSize;
    
    // Draw arcs
    this.drawArc('skillcheck-target', this.targetStart, this.targetEnd);
    this.drawArc('skillcheck-perfect', this.perfectStart, this.perfectEnd);
    
    // Reset
    this.angle = 0;
    this.result = null;
    this.updateIndicator();
    
    document.getElementById('skillcheck-glow').className = 'skillcheck-glow';
    document.getElementById('skillcheck-center').className = 'skillcheck-center';
    document.getElementById('skillcheck-text').textContent = 'Press SPACE';
    document.getElementById('skillcheck-center').querySelector('svg').innerHTML = Icons.key.replace(/<svg[^>]*>|<\/svg>/g, '');
    
    this.element.classList.remove('hidden');
    this.isActive = true;
    
    this.animate();
  },

  drawArc(id, startAngle, endAngle) {
    const path = document.getElementById(id);
    const cx = 100, cy = 100, r = 85;
    
    const start = this.polarToCartesian(cx, cy, r, endAngle);
    const end = this.polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
    
    path.setAttribute('d', `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`);
  },

  polarToCartesian(cx, cy, r, angle) {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  },

  animate() {
    if (!this.isActive || this.result) return;
    
    this.angle += this.speed;
    if (this.angle >= 360) this.angle = 0;
    
    this.updateIndicator();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  },

  updateIndicator() {
    const indicator = document.getElementById('skillcheck-indicator');
    indicator.style.transform = `rotate(${this.angle}deg)`;
    indicator.style.transformOrigin = '100px 100px';
    
    // Update indicator color based on position
    const inner = document.getElementById('indicator-inner');
    const isPerfect = this.angle >= this.perfectStart && this.angle <= this.perfectEnd;
    const isTarget = this.angle >= this.targetStart && this.angle <= this.targetEnd;
    
    if (isPerfect) {
      inner.setAttribute('fill', '#ffffff');
    } else if (isTarget) {
      inner.setAttribute('fill', '#c0c0c0');
    } else {
      inner.setAttribute('fill', '#a0a0a0');
    }
  },

  check() {
    if (!this.isActive || this.result) return;
    
    cancelAnimationFrame(this.animationId);
    
    const isPerfect = this.angle >= this.perfectStart && this.angle <= this.perfectEnd;
    const isTarget = this.angle >= this.targetStart && this.angle <= this.targetEnd;
    
    if (isPerfect || isTarget) {
      this.success();
    } else {
      this.fail();
    }
  },

  success() {
    this.result = 'success';
    
    document.getElementById('skillcheck-glow').className = 'skillcheck-glow success';
    document.getElementById('skillcheck-center').className = 'skillcheck-center success';
    document.getElementById('skillcheck-text').textContent = 'SUCCESS';
    document.getElementById('skillcheck-center').querySelector('svg').innerHTML = Icons.success.replace(/<svg[^>]*>|<\/svg>/g, '');
    document.getElementById('indicator-inner').setAttribute('fill', '#e2e8f0');
    
    setTimeout(() => this.close(true), 1500);
  },

  fail() {
    this.result = 'fail';
    
    document.getElementById('skillcheck-glow').className = 'skillcheck-glow fail';
    document.getElementById('skillcheck-center').className = 'skillcheck-center fail';
    document.getElementById('skillcheck-text').textContent = 'FAILED';
    document.getElementById('skillcheck-center').querySelector('svg').innerHTML = Icons.error.replace(/<svg[^>]*>|<\/svg>/g, '');
    document.getElementById('indicator-inner').setAttribute('fill', '#ef4444');
    
    setTimeout(() => this.close(false), 1500);
  },

  close(success) {
    this.element.classList.add('hidden');
    this.isActive = false;
    this.sendNUI('skillCheck:complete', { success });
  },

  setupKeyListener() {
    document.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.check();
      }
    });
  },

  sendNUI(event, data = {}) {
    if (typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  }
};

// ============================================
// RADIAL MENU SYSTEM
// ============================================
const RadialMenu = {
  element: null,
  itemsContainer: null,
  isOpen: false,
  items: [],

  init() {
    this.element = document.getElementById('radial-menu');
    this.itemsContainer = document.getElementById('radial-items');
    this.setupKeyboard();
  },

  open(data) {
    const { items = [] } = data;
    this.items = items;
    
    this.itemsContainer.innerHTML = '';
    
    const angleStep = 360 / items.length;
    const radius = 90;
    const centerX = 140;
    const centerY = 140;
    
    items.forEach((item, index) => {
      const angle = (angleStep * index - 90) * (Math.PI / 180);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const itemEl = document.createElement('div');
      itemEl.className = 'radial-item';
      itemEl.style.left = `${x}px`;
      itemEl.style.top = `${y}px`;
      itemEl.innerHTML = Icons[item.icon] || Icons.settings;
      
      itemEl.addEventListener('click', () => this.selectItem(index));
      itemEl.addEventListener('mouseenter', () => {
        document.getElementById('radial-label').textContent = item.label || '';
      });
      itemEl.addEventListener('mouseleave', () => {
        document.getElementById('radial-label').textContent = 'Select';
      });
      
      this.itemsContainer.appendChild(itemEl);
    });
    
    this.element.classList.remove('hidden');
    this.isOpen = true;
  },

  selectItem(index) {
    const item = this.items[index];
    if (item) {
      this.close();
      this.sendNUI('radialMenu:select', { id: item.id, index });
    }
  },

  close() {
    this.element.classList.add('hidden');
    this.isOpen = false;
  },

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') {
        this.close();
      }
    });
  },

  sendNUI(event, data = {}) {
    if (typeof GetParentResourceName === 'function') {
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
      
    // Skill Check
    case 'skillCheck':
      SkillCheck.start(data);
      break;
      
    // Text UI
    case 'textUi':
      TextUI.show(data);
      break;
    case 'hideTextUi':
      TextUI.hide(data.id);
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
      
    // Radial Menu
    case 'openRadial':
      RadialMenu.open(data);
      break;
    case 'closeRadial':
      RadialMenu.close();
      break;
  }
});

// ============================================
// DEMO FUNCTIONS (For testing - remove in production)
// ============================================
function showNotificationDemo() {
  const types = ['error', 'error', 'warning', 'success', 'info'];
  const messages = [
    "You don't have the appropriate items",
    "You don't have the appropriate items",
    "Police are being notified",
    "Vehicle has been stored in garage",
    "Press E to interact"
  ];
  
  types.forEach((type, i) => {
    setTimeout(() => {
      NotificationManager.show({
        type,
        title: messages[i]
      });
    }, i * 600);
  });
}

function showContextDemo() {
  ContextMenu.open({
    title: 'Quick Actions',
    items: [
      { id: 'vehicle', label: 'Vehicle Options', icon: 'car', hasSubmenu: true },
      { id: 'inventory', label: 'Open Inventory', icon: 'bag', keybind: 'TAB' },
      { id: 'phone', label: 'Phone', icon: 'phone', keybind: 'F1' },
      { type: 'divider' },
      { id: 'job', label: 'Job Menu', icon: 'briefcase', hasSubmenu: true },
      { id: 'billing', label: 'Send Bill', icon: 'receipt' },
      { type: 'divider' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
      { id: 'logout', label: 'Disconnect', icon: 'logout', danger: true },
    ]
  });
}

function showInputDemo() {
  InputDialog.open({
    title: 'Sell Vehicle',
    subtitle: 'Enter vehicle details',
    rows: [
      { type: 'text', label: 'Vehicle Name', placeholder: 'e.g., Lamborghini Aventador' },
      { type: 'text', label: 'Plate', placeholder: 'ABC 123' },
      { type: 'number', label: 'Price', placeholder: '0' },
      { type: 'color', label: 'Color', default: 'black' },
      { type: 'textarea', label: 'Description', placeholder: 'Additional details...' },
      { type: 'toggle', label: 'Private Listing', description: 'Only visible to nearby players' }
    ]
  });
}

function showProgressDemo() {
  ProgressBar.start({
    label: 'Repairing Vehicle',
    subtitle: 'Please wait',
    duration: 5000
  });
}

function showSkillCheckDemo() {
  SkillCheck.start({ difficulty: 'medium' });
}

function showTextUIDemo() {
  TextUI.hideAll();
  
  setTimeout(() => {
    TextUI.show({ id: 'demo1', text: '[E] Open', icon: 'door', position: 'right' });
  }, 100);
  
  setTimeout(() => {
    TextUI.show({ id: 'demo2', text: '[G] Pick up', icon: 'hand', position: 'right' });
  }, 700);
  
  setTimeout(() => {
    TextUI.show({ id: 'demo3', text: '[F] Enter', icon: 'car', position: 'left' });
  }, 1300);
  
  // Cycle active state
  let currentActive = 0;
  const ids = ['demo1', 'demo2', 'demo3'];
  
  setInterval(() => {
    ids.forEach((id, i) => TextUI.setActive(id, i === currentActive));
    currentActive = (currentActive + 1) % ids.length;
  }, 2000);
}

function showAlertDemo() {
  AlertDialog.open({
    header: 'Confirm Action',
    content: 'Are you sure you want to sell this vehicle? This action cannot be undone and the vehicle will be permanently removed from your garage.',
    labels: { confirm: 'Confirm Sell' }
  });
}

function showMenuDemo() {
  Menu.open({
    title: 'Garage Menu',
    subtitle: 'Legion Square Garage',
    items: [
      { id: 'car1', label: 'Lamborghini Aventador', description: 'Plate: ABC 123', icon: 'car', metadata: { speed: '95%', handling: '88%' } },
      { id: 'car2', label: 'Mercedes-AMG GT', description: 'Plate: XYZ 789', icon: 'car', metadata: { speed: '87%', handling: '92%' } },
      { id: 'car3', label: 'Porsche 911 GT3', description: 'Plate: DEF 456', icon: 'car', metadata: { speed: '91%', handling: '94%' } },
      { id: 'bike1', label: 'Ducati Panigale V4', description: 'Plate: MOT 001', icon: 'bike', metadata: { speed: '89%', handling: '78%' } },
      { id: 'car4', label: 'BMW M4 Competition', description: 'Plate: BMW 420', icon: 'car', metadata: { speed: '85%', handling: '90%' }, disabled: true },
    ]
  });
}

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  NotificationManager.init();
  ContextMenu.init();
  InputDialog.init();
  ProgressBar.init();
  AlertDialog.init();
  Menu.init();
  TextUI.init();
  SkillCheck.init();
  RadialMenu.init();
});

// Helper function for FiveM
function GetParentResourceName() {
  return window.GetParentResourceName ? window.GetParentResourceName() : 'ox_lib';
}
