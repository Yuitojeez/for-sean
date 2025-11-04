// ====== PASSWORD LOGIC ======
const correctPass = 'iluvspidey';
const pwdScreen = document.getElementById('password-screen');
const app = document.getElementById('app');
const pwdInput = document.getElementById('pwdInput');
const pwdBtn = document.getElementById('pwdBtn');
const pwdHint = document.getElementById('pwdHint');
const pwdMsg = document.getElementById('pwdMsg');

// Audio elements
const bgRomcom = document.getElementById('bgRomcom');
const bgRomcom2 = document.getElementById('bgRomcom2');
const bgBirthday = document.getElementById('bgBirthday');

// Check password
pwdBtn.addEventListener('click', checkPassword);
pwdInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkPassword();
});

function checkPassword() {
  const val = pwdInput.value.trim().toLowerCase();
  if (val === correctPass) {
    pwdScreen.style.display = 'none';
    app.style.display = 'block';
    // Start the animation for Spider-Man and avocado when page loads
    document.getElementById('spiderman').classList.add('animate');
    document.getElementById('dancing-avocado').classList.add('animate');
    bgRomcom.play().catch(() => {
      console.log('Autoplay blocked');
    });
  } else {
    pwdMsg.textContent = "Wrong! Hint: KartRider name 😉";
    pwdMsg.style.color = '#e74c3c';
    setTimeout(() => pwdMsg.textContent = '', 3000);
  }
}

pwdHint.addEventListener('click', () => {
  pwdMsg.textContent = 'Hint: yung kartrider name mo hehe';
  pwdMsg.style.color = '#27ae60';
  setTimeout(() => pwdMsg.textContent = '', 4500);
});

// ====== SCENE NAVIGATION ======
const scenes = {
  1: document.getElementById('scene-1'),
  2: document.getElementById('scene-2'),
  3: document.getElementById('scene-3'),
  4: document.getElementById('scene-4'),
  5: document.getElementById('scene-5')
};

function showScene(sceneKey) {
  Object.values(scenes).forEach(s => s.classList.remove('active'));
  scenes[sceneKey].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Stop all music first
  bgRomcom.pause();
  bgRomcom2.pause();
  bgBirthday.pause();
  
  if (sceneKey === 4) {
    // Birthday song scene - music handled by blowOutCandles
  } else if (sceneKey === 5) {
    // Reasons page - romcom1 plays
    bgRomcom.play().catch(() => {});
  } else {
    // Other scenes - romcom1 plays
    bgRomcom.play().catch(() => {});
  }
}

// Navigation buttons
document.getElementById('toScene2').addEventListener('click', () => {
  showScene(2);
  startTypewriter();
});
document.getElementById('backTo1').addEventListener('click', () => showScene(1));
document.getElementById('toScene3').addEventListener('click', () => showScene(3));
document.getElementById('backTo2').addEventListener('click', () => showScene(2));
document.getElementById('toCake').addEventListener('click', () => showScene(4));
document.getElementById('backTo3').addEventListener('click', () => showScene(3));
document.getElementById('toReasons').addEventListener('click', () => {
  showScene(5);
  revealReasons();
});

// ====== TYPEWRITER EFFECT ======
const typeArea = document.getElementById('typeArea');
const memePrompt = document.getElementById('memePrompt');

const lines = [
  "Okay, ready ka na? 😅",
  "Sure kana ha? WEEE di ngaaa? Sige na nga wait mo lang 😳",
  "Do you really want to read the next line? (you decide sean! 👀)",
  "Sana ngayong kaarawan mo, may extra smile ka. 💚"
];

let lineIndex = 0;
let charIndex = 0;

function startTypewriter() {
  typeArea.textContent = '';
  memePrompt.textContent = '';
  lineIndex = 0;
  charIndex = 0;
  typeNextLine();
}

