"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

const CATEGORIES = [
  { value: "fullstack", label: "Full-Stack", color: "bg-[#A8DADC]/20 text-[#2C9C9F] border-[#A8DADC]/30" },
  { value: "backend", label: "Backend & AI", color: "bg-[#FFC1CC]/20 text-rose-500 border-[#FFC1CC]/30" },
  { value: "cloud", label: "Cloud", color: "bg-[#B39CD0]/20 text-[#7B5EA7] border-[#B39CD0]/30" },
];

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  order: number;
}

const EMPTY_FORM = { name: "", category: "fullstack", proficiency: 75, order: 0 };

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const fetchSkills = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/skills");
    const data = await res.json();
    setSkills(data.skills ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY_FORM }); setOpen(true); };
  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, proficiency: s.proficiency, order: s.order });
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/skills/${editing._id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/skills", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      await fetchSkills();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    setSkills((s) => s.filter((x) => x._id !== id));
  };

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    skills: skills.filter((s) => s.category === cat.value).sort((a, b) => a.order - b.order),
  }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Skills</h1>
          <p className="text-sm text-muted-foreground mt-1">{skills.length} total</p>
        </div>
        <Button onClick={openAdd} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" /> Add Skill
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {grouped.map(({ value, label, color, skills: catSkills }) => (
            <div key={value} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <Badge variant="outline" className={`text-xs ${color}`}>{label}</Badge>
                <span className="text-xs text-muted-foreground">{catSkills.length} skills</span>
              </div>
              <div className="p-3 space-y-2">
                {catSkills.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No skills yet</p>
                ) : (
                  catSkills.map((s) => (
                    <div key={s._id} className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground truncate">{s.name}</span>
                          <span className="text-xs text-muted-foreground ml-2 shrink-0">{s.proficiency}%</span>
                        </div>
                        <div className="h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-300"
                            style={{ width: `${s.proficiency}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => openEdit(s)} className="p-1 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button onClick={() => handleDelete(s._id)} className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <button
                  onClick={() => { setForm({ ...EMPTY_FORM, category: value }); setEditing(null); setOpen(true); }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors border border-dashed border-border mt-2"
                >
                  <Plus className="h-3 w-3" /> Add to {label}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Skill" : "Add Skill"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Skill Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. React, Node.js, AWS…"
                className="rounded-xl bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger className="rounded-xl bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Proficiency</Label>
                <span className="text-sm font-bold text-primary">{form.proficiency}%</span>
              </div>
              <Slider
                value={[form.proficiency]}
                onValueChange={([v]) => setForm((f) => ({ ...f, proficiency: v }))}
                min={1} max={100} step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span><span>Intermediate</span><span>Expert</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Order</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: +e.target.value }))}
                className="rounded-xl bg-card"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name} className="rounded-xl">
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
