// ─── Gamkharu Loader ───

(function() {
  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #gk-loader {
      position: fixed;
      inset: 0;
      background: white;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: opacity 0.4s ease;
    }

    #gk-loader.hide {
      opacity: 0;
      pointer-events: none;
    }

    #gk-loader .gk-dot-row {
      display: flex;
      gap: 8px;
    }

    #gk-loader .gk-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #FF6435;
      animation: gk-bounce 0.9s infinite ease-in-out;
    }

    #gk-loader .gk-dot:nth-child(2) { animation-delay: 0.15s; }
    #gk-loader .gk-dot:nth-child(3) { animation-delay: 0.3s; }

    @keyframes gk-bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40%            { transform: scale(1);   opacity: 1;   }
    }

    #gk-loader .gk-brand {
      margin-top: 16px;
      font-family: "Lexend Deca", sans-serif;
      font-size: 1rem;
      color: #FF6435;
      letter-spacing: 2px;
    }
  `;
  document.head.appendChild(style);
  
  
  // Inject loader HTML
  const loader = document.createElement('div');
  loader.id = 'gk-loader';
  loader.innerHTML = `
    <div class="gk-dot-row">
      <div class="gk-dot"></div>
      <div class="gk-dot"></div>
      <div class="gk-dot"></div>
    </div>
    <div class="gk-brand">GAMKHARU</div>
  `;
  document.body.appendChild(loader);
  
  
  // Hide on page load
  window.addEventListener('load', () => {
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 400);
  });
})();