function typeNextLine() {
  if (lineIndex >= lines.length) {
    memePrompt.textContent = "Sige, next? Press mo nga Next para sa surprise!";
    return;
  }
  
  const currentLine = lines[lineIndex];
  
  if (charIndex < currentLine.length) {
    typeArea.textContent += currentLine[charIndex];
    charIndex++;
    setTimeout(typeNextLine, 55 + Math.random() * 35);
  } else {
    setTimeout(() => {
      const prompts = [
        "sure ka na ba? 😅",
        "pls wag moko block after this T-T",
        "last chance 'to ah 😆",
        "huy wag mo i-close 😭"
      ];
      memePrompt.textContent = prompts[lineIndex % prompts.length];
      
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNextLine, 1200);
    }, 600);
  }
}

// ====== INTERACTIVE CAKE ======
const cakeContainer = document.getElementById('cakeContainer');
const cakeInstruction = document.getElementById('cakeInstruction');
const cakeMsg = document.getElementById('cakeMsg');
const toReasonsBtn = document.getElementById('toReasons');

let candles = [];
let audioContext;
let analyser;
let microphone;

cakeContainer.addEventListener('click', function(event) {
  const rect = cakeContainer.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  addCandle(x, y);
  
  if (candles.length === 1) {
    cakeMsg.textContent = "Keep adding candles! 🕯️";
    cakeInstruction.textContent = "Make a wish first before you blow sean! 🎤✨";
    
    setTimeout(() => {
      startMicDetection();
    }, 1500);
  }
});

function addCandle(left, top) {
  const candle = document.createElement('div');
  candle.className = 'candle';
  candle.style.left = left + 'px';
  candle.style.top = top + 'px';
  
  const flame = document.createElement('div');
  flame.className = 'flame';
  candle.appendChild(flame);
  
  cakeContainer.appendChild(candle);
  candles.push(candle);
}

function startMicDetection() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    cakeInstruction.textContent = 'Mic not supported — click candles to blow them out.';
    enableManualBlow();
    return;
  }
  
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      
      checkForBlow();
    })
    .catch(function(err) {
      console.log('Mic access denied:', err);
      cakeInstruction.textContent = 'Mic blocked — click candles to blow them out.';
      enableManualBlow();
    });
}

function checkForBlow() {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  analyser.getByteFrequencyData(dataArray);
  
  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += dataArray[i];
  }
  let average = sum / bufferLength;
  
  if (average > 50) {
    blowOutCandles();
  } else {
    if (candles.some(c => !c.classList.contains('out'))) {
      requestAnimationFrame(checkForBlow);
    }
  }
}

function blowOutCandles() {
  let blownOut = 0;
  
  candles.forEach((candle) => {
    if (!candle.classList.contains('out') && Math.random() > 0.3) {
      candle.classList.add('out');
      blownOut++;
    }
  });
  
  if (candles.every(c => c.classList.contains('out'))) {
    cakeMsg.textContent = "You blew them all out! 🎉";
    cakeInstruction.textContent = "Happy Birthday! Enjoy the song 🎵";
    
    bgBirthday.currentTime = 0;
    bgBirthday.play().catch(() => {});
    
    setTimeout(() => {
      triggerConfetti();
    }, 500);
    
    // Show chat popup after 3 seconds
    setTimeout(() => {
      showChatPopup();
    }, 3000);
  } else if (blownOut > 0) {
    requestAnimationFrame(checkForBlow);
  }
}

function enableManualBlow() {
  candles.forEach(candle => {
    candle.style.cursor = 'pointer';
    candle.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.add('out');
      
      if (candles.every(c => c.classList.contains('out'))) {
        cakeMsg.textContent = "All candles blown! 🎉";
        cakeInstruction.textContent = "Happy Birthday! Enjoy the song 🎵";
        
        bgBirthday.play().catch(() => {});
        
        setTimeout(() => {
          triggerConfetti();
        }, 500);
        
        setTimeout(() => {
          showChatPopup();
        }, 3000);
      }
    });
  });
}

function triggerConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;
  
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ffc2d1', '#A8C686', '#F3D8C7', '#ffd166', '#06d6a0']
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ffc2d1', '#A8C686', '#F3D8C7', '#ffd166', '#06d6a0']
    });
    
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

