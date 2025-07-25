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
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: `
                
                  You are an assistant specialized in LumaAccess — a remote device access and control system.
  You help users with questions about how to use LumaAccess, features, troubleshooting, device access requests, and security.
  Provide clear, helpful, and concise answers only related to LumaAccess.
  If the question is unrelated, politely say you can only help with LumaAccess topics.

            ` },
            ...messages,
            userMessage,
          ],
        }),
      });

      const data = await res.json();
      const botMessage = data.choices[0].message;
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
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
