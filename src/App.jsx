import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, Check,
  CheckCheck, ChevronDown, CircleHelp, Clock3, Command, Filter, FolderKanban,
  LayoutDashboard, ListTodo, LogOut, Menu, MoreHorizontal, Plus, Search,
  Settings2, Sparkles, Target, TrendingUp, Users, X, Zap
} from "lucide-react";

const initialTasks = [
  { id: 1, title: "Finalize onboarding flow", project: "Website redesign", status: "In progress", priority: "High", due: "Today", initials: "AK", color: "bg-violet-100 text-violet-700" },
  { id: 2, title: "Review homepage wireframes", project: "Website redesign", status: "In review", priority: "Medium", due: "Today", initials: "MS", color: "bg-amber-100 text-amber-700" },
  { id: 3, title: "Set up analytics events", project: "Mobile app", status: "To do", priority: "High", due: "Oct 16", initials: "JD", color: "bg-sky-100 text-sky-700" },
  { id: 4, title: "Prepare launch email copy", project: "Marketing site", status: "In progress", priority: "Low", due: "Oct 17", initials: "AL", color: "bg-pink-100 text-pink-700" },
  { id: 5, title: "Optimize image assets", project: "Website redesign", status: "Done", priority: "Medium", due: "Oct 12", initials: "MS", color: "bg-amber-100 text-amber-700" },
  { id: 6, title: "QA mobile navigation", project: "Mobile app", status: "To do", priority: "Medium", due: "Oct 18", initials: "AK", color: "bg-violet-100 text-violet-700" },
];

