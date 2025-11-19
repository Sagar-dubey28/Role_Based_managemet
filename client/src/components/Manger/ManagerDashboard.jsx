function ManagerDashboard({ users, tasks, setTasks, current }) {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // manager's team = users with role 'user' (for preview)
  const team = users.filter(u => u.role === 'user');
  const teamTasks = tasks.filter(t => team.some(m => m._id === t.assignedTo));
  const myTasks = tasks.filter(t => t.assignedTo === current._id || t.createdBy === current._id || team.some(m=> m._id === t.assignedTo));

  const create = (data)=> { setTasks([...tasks, { ...data, _id: Date.now().toString(), createdBy: current._id }]); setOpenModal(false); };
  const update = (data)=> { setTasks(tasks.map(t=> t._id===editing._id ? {...t, ...data} : t)); setOpenModal(false); };
  const remove = (id)=> setTasks(tasks.filter(t=> t._id!==id));

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
      <aside className="col-span-3 bg-gradient-to-b from-emerald-700 to-emerald-900 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-2xl font-bold">Manager</div>
            <div className="text-sm text-emerald-200">Team lead</div>
          </div>
          <Menu />
        </div>

        <div className="space-y-3">
          <div className="text-sm text-emerald-100">Team Members</div>
          <div className="mt-2 space-y-2">{team.map(m=> <div key={m._id} className="bg-white/10 p-2 rounded">{m.name}</div>)}</div>
        </div>

        <div className="mt-6"><button onClick={()=>setOpenModal(true)} className="w-full py-2 bg-white text-emerald-900 rounded-lg font-semibold">+ Create Task</button></div>
      </aside>

      <main className="col-span-9">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manager Dashboard</h2>
          <div className="flex gap-2">
            <Link to="/admin" className="px-4 py-2 border rounded-lg">Admin</Link>
            <Link to="/user" className="px-4 py-2 border rounded-lg">User View</Link>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SmallStat label="My tasks" value={myTasks.length} />
          <SmallStat label="Assigned to team" value={teamTasks.length} />
          <SmallStat label="Overdue" value={tasks.filter(t=> new Date(t.dueDate) < new Date() && t.status !== 'done').length} warning />
        </section>

        <section className="bg-white rounded-2xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Kanban - Team Tasks</h3>
          <div className="grid grid-cols-3 gap-4">
            <Column title="To Do" tasks={tasks.filter(t=> t.status==='todo' && team.some(x=> x._id===t.assignedTo))} onEdit={(t)=>{ setEditing(t); setOpenModal(true); }} onDelete={remove} />
            <Column title="In Progress" tasks={tasks.filter(t=> t.status==='in-progress' && team.some(x=> x._id===t.assignedTo))} onEdit={(t)=>{ setEditing(t); setOpenModal(true); }} onDelete={remove} />
            <Column title="Done" tasks={tasks.filter(t=> t.status==='done' && team.some(x=> x._id===t.assignedTo))} onEdit={(t)=>{ setEditing(t); setOpenModal(true); }} onDelete={remove} />
          </div>
        </section>
      </main>

      {openModal && <TaskModal users={[...team]} initial={editing} onClose={()=>{ setEditing(null); setOpenModal(false); }} onSave={(data)=>{ if(editing) update(data); else create(data); }} />}
    </div>
  );
}