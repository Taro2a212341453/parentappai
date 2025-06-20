import { useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { MapPin, Plus, Clock, Shield, Battery, AlertTriangle, Navigation, Car } from "lucide-react";

export function LocationTab() {
  const locations = useQuery(api.locations.list) || [];
  const children = useQuery(api.children.list) || [];
  const recentCheckIns = useQuery(api.locations.getRecentCheckIns, {}) || [];
  const geofenceAlerts = useQuery(api.locations.getGeofenceAlerts, {}) || [];
  const [showAddLocationForm, setShowAddLocationForm] = useState(false);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'alerts' | 'driving'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Location & Safety
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Track locations, set geofences, and monitor safety</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowAddLocationForm(true)}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl sm:rounded-2xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base flex-1 sm:flex-none justify-center"
              >
                <Plus className="w-4 h-4" />
                Add Location
              </button>
              <button
                onClick={() => setShowCheckInForm(true)}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl sm:rounded-2xl font-medium hover:from-green-600 hover:to-blue-600 transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base flex-1 sm:flex-none justify-center"
              >
                <MapPin className="w-4 h-4" />
                Check In
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-lg border border-white/20">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: MapPin },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
              { id: 'driving', label: 'Driving', icon: Car },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all text-xs sm:text-sm flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label}</span>
                {tab.id === 'alerts' && geofenceAlerts.filter(a => !a.isRead).length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center ml-1">
                    {geofenceAlerts.filter(a => !a.isRead).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab locations={locations} children={children} recentCheckIns={recentCheckIns} />}
        {activeTab === 'history' && <HistoryTab children={children} />}
        {activeTab === 'alerts' && <AlertsTab alerts={geofenceAlerts} />}
        {activeTab === 'driving' && <DrivingTab children={children} />}

        {/* Modals */}
        {showAddLocationForm && (
          <LocationForm onClose={() => setShowAddLocationForm(false)} />
        )}
        {showCheckInForm && (
          <CheckInForm 
            locations={locations} 
            children={children}
            onClose={() => setShowCheckInForm(false)} 
          />
        )}
      </div>
    </div>
  );
}

