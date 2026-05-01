import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  Menu,
  Github,
  Zap
} from 'lucide-react';
import { sendMessage, ChatMessage } from './services/geminiService';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendMessage(messages, userMessage);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Error: System failed to synchronize. Please check connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-brand-black font-sans selection:bg-brand-amber/30 selection:text-brand-amber overflow-hidden relative">
      <div className="scanline" />
      
      {/* Sidebar - Mobile Toggle */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 w-64 bg-brand-brown-dark/95 backdrop-blur-xl border-r border-brand-brown-mid z-50 p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-brand-amber/10 border border-brand-amber/30 flex items-center justify-center p-2 rounded-lg">
                <Cpu className="text-brand-amber w-full h-full" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-brand-amber">BotX Pro</span>
            </div>

            <nav className="space-y-4 flex-1">
              <div className="text-[10px] uppercase tracking-[0.2em] text-brand-cream/40 mb-4 px-2">Advanced Modules</div>
              <SidebarItem icon={<Sparkles size={18} />} label="Neural Processing" />
              <SidebarItem icon={<ShieldCheck size={18} />} label="Secure Channel" />
              <SidebarItem icon={<Terminal size={18} />} label="System Logs" />
            </nav>

            <div className="pt-6 border-t border-brand-brown-mid">
              <div className="flex items-center gap-2 text-xs text-brand-cream/60 mb-2 px-2">
                <Zap size={14} className="text-brand-amber" />
                <span>Engine: Gemini 3 Flash</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="w-full py-2 bg-brand-brown-mid hover:bg-brand-amber/20 text-brand-cream text-sm rounded transition-colors"
              >
                Close Panel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative max-w-5xl mx-auto w-full px-4 lg:px-0">
        {/* Header */}
        <header className="h-20 flex items-center justify-between border-b border-brand-brown-mid/50 mb-4 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-brand-brown-dark rounded-lg transition-colors text-brand-amber lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-brand-amber/10 flex items-center justify-center">
                <Cpu className="text-brand-amber w-5 h-5" />
              </div>
              <h1 className="font-display text-xl font-bold amber-glow">BotX <span className="text-brand-cream/60 italic font-medium">Assistant</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-cream/40 px-3 py-1 border border-brand-brown-mid rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               Live Connection
             </div>
             <Github className="w-5 h-5 text-brand-cream/40 cursor-pointer hover:text-brand-amber transition-colors" />
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-8 py-8 px-2 scroll-smooth scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <WelcomeView onSelect={(text) => { setInput(text); }} />
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                   <MessageBubble message={msg} />
                </div>
              ))
            )}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start w-full"
              >
                <div className="glass-brown p-4 rounded-xl flex items-center gap-3 border border-brand-amber/20">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-amber rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-brand-amber rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-brand-amber rounded-full animate-bounce" />
                  </div>
                  <span className="text-xs font-mono text-brand-amber/80 uppercase tracking-tighter">Processing Input...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <footer className="py-8 shrink-0">
          <div className="relative group max-w-3xl mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-amber/20 to-brand-brown-mid/30 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000" />
            <div className="relative glass-brown rounded-2xl border border-brand-brown-mid flex flex-col p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Synchronize with systems..."
                className="w-full bg-transparent p-4 min-h-[60px] max-h-[150px] outline-none text-brand-cream placeholder:text-brand-cream/30 resize-none font-sans"
              />
              <div className="flex items-center justify-between px-2 pb-2">
                <div className="flex gap-1">
                   <div className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-brand-cream/40">
                      <Sparkles size={18} />
                   </div>
                   <div className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-brand-cream/40 underline decoration-brand-amber underline-offset-4 text-[10px] flex items-center tracking-tighter">
                      MOD-01
                   </div>
                </div>
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-brand-amber hover:bg-brand-amber/90 disabled:opacity-30 disabled:cursor-not-allowed text-brand-black p-2.5 rounded-lg transition-all active:scale-95 shadow-lg shadow-brand-amber/20 flex items-center gap-2 group"
                >
                  <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest pl-2">Sync</span>
                  <Send size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-brand-cream/20">
              botx system core via seiborlang project botx • architecture v3.1
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5">
      <div className="text-brand-cream/40 group-hover:text-brand-amber transition-colors">
        {icon}
      </div>
      <span className="text-sm font-medium text-brand-cream/70 group-hover:text-brand-cream transition-colors">{label}</span>
    </div>
  );
}

function WelcomeView({ onSelect }: { onSelect: (text: string) => void }) {
  const suggestions = [
    "Tell me about Seiborlang Project BotX",
    "Explain the aro-dynamic design philosophy",
    "Generate a code snippet for BotX integration",
    "What's your core objective as an AI?"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-2xl mx-auto"
    >
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-brand-amber/20 blur-2xl rounded-full opacity-30 animate-pulse" />
        <div className="relative w-24 h-24 glass-brown rounded-3xl flex items-center justify-center border-2 border-brand-amber/20 pixel-border scale-110">
          <Bot size={48} className="text-brand-amber" />
        </div>
      </div>
      
      <h2 className="text-4xl font-display font-bold mb-4 bg-gradient-to-b from-brand-amber to-brand-amber/50 bg-clip-text text-transparent italic tracking-tight">
        Awakening BotX Pro
      </h2>
      <p className="text-brand-cream/50 mb-12 max-w-md font-sans text-sm leading-relaxed">
        High-performance neural assistance with a signature digital noir aesthetic. System ready for synchronization.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {suggestions.map((text, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(text)}
            className="p-4 text-left glass-brown hover:bg-brand-brown-mid/40 border border-brand-brown-mid rounded-xl group transition-all"
          >
            <div className="flex items-center justify-between text-brand-cream/60 group-hover:text-brand-amber">
               <span className="text-xs font-medium">{text}</span>
               <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isBot = message.role === 'model';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-4 max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center p-1.5 border ${isBot ? 'bg-brand-brown-mid border-brand-amber/30 text-brand-amber' : 'bg-brand-amber border-brand-amber/50 text-brand-black'}`}>
        {isBot ? <Cpu size={18} /> : <User size={18} />}
      </div>
      
      <div className={`group flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={`px-5 py-4 rounded-2xl relative ${
          isBot 
            ? 'glass-brown text-brand-cream/90 border border-brand-brown-mid' 
            : 'bg-brand-amber text-brand-black font-medium border border-brand-amber shadow-lg shadow-brand-amber/10'
        }`}>
          {isBot && (
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <Sparkles size={11} className="text-brand-amber/40" />
            </div>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {message.content}
          </p>
        </div>
        <span className="mt-2 text-[8px] uppercase tracking-[0.2em] text-brand-cream/20 font-mono">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
