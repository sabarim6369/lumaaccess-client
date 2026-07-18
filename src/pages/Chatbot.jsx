import { useState } from 'react';
import './chatbot.css'; 
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer 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`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'You are an assistant specialized in LumaAccess — a remote device access and control system. You help users with questions about how to use LumaAccess, features, troubleshooting, device access requests, and security. Provide clear, helpful, and concise answers only related to LumaAccess. If the question is unrelated, politely say you can only help with LumaAccess topics.' },
            ...messages,
            userMessage,
          ],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Response Error:', res.status, errorText);
        setMessages((prev) => [...prev, { role: 'assistant', content: `API Error (${res.status}): Please check your connection and try again.` }]);
        return;
      }

      const data = await res.json();
      
      if (data.error) {
        console.error('API Error:', data.error);
        setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${data.error.message || 'Unknown error'}` }]);
        return;
      }
      
      if (!data.choices || data.choices.length === 0) {
        console.error('No response from API');
        setMessages((prev) => [...prev, { role: 'assistant', content: 'No response generated. Please try again.' }]);
        return;
      }
      
      const botMessage = data.choices[0].message;
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error: Please check your connection and try again.' }]);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {!open && (
        <button className="chatbot-icon" onClick={() => setOpen(true)}>
          💬
        </button>
      )}
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>AI Assistant</span>
            <button className="close-btn" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.content}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
