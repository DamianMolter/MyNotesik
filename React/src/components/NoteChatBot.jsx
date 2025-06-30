import { useState, useRef, useEffect } from "react";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';

function NoteChatbot({ note, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: `Cześć! 👋 Jestem asystentem dla Twojej notatki "${note.title}". Mogę pomóc Ci w analizie treści, generowaniu podsumowań, sugerowaniu usprawnień lub odpowiadaniu na pytania dotyczące notatki. Jak mogę Ci pomóc?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef();
  const messagesEndRef = useRef(); // Dodatkowy ref dla lepszego scroll

  // Funkcja do płynnego przewijania na dół
  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
    // Alternatywnie można użyć messagesEndRef
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll po każdej zmianie wiadomości lub stanu typing
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-scroll po otwarciu chatbota
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom(), 100); // Małe opóźnienie dla animacji
    }
  }, [isOpen]);

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Analiza treści notatki
    if (message.includes('podsumuj') || message.includes('streszczenie')) {
      return `📋 **Podsumowanie notatki "${note.title}":**\n\n${note.content.length > 200 ? note.content.substring(0, 200) + '...' : note.content}\n\n**Kluczowe punkty:**\n• Główny temat: ${note.title}\n• Długość treści: ${note.content.length} znaków\n• Status: Aktywna notatka`;
    }
    
    if (message.includes('długość') || message.includes('ile znaków')) {
      return `📊 **Statystyki notatki:**\n• Znaków: ${note.content.length}\n• Słów: ${note.content.split(' ').length}\n• Linijek: ${note.content.split('\n').length}`;
    }
    
    if (message.includes('usprawnienia') || message.includes('sugestie') || message.includes('poprawa')) {
      const suggestions = [];
      if (note.content.length < 50) suggestions.push('Rozszerz treść o więcej szczegółów');
      if (!note.content.includes('\n')) suggestions.push('Podziel treść na akapity dla lepszej czytelności');
      if (note.title.length < 5) suggestions.push('Rozszerz tytuł o więcej informacji');
      if (note.content.toLowerCase() === note.content) suggestions.push('Dodaj formatowanie - wielkie litery na początku zdań');
      
      return `💡 **Sugestie usprawnień:**\n\n${suggestions.length > 0 ? suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n') : 'Twoja notatka wygląda dobrze! 👍'}`;
    }
    
    if (message.includes('kategoria') || message.includes('typ') || message.includes('klasyfikacja')) {
      let category = 'Ogólna';
      if (note.content.toLowerCase().includes('spotkanie') || note.content.toLowerCase().includes('meeting')) category = 'Spotkanie';
      if (note.content.toLowerCase().includes('zadanie') || note.content.toLowerCase().includes('todo')) category = 'Zadania';
      if (note.content.toLowerCase().includes('pomysł') || note.content.toLowerCase().includes('idea')) category = 'Pomysły';
      if (note.content.toLowerCase().includes('projekt')) category = 'Projekt';
      
      return `🏷️ **Klasyfikacja notatki:**\nKategoria: ${category}\nPriorytet: ${note.content.includes('!') ? 'Wysoki' : 'Standardowy'}`;
    }
    
    if (message.includes('szukaj') || message.includes('znajdź')) {
      const searchTerm = message.replace(/.*szukaj|znajdź/, '').trim();
      if (searchTerm && note.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        return `🔍 **Znaleziono:** "${searchTerm}" występuje w treści notatki!`;
      } else if (searchTerm) {
        return `🔍 **Nie znaleziono:** "${searchTerm}" nie występuje w treści notatki.`;
      }
      return `🔍 **Wyszukiwanie:** Podaj słowo kluczowe do wyszukania, np. "szukaj projekt"`;
    }
    
    if (message.includes('pomoc') || message.includes('help') || message.includes('co możesz')) {
      return `🤖 **Moje możliwości:**\n\n• **Podsumuj** - generuję streszczenie notatki\n• **Statystyki** - pokazuję długość, liczbę słów\n• **Usprawnienia** - sugeruję poprawki\n• **Kategoria** - klasyfikuję typ notatki\n• **Szukaj [słowo]** - wyszukuję w treści\n• **Zadania** - wyodrębniam zadania do wykonania\n\nPo prostu napisz, czego potrzebujesz! 😊`;
    }
    
    if (message.includes('zadania') || message.includes('todo') || message.includes('do zrobienia')) {
      const tasks = [];
      const lines = note.content.split('\n');
      lines.forEach(line => {
        if (line.includes('□') || line.includes('☐') || line.includes('[ ]') || 
            line.includes('-') && (line.includes('zrób') || line.includes('wykonaj'))) {
          tasks.push(line.trim());
        }
      });
      
      return tasks.length > 0 
        ? `✅ **Znalezione zadania:**\n\n${tasks.map((task, i) => `${i + 1}. ${task}`).join('\n')}`
        : `📝 **Brak zadań:** W notatce nie znalazłem konkretnych zadań do wykonania. Może dodać listę rzeczy do zrobienia?`;
    }
    
    // Domyślna odpowiedź
    return `🤔 Interesujące pytanie! Na podstawie Twojej notatki "${note.title}" mogę pomóc w analizie treści. Spróbuj zapytać o podsumowanie, statystyki, usprawnienia lub zadania. Możesz też napisać "pomoc" aby zobaczyć wszystkie moje możliwości.`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    // Symulacja myślenia bota
    setTimeout(() => {
      const botResponse = {
        id: Date.now(), // Użyj timestamp dla unikalności
        type: 'bot',
        text: generateBotResponse(currentInput)
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="chatbot-title">
            <SmartToyIcon className="chatbot-icon" />
            <span>Asystent notatki</span>
          </div>
          <button className="chatbot-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <div ref={chatBodyRef} className="chatbot-messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'bot' ? <SmartToyIcon /> : <PersonIcon />}
              </div>
              <div className="message-content">
                {message.text.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">
                <SmartToyIcon />
              </div>
              <div className="message-content typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          {/* Invisible element for scroll target */}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chatbot-input">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Zadaj pytanie o swoją notatkę..."
            rows="2"
          />
          <button onClick={handleSendMessage} disabled={!inputText.trim()}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteChatbot;