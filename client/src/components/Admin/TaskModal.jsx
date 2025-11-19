import React from "react";

export default function TaskModal({ taskForm, setTaskForm, saveTask, users, editTaskData, setTaskModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl">
        <h3 className="text-xl font-bold mb-4">{editTaskData ? "Edit Task" : "Create Task"}</h3>

        <form className="space-y-4" onSubmit={saveTask}>
          <input
            className="w-full p-2 border rounded"
            placeholder="Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          />
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />

          <label className="block font-medium">Assign To</label>
          <select
            className="w-full p-2 border rounded"
            value={taskForm.assignedTo}
            onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
          >
            <option value="">-- Select User or Manager --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Status</label>
              <select
                className="w-full p-2 border rounded"
                value={taskForm.status}
                onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
            <div>
              <label>Priority</label>
              <select
                className="w-full p-2 border rounded"
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <label>Due Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setTaskModal(false)}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-[#2c3e50] text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
