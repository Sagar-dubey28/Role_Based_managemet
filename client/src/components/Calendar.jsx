import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { taskAPI, adminAPI } from '../lib/api';
import TaskDetailModal from './TaskDetailModal';

export default function Calendar({ currentUser }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [user, setUser] = useState(currentUser);

  // Initialize user from currentUser prop or localStorage
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to parse stored user:', err);
      }
    }
  }, [currentUser]);

  // Fetch tasks based on user role
  useEffect(() => {
    if (user) {
      fetchTasksForCalendar();
    }
  }, [user]);

  const fetchTasksForCalendar = async () => {
    try {
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      let tasks = [];

      if (user.role === 'admin') {
        // Admin sees all tasks
        const res = await adminAPI.getAllTasks();
        tasks = Array.isArray(res.data) ? res.data : (res.data?.tasks || []);
      } else if (user.role === 'manager') {
        // Manager sees all tasks (or team tasks if filtered by backend)
        const res = await taskAPI.getAllTasks();
        tasks = Array.isArray(res.data) ? res.data : (res.data?.tasks || []);
      } else {
        // User sees only their assigned tasks
        const res = await taskAPI.getAssignedTasks();
        tasks = Array.isArray(res.data) ? res.data : (res.data?.tasks || []);
      }

      // Ensure tasks is an array
      if (!Array.isArray(tasks)) {
        tasks = [];
      }

      // Transform tasks to calendar events
      const calendarEvents = tasks
        .filter(task => task && task.dueDate) // Only include tasks with due dates
        .map(task => {
          // Determine event color based on status
          let backgroundColor = '#3b82f6'; // default blue
          let borderColor = '#1e40af';

          if (task.status === 'completed') {
            backgroundColor = '#10b981';
            borderColor = '#059669';
          } else if (task.status === 'in-progress') {
            backgroundColor = '#f59e0b';
            borderColor = '#d97706';
          } else if (task.status === 'pending') {
            backgroundColor = '#6366f1';
            borderColor = '#4f46e5';
          }

          return {
            id: task._id,
            title: task.title,
            start: task.dueDate,
            backgroundColor,
            borderColor,
            extendedProps: {
              ...task,
              backgroundColor,
              borderColor,
            },
          };
        });

      setEvents(calendarEvents);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
    setShowModal(true);
  };

  const handleRefresh = () => {
    fetchTasksForCalendar();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Required</h2>
              <p className="text-gray-600">Please login to view the calendar</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin">
                <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading calendar...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Task Calendar</h1>
              <p className="text-gray-600 mt-2">View and manage tasks on a calendar</p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Calendar Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="calendar-wrapper p-6">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              events={events}
              eventClick={handleEventClick}
              height="auto"
              contentHeight="auto"
              datesSet={(info) => setCurrentDate(info.start)}
              eventDisplay="block"
              eventClassNames={() => ['cursor-pointer', 'hover:opacity-80']}
              dayCellClassNames={() => ['bg-gray-50']}
              slotLabelClassNames={() => ['text-gray-600']}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Status Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-indigo-500"></div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-amber-500"></div>
              <span className="text-sm text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm text-gray-600">Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {showModal && selectedEvent && (
        <TaskDetailModal
          task={selectedEvent}
          onClose={() => {
            setShowModal(false);
            handleRefresh();
          }}
        />
      )}
    </div>
  );
}
