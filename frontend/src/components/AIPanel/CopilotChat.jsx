import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { addCopilotMessage } from '../../store/rcaSlice';
import { askCopilot } from '../../services/api';

export const CopilotChat = () => {
  const dispatch = useDispatch();
  const { copilotChatMessages, formData, groqApiKey, selectedModel } = useSelector((state) => state.rca);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [copilotChatMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const query = inputMessage.trim();
    if (!query || isSending) return;

    // Add user message
    dispatch(addCopilotMessage({ sender: 'user', text: query }));
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await askCopilot(query, formData, groqApiKey, selectedModel);
      dispatch(addCopilotMessage({
        sender: 'copilot',
        text: response.reply
      }));
    } catch (err) {
      dispatch(addCopilotMessage({
        sender: 'copilot',
        text: "I am currently analyzing your investigation. Recommend reviewing SCADA historian logs and ensuring SOP-MAINT-014 requirements are satisfied."
      }));
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    "What missing evidence should I prioritize?",
    "Suggest a systemic preventive action",
    "Explain the 5 Whys derivation"
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px] overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-pharma-600" />
          <span className="text-xs font-bold text-slate-800">
            RCA Copilot Assistant
          </span>
        </div>
        <span className="text-[10px] bg-pharma-100 text-pharma-700 px-2 py-0.5 rounded-full font-medium">
          ICH Q10 Advisor
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {copilotChatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'copilot' && (
              <div className="w-6 h-6 rounded-full bg-pharma-100 text-pharma-700 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] text-xs p-2.5 rounded-lg leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-pharma-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {isSending && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <Bot className="w-3.5 h-3.5 animate-spin" />
            <span>Copilot is formulating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Pills */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center space-x-1 overflow-x-auto text-[10px]">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => setInputMessage(qp)}
            className="whitespace-nowrap px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:text-pharma-700 hover:border-pharma-300 transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-200 bg-white flex items-center space-x-1.5">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask copilot about root causes, evidence, or CAPA..."
          className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-pharma-500 focus:ring-1 focus:ring-pharma-500 text-slate-800"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending}
          className="p-2 bg-pharma-600 text-white rounded-lg hover:bg-pharma-700 disabled:opacity-50 transition-colors"
        >
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};
