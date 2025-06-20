import { useState, useRef, useEffect } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MessageCircle, Send, Sparkles, RotateCcw, Trash2 } from "lucide-react";

export function HomeTab() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatHistory = useQuery(api.chat.getHistory) || [];
  const sendMessage = useAction(api.chat.sendMessage);
  const clearHistory = useMutation(api.chat.clearHistory);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, currentResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage("");
    setIsLoading(true);
    setCurrentResponse("");

    try {
      const response = await sendMessage({ message: userMessage });
      setCurrentResponse(response);
    } catch (error) {
      console.error("Failed to send message:", error);
      setCurrentResponse("I'm having trouble responding right now. Please try again! 💙");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (originalMessage: string) => {
    setIsLoading(true);
    setCurrentResponse("");
    
    try {
      const response = await sendMessage({ message: originalMessage });
      setCurrentResponse(response);
    } catch (error) {
      console.error("Failed to regenerate response:", error);
      setCurrentResponse("I'm having trouble responding right now. Please try again! 💙");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm("Are you sure you want to clear all conversation history? This action cannot be undone.")) {
      await clearHistory();
      setCurrentResponse("");
    }
  };

  const quickPrompts = [
    "Help with bedtime routine 😴",
    "Healthy meal ideas 🍎",
    "Managing tantrums 🎯",
    "Screen time guidelines 📱",
    "Development milestones 🌱"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto p-3 sm:p-4 h-full flex flex-col">
          {/* Welcome Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Your AI Parenting Assistant
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">Ask me anything about parenting, child development, health, and more!</p>
              </div>
              {chatHistory.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear conversation history"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Prompts */}
          {chatHistory.length === 0 && !currentResponse && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Quick Questions
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(prompt.replace(/[😴🍎🎯📱🌱]/g, '').trim())}
                    className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 rounded-xl sm:rounded-2xl hover:from-blue-200 hover:to-purple-200 transition-all text-xs sm:text-sm border border-blue-200/50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages - Scrollable Area */}
          <div className="flex-1 overflow-y-auto mb-4 sm:mb-6 space-y-3 sm:space-y-4 pr-2">
            {chatHistory.map((chat) => (
              <div key={chat._id} className="space-y-3 sm:space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl sm:rounded-3xl rounded-br-lg px-4 sm:px-6 py-3 sm:py-4 max-w-[85%] sm:max-w-2xl shadow-lg">
                    <p className="text-sm sm:text-base leading-relaxed break-words">{chat.message}</p>
                  </div>
                </div>
                
                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl rounded-bl-lg px-4 sm:px-6 py-3 sm:py-4 max-w-[85%] sm:max-w-2xl shadow-lg border border-white/20">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                            {chat.response}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRegenerate(chat.message)}
                          disabled={isLoading}
                          className="mt-2 sm:mt-3 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Regenerate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Current Response */}
            {currentResponse && (
              <div className="flex justify-start">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl rounded-bl-lg px-4 sm:px-6 py-3 sm:py-4 max-w-[85%] sm:max-w-2xl shadow-lg border border-white/20">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                          {currentResponse}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl rounded-bl-lg px-4 sm:px-6 py-3 sm:py-4 shadow-lg border border-white/20">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Form - Fixed at bottom */}
      <div className="bg-gradient-to-t from-white via-white/95 to-transparent p-3 sm:p-4 border-t border-white/20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-2">
              <div className="flex items-end gap-2 sm:gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about parenting..."
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 resize-none text-sm sm:text-base"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
