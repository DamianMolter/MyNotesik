import { useState, useRef, useEffect } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";

function NoteChatbot({ note, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: `Cześć! 👋 Jestem Twoim coachem i doradcą. Pomogę Ci w rozwiązaniu problemu dotyczącego: "${note.title}". Czym mogę Ci służyć?`,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const chatBodyRef = useRef();
  const messagesEndRef = useRef();

  // Funkcja do płynnego przewijania na dół
  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll po każdej zmianie wiadomości lub stanu typing
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-scroll po otwarciu chatbota
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [isOpen]);

  
const generateBotResponse = async (userMessage) => {
  try {
    setError(null);

    // Sprawdź czy klucz API jest dostępny
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY;
    console.log('API Key available:', !!apiKey);
    console.log('import.meta.env:', import.meta.env);
    
    if (!apiKey) {
      throw new Error('Brak klucza API. Sprawdź plik .env');
    }

    // Przygotuj kontekst z treścią notatki
    const noteContext = `Tytuł notatki: ${note.title}
Treść notatki: ${note.content || "Brak treści"}`;

    const prompt = `Jesteś doświadczonym coachem i psychologiem, który pomaga użytkownikom w rozwiązywaniu ich problemów. 
Odpowiadaj po polsku w sposób pomocny i przyjazny.

Kontekst notatki:
${noteContext}

Pytanie użytkownika: ${userMessage}

Odpowiedz w kontekście tej notatki.`;

    // Uproszczona struktura requestBody
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    console.log('Request URL:', url.replace(apiKey, 'HIDDEN_KEY'));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      throw new Error(`API Error: ${data.error.message}`);
    } else {
      console.error('Unexpected API response structure:', data);
      throw new Error("Nieprawidłowa odpowiedź z API");
    }
  } catch (error) {
    console.error("Błąd podczas komunikacji z Gemini API:", error);
    setError(error.message);
    return generateFallbackResponse(userMessage);
  }
};

  // Funkcja fallback na wypadek problemów z API
  const generateFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    if (message.includes("podsumuj") || message.includes("streszczenie")) {
      return `Nie mogę obecnie połączyć się z AI, ale mogę powiedzieć, że Twoja notatka "${
        note.title
      }" ${
        note.content
          ? "zawiera treść, którą możesz przeanalizować samodzielnie"
          : "nie ma jeszcze treści"
      }. Spróbuj ponownie za moment.`;
    }

    if (message.includes("analiza") || message.includes("analizuj")) {
      return `Przepraszam, mam obecnie problemy z połączeniem do AI. Twoja notatka "${note.title}" jest gotowa do analizy po przywróceniu połączenia.`;
    }

    if (message.includes("usprawnienie") || message.includes("poprawa")) {
      return `Nie mogę teraz uzyskać dostępu do AI, ale ogólnie sugeruję przejrzenie struktury i jasności treści w notatce "${note.title}".`;
    }

    if (message.includes("pytanie") || message.includes("?")) {
      return `Przepraszam, obecnie nie mogę odpowiedzieć na szczegółowe pytania o notatkę ze względu na problemy z połączeniem AI. Spróbuj ponownie za chwilę.`;
    }

    return `Przepraszam, mam obecnie problemy z połączeniem do AI. Spróbuj zadać pytanie ponownie za moment. Błąd: ${
      error || "Nieznany błąd"
    }`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputText,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const botResponseText = await generateBotResponse(currentInput);

      const botResponse = {
        id: Date.now(),
        type: "bot",
        text: botResponseText,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        id: Date.now(),
        type: "bot",
        text: `Przepraszam, wystąpił błąd podczas generowania odpowiedzi. Spróbuj ponownie za moment.`,
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
            {error && (
              <span className="error-indicator" title={`Błąd: ${error}`}>
                ⚠️
              </span>
            )}
          </div>
          <button className="chatbot-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div ref={chatBodyRef} className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === "bot" ? <SmartToyIcon /> : <PersonIcon />}
              </div>
              <div className="message-content">
                {message.text.split("\n").map((line, i) => (
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

          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Zadaj pytanie o swoją notatkę..."
            rows="2"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteChatbot;
