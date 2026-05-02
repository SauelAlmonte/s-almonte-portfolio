"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw, Save, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

interface Experience {
  _id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  description?: string;
  bullets: string[];
  order: number;
}

interface Education {
  _id: string;
  school: string;
  degree: string;
  field?: string;
  year?: string;
  description?: string;
}

interface Certification {
  _id: string;
  name: string;
  issuer: string;
  year?: string;
  credentialUrl?: string;
}

interface ResumeDoc {
  summary: string;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  resumeFileUrl?: string;
}

const patch = (action: string, data?: object, id?: string) =>
  fetch("/api/admin/resume", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data, id }),
    credentials: "include",
  });

const emptyResumeDoc: ResumeDoc = {
  summary: "",
  experience: [],
  education: [],
  certifications: [],
};

export default function AdminResumePage() {
  const [resume, setResume] = useState<ResumeDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  /* Summary state */
  const [summary, setSummary] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  /* Dialog state */
  const [dialog, setDialog] = useState<{ type: string; item?: object } | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [bulletInput, setBulletInput] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);

  const fetchResume = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/resume", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          typeof data?.error === "string" ? data.error : `Request failed (${res.status})`;
        setLoadError(msg);
        setResume(emptyResumeDoc);
        setSummary("");
        setFileUrl("");
        return;
      }
      const r: ResumeDoc = data.resume ?? emptyResumeDoc;
      setResume(r);
      setSummary(r.summary ?? "");
      setFileUrl(r.resumeFileUrl ?? "");
    } catch {
      setLoadError("Could not load resume. Check your connection and MongoDB settings.");
      setResume(emptyResumeDoc);
      setSummary("");
      setFileUrl("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResume(); }, []);

  const saveSummary = async () => {
    setSavingSection("summary");
    await patch("updateSummary", { summary });
    setSavingSection(null);
  };

  const saveFileUrl = async () => {
    setSavingSection("fileUrl");
    await patch("updateFileUrl", { resumeFileUrl: fileUrl });
    setSavingSection(null);
  };

  /* Generic open dialog helpers */
  const openAdd = (type: string) => {
    setDialog({ type });
    setFormData({});
    setBullets([]);
    setBulletInput("");
  };

  const openEdit = (type: string, item: Record<string, unknown>) => {
    setDialog({ type: `edit_${type}`, item });
    const { _id, bullets: b, ...rest } = item;
    void _id;
    setFormData(Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, String(v ?? "")])));
    setBullets((b as string[]) ?? []);
    setBulletInput("");
  };

  const handleSaveDialog = async () => {
    if (!dialog) return;
    setSavingSection("dialog");
    const { type } = dialog;

    if (type === "experience") {
      await patch("addExperience", { ...formData, bullets });
    } else if (type === "edit_experience") {
      const item = dialog.item as Experience;
      await patch("updateExperience", { ...formData, bullets }, item._id);
    } else if (type === "education") {
      await patch("addEducation", formData);
    } else if (type === "edit_education") {
      const item = dialog.item as Education;
      await patch("updateEducation", formData, item._id);
    } else if (type === "certification") {
      await patch("addCertification", formData);
    } else if (type === "edit_certification") {
      const item = dialog.item as Certification;
      await patch("updateCertification", formData, item._id);
    }

    await fetchResume();
    setDialog(null);
    setSavingSection(null);
  };

  const handleDelete = async (action: string, id: string) => {
    if (!confirm("Delete this entry?")) return;
    await patch(action, undefined, id);
    fetchResume();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
        <RefreshCw className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading resume data…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Resume</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your resume content</p>
      </div>

      {loadError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl" role="alert">
          {loadError}
        </p>
      )}

      <Tabs defaultValue="summary">
        <TabsList className="rounded-xl">
          <TabsTrigger value="summary" className="rounded-lg">Summary</TabsTrigger>
          <TabsTrigger value="experience" className="rounded-lg">Experience</TabsTrigger>
          <TabsTrigger value="education" className="rounded-lg">Education</TabsTrigger>
          <TabsTrigger value="certifications" className="rounded-lg">Certifications</TabsTrigger>
          <TabsTrigger value="file" className="rounded-lg">Resume File</TabsTrigger>
        </TabsList>

        {/* Summary */}
        <TabsContent value="summary" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Professional Summary / Bio</Label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={6}
              className="rounded-xl bg-card resize-none"
              placeholder="Write a brief professional summary about yourself…"
            />
          </div>
          <Button onClick={saveSummary} disabled={savingSection === "summary"} className="gap-2 rounded-xl">
            <Save className="h-4 w-4" />
            {savingSection === "summary" ? "Saving…" : "Save Summary"}
          </Button>
        </TabsContent>

        {/* Experience */}
        <TabsContent value="experience" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{resume?.experience.length ?? 0} entries</p>
            <Button onClick={() => openAdd("experience")} size="sm" className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> Add Experience
            </Button>
          </div>
          <div className="space-y-3">
            {(resume?.experience ?? []).map((exp) => (
              <div key={exp._id} className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{exp.role}</p>
                    <p className="text-sm text-primary">{exp.company}</p>
                    <p className="text-xs text-muted-foreground">{exp.period}{exp.location ? ` · ${exp.location}` : ""}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit("experience", exp as unknown as Record<string, unknown>)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete("deleteExperience", exp._id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {exp.bullets?.length > 0 && (
                  <ul className="space-y-1 mt-2">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary">•</span>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Education */}
        <TabsContent value="education" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{resume?.education.length ?? 0} entries</p>
            <Button onClick={() => openAdd("education")} size="sm" className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> Add Education
            </Button>
          </div>
          <div className="space-y-3">
            {(resume?.education ?? []).map((edu) => (
              <div key={edu._id} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</p>
                    <p className="text-sm text-primary">{edu.school}</p>
                    {edu.year && <p className="text-xs text-muted-foreground">{edu.year}</p>}
                    {edu.description && <p className="text-xs text-muted-foreground mt-1">{edu.description}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit("education", edu as unknown as Record<string, unknown>)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete("deleteEducation", edu._id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Certifications */}
        <TabsContent value="certifications" className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{resume?.certifications.length ?? 0} entries</p>
            <Button onClick={() => openAdd("certification")} size="sm" className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> Add Certification
            </Button>
          </div>
          <div className="space-y-3">
            {(resume?.certifications ?? []).map((cert) => (
              <div key={cert._id} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{cert.name}</p>
                    <p className="text-sm text-primary">{cert.issuer}</p>
                    {cert.year && <p className="text-xs text-muted-foreground">{cert.year}</p>}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-1 transition-colors">
                        <LinkIcon className="h-3 w-3" /> View Credential
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit("certification", cert as unknown as Record<string, unknown>)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete("deleteCertification", cert._id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Resume File */}
        <TabsContent value="file" className="mt-6 space-y-4">
          <div className="p-4 rounded-xl border border-border bg-card space-y-4">
            <p className="text-sm text-muted-foreground">
              Paste the public URL to your resume PDF (Google Drive, Dropbox, etc.). This is used for the &ldquo;Download Resume&rdquo; button on your portfolio.
            </p>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Resume PDF URL</Label>
              <Input
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/…"
                className="rounded-xl bg-muted"
              />
            </div>
            {fileUrl && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                <LinkIcon className="h-4 w-4" /> Preview current resume
              </a>
            )}
            <Button onClick={saveFileUrl} disabled={savingSection === "fileUrl"} className="gap-2 rounded-xl">
              <Save className="h-4 w-4" />
              {savingSection === "fileUrl" ? "Saving…" : "Save URL"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Universal Dialog */}
      <Dialog open={!!dialog} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialog?.type.includes("experience") ? (dialog.type.startsWith("edit") ? "Edit Experience" : "Add Experience")
                : dialog?.type.includes("education") ? (dialog.type.startsWith("edit") ? "Edit Education" : "Add Education")
                : dialog?.type.startsWith("edit") ? "Edit Certification" : "Add Certification"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Experience fields */}
            {dialog?.type.includes("experience") && (
              <>
                {[
                  { key: "company", label: "Company *", placeholder: "Company name" },
                  { key: "role", label: "Role / Title *", placeholder: "Software Engineer" },
                  { key: "period", label: "Period *", placeholder: "Jan 2022 – Present" },
                  { key: "location", label: "Location", placeholder: "New York, NY / Remote" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-semibold">{label}</Label>
                    <Input value={formData[key] ?? ""} onChange={(e) => setFormData((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="rounded-xl bg-card" />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Description</Label>
                  <Textarea value={formData.description ?? ""} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} className="rounded-xl bg-card resize-none" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Bullet Points</Label>
                  <div className="flex gap-2">
                    <Input value={bulletInput} onChange={(e) => setBulletInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && bulletInput.trim()) { e.preventDefault(); setBullets((b) => [...b, bulletInput.trim()]); setBulletInput(""); } }}
                      placeholder="Add a bullet and press Enter" className="rounded-xl bg-card text-sm" />
                    <Button type="button" variant="outline" size="sm" className="rounded-xl shrink-0"
                      onClick={() => { if (bulletInput.trim()) { setBullets((b) => [...b, bulletInput.trim()]); setBulletInput(""); } }}>
                      Add
                    </Button>
                  </div>
                  <ul className="space-y-1.5">
                    {bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="flex-1 text-muted-foreground">{b}</span>
                        <button onClick={() => setBullets((bl) => bl.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Education fields */}
            {dialog?.type.includes("education") && (
              <>
                {[
                  { key: "school", label: "School / Institution *", placeholder: "University name" },
                  { key: "degree", label: "Degree *", placeholder: "Bachelor of Science" },
                  { key: "field", label: "Field of Study", placeholder: "Computer Science" },
                  { key: "year", label: "Year", placeholder: "2020" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-semibold">{label}</Label>
                    <Input value={formData[key] ?? ""} onChange={(e) => setFormData((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="rounded-xl bg-card" />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Description</Label>
                  <Textarea value={formData.description ?? ""} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} className="rounded-xl bg-card resize-none" rows={2} />
                </div>
              </>
            )}

            {/* Certification fields */}
            {dialog?.type.includes("certification") && (
              <>
                {[
                  { key: "name", label: "Certification Name *", placeholder: "AWS Certified Solutions Architect" },
                  { key: "issuer", label: "Issuing Organization *", placeholder: "Amazon Web Services" },
                  { key: "year", label: "Year", placeholder: "2023" },
                  { key: "credentialUrl", label: "Credential URL", placeholder: "https://…" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-semibold">{label}</Label>
                    <Input value={formData[key] ?? ""} onChange={(e) => setFormData((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="rounded-xl bg-card" />
                  </div>
                ))}
              </>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialog(null)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSaveDialog} disabled={savingSection === "dialog"} className="rounded-xl">
              {savingSection === "dialog" ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