const projects = [
  { name: "Website redesign", category: "Design & development", progress: 72, tasks: "18/25 tasks", color: "bg-violet-500", icon: "✳", tint: "bg-violet-50 text-violet-700" },
  { name: "Mobile app", category: "Product", progress: 48, tasks: "12/25 tasks", color: "bg-blue-500", icon: "◈", tint: "bg-blue-50 text-blue-700" },
  { name: "Marketing site", category: "Growth", progress: 86, tasks: "19/22 tasks", color: "bg-emerald-500", icon: "↗", tint: "bg-emerald-50 text-emerald-700" },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My tasks", icon: ListTodo },
  { label: "Projects", icon: FolderKanban },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("flowboard-tasks")) || initialTasks; }
    catch { return initialTasks; }
  });
  const [activeNav, setActiveNav] = useState("Overview");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [showModal, setShowModal] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ title: "", project: "Website redesign", priority: "Medium", due: "Oct 20" });

  useEffect(() => { localStorage.setItem("flowboard-tasks", JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredTasks = useMemo(() => tasks.filter(task => {
    const matchesQuery = `${task.title} ${task.project} ${task.priority}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All status" || task.status === statusFilter;
    const matchesNav = activeNav !== "My tasks" || task.initials === "MS";
    const matchesProject = activeNav !== "Projects" || task.project === "Website redesign";
    return matchesQuery && matchesStatus && matchesNav && matchesProject;
  }), [tasks, query, statusFilter, activeNav]);

  const completed = tasks.filter(task => task.status === "Done").length;
  const inProgress = tasks.filter(task => task.status === "In progress").length;
  const addTask = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    setTasks(prev => [{ ...form, id: Date.now(), status: "To do", initials: "MS", color: "bg-amber-100 text-amber-700" }, ...prev]);
    setForm({ title: "", project: "Website redesign", priority: "Medium", due: "Oct 20" });
    setShowModal(false);
    setToast("Task added to your workspace");
  };
  const cycleStatus = (id) => {
    const order = ["To do", "In progress", "In review", "Done"];
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;
      const next = order[(order.indexOf(task.status) + 1) % order.length];
      return { ...task, status: next };
    }));
    setToast("Task status updated");
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#20243a]">
      {mobileMenu && <button aria-label="Close menu overlay" onClick={() => setMobileMenu(false)} className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-[#eceef5] bg-white px-5 py-6 transition-transform lg:translate-x-0 ${mobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-10 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#6254e8] text-white shadow-lg shadow-violet-200"><Command size={21} strokeWidth={2.5} /></div>
            <div><div className="font-display text-[19px] font-extrabold tracking-tight">flowboard<span className="text-[#6558e8]">.</span></div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Workspace</div></div>
          </div>
          <button onClick={() => setMobileMenu(false)} className="rounded-lg p-1 text-slate-400 lg:hidden"><X size={19} /></button>
        </div>

        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Workspace</div>
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} onClick={() => { setActiveNav(label); setMobileMenu(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${activeNav === label ? "bg-[#f0efff] text-[#5e50dc]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
              <Icon size={18} />{label}
              {label === "My tasks" && <span className="ml-auto rounded-md bg-white px-2 py-0.5 text-[11px] text-slate-500">{tasks.filter(t => t.initials === "MS" && t.status !== "Done").length}</span>}
            </button>
          ))}
        </nav>

        <div className="mb-3 mt-9 flex items-center justify-between px-3"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Your projects</span><button onClick={() => setToast("Create a project from your project settings")} className="rounded-md p-1 text-slate-400 hover:bg-slate-100"><Plus size={15} /></button></div>
        <div className="space-y-1">
          {projects.map((project) => <button key={project.name} onClick={() => { setActiveNav("Projects"); setMobileMenu(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-slate-600 hover:bg-slate-50"><span className={`grid h-7 w-7 place-items-center rounded-lg text-sm ${project.tint}`}>{project.icon}</span><span className="truncate">{project.name}</span><span className="ml-auto h-1.5 w-1.5 rounded-full bg-slate-300" /></button>)}
        </div>

        <div className="mt-auto">
          <div className="mb-5 rounded-2xl bg-gradient-to-br from-[#f1efff] to-[#faf9ff] p-4">
            <div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-white text-[#6254e8] shadow-sm"><Sparkles size={18} /></div>
            <div className="font-display text-sm font-extrabold">Make work flow.</div>
            <p className="mt-1 text-xs leading-5 text-slate-500">A little progress each day adds up to big results.</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full w-[68%] rounded-full bg-[#7568ef]" /></div>
            <div className="mt-2 text-[10px] font-semibold text-slate-500">Weekly focus · 68%</div>
          </div>
          <button onClick={() => setToast("Settings are coming soon")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"><Settings2 size={18} />Settings</button>
          <button onClick={() => setToast("Help center: hello@flowboard.demo")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"><CircleHelp size={18} />Help & support</button>
          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 px-1 pt-5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#f8dfc7] text-xs font-bold text-[#995e32]">MS</div>
            <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">Manu Singh</div><div className="text-[11px] text-slate-400">Free workspace</div></div>
            <button onClick={() => setToast("You are already in your demo workspace")} className="text-slate-400 hover:text-slate-700"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[252px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#eceef5] bg-white/90 px-5 backdrop-blur-xl sm:px-8 xl:px-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenu(true)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><Menu size={20} /></button>
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex"><span>Workspace</span><span>/</span><span className="font-semibold text-slate-700">{activeNav}</span></div>
            <div className="sm:hidden font-display text-base font-extrabold">{activeNav}</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <label className="hidden h-10 w-52 items-center gap-2 rounded-xl border border-slate-200 bg-[#fafbfe] px-3 md:flex"><Search size={16} className="text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anything..." className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400" /><kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">⌘ K</kbd></label>
            <button onClick={() => setToast("You're all caught up!")} className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><Bell size={17} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white" /></button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <button onClick={() => setToast("Profile menu opened")} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#f8dfc7] text-[11px] font-bold text-[#995e32]">MS</span><ChevronDown size={14} className="hidden text-slate-400 sm:block" /></button>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#6558e8]"><span className="h-2 w-2 rounded-full bg-[#6558e8]" />WEDNESDAY, OCTOBER 14</div><h1 className="font-display text-[28px] font-extrabold tracking-tight sm:text-[34px]">Good morning, Manu <span>✌️</span></h1><p className="mt-2 text-sm text-slate-500">Here's what's happening with your projects today.</p></div>
            <button onClick={() => setShowModal(true)} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6254e8] px-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-[#5144d0]"><Plus size={17} strokeWidth={2.5} /> Create new task</button>
          </div>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total tasks" value={tasks.length} note="Across all projects" icon={ListTodo} iconBg="bg-violet-50 text-violet-600" trend="+12.5%" positive />
            <StatCard label="In progress" value={inProgress} note="Keep the momentum" icon={Activity} iconBg="bg-blue-50 text-blue-600" trend="Active" />
            <StatCard label="Completed" value={completed} note="Tasks finished so far" icon={CheckCheck} iconBg="bg-emerald-50 text-emerald-600" trend={`${tasks.length ? Math.round(completed / tasks.length * 100) : 0}%`} positive />
            <StatCard label="Team productivity" value="84%" note="You're doing great!" icon={Target} iconBg="bg-amber-50 text-amber-600" trend="+8.2%" positive />
          </section>

          <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">
            <div className="rounded-2xl border border-[#eceef5] bg-white p-5 shadow-[0_3px_14px_rgba(30,41,59,.025)] sm:p-6">
              <div className="mb-6 flex items-start justify-between"><div><h2 className="font-display text-base font-extrabold">Project progress</h2><p className="mt-1 text-xs text-slate-400">Keep track of your team's momentum</p></div><button onClick={() => { setActiveNav("Projects"); setToast("Showing your project tasks"); }} className="flex items-center gap-1 text-xs font-bold text-[#6558e8]">View all <ArrowUpRight size={14} /></button></div>
              <div className="space-y-5">
                {projects.map(p => <div key={p.name}><div className="mb-2.5 flex items-center gap-3"><div className={`grid h-9 w-9 place-items-center rounded-xl text-lg ${p.tint}`}>{p.icon}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{p.name}</div><div className="mt-0.5 text-[11px] text-slate-400">{p.category} · {p.tasks}</div></div><div className="text-sm font-extrabold">{p.progress}%</div></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${p.color} transition-all duration-500`} style={{ width: `${p.progress}%` }} /></div></div>)}
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#fafaff] p-3.5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#6558e8] shadow-sm"><Zap size={17} /></div><div className="flex-1"><div className="text-xs font-bold">You're on a roll!</div><div className="mt-0.5 text-[11px] text-slate-500">Your projects are moving forward. Keep it up.</div></div><TrendingUp size={17} className="text-emerald-500" /></div>
            </div>

            <div className="rounded-2xl border border-[#eceef5] bg-white p-5 shadow-[0_3px_14px_rgba(30,41,59,.025)] sm:p-6">
              <div className="mb-5 flex items-start justify-between"><div><h2 className="font-display text-base font-extrabold">Weekly activity</h2><p className="mt-1 text-xs text-slate-400">Tasks completed this week</p></div><button onClick={() => setToast("Weekly report is ready in this demo")} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"><MoreHorizontal size={18} /></button></div>
              <div className="mb-2 flex items-end gap-2"><span className="font-display text-3xl font-extrabold">{Math.max(7, completed + 7)}</span><span className="mb-1 flex items-center gap-1 text-xs font-bold text-emerald-600"><ArrowUpRight size={14} />18.4%</span></div><div className="text-[11px] text-slate-400">Compared to last week</div>
              <div className="mt-5 flex h-[155px] items-end justify-between gap-2 border-b border-slate-100 pb-2">
                {[{d:"Mon",v:42},{d:"Tue",v:68},{d:"Wed",v:52},{d:"Thu",v:85},{d:"Fri",v:62},{d:"Sat",v:35},{d:"Sun",v:24}].map((day,i) => <div key={day.d} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className={`w-full max-w-[25px] rounded-t-md transition-all hover:opacity-80 ${i===3 ? "bg-[#6558e8]" : "bg-[#e8e6ff]"}`} style={{height:`${day.v}%`}} /><span className="text-[10px] text-slate-400">{day.d}</span></div>)}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-slate-500"><span className="h-2 w-2 rounded-full bg-[#6558e8]" />Completed tasks</span><button onClick={() => setToast("Activity report opened")} className="font-bold text-[#6558e8]">Full report</button></div>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#eceef5] bg-white shadow-[0_3px_14px_rgba(30,41,59,.025)]">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
              <div><h2 className="font-display text-base font-extrabold">{activeNav === "My tasks" ? "My tasks" : activeNav === "Projects" ? "Website redesign tasks" : "Tasks overview"}</h2><p className="mt-1 text-xs text-slate-400">Stay on top of your priorities</p></div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex h-9 min-w-[150px] items-center gap-2 rounded-lg border border-slate-200 px-2.5 md:hidden"><Search size={14} className="text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tasks..." className="w-full text-xs outline-none" /></label>
                <label className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-600"><Filter size={14} className="text-slate-400" /><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent outline-none"><option>All status</option><option>To do</option><option>In progress</option><option>In review</option><option>Done</option></select></label>
                <button onClick={() => setShowModal(true)} className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"><Plus size={14} /> Add task</button>
              </div>
            </div>
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full min-w-[740px] text-left">
                <thead><tr className="bg-[#fafbfe] text-[10px] font-bold uppercase tracking-[.1em] text-slate-400"><th className="px-6 py-3.5">Task name</th><th className="px-4 py-3.5">Project</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Priority</th><th className="px-4 py-3.5">Due date</th><th className="px-5 py-3.5">Assignee</th><th className="px-4 py-3.5"></th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map(task => <tr key={task.id} className="group transition hover:bg-[#fcfcff]">
                    <td className="px-6 py-4"><button onClick={() => cycleStatus(task.id)} title="Click to advance task status" className={`mr-3 inline-grid h-4 w-4 align-middle place-items-center rounded border ${task.status === "Done" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent hover:border-[#6558e8]"}`}>{task.status === "Done" && <Check size={11} />}</button><span className={`align-middle text-xs font-semibold ${task.status === "Done" ? "text-slate-400 line-through" : "text-slate-700"}`}>{task.title}</span></td>
                    <td className="px-4 py-4 text-xs text-slate-500">{task.project}</td>
                    <td className="px-4 py-4"><button onClick={() => cycleStatus(task.id)} className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-bold ${task.status==="Done"?"bg-emerald-50 text-emerald-700":task.status==="In progress"?"bg-blue-50 text-blue-700":task.status==="In review"?"bg-amber-50 text-amber-700":"bg-slate-100 text-slate-500"}`}>{task.status}</button></td>
                    <td className="px-4 py-4"><span className={`flex items-center gap-1.5 text-[11px] font-semibold ${task.priority==="High"?"text-rose-600":task.priority==="Medium"?"text-amber-600":"text-slate-400"}`}><span className={`h-1.5 w-1.5 rounded-full ${task.priority==="High"?"bg-rose-500":task.priority==="Medium"?"bg-amber-500":"bg-slate-300"}`} />{task.priority}</span></td>
                    <td className="px-4 py-4"><span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] text-slate-500"><CalendarDays size={13} className="text-slate-400" />{task.due}</span></td>
                    <td className="px-5 py-4"><div className={`grid h-7 w-7 place-items-center rounded-full text-[9px] font-extrabold ${task.color}`} title={task.initials}>{task.initials}</div></td>
                    <td className="px-4 py-4"><button onClick={() => { setTasks(prev => prev.filter(t => t.id !== task.id)); setToast("Task removed"); }} title="Delete task" className="rounded-md p-1.5 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"><X size={14} /></button></td>
                  </tr>)}
                  {filteredTasks.length === 0 && <tr><td colSpan="7" className="px-6 py-12 text-center"><div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-400"><Search size={18} /></div><p className="text-sm font-semibold text-slate-600">No tasks found</p><p className="mt-1 text-xs text-slate-400">Try a different search or filter.</p></td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 text-[11px] text-slate-400 sm:px-6"><span>Showing <strong className="text-slate-600">{filteredTasks.length}</strong> of <strong className="text-slate-600">{tasks.length}</strong> tasks</span><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Changes saved automatically</span></div>
          </section>
          <footer className="flex flex-col items-center justify-between gap-2 py-7 text-[11px] text-slate-400 sm:flex-row"><span>© 2026 FlowBoard. Made for focused work.</span><span className="flex items-center gap-4"><button onClick={() => setToast("Privacy policy demo page")} className="hover:text-slate-600">Privacy</button><button onClick={() => setToast("Documentation demo page")} className="hover:text-slate-600">Documentation</button><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />All systems operational</span></span></footer>
        </div>
      </main>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
        <form onSubmit={addTask} className="w-full max-w-[460px] rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
          <div className="mb-6 flex items-start justify-between"><div><div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-[#6558e8]"><Plus size={20} /></div><h2 className="font-display text-xl font-extrabold">Create a task</h2><p className="mt-1 text-xs text-slate-400">Add a task to keep your project moving.</p></div><button type="button" onClick={() => setShowModal(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div>
          <label className="mb-4 block"><span className="mb-2 block text-xs font-bold text-slate-600">Task name <span className="text-rose-500">*</span></span><input autoFocus required value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="e.g. Build responsive navbar" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-[#8c82f1] focus:ring-4 focus:ring-violet-50" /></label>
          <label className="mb-4 block"><span className="mb-2 block text-xs font-bold text-slate-600">Project</span><select value={form.project} onChange={e => setForm({...form,project:e.target.value})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#8c82f1]"><option>Website redesign</option><option>Mobile app</option><option>Marketing site</option></select></label>
          <div className="mb-6 grid grid-cols-2 gap-3"><label><span className="mb-2 block text-xs font-bold text-slate-600">Priority</span><select value={form.priority} onChange={e => setForm({...form,priority:e.target.value})} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#8c82f1]"><option>Low</option><option>Medium</option><option>High</option></select></label><label><span className="mb-2 block text-xs font-bold text-slate-600">Due date</span><input value={form.due} onChange={e => setForm({...form,due:e.target.value})} placeholder="e.g. Oct 20" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#8c82f1]" /></label></div>
          <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" className="h-11 flex-1 rounded-xl bg-[#6254e8] text-sm font-bold text-white shadow-lg shadow-violet-100 hover:bg-[#5144d0]">Create task</button></div>
        </form>
      </div>}
      {toast && <div role="status" className="fixed bottom-5 right-5 z-[60] flex max-w-[calc(100%-40px)] items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl"><Check size={16} className="text-emerald-400" />{toast}<button onClick={() => setToast("")} className="ml-2 text-slate-400 hover:text-white"><X size={14} /></button></div>}
    </div>
  );
}

function StatCard({ label, value, note, icon: Icon, iconBg, trend, positive }) {
  return <div className="rounded-2xl border border-[#eceef5] bg-white p-5 shadow-[0_3px_14px_rgba(30,41,59,.025)] transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><div className="text-xs font-semibold text-slate-500">{label}</div><div className={`grid h-9 w-9 place-items-center rounded-xl ${iconBg}`}><Icon size={18} /></div></div><div className="mt-3 flex items-end gap-2"><span className="font-display text-[30px] font-extrabold leading-none tracking-tight">{value}</span><span className={`mb-0.5 flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[10px] font-bold ${positive ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>{positive && <ArrowUpRight size={12} />}{trend}</span></div><div className="mt-2 text-[11px] text-slate-400">{note}</div></div>;
}

export default App;