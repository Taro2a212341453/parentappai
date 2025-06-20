import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { HomeTab } from "./components/HomeTab";
import { KidsTab } from "./components/KidsTab";
import { TasksTab } from "./components/TasksTab";
import { HealthTab } from "./components/HealthTab";
import { LocationTab } from "./components/LocationTab";
import { MessageCircle, Users, CheckSquare, Heart, MapPin } from "lucide-react";

type Tab = 'home' | 'kids' | 'tasks' | 'health' | 'location';

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <img 
                src="https://cdn.discordapp.com/attachments/746888503387750481/1385405624954650664/ChatGPT_Image_Jun_19_2025_07_45_39_PM.png?ex=6855f308&is=6854a188&hm=62f4d8aaac735a2896fdbf2e2e1fd9b52ebdcfd99474bb119a3b085a6deac667&"
                alt="Nestly Logo"
                className="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-lg"
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Nestly
              </h1>
              <p className="text-gray-600">Your AI-powered parenting assistant</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <SignInForm />
            </div>
          </div>
        </div>
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedApp />
      </Authenticated>
    </main>
  );
}

function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const user = useQuery(api.auth.loggedInUser);

  const tabs = [
    { id: 'home' as Tab, label: 'Chat', icon: MessageCircle, emoji: '💬' },
    { id: 'kids' as Tab, label: 'My Kids', icon: Users, emoji: '👶' },
    { id: 'tasks' as Tab, label: 'Tasks', icon: CheckSquare, emoji: '✅' },
    { id: 'health' as Tab, label: 'Health', icon: Heart, emoji: '🏥' },
    { id: 'location' as Tab, label: 'Location', icon: MapPin, emoji: '📍' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'kids':
        return <KidsTab />;
      case 'tasks':
        return <TasksTab />;
      case 'health':
        return <HealthTab />;
      case 'location':
        return <LocationTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="https://cdn.discordapp.com/attachments/746888503387750481/1385405624954650664/ChatGPT_Image_Jun_19_2025_07_45_39_PM.png?ex=6855f308&is=6854a188&hm=62f4d8aaac735a2896fdbf2e2e1fd9b52ebdcfd99474bb119a3b085a6deac667&"
                alt="Nestly Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl shadow-md"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Nestly
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">AI Parenting Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {user && (
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">
                    Welcome, {user.name || user.email}
                  </p>
                </div>
              )}
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 z-50">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-around py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 shadow-lg scale-105'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                }`}
              >
                <div className="relative">
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  {activeTab === tab.id && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
