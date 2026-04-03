// js/menu.js
import { getDishStory, typewriterEffect } from './ai.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- MENU TABS ---
  const menuTabs = document.querySelectorAll('.menu__tab');
  const menuPanels = document.querySelectorAll('.menu__tab-panel');

  if (menuTabs.length > 0) {
    // Check sessionStorage
    const activeTabId = sessionStorage.getItem('activeMenuTab') || menuTabs[0].getAttribute('aria-controls');
    
    function switchTab(targetId) {
      menuPanels.forEach(p => {
        p.style.display = p.id === targetId ? 'grid' : 'none';
        // Add animation class
        if (p.id === targetId) {
          p.style.opacity = '0';
          setTimeout(() => p.style.opacity = '1', 50);
          p.style.transition = 'opacity 0.3s ease';
        }
      });
      
      menuTabs.forEach(t => {
        t.setAttribute('aria-selected', t.getAttribute('aria-controls') === targetId);
      });
      sessionStorage.setItem('activeMenuTab', targetId);
    }
    
    switchTab(activeTabId);

    menuTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchTab(tab.getAttribute('aria-controls'));
      });
    });
  }

  // --- AI DISH STORYTELLER ---
  const storyButtons = document.querySelectorAll('.btn-story');
  
  storyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const card = e.target.closest('.menu-card');
      const dishName = card.querySelector('.menu-card__title').textContent;
      
      // Open modal
      window.openModal(`<div style="text-align:center"><div class="ai-loading active" id="modal-loader" style="margin:20px auto; justify-content:center;"><span></span><span></span><span></span></div><p id="modal-story-text" style="opacity: 0;"></p></div>`);
      
      const story = await getDishStory(dishName, "premium seasonal ingredients");
      
      const loader = document.getElementById('modal-loader');
      const textBlock = document.getElementById('modal-story-text');
      
      if (loader) loader.style.display = 'none';
      if (textBlock) {
        textBlock.style.opacity = '1';
        await typewriterEffect(textBlock, story, 20);
      }
    });
  });
});
