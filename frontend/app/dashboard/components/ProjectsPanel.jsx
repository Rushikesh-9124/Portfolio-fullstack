"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsAPI } from "../../../lib/api";
import toast from "react-hot-toast";

const CATEGORIES = ["Web App", "Mobile", "AI/ML", "API", "Other"];
const STATUSES = ["completed", "in-progress", "archived"];

const EMPTY = {
  title: "",
  description: "",
  longDescription: "",
  techStack: "",
  githubUrl: "",
  liveUrl: "",
  image: "",
  featured: false,
  category: "Web App",
  status: "completed",
  order: 0,
};

function ProjectForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    ...initial,
    techStack: Array.isArray(initial.techStack)
      ? initial.techStack.join(", ")
      : initial.techStack,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = () => {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("longDescription", form.longDescription || "");

    formData.append(
      "techStack",
      JSON.stringify(
        form.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      ),
    );

    formData.append("githubUrl", form.githubUrl || "");
    formData.append("liveUrl", form.liveUrl || "");
    formData.append("featured", form.featured);
    formData.append("category", form.category);
    formData.append("status", form.status);
    formData.append("order", form.order || 0);

    if (form.image instanceof File) {
      formData.append("image", form.image);
    }

    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 border border-indigo-500/20 mb-6"
    >
      <h3 className="font-body font-semibold text-white mb-5">
        {initial.title ? `Edit: ${initial.title}` : "New Project"}
      </h3>
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="My Awesome Project"
              className="input-glass"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input-glass"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
            Short Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            placeholder="Brief description shown on the card..."
            className="input-glass resize-none"
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
            Tech Stack (comma-separated)
          </label>
          <input
            name="techStack"
            value={form.techStack}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB, Tailwind CSS"
            className="input-glass"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
              GitHub URL
            </label>
            <input
              name="githubUrl"
              value={form.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="input-glass"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
              Live URL
            </label>
            <input
              name="liveUrl"
              value={form.liveUrl}
              onChange={handleChange}
              placeholder="https://myproject.com"
              className="input-glass"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
              Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setForm((p) => ({ ...p, image: file }));
                }
              }}
              className="input-glass"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input-glass"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            checked={form.featured}
            onChange={handleChange}
            className="w-4 h-4 accent-indigo-500 rounded"
          />
          <label
            htmlFor="featured"
            className="text-slate-300 text-sm font-body cursor-pointer"
          >
            Mark as Featured project
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button
          onClick={handleSave}
          disabled={saving || !form.title || !form.description}
          className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Project"}
        </button>
        <button onClick={onCancel} className="btn-ghost px-6 py-2 text-sm">
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

const STATUS_COLORS = {
  completed: "#10b981",
  "in-progress": "#f59e0b",
  archived: "#6b7280",
};

export default function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await projectsAPI.getAll();
      setProjects(res.data.data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await projectsAPI.create(form);
      toast.success("Project added!");
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await projectsAPI.update(editProject._id, form);
      toast.success("Project updated!");
      setEditProject(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await projectsAPI.delete(id);
      toast.success("Project deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Manage Projects
          </h2>
          <p className="text-slate-400 text-sm font-body mt-1">
            {projects.length} projects total
          </p>
        </div>
        {!showForm && !editProject && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary px-5 py-2.5 text-sm"
          >
            + Add Project
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <ProjectForm
            initial={EMPTY}
            onSave={handleCreate}
            onCancel={() => setShowForm(false)}
            saving={saving}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project._id}>
              {editProject?._id === project._id ? (
                <ProjectForm
                  initial={{
                    ...project,
                    techStack: project.techStack?.join(", ") || "",
                  }}
                  onSave={handleUpdate}
                  onCancel={() => setEditProject(null)}
                  saving={saving}
                />
              ) : (
                <motion.div layout className="glass-card p-5 flex gap-4 group">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl shrink-0 overflow-hidden bg-gradient-to-br from-indigo-900/40 to-violet-900/40 flex items-center justify-center">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-display text-2xl font-bold gradient-text opacity-40">
                        {project.title?.[0]}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h3 className="font-body font-semibold text-white">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                          Featured
                        </span>
                      )}
                      <span
                        className="px-2 py-0.5 text-xs rounded-full border"
                        style={{
                          color: STATUS_COLORS[project.status],
                          borderColor: `${STATUS_COLORS[project.status]}40`,
                          background: `${STATUS_COLORS[project.status]}10`,
                        }}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(project.techStack || []).slice(0, 4).map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs font-mono rounded bg-white/5 text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                      {project.techStack?.length > 4 && (
                        <span className="text-xs text-slate-500">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditProject(project);
                        setShowForm(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id, project.title)}
                      className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center text-slate-500 py-12 glass-card">
          No projects yet. Click "+ Add Project" to get started.
        </div>
      )}
    </motion.div>
  );
}
