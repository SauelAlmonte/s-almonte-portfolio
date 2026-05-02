"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, X, ImagePlus, Star, StarOff, RefreshCw, ExternalLink, Github, Download,
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { CATEGORY_META, type ProjectCategory } from "@/config/projects";
import { cn } from "@/lib/utils";

const PROJECT_CATEGORIES: ProjectCategory[] = ["fullstack", "backend", "cloud"];

const CATEGORY_BORDER_ACTIVE: Record<ProjectCategory, string> = {
  fullstack: "data-[state=active]:border-[#A8DADC]/50 data-[state=active]:shadow-[inset_0_0_0_1px_rgba(168,218,220,0.35)]",
  backend: "data-[state=active]:border-[#B39CD0]/45 data-[state=active]:shadow-[inset_0_0_0_1px_rgba(179,156,208,0.35)]",
  cloud: "data-[state=active]:border-[#FFC1CC]/50 data-[state=active]:shadow-[inset_0_0_0_1px_rgba(255,193,204,0.35)]",
};

interface Project {
  _id: string;
  slug?: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageGradient?: string;
  imageBase64?: string;
  featured: boolean;
  comingSoon?: boolean;
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
  comingSoon: false,
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

/** Split chip input on commas, semicolons, en dash, or em dash (matches placeholder typography). */
function splitChipInput(raw: string): string[] {
  return raw
    .split(/[,;]|[\u2013\u2014]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Merge textarea-style draft into persisted chip list (used when Save is clicked). */
function mergeIncomingChips(existing: string[], rawDraft: string): string[] {
  const additions = splitChipInput(rawDraft);
  if (!additions.length) return existing;
  const out = [...existing];
  for (const a of additions) {
    if (!out.includes(a)) out.push(a);
  }
  return out;
}

export type ChipInputHandle = {
  /** Uncommitted text currently in the field */
  getDraft: () => string;
  clearDraft: () => void;
};

const TagInput = forwardRef<
  ChipInputHandle,
  {
    label: string;
    values: string[];
    onChange: (v: string[]) => void;
    placeholder?: string;
    hint?: string;
  }
>(function TagInput({ label, values, onChange, placeholder, hint }, ref) {
  const [input, setInput] = useState("");

  const commitDraft = useCallback(() => {
    const segments = splitChipInput(input);
    if (!segments.length) return;
    const merged = [...values];
    for (const s of segments) {
      if (!merged.includes(s)) merged.push(s);
    }
    onChange(merged);
    setInput("");
  }, [input, values, onChange]);

  useImperativeHandle(
    ref,
    () => ({
      getDraft: () => input,
      clearDraft: () => setInput(""),
    }),
    [input]
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>
      {hint ? <p className="text-xs text-muted-foreground -mt-0.5">{hint}</p> : null}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={() => commitDraft()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitDraft();
            }
          }}
          placeholder={placeholder ?? "Type and press Enter, or comma-separate"}
          className="rounded-xl bg-card text-sm"
        />
        <Button type="button" variant="outline" size="sm" onClick={() => commitDraft()} className="rounded-xl shrink-0">
          Add
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {values.map((v) => (
            <span key={v} className="flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full">
              {v}
              <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(values.filter((x) => x !== v))}>
                <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

TagInput.displayName = "TagInput";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const fileRef = useRef<HTMLInputElement>(null);
  const techChipRef = useRef<ChipInputHandle | null>(null);
  const discoveryChipRef = useRef<ChipInputHandle | null>(null);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("fullstack");
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<Project | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const countsByCategory = useMemo(
    () =>
      PROJECT_CATEGORIES.reduce(
        (acc, key) => {
          acc[key] = projects.filter((p) => p.category === key).length;
          return acc;
        },
        {} as Record<ProjectCategory, number>
      ),
    [projects]
  );

  const fetchProjects = async () => {
    setLoading(true);
    setLoadError(null);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/admin/projects", { credentials: "include" });
      const text = await res.text();
      let data: { projects?: Project[]; error?: string } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as { projects?: Project[]; error?: string };
        } catch {
          setLoadError("Server returned invalid data (not JSON). Try restarting the dev server.");
          setProjects([]);
          return;
        }
      }
      if (!res.ok) {
        setLoadError(typeof data?.error === "string" ? data.error : `Request failed (${res.status})`);
        setProjects([]);
        return;
      }
      const list = data.projects ?? [];
      setProjects(
        list.map((p) => ({
          ...p,
          tags: p.tags ?? [],
          techStack: p.techStack ?? [],
        }))
      );
    } catch {
      setLoadError("Could not load projects. Check your connection and MongoDB settings.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const seedFromPortfolioConfig = async () => {
    setSeeding(true);
    setLoadError(null);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/admin/projects/seed", {
        method: "POST",
        credentials: "include",
      });
      const text = await res.text();
      let data: { message?: string; error?: string } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as { message?: string; error?: string };
        } catch {
          throw new Error("Invalid response from server");
        }
      }
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Import failed");
      }
      setSeedMessage(typeof data.message === "string" ? data.message : "Import complete.");
      await fetchProjects();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setSeeding(false);
    }
  };

  const openAddForCategory = (cat: ProjectCategory) => {
    setActiveCategory(cat);
    setEditing(null);
    setForm({ ...EMPTY_FORM, category: cat });
    setOpen(true);
  };

  const openAdd = () => {
    openAddForCategory(activeCategory);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description, category: p.category,
      techStack: p.techStack, tags: p.tags ?? [],
      liveUrl: p.liveUrl ?? "",
      repoUrl: p.repoUrl ?? "",
      imageBase64: p.imageBase64 ?? "", featured: p.featured,
      comingSoon: p.comingSoon ?? false,
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
      const techStack = mergeIncomingChips(form.techStack, techChipRef.current?.getDraft() ?? "");
      const tags = mergeIncomingChips(form.tags, discoveryChipRef.current?.getDraft() ?? "");
      techChipRef.current?.clearDraft();
      discoveryChipRef.current?.clearDraft();
      setForm((f) => ({ ...f, techStack, tags }));
      const body = { ...form, techStack, tags };
      const url = editing
        ? `/api/admin/projects/${editing._id}`
        : "/api/admin/projects";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const text = await res.text();
      let data: { error?: string } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as { error?: string };
        } catch {
          setLoadError("Could not save project. Invalid server response.");
          return;
        }
      }
      if (!res.ok) {
        setLoadError(typeof data.error === "string" ? data.error : `Save failed (${res.status}).`);
        return;
      }
      await fetchProjects();
      setOpen(false);
    } catch {
      setLoadError("Could not save project. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeletePhraseMatches =
    deleteConfirmationInput.trim().toLowerCase() === "delete";

  const resetDeleteConfirmation = () => {
    setDeleteConfirmProject(null);
    setDeleteConfirmationInput("");
    setDeleteSubmitting(false);
  };

  const openDeleteConfirmation = (p: Project) => {
    setDeleteConfirmProject(p);
    setDeleteConfirmationInput("");
    setDeleteSubmitting(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirmProject || !confirmDeletePhraseMatches || deleteSubmitting) return;
    setDeleteSubmitting(true);
    try {
      const id = deleteConfirmProject._id;
      let res: Response;
      try {
        res = await fetch(`/api/admin/projects/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
      } catch {
        setLoadError("Could not delete this project. Check your connection and try again.");
        return;
      }
      if (!res.ok) {
        setLoadError(`Could not delete this project (${res.status}).`);
        return;
      }
      setProjects((prev) => prev.filter((x) => x._id !== id));
      resetDeleteConfirmation();
    } finally {
      setDeleteSubmitting(false);
    }
  };


  const toggleFeatured = async (p: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !p.featured }),
        credentials: "include",
      });
      const text = await res.text();
      let data: { error?: string } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as { error?: string };
        } catch {
          setLoadError("Could not update featured state. Invalid server response.");
          return;
        }
      }
      if (!res.ok) {
        setLoadError(
          typeof data.error === "string"
            ? data.error
            : `Could not update featured state (${res.status}).`
        );
        return;
      }
      await fetchProjects();
    } catch {
      setLoadError("Could not update featured state. Check your connection and try again.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} total
            {!loading && projects.length > 0 ? (
              <>
                {" "}
                · {countsByCategory[activeCategory]} in {CATEGORY_META[activeCategory].label}
              </>
            ) : null}
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </div>

      {/* Projects grid */}
      {loadError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl" role="alert">
          {loadError}
        </p>
      )}
      {seedMessage && (
        <p className="text-sm text-muted-foreground bg-muted/50 px-4 py-3 rounded-xl">{seedMessage}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 gap-4 text-center border border-dashed border-border rounded-xl px-6">
          <div className="space-y-1 max-w-md">
            <p className="text-sm font-semibold text-foreground">No projects in the database yet</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Public `/skills/[category]` pages load from MongoDB when it has rows; otherwise they use
              <code className="mx-1 text-xs bg-muted px-1 py-0.5 rounded">config/projects.ts</code>.
              Import those defaults once so Admin and the site share the same data.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => seedFromPortfolioConfig()}
            disabled={seeding}
            variant="outline"
            className="rounded-xl gap-2"
          >
            {seeding ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Importing…</>
            ) : (
              <><Download className="h-4 w-4" /> Import from portfolio config</>
            )}
          </Button>
          <Button type="button" onClick={openAdd} variant="default" className="rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Add project manually instead
          </Button>
        </div>
      ) : (
        <Tabs
          value={activeCategory}
          onValueChange={(v) => setActiveCategory(v as ProjectCategory)}
          className="w-full"
        >
          <TabsList
            variant="default"
            className="flex h-auto min-h-11 w-full max-w-full flex-wrap justify-start gap-1 rounded-xl p-1 md:flex-nowrap"
            aria-label="Project categories"
          >
            {PROJECT_CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const n = countsByCategory[cat];
              return (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  id={`projects-tab-${cat}`}
                  className={cn(
                    "grow basis-[min(100%,11rem)] justify-center gap-2 rounded-lg px-3 py-2.5 text-center text-xs font-semibold whitespace-normal md:text-sm lg:flex-none",
                    CATEGORY_BORDER_ACTIVE[cat]
                  )}
                >
                  <span>{meta.label}</span>
                  <span
                    className="tabular-nums text-[0.65rem] font-semibold opacity-75 md:text-xs"
                    aria-hidden
                  >
                    ({n})
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {PROJECT_CATEGORIES.map((cat) => {
            const list = projects
              .filter((p) => p.category === cat)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

            return (
              <TabsContent
                key={cat}
                value={cat}
                className="mt-6 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-labelledby={`projects-tab-${cat}`}
              >
                {list.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-14 px-4 text-center">
                    <p className="text-sm font-medium text-foreground">
                      No projects in {CATEGORY_META[cat].label} yet.
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Add a project below or import defaults from portfolio config—they are assigned to categories automatically.
                    </p>
                    <Button type="button" onClick={() => openAddForCategory(cat)} className="rounded-xl gap-2">
                      <Plus className="h-4 w-4" />
                      Add to {CATEGORY_META[cat].label}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {list.map((p) => (
                      <article
                        key={p._id}
                        className="group overflow-hidden rounded-xl border border-border bg-card"
                      >
                        {/* Thumbnail */}
                        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-muted">
                          {p.imageBase64 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.imageBase64}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImagePlus className="h-8 w-8 text-muted-foreground/30" aria-hidden />
                          )}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                            <button
                              type="button"
                              onClick={() => toggleFeatured(p)}
                              className="rounded-lg bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-background"
                              aria-label={p.featured ? "Remove featured" : "Mark featured"}
                            >
                              {p.featured ? (
                                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                              ) : (
                                <StarOff className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => openEdit(p)}
                              className="rounded-lg bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-background"
                              aria-label={`Edit ${p.title}`}
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openDeleteConfirmation(p)}
                              className="rounded-lg bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-destructive/10"
                              aria-label={`Delete ${p.title}`}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm leading-tight font-semibold text-foreground">
                              {p.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={cn(
                                "shrink-0 text-xs border",
                                CATEGORY_META[p.category as ProjectCategory]?.tagClass
                              )}
                            >
                              {CATEGORY_META[p.category as ProjectCategory]?.label ?? p.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>

                          {p.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {p.techStack.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                >
                                  {t}
                                </span>
                              ))}
                              {p.techStack.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{p.techStack.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {p.tags && p.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {p.tags.slice(0, 4).map((t) => (
                                <span
                                  key={t}
                                  className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                                >
                                  {t}
                                </span>
                              ))}
                              {p.tags.length > 4 && (
                                <span className="text-xs text-muted-foreground">
                                  +{p.tags.length - 4}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2 pt-1">
                            {p.liveUrl && (
                              <a
                                href={p.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                              >
                                <ExternalLink className="h-3 w-3" aria-hidden /> Live
                              </a>
                            )}
                            {p.repoUrl && (
                              <a
                                href={p.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                              >
                                <Github className="h-3 w-3" aria-hidden /> Repo
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
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
                  <img src={form.imageBase64} alt="" className="w-full h-full object-cover" />
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

              <div className="col-span-2 space-y-2">
                <Label className="text-sm font-semibold">Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger className="w-full min-w-0 rounded-xl bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullstack">{CATEGORY_META.fullstack.label}</SelectItem>
                    <SelectItem value="backend">{CATEGORY_META.backend.label}</SelectItem>
                    <SelectItem value="cloud">{CATEGORY_META.cloud.label}</SelectItem>
                  </SelectContent>
                </Select>
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
              ref={techChipRef}
              label="Tech Stack"
              values={form.techStack}
              onChange={(v) => setForm((f) => ({ ...f, techStack: v }))}
              placeholder="Next.js, TypeScript — commas ok, then Add"
            />

            <TagInput
              ref={discoveryChipRef}
              label="Discovery Tags (attract visitors & SEO)"
              hint="Shown as topic pills on admin cards and public /skills/[category] project cards."
              values={form.tags}
              onChange={(v) => setForm((f) => ({ ...f, tags: v }))}
              placeholder="AI, SaaS — commas ok, then Add"
            />

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <input
                type="checkbox"
                id="comingSoon"
                checked={form.comingSoon}
                onChange={(e) => setForm((f) => ({ ...f, comingSoon: e.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              <Label htmlFor="comingSoon" className="text-sm cursor-pointer">Coming soon (card overlay on site)</Label>
            </div>

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

      <Dialog
        open={deleteConfirmProject !== null}
        onOpenChange={(next) => {
          if (!next && !deleteSubmitting) resetDeleteConfirmation();
        }}
      >
        <DialogContent
          className="rounded-xl max-w-[calc(100%-2rem)] sm:max-w-md"
          showCloseButton={!deleteSubmitting}
          onPointerDownOutside={(e) => deleteSubmitting && e.preventDefault()}
          onEscapeKeyDown={(e) => deleteSubmitting && e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <DialogDescription id="delete-project-dialog-desc" asChild>
              <div className="space-y-1 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">{deleteConfirmProject?.title}</span>
                  ?
                </p>
                <p className="font-medium text-destructive">This action cannot be undone.</p>
              </div>
            </DialogDescription>

            <div className="space-y-2">
              <Label htmlFor="confirm-delete-project-input" className="cursor-default text-sm font-semibold text-foreground">
                Type{" "}
                <span className="font-mono font-semibold text-destructive">delete</span>{" "}
                to confirm
              </Label>
              <Input
                id="confirm-delete-project-input"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-describedby="delete-project-dialog-desc"
                aria-invalid={deleteConfirmationInput.length > 0 && !confirmDeletePhraseMatches}
                className="rounded-xl bg-card font-mono text-sm"
                disabled={deleteSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={resetDeleteConfirmation}
              disabled={deleteSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              onClick={handleDeleteConfirmed}
              disabled={!confirmDeletePhraseMatches || deleteSubmitting}
            >
              {deleteSubmitting ? "Deleting…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
