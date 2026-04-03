// js/ai.js

const API_BASE_URL = 'https://api.anthropic.com/v1/messages';
// In a real app, API calls should be routed through a backend proxy to protect keys.
// For demonstration, we assume a proxy or mock endpoint if no key is present.
const MODEL = 'claude-3-5-sonnet-20240620'; 
// Using a placeholder API endpoint here that would normally proxy to Anthropic
const PROXY_URL = '/api/chat';

const SYSTEM_PROMPT = `You are the AI concierge for Obsidian, a Michelin-starred Japanese-French fusion restaurant. Always respond in an elegant, poetic tone befitting a luxury dining establishment. Keep responses concise (2-4 sentences max unless storytelling). Menu includes: 
Starters: Miso Foie Gras, Sakura Smoke Wagyu Tartare, Hokkaido Scallop Crudo, Truffle Dashi Chawanmushi.
Mains: Yuzu Kosho Duck Breast, Matcha Butter Lobster, Black Cod with Beurre Blanc, A5 Wagyu with Sansho Peppercorn Jus.
Desserts: Matchamisu, Yuzu Soufflé, Black Sesame Macarons, Cherry Blossom Sorbet.
Drinks: Obsidian Signature Cocktail, Sake Flight, Tokyo 75, Aged Umeshu.`;

/**
 * Helper to call the API 
 * We mock it using a timeout for frontend scaffolding so it works without keys.
 */
async function callAnthropicMock(systemPrompt, userMessage) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let responseText = "An elegant recommendation awaits.";
      
      if (systemPrompt.includes("wine sommelier")) {
        responseText = "I highly recommend the 2018 Domain de la Romanée-Conti. Its subtle earthy notes perfectly complement the umami profile of our Japanese-French fusion, elevating each bite with a transcendent elegance.";
      } else if (systemPrompt.includes("head chef")) {
        responseText = "For a bold spirit, the Sakura Smoke Wagyu Tartare is a triumph. It awakens the palate with daring smokiness while embracing you in luxurious Wagyu richness.";
      } else if (systemPrompt.includes("culinary storyteller")) {
        responseText = "This dish was born from a twilight walk in Kyoto. The delicate ingredients whisper tales of spring blossoms and traditional French technique, harmonizing over twenty hours of gentle simmering. Its creation is a labor of love, meant to evoke memories you haven't yet experienced.";
      } else if (systemPrompt.includes("reservation concierge")) {
        if (userMessage.toLowerCase().includes("confirm")) {
          responseText = JSON.stringify({
            date: "Tomorrow",
            time: "19:00",
            party: "2",
            occasion: "Anniversary",
            dietary: "None",
            confirmationCode: "OBS-8X2M"
          });
        } else {
          responseText = "I would be honored to arrange your evening. For what date and time shall we reserve your table?";
        }
      }
      
      resolve(responseText);
    }, 1500);
  });
}

export async function getSommelierRecommendation(dishOrMood) {
  try {
    const system = `${SYSTEM_PROMPT}\nYou are the wine sommelier.`;
    const msg = `What wine pairs well with ${dishOrMood}?`;
    return await callAnthropicMock(system, msg);
  } catch (err) {
    return "Our apologies, the cellar is currently reorganizing. Please consult our staff for a pristine recommendation.";
  }
}

export async function getChefMoodPick(mood) {
  const validMoods = ['Bold', 'Delicate', 'Adventurous', 'Comforting', 'Romantic', 'Celebratory'];
  if (!validMoods.includes(mood)) {
    mood = 'Adventurous';
  }
  try {
    const system = `${SYSTEM_PROMPT}\nYou are the head chef.`;
    const msg = `I am feeling ${mood}. What dish do you recommend?`;
    return await callAnthropicMock(system, msg);
  } catch (err) {
    return "The kitchen is abuzz, but any selection you make will be a masterpiece.";
  }
}

export async function getDishStory(dishName, ingredients) {
  try {
    const system = `${SYSTEM_PROMPT}\nYou are a culinary storyteller. Write a 150-word poetic narrative about the origin and technique.`;
    const msg = `Tell me the story behind ${dishName} and its ingredients: ${ingredients}.`;
    return await callAnthropicMock(system, msg);
  } catch (err) {
    return "The story of this dish is a quiet secret, best discovered with the first bite.";
  }
}

export async function getReservationResponse(conversationHistory, userMessage) {
  try {
    const system = `${SYSTEM_PROMPT}\nYou are the reservation concierge. Collect date, time, party size, occasion, and dietary restrictions. When all info is collected, return ONLY a JSON object with keys: date, time, party, occasion, dietary, confirmationCode.`;
    // Pass conversationHistory to proxy ideally
    return await callAnthropicMock(system, userMessage);
  } catch (err) {
    return "I am having trouble reaching the reservation desk. Please call us directly.";
  }
}

export function showLoadingState(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.classList.add('active');
}

export function hideLoadingState(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.classList.remove('active');
}

export function typewriterEffect(element, text, speed = 30) {
  return new Promise((resolve) => {
    element.textContent = '';
    element.classList.add('populated');
    let i = 0;
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
}