// ====== CHAT POPUP ======
const chatPopup = document.getElementById('chatPopup');
const closeChatPopupBtn = document.getElementById('closeChatPopup');
const openSecretMessageBtn = document.getElementById('openSecretMessage');

function showChatPopup() {
  chatPopup.style.display = 'block';
  toReasonsBtn.style.display = 'inline-block';
}

closeChatPopupBtn.addEventListener('click', () => {
  chatPopup.style.display = 'none';
});

openSecretMessageBtn.addEventListener('click', () => {
  chatPopup.style.display = 'none';
  showSecretModal();
});

// ====== SECRET MESSAGE MODAL ======
const secretModal = document.getElementById('secretModal');
const closeSecretModalBtn = document.getElementById('closeSecretModal');
const secretPwdInput = document.getElementById('secretPwdInput');
const unlockSecretBtn = document.getElementById('unlockSecretBtn');
const secretPwdMsg = document.getElementById('secretPwdMsg');

function showSecretModal() {
  secretModal.style.display = 'block';
}

closeSecretModalBtn.addEventListener('click', () => {
  secretModal.style.display = 'none';
});

unlockSecretBtn.addEventListener('click', checkSecretPassword);
secretPwdInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkSecretPassword();
});

function checkSecretPassword() {
  const val = secretPwdInput.value.trim().toLowerCase();
  if (val === correctPass) {
    secretModal.style.display = 'none';
    
    // Start playing romcom1 right away when secret message is opened
    bgBirthday.pause();
    bgRomcom.currentTime = 0;
    bgRomcom.play().catch(() => {});
    
    showConfessionModal();
  } else {
    secretPwdMsg.textContent = "Wrong password! Try again 😅";
    secretPwdMsg.style.color = '#e74c3c';
    setTimeout(() => {
      secretPwdMsg.textContent = '';
    }, 3000);
  }
}

// ====== CONFESSION MODAL ======
const confessionModal = document.getElementById('confessionModal');
const closeConfessionModalBtn = document.getElementById('closeConfessionModal');
const continueToReasonsBtn = document.getElementById('continueToReasons');
const heartsContainer = document.getElementById('heartsContainer');

function showConfessionModal() {
  confessionModal.style.display = 'block';
  startFloatingHearts();
  
  // Play romcom2 when confession is shown
  bgRomcom.pause();
  bgRomcom2.currentTime = 0;
  bgRomcom2.play().catch(() => {});
  
  // Animate confession text slowly
  const confLines = document.querySelectorAll('.confLine');
  confLines.forEach((line, index) => {
    line.style.opacity = '0';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, index * 2000); // Slower appearance - 2 seconds between each line
  });
}

closeConfessionModalBtn.addEventListener('click', () => {
  confessionModal.style.display = 'none';
});

continueToReasonsBtn.addEventListener('click', () => {
  confessionModal.style.display = 'none';
  // Stop romcom2 when moving to reasons page
  bgRomcom2.pause();
  showScene(5);
  revealReasons();
});

function startFloatingHearts() {
  heartsContainer.innerHTML = '';
  
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '❤️';
    heart.style.left = (10 + Math.random() * 80) + '%';
    heart.style.bottom = '0px';
    heart.style.animationDelay = (i * 0.2) + 's';
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
      heart.remove();
    }, 3000 + (i * 200));
  }
}

// ====== REASONS REVEAL ======
function revealReasons() {
  const reasonCards = document.querySelectorAll('.reason-card');
  
  reasonCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.remove('hidden');
      card.classList.add('show');
    }, index * 400);
  });
}

// Restart button
document.getElementById('restart').addEventListener('click', () => {
  location.reload();
});

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
  app.style.display = 'none';
  
  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === secretModal) {
      secretModal.style.display = 'none';
    }
    if (e.target === confessionModal) {
      confessionModal.style.display = 'none';
    }
  });
});