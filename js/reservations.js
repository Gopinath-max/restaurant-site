// js/reservations.js
import { getReservationResponse, typewriterEffect } from './ai.js';

document.addEventListener('DOMContentLoaded', () => {
  const chatContainer = document.getElementById('chat-history');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const suggestionContainer = document.getElementById('suggestion-chips');
  const confirmationCard = document.getElementById('confirmation-card');
  const resetBtn = document.getElementById('chat-reset');
  
  if (!chatContainer) return; // Not on the reservations section

  let conversationHistory = JSON.parse(sessionStorage.getItem('obsidianChatHistory')) || [];
  let bookingData = JSON.parse(sessionStorage.getItem('obsidianBooking')) || null;
  
  // --- INIT ---
  function initChat() {
    if (bookingData && bookingData.confirmed) {
      handleConfirmation(bookingData);
      chatContainer.innerHTML = ''; // Clear chat to just show confirmation
      if(suggestionContainer) suggestionContainer.innerHTML = '';
      return;
    }

    if (conversationHistory.length === 0) {
      const welcome = "Welcome to Obsidian. I am your concierge. How may I assist you with your dining experience today?";
      renderBubble(welcome, 'ai');
      conversationHistory.push({ role: 'ai', text: welcome });
    } else {
      conversationHistory.forEach(msg => renderBubble(msg.text, msg.role, false));
    }
    
    renderSuggestionChips(["Table for 2", "Anniversary dinner", "Dietary restrictions", "Tomorrow at 7PM"]);
    chatInput.focus();
  }

  function renderBubble(text, role, animate = true) {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', `chat-bubble--${role}`);
    if (animate) {
      bubble.style.animation = 'fadeInUp 0.3s ease forwards';
    }
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bubble.innerHTML = `<div style="font-size: 0.8em; opacity: 0.7; margin-bottom: 4px;">${role === 'ai' ? 'Obsidian Concierge' : 'You'} - ${time}</div><div class="bubble-text">${text}</div>`;
    
    chatContainer.appendChild(bubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return bubble.querySelector('.bubble-text');
  }

  function renderSuggestionChips(chips) {
    if (!suggestionContainer) return;
    suggestionContainer.innerHTML = '';
    chips.forEach(chipText => {
      const btn = document.createElement('button');
      btn.classList.add('mood-chip');
      btn.textContent = chipText;
      btn.addEventListener('click', () => {
        chatInput.value = chipText;
        sendMessage();
      });
      suggestionContainer.appendChild(btn);
    });
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    renderBubble(text, 'user');
    conversationHistory.push({ role: 'user', text });
    sessionStorage.setItem('obsidianChatHistory', JSON.stringify(conversationHistory));

    // Show loading
    const loadingElem = document.createElement('div');
    loadingElem.classList.add('ai-loading', 'active');
    loadingElem.style.margin = '10px 0 auto 0';
    loadingElem.innerHTML = '<span></span><span></span><span></span>';
    chatContainer.appendChild(loadingElem);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const response = await getReservationResponse(conversationHistory, text);
    loadingElem.remove();

    try {
      // Check if response is JSON (confirmation)
      const parsed = JSON.parse(response);
      if (parsed && parsed.confirmationCode) {
        parsed.confirmed = true;
        bookingData = parsed;
        sessionStorage.setItem('obsidianBooking', JSON.stringify(bookingData));
        handleConfirmation(bookingData);
        conversationHistory.push({ role: 'ai', text: "Reservation Confirmed." });
        return;
      }
    } catch(e) {
      // Not JSON, normal text response
    }

    const aiTextElem = renderBubble('', 'ai');
    await typewriterEffect(aiTextElem, response, 20);
    
    conversationHistory.push({ role: 'ai', text: response });
    sessionStorage.setItem('obsidianChatHistory', JSON.stringify(conversationHistory));
    
    // Update chips based on simple heuristic (mock)
    if (conversationHistory.length > 3 && !text.includes("Tomorrow")) {
       renderSuggestionChips(["Confirm 7PM table", "Change time"]);
    }
  }

  function handleConfirmation(data) {
    if (chatInput) chatInput.parentElement.style.display = 'none';
    if (suggestionContainer) suggestionContainer.style.display = 'none';
    
    if (confirmationCard) {
      confirmationCard.innerHTML = `
        <svg style="width: 50px; fill: var(--color-gold); margin: 0 auto 20px auto;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
        <h3 class="text-title" style="color: var(--color-gold); margin-bottom: var(--space-md);">Reservation Confirmed</h3>
        <p class="text-body" style="margin-bottom: var(--space-xs)">Date: <strong>${data.date}</strong></p>
        <p class="text-body" style="margin-bottom: var(--space-xs)">Time: <strong>${data.time}</strong></p>
        <p class="text-body" style="margin-bottom: var(--space-xs)">Guests: <strong>${data.party}</strong></p>
        <p class="text-body" style="margin-bottom: var(--space-xs)">Occasion: <strong>${data.occasion}</strong></p>
        <p class="text-body" style="margin-bottom: var(--space-md)">Confirmation: <strong style="color: var(--color-gold)">${data.confirmationCode}</strong></p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
          <button class="btn-primary" onclick="alert('ICS Downloaded')">Add to Calendar</button>
          <a class="btn-ghost" href="mailto:?subject=Obsidian Reservation&body=Confirmation Code: ${data.confirmationCode}">Email Conf</a>
        </div>
      `;
      confirmationCard.classList.add('visible');
    }
  }

  if(sendBtn) sendBtn.addEventListener('click', sendMessage);
  if(chatInput) chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      sessionStorage.removeItem('obsidianChatHistory');
      sessionStorage.removeItem('obsidianBooking');
      conversationHistory = [];
      bookingData = null;
      chatContainer.innerHTML = '';
      if (confirmationCard) confirmationCard.classList.remove('visible');
      if (chatInput) chatInput.parentElement.style.display = 'flex';
      if (suggestionContainer) suggestionContainer.style.display = 'flex';
      initChat();
    });
  }

  initChat();
});
