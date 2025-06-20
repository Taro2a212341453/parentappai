import { useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Users, Plus, Calendar, MapPin, Battery, Edit, Trash2 } from "lucide-react";

export function KidsTab() {
  const children = useQuery(api.children.list) || [];
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChild, setEditingChild] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                My Kids
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your children's profiles and information</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl sm:rounded-2xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              Add Child
            </button>
          </div>
        </div>

        {/* Children Grid */}
        {children.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {children.map((child) => (
              <ChildCard 
                key={child._id} 
                child={child} 
                onEdit={() => setEditingChild(child)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-lg border border-white/20 text-center">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No children added yet</h3>
            <p className="text-gray-500 text-sm sm:text-base mb-4">Add your first child to get started with tracking</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl sm:rounded-2xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg text-sm sm:text-base"
            >
              Add Your First Child
            </button>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {(showAddForm || editingChild) && (
          <ChildForm
            child={editingChild}
            onClose={() => {
              setShowAddForm(false);
              setEditingChild(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function ChildCard({ child, onEdit }: { child: any; onEdit: () => void }) {
  const removeChild = useMutation(api.children.remove);
  
  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${child.name}'s profile?`)) {
      await removeChild({ id: child._id });
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const age = calculateAge(child.birthDate);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
            {child.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">{child.name}</h3>
            <p className="text-sm sm:text-base text-gray-600">{age} years old</p>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={onEdit}
            className="p-1 sm:p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Born: {new Date(child.birthDate).toLocaleDateString()}</span>
        </div>

        {child.allergies && child.allergies.length > 0 && (
          <div className="text-sm sm:text-base text-gray-600">
            <span className="font-medium">Allergies:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {child.allergies.map((allergy: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {child.notes && (
          <div className="text-sm sm:text-base text-gray-600">
            <span className="font-medium">Notes:</span>
            <p className="mt-1 text-gray-700 break-words">{child.notes}</p>
          </div>
        )}

        {child.batteryLevel !== undefined && (
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Battery className={`w-4 h-4 ${child.batteryLevel > 20 ? 'text-green-600' : 'text-red-600'}`} />
            <span className={child.batteryLevel > 20 ? 'text-green-600' : 'text-red-600'}>
              Device: {child.batteryLevel}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ChildForm({ child, onClose }: { child?: any; onClose: () => void }) {
  const [name, setName] = useState(child?.name || "");
  const [birthDate, setBirthDate] = useState(child?.birthDate || "");
  const [allergies, setAllergies] = useState<string[]>(child?.allergies || []);
  const [notes, setNotes] = useState(child?.notes || "");
  const [newAllergy, setNewAllergy] = useState("");

  const createChild = useMutation(api.children.create);
  const updateChild = useMutation(api.children.update);
  const capitalizeText = useAction(api.aiHealth.capitalizeAndCorrectText);

  const addAllergy = async () => {
    if (newAllergy.trim()) {
      const correctedAllergy = await capitalizeText({ text: newAllergy.trim() });
      setAllergies([...allergies, correctedAllergy]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Auto-capitalize and correct text
      const correctedName = await capitalizeText({ text: name });
      const correctedNotes = notes ? await capitalizeText({ text: notes }) : "";
      
      if (child) {
        await updateChild({
          id: child._id,
          name: correctedName,
          birthDate,
          allergies,
          notes: correctedNotes || undefined,
        });
      } else {
        await createChild({
          name: correctedName,
          birthDate,
          allergies,
          notes: correctedNotes || undefined,
        });
      }
      onClose();
    } catch (error) {
      console.error("Failed to save child:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            {child ? 'Edit Child' : 'Add New Child'}
          </h3>
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergies
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add allergy..."
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              />
              <button
                type="button"
                onClick={addAllergy}
                className="px-3 sm:px-4 py-2 bg-purple-500 text-white rounded-lg sm:rounded-xl hover:bg-purple-600 transition-colors text-sm sm:text-base"
              >
                Add
              </button>
            </div>
            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center gap-1"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              placeholder="Any additional notes about your child..."
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
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all text-sm sm:text-base"
            >
              {child ? 'Update' : 'Add'} Child
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
