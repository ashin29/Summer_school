# NeuroBridge/GINA: Implementation Guide & Feature Alignment

## Project Overview

NeuroBridge (currently implemented as GINA - "An adaptive communication assistant for neurodivergent individuals") is designed to bridge communication gaps for neurodivergent individuals by providing support in interpreting social cues, understanding figurative speech, and expressing emotions.

This document outlines how the current implementation aligns with the project goals and explains the logic behind the code.

## Core Code Components & Their Alignment with Project Goals

### 1. OpenAI Integration (openai-service.js)

```javascript
class OpenAIService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo'; // Can be upgraded to gpt-4-turbo
        
        // System prompt with few-shot examples
        this.systemPrompt = `You are a two-way communication assistant between autistic and neurotypical people...`;
        
        this.conversationHistory = [...];
    }
    
    // Methods for handling conversation
    updateSystemPromptWithPreferences(preferences) {...}
    addMessage(role, content) {...}
    getCompletion(userMessage, preferences) {...}
    resetConversation() {...}
}
```

**Alignment with Project Goals:**
- **Two-Way Interaction**: The OpenAI service maintains conversation history and context, enabling genuine back-and-forth communication rather than single-response outputs.
- **Explain Social Rules Without Judgment**: The system prompt is crafted to provide explanations about social norms in a non-judgmental way.
- **Ethics-First Transparency**: The system prompt includes instructions to explain idioms, indirect language, and emotional subtext when asked.

**Key Logic Elements:**
- **Conversation Memory**: The service maintains a history of the conversation, enabling context-aware responses.
- **Preference Integration**: User preferences modify the system prompt, allowing for personalized interactions.
- **Token Management**: The service automatically manages conversation history size to avoid token limits.

### 2. User Interface (script.js)

```javascript
// Core UI components and event listeners
// Settings checkboxes for user preferences
// Speech synthesis and recognition
// Theme cycling functionality
// Chat message handling
```

**Alignment with Project Goals:**
- **Customizable Sensory Profile**: Theme cycling (`cycleTheme()`) allows users to choose visual preferences.
- **Speech Input and Output**: The implementation includes speech recognition and synthesis for multimodal interaction.
- **Social Mode Toggle**: User preferences (`simplifiedText`, `avoidEmojis`, `explainSarcasm`) allow basic customization of AI responses.

**Key Logic Elements:**
- **Message Formatting**: The `formatMessage()` function handles conversion of plain text to structured HTML.
- **User Settings Integration**: User preferences are collected and passed to the OpenAI service.
- **Accessibility Features**: Speech synthesis (`readAloud()`) and recognition make the app accessible to users with different needs.

### 3. Responsive UI Design (styles.css)

```css
/* Theme variables and responsive design */
:root {
    --primary-color: #6a8eae;
    --secondary-color: #a5c9c9;
    /* Additional variables for visual preferences */
}

/* Alternative themes */
.dark-theme {...}
.soft-theme {...}

/* Responsive media queries */
@media (max-width: 768px) {...}
```

**Alignment with Project Goals:**
- **Customizable Sensory Profile**: Multiple themes address sensory preferences.
- **Accessibility**: Responsive design ensures usability across devices.
- **Sensory Sensitivity**: Careful color choices and transitions create a non-overwhelming interface.

## Current Implementation vs. Project Vision

### Implemented Features:

1. ✅ **Two-Way Interaction**: Basic chat interface with conversation memory
2. ✅ **Customizable Sensory Profile**: Multiple themes (default, dark, soft)
3. ✅ **Speech Input/Output**: Basic speech recognition and synthesis
4. ✅ **User Preferences**: Settings for simplified text, avoiding emojis, and explaining sarcasm
5. ✅ **Ethics-First Approach**: System prompt designed to explain rather than dictate

### Features Partially Implemented:

1. ⚠️ **Social Mode Toggle**: Basic preference toggles exist, but not full mode switching
2. ⚠️ **Explain Social Rules**: System prompt contains instructions, but implementation depends on AI model quality

### Features Not Yet Implemented:

1. ❌ **Emotion Recognition and Response Coaching**: No visualization or guidance for interpreting emotions
2. ❌ **Scenario-Based Social Training**: No branching scenarios or simulations
3. ❌ **Progress Tracker**: No tracking of user interactions or progress
4. ❌ **Conversation Builder Practice Tool**: No specific scenario simulation

## Technical Implementation Insights

### System Prompt Design

The system prompt in `openai-service.js` is the core of the application's intelligence. It instructs the AI to:

```
You are a two-way communication assistant between autistic and neurotypical people.
Your goals:

- Translate neurotypical speech into simple, literal language for autistic users.
- Rephrase autistic users' responses into more socially expected or nuanced language if they request it.
- Explain idioms, indirect language, sarcasm, or emotional subtext when asked.
- Avoid judgment, always respect neurodivergent preferences, and never push masking.
- Use bullet points, emojis, or visual summaries when helpful.
- When uncertain, ask for clarification politely instead of assuming.
- Support both users equally and allow role-switching (e.g., autistic user ↔️ neurotypical user).
- Respond calmly and with sensory sensitivity — avoid overwhelming formats.
- Allow users to set or change preferences (e.g., "Use simplified text always", "Avoid emojis", "Explain sarcasm automatically").
```

