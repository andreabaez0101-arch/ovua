/* ========================================
   dopa - radio script
   JavaScript for FiveM Server
   ======================================== */

const Radio = {
  isOpen: false,
  isTalking: false,
  isMuted: false,
  currentChannel: 1,
  volume: 75,
  members: [],
  channelNames: {
    1: 'Canal Principal',
    2: 'Policia',
    3: 'EMS',
    4: 'Mecanicos',
    5: 'Taxi',
    6: 'Privado'
  },

  // Initialize
  init() {
    this.container = document.getElementById('radio-container');
    this.usersOverlay = document.getElementById('users-list-overlay');
    this.channelDisplay = document.getElementById('channel-number');
    this.channelNameDisplay = document.getElementById('channel-name');
    this.channelInput = document.getElementById('channel-input');
    this.volumeSlider = document.getElementById('volume-slider');
    this.volumeValue = document.getElementById('volume-value');
    this.volumeFill = document.getElementById('volume-fill');
    this.talkBtn = document.getElementById('talk-btn');
    this.muteBtn = document.getElementById('mute-btn');
    this.muteIcon = document.getElementById('mute-icon');
    this.muteText = document.getElementById('mute-text');

    this.setupKeyboardShortcuts();
    this.updateDisplay();
  },

  // Open radio
  open(data = {}) {
    if (data.channel) {
      this.currentChannel = data.channel;
    }
    if (data.members) {
      this.members = data.members;
      this.renderUsersOverlay();
    }
    
    this.container.classList.remove('hidden');
    this.isOpen = true;
    this.updateDisplay();
  },

  // Close radio
  close() {
    this.container.classList.add('hidden');
    this.isOpen = false;
    this.sendNUI('radio:close');
  },

  // Toggle radio
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  // Show members panel (placeholder)
  showMembers() {
    console.log('Show members panel');
  },

  // Show settings panel (placeholder)
  showSettings() {
    console.log('Show settings panel');
  },

  // Change channel
  changeChannel(direction) {
    let newChannel = this.currentChannel + direction;
    if (newChannel < 1) newChannel = 999;
    if (newChannel > 999) newChannel = 1;
    
    this.setChannel(newChannel);
  },

  // Set specific channel
  setChannel(channel) {
    this.currentChannel = channel;
    this.updateDisplay();
    this.updateQuickButtons();
    this.sendNUI('radio:setChannel', { channel: this.currentChannel });
  },

  // Handle channel input
  handleChannelInput(event) {
    if (event.key === 'Enter') {
      const value = parseInt(this.channelInput.value);
      if (value >= 1 && value <= 999) {
        this.setChannel(value);
        this.channelInput.value = '';
        this.channelInput.blur();
      }
    }
  },

  // Quick channel selection
  quickChannel(slot) {
    this.setChannel(slot);
  },

  // Update display
  updateDisplay() {
    const channelStr = String(this.currentChannel).padStart(3, '0');
    this.channelDisplay.textContent = channelStr;
    this.channelNameDisplay.textContent = this.channelNames[this.currentChannel] || `Canal ${this.currentChannel}`;
  },

  // Update quick buttons
  updateQuickButtons() {
    const buttons = document.querySelectorAll('.quick-btn');
    buttons.forEach((btn, index) => {
      btn.classList.toggle('active', (index + 1) === this.currentChannel);
    });
  },

  // Set volume
  setVolume(value) {
    this.volume = parseInt(value);
    this.volumeValue.textContent = `${this.volume}%`;
    this.volumeFill.style.width = `${this.volume}%`;
    this.sendNUI('radio:setVolume', { volume: this.volume });
  },

  // Start talking
  startTalk() {
    if (this.isMuted) return;
    
    this.isTalking = true;
    this.talkBtn.classList.add('talking');
    this.sendNUI('radio:startTalk');
  },

  // End talking
  endTalk() {
    this.isTalking = false;
    this.talkBtn.classList.remove('talking');
    this.sendNUI('radio:endTalk');
  },

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.muteBtn.classList.add('muted');
      this.muteIcon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
      this.muteText.textContent = 'Silenciado';
    } else {
      this.muteBtn.classList.remove('muted');
      this.muteIcon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>';
      this.muteText.textContent = 'Silenciar';
    }
    
    this.sendNUI('radio:toggleMute', { muted: this.isMuted });
  },

  // Disconnect from radio
  disconnect() {
    this.close();
    this.sendNUI('radio:disconnect');
  },

  // Render users overlay (transparent list always visible)
  renderUsersOverlay() {
    this.usersOverlay.innerHTML = '';
    
    this.members.forEach(member => {
      const item = document.createElement('div');
      item.className = `user-item${member.isLeader ? ' leader' : ''}${member.talking ? ' talking' : ''}`;
      
      let html = '';
      
      // Leader icon
      if (member.isLeader) {
        html += `<svg class="leader-icon" viewBox="0 0 24 24" fill="currentColor" style="color: ${member.color || '#FFD700'};">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>`;
      }
      
      // Name
      const nameColor = member.isLeader ? (member.color || '#FFD700') : 'rgba(255, 255, 255, 0.85)';
      html += `<span class="user-name" style="color: ${nameColor};">${member.name}</span>`;
      
      // Audio indicator
      html += `<div class="audio-indicator${member.talking ? '' : ' hidden'}">
        <span></span><span></span><span></span>
      </div>`;
      
      item.innerHTML = html;
      this.usersOverlay.appendChild(item);
    });
  },

  // Update member talking status
  setMemberTalking(memberId, isTalking) {
    const member = this.members.find(m => m.id === memberId);
    if (member) {
      member.talking = isTalking;
      this.renderUsersOverlay();
    }
  },

  // Add member to channel
  addMember(member) {
    this.members.push(member);
    this.renderUsersOverlay();
  },

  // Remove member from channel
  removeMember(memberId) {
    this.members = this.members.filter(m => m.id !== memberId);
    this.renderUsersOverlay();
  },

  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // N key to talk
      if (e.key === 'n' || e.key === 'N') {
        if (!this.isTalking) {
          this.startTalk();
        }
      }
      
      // Escape to close
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
      
      // Arrow keys to change channel (only when radio is open)
      if (this.isOpen && document.activeElement !== this.channelInput) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.changeChannel(1);
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.changeChannel(-1);
        }
      }
    });
    
    document.addEventListener('keyup', (e) => {
      if ((e.key === 'n' || e.key === 'N') && this.isTalking) {
        this.endTalk();
      }
    });
  },

  // Send NUI message to FiveM
  sendNUI(event, data = {}) {
    if (typeof GetParentResourceName === 'function') {
      fetch(`https://${GetParentResourceName()}/${event}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
    }
  },

  // Demo functions
  simulateTalk() {
    if (!this.isTalking) {
      this.startTalk();
      setTimeout(() => this.endTalk(), 2000);
    }
  }
};

// NUI Message Handler
window.addEventListener('message', (event) => {
  const data = event.data;
  
  switch(data.action) {
    case 'open':
      Radio.open(data);
      break;
    case 'close':
      Radio.close();
      break;
    case 'setChannel':
      Radio.setChannel(data.channel);
      break;
    case 'setVolume':
      Radio.setVolume(data.volume);
      break;
    case 'updateMembers':
      Radio.members = data.members;
      Radio.renderUsersOverlay();
      break;
    case 'memberTalking':
      Radio.setMemberTalking(data.memberId, data.talking);
      break;
    case 'addMember':
      Radio.addMember(data.member);
      break;
    case 'removeMember':
      Radio.removeMember(data.memberId);
      break;
    case 'showUsersOverlay':
      Radio.usersOverlay.classList.remove('hidden');
      break;
    case 'hideUsersOverlay':
      Radio.usersOverlay.classList.add('hidden');
      break;
  }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Radio.init();
  
  // Set initial demo members (shown in overlay)
  Radio.members = [
    { id: 1, name: 'John Doe', talking: false, isSelf: false, isLeader: true, color: '#FFD700' },
    { id: 2, name: 'Maria Johnson', talking: false, isSelf: false, isLeader: false },
    { id: 3, name: 'Carlos Martinez', talking: true, isSelf: false, isLeader: false },
    { id: 4, name: 'Ana Rodriguez', talking: false, isSelf: false, isLeader: false }
  ];
  Radio.renderUsersOverlay();
  
  // Simulate random talking
  setInterval(() => {
    Radio.members.forEach(member => {
      if (!member.isSelf) {
        member.talking = Math.random() > 0.85;
      }
    });
    Radio.renderUsersOverlay();
  }, 2000);
});
