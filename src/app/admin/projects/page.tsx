"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, X, ImagePlus, Star, StarOff, RefreshCw, ExternalLink, Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

const CATEGORY_LABELS: Record<string, string> = {
  fullstack: "Full-Stack",
  backend: "Backend & AI",
  cloud: "Cloud",
};

const CATEGORY_COLORS: Record<string, string> = {
  fullstack: "bg-[#A8DADC]/20 text-[#2C9C9F] border-[#A8DADC]/30",
  backend: "bg-[#FFC1CC]/20 text-rose-500 border-[#FFC1CC]/30",
  cloud: "bg-[#B39CD0]/20 text-[#7B5EA7] border-[#B39CD0]/30",
};

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageBase64?: string;
  featured: boolean;
  order: number;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "fullstack",
  techStack: [] as string[],
  tags: [] as string[],
  liveUrl: "",
  repoUrl: "",
  imageBase64: "",
  featured: false,
  order: 0,
};

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 800;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function TagInput({
  label, values, onChange, placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim();
    if (val && !values.includes(val)) onChange([...values, val]);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder ?? "Type and press Enter"}
          className="rounded-xl bg-card text-sm"
        />
        <Button type="button" variant="outline" size="sm" onClick={add} className="rounded-xl shrink-0">
          Add
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {values.map((v) => (
            <span key={v} className="flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full">
              {v}
              <button type="button" onClick={() => onChange(values.filter((x) => x !== v))}>
                <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    const data = await res.json();
    setProjects(data.projects ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description, category: p.category,
      techStack: p.techStack, tags: p.tags,
      liveUrl: p.liveUrl ?? "", repoUrl: p.repoUrl ?? "",
      imageBase64: p.imageBase64 ?? "", featured: p.featured, order: p.order,
    });
    setOpen(true);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setForm((f) => ({ ...f, imageBase64: compressed }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/projects/${editing._id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/projects", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      await fetchProjects();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects((p) => p.filter((x) => x._id !== id));
  };

  const toggleFeatured = async (p: Project) => {
    await fetch(`/api/admin/projects/${p._id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    });
    fetchProjects();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} total</p>
        </div>
        <Button onClick={openAdd} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </div>

      {/* Projects grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground border border-dashed border-border rounded-xl">
          <Plus className="h-10 w-10 opacity-30" />
          <p className="text-sm">No projects yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p._id} className="rounded-xl border border-border bg-card overflow-hidden group">
              {/* Thumbnail */}
              <div className="relative h-40 bg-muted flex items-center justify-center overflow-hidden">
                {p.imageBase64 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageBase64} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus className="h-8 w-8 text-muted-foreground/30" />
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleFeatured(p)} className="p-1.5 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors">
                    {p.featured ? <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" /> : <StarOff className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1.5 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors">
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="p-1.5 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-destructive/10 transition-colors">
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground text-sm leading-tight">{p.title}</h3>
                  <Badge variant="outline" className={`text-xs shrink-0 ${CATEGORY_COLORS[p.category]}`}>
                    {CATEGORY_LABELS[p.category]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>

                {/* Tags */}
                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                    {p.tags.length > 4 && <span className="text-xs text-muted-foreground">+{p.tags.length - 4}</span>}
                  </div>
                )}

                {/* Tech stack */}
                {p.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{t}</span>
                    ))}
                    {p.techStack.length > 3 && <span className="text-xs text-muted-foreground">+{p.techStack.length - 3} more</span>}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-2 pt-1">
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="h-3 w-3" /> Live
                    </a>
                  )}
                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Github className="h-3 w-3" /> Repo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Thumbnail upload */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Thumbnail</Label>
              <div
                onClick={() => fileRef.current?.click()}
                className="relative h-40 rounded-xl border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
              >
                {form.imageBase64 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.imageBase64} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImagePlus className="h-8 w-8" />
                    <span className="text-xs">Click to upload (auto-compressed)</span>
                  </div>
                )}
                {form.imageBase64 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, imageBase64: "" })); }}
                    className="absolute top-2 right-2 p-1 bg-background/80 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label className="text-sm font-semibold">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="rounded-xl bg-card" />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="text-sm font-semibold">Description *</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="rounded-xl bg-card resize-none" rows={3} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger className="rounded-xl bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullstack">Full-Stack</SelectItem>
                    <SelectItem value="backend">Backend & AI</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Order</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: +e.target.value }))} className="rounded-xl bg-card" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Live URL</Label>
                <Input value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))} placeholder="https://" className="rounded-xl bg-card" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Repo URL</Label>
                <Input value={form.repoUrl} onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))} placeholder="https://github.com/..." className="rounded-xl bg-card" />
              </div>
            </div>

            <TagInput
              label="Tech Stack"
              values={form.techStack}
              onChange={(v) => setForm((f) => ({ ...f, techStack: v }))}
              placeholder="e.g. Next.js, TypeScript…"
            />

            <TagInput
              label="Discovery Tags (attract visitors & SEO)"
              values={form.tags}
              onChange={(v) => setForm((f) => ({ ...f, tags: v }))}
              placeholder="e.g. AI, SaaS, Real-time…"
            />

            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              <Label htmlFor="featured" className="text-sm cursor-pointer">Mark as Featured</Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.description} className="rounded-xl">
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