This prompt aligns with multiple project goals including:
- Two-way interaction
- Explaining social rules without judgment
- Customization based on user preferences

### Preferences Integration

The integration of user preferences happens through a multi-step process:

1. UI checkboxes capture user preferences
2. When sending a message, preferences are collected:
   ```javascript
   const settings = {
       simplifiedText: simplifiedTextCheckbox.checked,
       avoidEmojis: avoidEmojisCheckbox.checked,
       explainSarcasm: explainSarcasmCheckbox.checked,
       readAloud: readAloudCheckbox.checked
   };
   ```
3. Preferences modify the system prompt:
   ```javascript
   updateSystemPromptWithPreferences(preferences) {
       let preferencesString = "User preferences:\n";
       
       if (preferences.simplifiedText) {
           preferencesString += "- Always use simplified text\n";
       }
       
       // Additional preferences
       
       const systemMessageWithPreferences = this.systemPrompt + "\n\n" + preferencesString;
       
       // Update system message
   }
   ```

This mechanism enables the AI to customize its responses based on user preferences, aligning with the "Customizable Sensory Profile" goal.

### Speech Recognition and Synthesis

The application includes both speech input and output capabilities:

```javascript
// Speech recognition
recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';

// Speech synthesis
function readAloud(text) {
    const plainText = text.replace(/<[^>]*>?/gm, '');
    const utterance = new SpeechSynthesisUtterance(plainText);
    // Select voice and configure properties
    synth.speak(utterance);
}
```

This implementation supports the "Speech Input and Output + Text Options" goal, though it currently uses the browser's built-in capabilities rather than advanced APIs like Whisper or ElevenLabs.

## Future Implementation Recommendations

To fully realize the project vision, consider these technical enhancements:

1. **Upgrade to GPT-4 or Better Model**: For more nuanced understanding of social cues and context.

2. **Implement Full Social Mode Toggle**:
   ```javascript
   // Example implementation
   const socialModes = {
       casual: {
           systemPromptAddition: "Use casual, friendly language with simple explanations...",
           temperature: 0.7
       },
       professional: {
           systemPromptAddition: "Use formal, workplace-appropriate language...",
           temperature: 0.5
       },
       conflictHandling: {
           systemPromptAddition: "Focus on de-escalation techniques and clear boundary setting...",
           temperature: 0.4
       }
   };
   
   function setSocialMode(mode) {
       const selectedMode = socialModes[mode];
       openAIService.updateSystemPromptWithSocialMode(selectedMode.systemPromptAddition);
       openAIService.setTemperature(selectedMode.temperature);
   }
   ```

3. **Integrate Advanced Voice APIs**:
   ```javascript
   // Example implementation with Whisper API
   async function transcribeSpeech(audioBlob) {
       const formData = new FormData();
       formData.append('file', audioBlob, 'recording.webm');
       formData.append('model', 'whisper-1');
       
       const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
           method: 'POST',
           headers: {
               'Authorization': `Bearer ${apiKey}`
           },
           body: formData
       });
       
       const data = await response.json();
       return data.text;
   }
   ```

4. **Add Scenario-Based Training**:
   ```javascript
   const scenarios = [
       {
           name: "Joining a Conversation",
           context: "You see two classmates talking about a movie you like.",
           options: [
               "Wait for a pause and say 'I like that movie too.'",
               "Interrupt and share your detailed analysis of the film.",
               "Stand nearby until they notice you."
           ],
           settings: ["school", "social gathering"]
       },
       // Additional scenarios
   ];
   
   function startScenario(scenarioId, setting) {
       const scenario = scenarios.find(s => s.id === scenarioId);
       // Modify system prompt to run the scenario in the selected setting
       // Track user choices
   }
   ```

5. **Implement Progress Tracking**:
   ```javascript
   // Example localStorage-based tracking
   function trackInteraction(type, details) {
       let history = JSON.parse(localStorage.getItem('interactionHistory')) || [];
       history.push({
           type,
           details,
           timestamp: new Date().toISOString()
       });
       localStorage.setItem('interactionHistory', JSON.stringify(history));
   }
   
   function generateProgressReport() {
       const history = JSON.parse(localStorage.getItem('interactionHistory')) || [];
       // Generate insights based on user interaction patterns
   }
   ```

## Conclusion

The current implementation of NeuroBridge/GINA provides a solid foundation for a communication assistant for neurodivergent individuals. It includes the core functionality for two-way conversation, basic customization, and accessibility features.

To fully realize the project vision as outlined in the documentation, additional features need to be implemented, focusing particularly on scenario-based training, emotion recognition, and more advanced customization options.

The modular architecture of the current code provides a good starting point for these enhancements, as new features can be added to the existing OpenAI service or UI components without requiring a complete redesign of the application.