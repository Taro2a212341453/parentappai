import { useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Heart, Plus, TrendingUp, Calendar, Pill, Utensils, Moon, Smile, Sparkles } from "lucide-react";

export function HealthTab() {
  const children = useQuery(api.children.list) || [];
  const healthLogs = useQuery(api.healthLogs.list, {}) || [];
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>(children[0]?._id || "");
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'trends'>('overview');

  const filteredLogs = selectedChild 
    ? healthLogs.filter(log => log.childId === selectedChild)
    : healthLogs;

  const weeklySummary = useQuery(
    api.healthLogs.getWeeklySummary,
    selectedChild ? { childId: selectedChild as Id<"children"> } : "skip"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Health & Wellness
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Track your family's health with smart insights</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {children.length > 0 && (
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="px-3 sm:px-4 py-2 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80 text-sm sm:text-base flex-1 sm:flex-none"
                >
                  <option value="">All Children</option>
                  {children.map((child) => (
                    <option key={child._id} value={child._id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={() => setShowAddForm(true)}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl sm:rounded-2xl font-medium hover:from-green-600 hover:to-blue-600 transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base flex-1 sm:flex-none justify-center"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-lg border border-white/20">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: Heart },
              { id: 'logs', label: 'Health Logs', icon: Calendar },
              { id: 'trends', label: 'Insights', icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all text-xs sm:text-sm flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab 
            weeklySummary={weeklySummary} 
            recentLogs={filteredLogs.slice(0, 5)} 
            selectedChild={selectedChild}
            children={children}
          />
        )}
        {activeTab === 'logs' && <LogsTab logs={filteredLogs} />}
        {activeTab === 'trends' && <TrendsTab logs={filteredLogs} selectedChild={selectedChild} />}

        {/* Add Form Modal */}
        {showAddForm && (
          <HealthLogForm
            children={children}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
}

function OverviewTab({ weeklySummary, recentLogs, selectedChild, children }: {
  weeklySummary: any;
  recentLogs: any[];
  selectedChild: string;
  children: any[];
}) {
  const selectedChildData = children.find(c => c._id === selectedChild);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Weekly Summary */}
      {weeklySummary && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">This Week's Summary {selectedChildData && `- ${selectedChildData.name}`}</span>
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{weeklySummary.totalEntries}</p>
                  <p className="text-xs sm:text-sm text-blue-700">Total Entries</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-green-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{weeklySummary.mealCount}</p>
                  <p className="text-xs sm:text-sm text-green-700">Meals Logged</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">{weeklySummary.sleepCount}</p>
                  <p className="text-xs sm:text-sm text-purple-700">Sleep Logs</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-yellow-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600">{weeklySummary.moodEntries.length}</p>
                  <p className="text-xs sm:text-sm text-yellow-700">Mood Entries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Logs */}
      {recentLogs.length > 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            Recent Health Logs
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {recentLogs.map((log) => (
              <HealthLogCard key={log._id} log={log} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-lg border border-white/20 text-center">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No health logs yet</h3>
          <p className="text-gray-500 text-sm sm:text-base">Start tracking your family's health and wellness</p>
        </div>
      )}
    </div>
  );
}

function LogsTab({ logs }: { logs: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          All Health Logs
        </h3>
        
        {logs.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {logs.map((log) => (
              <HealthLogCard key={log._id} log={log} showDelete />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">No health logs available</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TrendsTab({ logs, selectedChild }: { logs: any[], selectedChild: string }) {
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const generateAnalysis = useAction(api.aiHealth.generateTrendAnalysis);
  
  const moodLogs = logs.filter(l => l.type === 'mood');
  const sleepLogs = logs.filter(l => l.type === 'sleep');
  const mealLogs = logs.filter(l => l.type === 'meal');

  const handleGenerateAnalysis = async () => {
    if (!selectedChild) return;
    setIsLoadingAnalysis(true);
    try {
      const analysis = await generateAnalysis({ childId: selectedChild as Id<"children"> });
      setAiAnalysis(analysis);
    } catch (error) {
      setAiAnalysis("Unable to generate analysis. Please try again later. 🔄");
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* AI Analysis */}
      {selectedChild && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              Health Insights ✨
            </h3>
            <button
              onClick={handleGenerateAnalysis}
              disabled={isLoadingAnalysis}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              {isLoadingAnalysis ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Insights
                </>
              )}
            </button>
          </div>
          {aiAnalysis && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm sm:text-base">
                {aiAnalysis}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
          <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            Mood Trends 😊
          </h4>
          {moodLogs.length > 0 ? (
            <div className="space-y-2">
              {moodLogs.slice(0, 5).map((log) => (
                <div key={log._id} className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-sm sm:text-lg">{log.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-xs sm:text-sm">No mood data available</p>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
          <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            Sleep Patterns 😴
          </h4>
          {sleepLogs.length > 0 ? (
            <div className="space-y-2">
              {sleepLogs.slice(0, 5).map((log) => (
                <div key={log._id} className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">{log.value} hours</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-xs sm:text-sm">No sleep data available</p>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
          <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            Meal Tracking 🍽️
          </h4>
          {mealLogs.length > 0 ? (
            <div className="space-y-2">
              {mealLogs.slice(0, 5).map((log) => (
                <div key={log._id} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">{log.value.substring(0, 15)}...</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-xs sm:text-sm">No meal data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

function HealthLogCard({ log, showDelete = false }: { log: any; showDelete?: boolean }) {
  const removeLog = useMutation(api.healthLogs.remove);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this health log?")) {
      await removeLog({ id: log._id });
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactElement> = {
      meal: <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />,
      sleep: <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />,
      mood: <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />,
      symptom: <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />,
      medicine: <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
    };
    return icons[type] || <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      meal: "bg-green-50 border-green-200",
      sleep: "bg-purple-50 border-purple-200",
      mood: "bg-yellow-50 border-yellow-200",
      symptom: "bg-red-50 border-red-200",
      medicine: "bg-blue-50 border-blue-200",
    };
    return colors[type] || "bg-gray-50 border-gray-200";
  };

  const getTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      meal: "🍽️",
      sleep: "😴",
      mood: "😊",
      symptom: "🤒",
      medicine: "💊",
    };
    return emojis[type] || "📝";
  };

  return (
    <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${getTypeColor(log.type)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 sm:gap-3 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            {getTypeIcon(log.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-lg">{getTypeEmoji(log.type)}</span>
              <h4 className="font-medium text-gray-800 capitalize text-sm sm:text-base">{log.type}</h4>
              <span className="px-2 py-1 bg-white rounded-full text-xs text-gray-600">
                {log.childName}
              </span>
            </div>
            <p className="text-gray-700 mt-1 text-sm sm:text-base break-words">
              {log.type === 'sleep' ? `${log.value} hours` : log.value}
            </p>
            {log.notes && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{log.notes}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        {showDelete && (
          <button
            onClick={handleDelete}
            className="p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

function HealthLogForm({ children, onClose }: {
  children: any[];
  onClose: () => void;
}) {
  const [childId, setChildId] = useState(children[0]?._id || "");
  const [type, setType] = useState("meal");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const createLog = useMutation(api.healthLogs.create);
  const validateInput = useAction(api.aiHealth.validateHealthInput);
  const capitalizeText = useAction(api.aiHealth.capitalizeAndCorrectText);

  const handleValueChange = async (newValue: string) => {
    setValue(newValue);
    
    if (newValue.trim() && (type === 'mood' || type === 'meal' || type === 'symptom' || type === 'medicine')) {
      setIsValidating(true);
      try {
        const result = await validateInput({ type, value: newValue });
        if (!result.isValid && result.suggestion) {
          setValidationMessage(result.suggestion);
        } else {
          setValidationMessage("");
        }
      } catch (error) {
        setValidationMessage("");
      } finally {
        setIsValidating(false);
      }
    } else {
      setValidationMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Auto-capitalize and correct text
      const correctedValue = type !== 'sleep' ? await capitalizeText({ text: value }) : value;
      const correctedNotes = notes ? await capitalizeText({ text: notes }) : "";
      
      await createLog({
        childId: childId as Id<"children">,
        type,
        value: correctedValue,
        notes: correctedNotes || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create health log:", error);
    }
  };

  const getPlaceholder = (type: string) => {
    const placeholders: Record<string, string> = {
      meal: "e.g., Breakfast - oatmeal with berries, sushi, tacos",
      sleep: "Hours of sleep (e.g., 8, 7.5, 9)",
      mood: "e.g., happy, sad, excited, anxious, content",
      symptom: "e.g., mild fever, runny nose, headache",
      medicine: "e.g., Tylenol 5ml, vitamin D, ibuprofen",
    };
    return placeholders[type] || "Enter details...";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Add Health Log 📝</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Child
            </label>
            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              required
            >
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setValue("");
                setValidationMessage("");
              }}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            >
              <option value="meal">🍽️ Meal</option>
              <option value="sleep">😴 Sleep</option>
              <option value="mood">😊 Mood</option>
              <option value="symptom">🤒 Symptom</option>
              <option value="medicine">💊 Medicine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Details {type === 'sleep' && '(hours)'}
            </label>
            {type === 'sleep' ? (
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="8"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                required
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder={getPlaceholder(type)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                required
              />
            )}
            {isValidating && (
              <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Validating...
              </p>
            )}
            {validationMessage && (
              <p className="text-sm text-orange-600 mt-1">{validationMessage}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-blue-600 transition-all text-sm sm:text-base"
            >
              Add Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