function OverviewTab({ locations, children, recentCheckIns }: { 
  locations: any[], 
  children: any[], 
  recentCheckIns: any[] 
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{locations.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Locations</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{locations.filter(l => l.isGeofenceEnabled).length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Geofences</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{recentCheckIns.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Check-ins</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Battery className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">{children.filter(c => c.batteryLevel && c.batteryLevel > 20).length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      {locations.length > 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            Your Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {locations.map((location) => (
              <LocationCard key={location._id} location={location} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-lg border border-white/20 text-center">
          <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No locations added yet</h3>
          <p className="text-gray-500 text-sm sm:text-base">Add your first location to start tracking</p>
        </div>
      )}

      {/* Recent Check-ins */}
      {recentCheckIns.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            Recent Check-ins
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {recentCheckIns.slice(0, 5).map((checkIn) => (
              <div key={checkIn._id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{checkIn.locationName}</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {checkIn.childName && `${checkIn.childName} • `}
                    {new Date(checkIn.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryTab({ children }: { children: any[] }) {
  const [selectedChildId, setSelectedChildId] = useState<string>(children[0]?._id || "");
  const locationHistory = useQuery(
    api.locations.getLocationHistory,
    selectedChildId ? { childId: selectedChildId as Id<"children"> } : "skip"
  ) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            Location History
          </h3>
          {children.length > 0 && (
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto"
            >
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {locationHistory.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {locationHistory.map((entry) => (
              <div key={entry._id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm sm:text-base break-words">
                    {entry.address || `${entry.latitude.toFixed(4)}, ${entry.longitude.toFixed(4)}`}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {new Date(entry.timestamp).toLocaleString()}
                    {entry.accuracy && ` • Accuracy: ${entry.accuracy}m`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Navigation className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">No location history available</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AlertsTab({ alerts }: { alerts: any[] }) {
  const markAsRead = useMutation(api.locations.markAlertAsRead);

  const handleMarkAsRead = async (alertId: Id<"geofenceAlerts">) => {
    await markAsRead({ alertId });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          Geofence Alerts
        </h3>

        {alerts.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {alerts.map((alert) => (
              <div key={alert._id} className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
                alert.isRead ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${
                      alert.alertType === 'enter' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        alert.alertType === 'enter' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm sm:text-base break-words">
                        {alert.childName} {alert.alertType === 'enter' ? 'entered' : 'left'} {alert.locationName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(alert._id)}
                      className="px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">No alerts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DrivingTab({ children }: { children: any[] }) {
  const [selectedChildId, setSelectedChildId] = useState<string>(children[0]?._id || "");
  const drivingReports = useQuery(
    api.drivingReports.list,
    selectedChildId ? { childId: selectedChildId as Id<"children"> } : "skip"
  ) || [];
  const weeklySummary = useQuery(
    api.drivingReports.getWeeklySummary,
    selectedChildId ? { childId: selectedChildId as Id<"children"> } : "skip"
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Car className="w-4 h-4 sm:w-5 sm:h-5" />
            Driving Reports
          </h3>
          {children.length > 0 && (
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto"
            >
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {weeklySummary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{weeklySummary.totalTrips}</p>
              <p className="text-xs sm:text-sm text-blue-700">Trips This Week</p>
            </div>
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-100">
              <p className="text-xl sm:text-2xl font-bold text-green-600">{weeklySummary.avgScore}</p>
              <p className="text-xs sm:text-sm text-green-700">Average Score</p>
            </div>
            <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-100">
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{weeklySummary.totalDistance}</p>
              <p className="text-xs sm:text-sm text-purple-700">Miles Driven</p>
            </div>
            <div className="bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-100">
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{weeklySummary.maxSpeed}</p>
              <p className="text-xs sm:text-sm text-orange-700">Max Speed (mph)</p>
            </div>
          </div>
        )}

        {drivingReports.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {drivingReports.slice(0, 10).map((report) => (
              <div key={report._id} className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                <div className="flex items-center justify-between mb-2 gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${
                      report.score >= 80 ? 'bg-green-100' : report.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Car className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        report.score >= 80 ? 'text-green-600' : report.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm sm:text-base break-words">
                        {report.startLocation} → {report.endLocation}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {new Date(report.tripStart).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xl sm:text-2xl font-bold ${
                      report.score >= 80 ? 'text-green-600' : report.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {report.score}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Score</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-600">Distance</p>
                    <p className="font-medium">{report.distance} mi</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Max Speed</p>
                    <p className="font-medium">{report.maxSpeed} mph</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Hard Braking</p>
                    <p className="font-medium">{report.hardBraking}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone Usage</p>
                    <p className="font-medium">{report.phoneUsage} min</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Car className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">No driving reports available</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LocationCard({ location }: { location: any }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-100">
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{location.name}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{location.type}</p>
          </div>
        </div>
        {location.isGeofenceEnabled && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            <span className="text-xs text-green-600 hidden sm:inline">Protected</span>
          </div>
        )}
      </div>
      
      {location.address && (
        <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{location.address}</p>
      )}
      
      {location.geofenceRadius && (
        <p className="text-xs text-gray-500">
          Geofence: {location.geofenceRadius}m radius
        </p>
      )}
    </div>
  );
}

function LocationForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("home");
  const [geofenceRadius, setGeofenceRadius] = useState(100);
  const [isGeofenceEnabled, setIsGeofenceEnabled] = useState(false);

  const createLocation = useMutation(api.locations.create);
  const capitalizeText = useAction(api.aiHealth.capitalizeAndCorrectText);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Auto-capitalize and correct text
      const correctedName = await capitalizeText({ text: name });
      const correctedAddress = address ? await capitalizeText({ text: address }) : "";
      
      await createLocation({
        name: correctedName,
        address: correctedAddress || undefined,
        type,
        geofenceRadius: isGeofenceEnabled ? geofenceRadius : undefined,
        isGeofenceEnabled,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create location:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Add New Location</h3>
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
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address (Optional)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="home">🏠 Home</option>
              <option value="school">🏫 School</option>
              <option value="work">🏢 Work</option>
              <option value="friend">👥 Friend's House</option>
              <option value="activity">🎯 Activity</option>
              <option value="other">📍 Other</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="geofence"
              checked={isGeofenceEnabled}
              onChange={(e) => setIsGeofenceEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="geofence" className="text-sm font-medium text-gray-700">
              Enable geofence alerts
            </label>
          </div>

          {isGeofenceEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geofence Radius (meters)
              </label>
              <input
                type="number"
                value={geofenceRadius}
                onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                min="50"
                max="1000"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          )}

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
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all text-sm sm:text-base"
            >
              Add Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CheckInForm({ locations, children, onClose }: { 
  locations: any[], 
  children: any[], 
  onClose: () => void 
}) {
  const [locationId, setLocationId] = useState("");
  const [childId, setChildId] = useState("");
  const [notes, setNotes] = useState("");

  const checkIn = useMutation(api.locations.checkIn);
  const capitalizeText = useAction(api.aiHealth.capitalizeAndCorrectText);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Auto-capitalize and correct text
      const correctedNotes = notes ? await capitalizeText({ text: notes }) : "";
      
      await checkIn({
        locationId: locationId as Id<"locations">,
        childId: childId ? (childId as Id<"children">) : undefined,
        notes: correctedNotes || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to check in:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Check In</h3>
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
              Location
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Child (Optional)
            </label>
            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="">Select a child</option>
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
              Check In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
