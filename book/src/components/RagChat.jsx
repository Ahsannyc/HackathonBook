import React, { useState, useRef, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { useAuth } from '../components/auth/AuthContext';
import { authApi } from '../components/auth/api';
import '../css/rag-chat.css';

const RagChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [sessionId, setSessionId] = useState(() => {
    // Generate a session ID that persists across page reloads
    if (typeof window !== 'undefined') {
      let storedSessionId = localStorage.getItem('ragChatSessionId');
      if (!storedSessionId) {
        storedSessionId = Date.now().toString();
        localStorage.setItem('ragChatSessionId', storedSessionId);
      }
      return storedSessionId;
    }
    return Date.now().toString();
  });

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const { colorMode } = useColorMode();
  const { isAuthenticated, user } = useAuth();

  // Function to get selected text from the page
  const getSelectedText = () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      setSelectedText(selectedText);
      // Auto-focus the input when text is selected
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
    return selectedText;
  };

  // Add event listener for text selection
  useEffect(() => {
    const handleTextSelection = () => {
      const selected = window.getSelection().toString().trim();
      if (selected) {
        setSelectedText(selected);
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keyup', handleTextSelection);
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (isSelectedTextQuery = false) => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message to chat
    const newMessages = [...messages, { type: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      if (isSelectedTextQuery && selectedText) {
        // Send selected text query using auth API
        const data = await authApi.selectedTextQuery({
          query: userMessage,
          selected_text: selectedText,
          session_id: sessionId
        });

        setMessages(prev => [...prev, {
          type: 'bot',
          content: data.answer,
          sources: [] // No sources for selected text queries
        }]);
      } else {
        // Send general query using auth API
        const data = await authApi.query({
          query: userMessage,
          session_id: sessionId
        });

        setMessages(prev => [...prev, {
          type: 'bot',
          content: data.answer,
          sources: data.source_chunks || []
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        sources: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSubmitSelectedText = (e) => {
    e.preventDefault();
    if (selectedText) {
      sendMessage(true); // true indicates selected text query
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className={`rag-chat-container ${colorMode}`}>
      <div className="rag-chat-header">
        <h3>🤖 Robotics Textbook Assistant</h3>
        <button onClick={clearChat} className="clear-chat-btn">Clear Chat</button>
      </div>

      <div className="rag-chat-messages">
        {messages.length === 0 ? (
          <div className="rag-chat-welcome">
            {isAuthenticated ? (
              <>
                <p>Welcome back, {user?.email}! Ask me anything about the robotics textbook content.</p>
                <p>• Type a question above for general answers</p>
                <p>• Select text on the page and click "Ask About Selected Text" for specific answers</p>
              </>
            ) : (
              <>
                <p>Ask me anything about the robotics textbook content!</p>
                <p>• Type a question above for general answers</p>
                <p>• Select text on the page and click "Ask About Selected Text" for specific answers</p>
                <p><a href="/auth/signup">Sign up</a> or <a href="/auth/signin">sign in</a> to personalize your experience.</p>
              </>
            )}
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`rag-message ${msg.type}`}>
              <div className="message-content">
                {msg.content}
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="message-sources">
                  <details>
                    <summary>Sources</summary>
                    <ul>
                      {msg.sources.slice(0, 3).map((source, idx) => (
                        <li key={idx}>
                          <small>Source: {source.source || 'Unknown'}</small>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="rag-message bot">
            <div className="message-content">
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

      {selectedText && (
        <div className="selected-text-preview">
          <p><strong>Selected Text:</strong> "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"</p>
          <button
            onClick={handleSubmitSelectedText}
            disabled={isLoading || !inputValue.trim()}
            className="ask-selected-btn"
          >
            Ask About Selected Text
          </button>
        </div>
      )}

      <form className="rag-chat-input-form" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the robotics textbook..."
            disabled={isLoading}
            rows={3}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="send-btn"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RagChat;