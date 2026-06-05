import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, LogIn, X, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function AISearchChat({ active, onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: '¡Hola! 👋 Cuéntame qué dispositivo o problema tienes y te ayudo a encontrar el servicio correcto.'
  }]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const conversationRef = useRef(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(setIsAuthenticated);
  }, []);

  useEffect(() => {
    if (active && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [active]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const initConversation = async () => {
    if (conversationRef.current) return conversationRef.current;
    const conv = await base44.agents.createConversation({
      agent_name: 'gsm_assistant',
      metadata: { name: 'Búsqueda IA' }
    });
    conversationRef.current = conv;
    return conv;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    let conv;
    try {
      conv = await initConversation();
    } catch (e) {
      conversationRef.current = null;
      setMessages(prev => [...prev, { role: 'assistant', content: 'No se pudo conectar. Intenta de nuevo.' }]);
      setLoading(false);
      return;
    }

    setMessages(prev => [...prev, { role: 'assistant', content: null }]);

    let unsubscribe;
    try {
      unsubscribe = base44.agents.subscribeToConversation(conv.id, (data) => {
        const msgs = data.messages || [];
        const assistantMsgs = msgs.filter(m => m.role === 'assistant');
        const last = assistantMsgs[assistantMsgs.length - 1];
        if (last?.content) {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: last.content };
            return updated;
          });
          setLoading(false);
        }
      });

      await base44.agents.addMessage(conv, { role: 'user', content: text });

      setTimeout(() => {
        if (unsubscribe) unsubscribe();
        setLoading(false);
      }, 15000);
    } catch (e) {
      if (unsubscribe) unsubscribe();
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: 'Hubo un error. Intenta de nuevo.' };
        return updated;
      });
      setLoading(false);
    }
  };

  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      className="w-full mt-2 bg-white border border-primary/20 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-primary/5 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Asistente IA GSM</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={base44.agents.getWhatsAppConnectURL('gsm_assistant')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 text-xs font-semibold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      {isAuthenticated === false ? (
        <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
          <Bot className="w-8 h-8 text-primary/50" />
          <div>
            <p className="font-semibold text-foreground text-sm">Inicia sesión para usar el Asistente IA</p>
            <p className="text-xs text-muted-foreground mt-1">El asistente está disponible para usuarios registrados</p>
          </div>
          <button
            onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </button>
        </div>
      ) : (
        <>
          {/* Mensajes */}
          <div className="overflow-y-auto p-3 space-y-2.5" style={{ maxHeight: '280px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
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

          {/* Input integrado */}
          <div className="p-3 border-t border-border flex gap-2">
            <input
              ref={inputRef}
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}