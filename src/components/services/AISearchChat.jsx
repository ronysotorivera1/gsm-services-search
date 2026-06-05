import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Loader2, Bot } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function AISearchChat({ onSearchChange }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const initConversation = async () => {
    if (conversation) return conversation;
    const conv = await base44.agents.createConversation({
      agent_name: 'gsm_assistant',
      metadata: { name: 'Búsqueda IA' }
    });
    setConversation(conv);
    return conv;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const conv = await initConversation();
      setMessages(prev => [...prev, { role: 'assistant', content: null }]);

      const unsubscribe = base44.agents.subscribeToConversation(conv.id, (data) => {
        const msgs = data.messages || [];
        const assistantMsgs = msgs.filter(m => m.role === 'assistant');
        const last = assistantMsgs[assistantMsgs.length - 1];
        if (last?.content) {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: last.content };
            return updated;
          });
        }
      });

      await base44.agents.addMessage(conv, { role: 'user', content: text });

      setTimeout(() => {
        unsubscribe();
        setLoading(false);
      }, 8000);
    } catch (e) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: 'Hubo un error. Intenta de nuevo.' };
        return updated;
      });
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '¡Hola! 👋 Cuéntame qué dispositivo o problema tienes y te ayudo a encontrar el servicio correcto.'
      }]);
    }
  };

  return (
    <div className="relative">
      {/* Botón IA en el buscador */}
      <button
        type="button"
        onClick={open ? () => setOpen(false) : handleOpen}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          open
            ? 'bg-primary text-white'
            : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>IA</span>
      </button>

      {/* Panel de chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-primary/20 rounded-xl shadow-xl z-50 flex flex-col overflow-hidden"
            style={{ maxHeight: '420px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-primary/10">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Asistente GSM</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: '300px' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}>
                    {msg.content === null
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : msg.content
                    }
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ej: iPhone 13 bloqueado por iCloud..."
                className="flex-1 text-sm border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 bg-background"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}