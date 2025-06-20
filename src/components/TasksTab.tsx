import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function TasksTab() {
  const tasks = useQuery(api.tasks.list) || [];
  const children = useQuery(api.children.list) || [];
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Id<"tasks"> | null>(null);

  const upcomingTasks = tasks.filter(t => !t.completed && t.dueDate > Date.now());
  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate <= Date.now());
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
          <p className="text-gray-600">Manage your parenting tasks and reminders</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all shadow-sm"
        >
          + Add Task
        </button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
          <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
          <div className="text-sm text-red-700">Overdue</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{upcomingTasks.length}</div>
          <div className="text-sm text-blue-700">Upcoming</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
          <div className="text-sm text-green-700">Completed</div>
        </div>
      </div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <TaskSection
          title="⚠️ Overdue Tasks"
          tasks={overdueTasks}
          bgColor="bg-red-50"
          borderColor="border-red-200"
          onEdit={setEditingTask}
        />
      )}

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <TaskSection
          title="📅 Upcoming Tasks"
          tasks={upcomingTasks}
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
          onEdit={setEditingTask}
        />
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <TaskSection
          title="✅ Completed Tasks"
          tasks={completedTasks.slice(0, 5)}
          bgColor="bg-green-50"
          borderColor="border-green-200"
          onEdit={setEditingTask}
        />
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks yet</h3>
          <p className="text-gray-500 mb-6">Add your first task to get organized</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Add Your First Task
          </button>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingTask) && (
        <TaskForm
          taskId={editingTask}
          children={children}
          onClose={() => {
            setShowAddForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

function TaskSection({ title, tasks, bgColor, borderColor, onEdit }: {
  title: string;
  tasks: any[];
  bgColor: string;
  borderColor: string;
  onEdit: (id: Id<"tasks">) => void;
}) {
  return (
    <div className={`${bgColor} rounded-2xl p-6 border ${borderColor}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={() => onEdit(task._id)} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, onEdit }: { task: any; onEdit: () => void }) {
  const toggleTask = useMutation(api.tasks.toggle);
  const removeTask = useMutation(api.tasks.remove);

  const handleToggle = () => {
    toggleTask({ id: task._id });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      removeTask({ id: task._id });
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      feeding: "🍼",
      napping: "😴",
      medicine: "💊",
      activity: "🎮",
      other: "📝",
    };
    return icons[category] || "📝";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[priority] || colors.low;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-500"
          }`}
        >
          {task.completed && "✓"}
        </button>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCategoryIcon(task.category)}</span>
              <h4 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                {task.title}
              </h4>
            </div>
            <div className="flex gap-1">
              <button
                onClick={onEdit}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              >
                ✏️
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>

          {task.description && (
            <p className={`text-sm mb-2 ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm">
            <span className={`px-2 py-1 rounded-full border text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority} priority
            </span>
            
            {task.childName && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs border border-purple-200">
                👶 {task.childName}
              </span>
            )}

            <span className={`text-xs ${task.isOverdue ? "text-red-600 font-medium" : "text-gray-500"}`}>
              {task.isOverdue ? "Overdue" : new Date(task.dueDate).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskForm({ taskId, children, onClose }: {
  taskId: Id<"tasks"> | null;
  children: any[];
  onClose: () => void;
}) {
  const tasks = useQuery(api.tasks.list) || [];
  const task = taskId ? tasks.find(t => t._id === taskId) : null;

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(
    task ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
  );
  const [childId, setChildId] = useState(task?.childId || "");
  const [category, setCategory] = useState(task?.category || "other");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [recurring, setRecurring] = useState(task?.recurring || "");

  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const taskData = {
        title,
        description: description || undefined,
        dueDate: new Date(dueDate).getTime(),
        childId: childId ? (childId as Id<"children">) : undefined,
        category,
        priority,
        recurring: recurring || undefined,
      };

      if (taskId) {
        await updateTask({ id: taskId, ...taskData });
      } else {
        await createTask(taskData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {taskId ? "Edit Task" : "Add New Task"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Child (Optional)
            </label>
            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a child</option>
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="feeding">🍼 Feeding</option>
                <option value="napping">😴 Napping</option>
                <option value="medicine">💊 Medicine</option>
                <option value="activity">🎮 Activity</option>
                <option value="other">📝 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recurring (Optional)
            </label>
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">No repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              {taskId ? "Update" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
