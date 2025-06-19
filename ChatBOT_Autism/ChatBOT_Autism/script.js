// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const voiceInputButton = document.getElementById('voice-input-btn');
const themeButton = document.getElementById('theme-button');
const starterButtons = document.querySelectorAll('.starter-btn');

// Settings checkboxes
const simplifiedTextCheckbox = document.getElementById('simplified-text');
const avoidEmojisCheckbox = document.getElementById('avoid-emojis');
const explainSarcasmCheckbox = document.getElementById('explain-sarcasm');
const readAloudCheckbox = document.getElementById('read-aloud');

// Theme cycling
const themes = ['default', 'dark-theme', 'soft-theme'];
let currentThemeIndex = 0;

// Speech synthesis and recognition
const synth = window.speechSynthesis;
let recognition;

// OpenAI Service initialization
// Replace 'your-api-key-here' with your actual OpenAI API key
const openAIService = new OpenAIService('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');

// Try to initialize speech recognition if available
try {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
    };
    
    recognition.onend = function() {
        voiceInputButton.style.backgroundColor = '';
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
        voiceInputButton.style.backgroundColor = '';
    };
} catch (e) {
    console.error('Speech recognition not supported in this browser');
    voiceInputButton.disabled = true;
    voiceInputButton.title = 'Voice input not supported in this browser';
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

voiceInputButton.addEventListener('click', toggleVoiceInput);
themeButton.addEventListener('click', cycleTheme);

starterButtons.forEach(button => {
    button.addEventListener('click', () => {
        userInput.value = button.textContent;
        userInput.focus();
    });
});

// Functions
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    userInput.value = '';
    
    // Get user settings
    const settings = {
        simplifiedText: simplifiedTextCheckbox.checked,
        avoidEmojis: avoidEmojisCheckbox.checked,
        explainSarcasm: explainSarcasmCheckbox.checked,
        readAloud: readAloudCheckbox.checked
    };
    
    // Process with AI and get response
    processWithAI(message, settings);
}

function addMessageToChat(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    const messageContent = document.createElement('p');
    messageContent.innerHTML = formatMessage(content);
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(content) {
    // Convert URLs to links
    content = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    
    // Convert markdown-style bullets to HTML
    content = content.replace(/^\s*[-•]\s+(.+)$/gm, '<li>$1</li>');
    content = content.replace(/<li>(.+)<\/li>/g, function(match) {
        return '<ul>' + match + '</ul>';
    });
    
    // Return formatted content
    return content;
}

async function processWithAI(message, settings) {
    // Show loading indicator
    addMessageToChat('<em>Processing...</em>', 'system');
    
    try {
        // Get response from OpenAI Service
        const aiResponse = await openAIService.getCompletion(message, settings);
        
        // Remove loading message
        chatMessages.removeChild(chatMessages.lastChild);
        
        // Add AI response to chat
        addMessageToChat(aiResponse, 'system');
        
        // Read aloud if enabled
        if (settings.readAloud) {
            readAloud(aiResponse);
        }
    } catch (error) {
        console.error('Error processing with AI:', error);
        chatMessages.removeChild(chatMessages.lastChild);
        addMessageToChat('Sorry, there was an error processing your message. Please try again.', 'system');
    }
}

function readAloud(text) {
    // Strip HTML tags for speech
    const plainText = text.replace(/<[^>]*>?/gm, '');
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(plainText);
    
    // Select a voice that sounds natural
    const voices = synth.getVoices();
    // Try to find a natural sounding voice
    const preferredVoice = voices.find(voice => 
        voice.name.includes('Samantha') || 
        voice.name.includes('Google') || 
        voice.name.includes('Natural')
    );
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    
    // Set properties
    utterance.rate = 1;
    utterance.pitch = 1;
    
    // Speak
    synth.speak(utterance);
}

function toggleVoiceInput() {
    if (!recognition) return;
    
    if (recognition.started) {
        recognition.stop();
        recognition.started = false;
        voiceInputButton.style.backgroundColor = '';
    } else {
        recognition.start();
        recognition.started = true;
        voiceInputButton.style.backgroundColor = '#ff6b6b';
    }
}

function cycleTheme() {
    // Remove current theme
    document.body.classList.remove(themes[currentThemeIndex]);
    
    // Go to next theme
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    
    // Apply new theme
    if (currentThemeIndex > 0) { // Skip 'default' as it's not a class
        document.body.classList.add(themes[currentThemeIndex]);
    }
    
    // Update button text
    themeButton.textContent = `Theme: ${themes[currentThemeIndex].replace('-theme', '')}`;
}

// Add reset button to input buttons
const inputButtons = document.querySelector('.input-buttons');
const resetButton = document.createElement('button');
resetButton.id = 'reset-btn';
resetButton.textContent = 'Reset';
resetButton.classList.add('reset-btn');
inputButtons.prepend(resetButton);

// Reset conversation button
resetButton.addEventListener('click', () => {
    // Clear chat messages except for welcome message
    while (chatMessages.childNodes.length > 1) {
        chatMessages.removeChild(chatMessages.lastChild);
    }
    
    // Reset OpenAI conversation history
    openAIService.resetConversation();
    
    // Add reset confirmation message
    addMessageToChat('Conversation has been reset. How can I help you today?', 'system');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Clear default welcome message
    chatMessages.innerHTML = '';
    
    // Add welcome message
    addMessageToChat('Welcome to GINA! I\'m your adaptive communication assistant for neurodivergent individuals. How can I help you today?', 'system');
    
    // Focus input
    userInput.focus();
    
    // Initialize theme button text
    themeButton.textContent = `Theme: default`;
    
    // Preload voices for speech synthesis
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = () => synth.getVoices();
    }
});