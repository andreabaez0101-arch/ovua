/* ========================================
   Radio UI - JavaScript
   For FiveM Server
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
    this.channelDisplay = document.getElementById('channel-number');
    this.channelNameDisplay = document.getElementById('channel-name');
    this.channelInput = document.getElementById('channel-input');
    this.volumeSlider = document.getElementById('volume-slider');
    this.volumeValue = document.getElementById('volume-value');
    this.volumeFill = document.getElementById('volume-fill');
    this.talkBtn = document.getElementById('talk-btn');
    this.membersCount = document.getElementById('members-count');
    this.membersList = document.getElementById('members-list');
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
      this.renderMembers();
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
    const muteBtn = document.querySelector('.footer-btn:first-child');
    
    if (this.isMuted) {
      muteBtn.classList.add('muted');
      this.muteIcon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
      this.muteText.textContent = 'Silenciado';
    } else {
      muteBtn.classList.remove('muted');
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

  // Render members list
  renderMembers() {
    this.membersList.innerHTML = '';
    this.membersCount.textContent = this.members.length;
    
    this.members.forEach(member => {
      const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      const item = document.createElement('div');
      item.className = `member-item ${member.isSelf ? 'self' : ''}`;
      item.innerHTML = `
        <div class="member-avatar">${initials}</div>
        <span class="member-name">${member.name}${member.isSelf ? ` (ID: ${member.id})` : ''}</span>
        <span class="member-status ${member.talking ? 'talking' : ''}">${member.talking ? 'Hablando' : 'En linea'}</span>
      `;
      this.membersList.appendChild(item);
    });
  },

  // Update member talking status
  setMemberTalking(memberId, isTalking) {
    const member = this.members.find(m => m.id === memberId);
    if (member) {
      member.talking = isTalking;
      this.renderMembers();
    }
  },

  // Add member to channel
  addMember(member) {
    this.members.push(member);
    this.renderMembers();
  },

  // Remove member from channel
  removeMember(memberId) {
    this.members = this.members.filter(m => m.id !== memberId);
    this.renderMembers();
  },

  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // N key to talk
      if (e.key === 'n' || e.key === 'N') {
        if (this.isOpen && !this.isTalking) {
          this.startTalk();
        }
      }
      
      // Escape to close
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
      
      // Arrow keys to change channel
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
  },

  addMemberDemo() {
    const names = ['Carlos Rodriguez', 'Ana Martinez', 'Luis Garcia', 'Sofia Lopez'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomId = Math.floor(Math.random() * 100) + 1;
    
    this.addMember({
      id: randomId,
      name: randomName,
      talking: false,
      isSelf: false
    });
  }
};

// Helper function for FiveM
function GetParentResourceName() {
  return window.GetParentResourceName ? window.GetParentResourceName() : 'radio';
}

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
      Radio.renderMembers();
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
  }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Radio.init();
  
  // Demo: Set initial members
  Radio.members = [
    { id: 1, name: 'John Doe', talking: true, isSelf: false },
    { id: 2, name: 'Maria Johnson', talking: false, isSelf: false },
    { id: 15, name: 'Tu', talking: false, isSelf: true }
  ];
  Radio.renderMembers();
});
