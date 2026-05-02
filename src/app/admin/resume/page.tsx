"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw, Save, Link as LinkIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatCredentialPeriod, isoDateForPicker } from "@/lib/resume/format-credential-period";

interface Experience {
  _id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  description?: string;
  bullets: string[];
  tech?: string[];
  order: number;
}

interface Education {
  _id: string;
  school: string;
  degree: string;
  field?: string;
  year?: string;
  description?: string;
  credentialUrl?: string;
}

interface Certification {
  _id: string;
  name: string;
  issuer: string;
  year?: string;
  description?: string;
  credentialUrl?: string;
}

interface ResumeDoc {
  summary: string;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  resumeFileUrl?: string;
  resumeItFileUrl?: string;
}

const patch = async (action: string, data?: object, id?: string) => {
  const res = await fetch("/api/admin/resume", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data, id }),
    credentials: "include",
  });
  return res;
};

const emptyResumeDoc: ResumeDoc = {
  summary: "",
  experience: [],
  education: [],
  certifications: [],
};

function parseCommaSeparatedTags(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function readPatchError(res: Response): Promise<string | undefined> {
  const text = await res.text();
  if (!text.trim()) return undefined;
  try {
    const p = JSON.parse(text) as { error?: string };
    if (typeof p.error === "string") return p.error;
  } catch {
    return "Invalid server response.";
  }
  return undefined;
}

export default function AdminResumePage() {
  const [resume, setResume] = useState<ResumeDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  /* Summary state */
  const [summary, setSummary] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileUrlIt, setFileUrlIt] = useState("");

  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  /* Dialog state */
  const [dialog, setDialog] = useState<{ type: string; item?: object } | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [bulletInput, setBulletInput] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [techTags, setTechTags] = useState("");

  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchResume = async () => {
    setLoading(true);
    setLoadError(null);
    setSaveError(null);
    try {
      const res = await fetch("/api/admin/resume", { credentials: "include" });
      const text = await res.text();
      let data: { resume?: ResumeDoc; error?: string } = {};
      if (text.trim()) {
        try {
          data = JSON.parse(text) as { resume?: ResumeDoc; error?: string };
        } catch {
          setLoadError("Server returned invalid data (not JSON). Try restarting the dev server.");
          setResume(emptyResumeDoc);
          setSummary("");
          setFileUrl("");
          setFileUrlIt("");
          return;
        }
      }
      if (!res.ok) {
        const msg =
          typeof data?.error === "string" ? data.error : `Request failed (${res.status})`;
        setLoadError(msg);
        setResume(emptyResumeDoc);
        setSummary("");
        setFileUrl("");
        setFileUrlIt("");
        return;
      }
      const r: ResumeDoc = data.resume ?? emptyResumeDoc;
      setResume(r);
      setSummary(r.summary ?? "");
      setFileUrl(r.resumeFileUrl ?? "");
      setFileUrlIt(r.resumeItFileUrl ?? "");
    } catch {
      setLoadError("Could not load resume. Check your connection and MongoDB settings.");
      setResume(emptyResumeDoc);
      setSummary("");
      setFileUrl("");
      setFileUrlIt("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResume(); }, []);

  const saveSummary = async () => {
    setSavingSection("summary");
    setSaveError(null);
    try {
      const res = await patch("updateSummary", { summary });
      if (!res.ok) {
        setSaveError((await readPatchError(res)) ?? `Save failed (${res.status}).`);
        return;
      }
      await fetchResume();
    } finally {
      setSavingSection(null);
    }
  };

  const savePdfUrls = async () => {
    setSavingSection("fileUrl");
    setSaveError(null);
    try {
      const res = await patch("updateResumePdfUrls", {
        resumeFileUrl: fileUrl,
        resumeItFileUrl: fileUrlIt,
      });
      if (!res.ok) {
        setSaveError((await readPatchError(res)) ?? `Save failed (${res.status}).`);
        return;
      }
      await fetchResume();
    } finally {
      setSavingSection(null);
    }
  };

  const seedFromPortfolioConfig = async () => {
    if (
      !confirm(
        "Replace experience, education, and certifications with data from config/resume.ts and config/experience.ts? Summary and resume PDF URLs are not changed."
      )
    ) {
      return;
    }
    setSeeding(true);
    setLoadError(null);
    setSaveError(null);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/admin/resume/seed", {
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
        throw new Error(typeof data.error === "string" ? data.error : "Sync failed");
      }
      setSeedMessage(typeof data.message === "string" ? data.message : "Resume data synced from config.");
      await fetchResume();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Sync failed.");
    } finally {
      setSeeding(false);
    }
  };

  /* Generic open dialog helpers */
  const openAdd = (type: string) => {
    setDialog({ type });
    setFormData({});
    setBullets([]);
    setBulletInput("");
    setTechTags("");
  };

  const openEdit = (type: string, item: Record<string, unknown>) => {
    setDialog({ type: `edit_${type}`, item });
    setBulletInput("");
    if (type === "experience") {
      const exp = item as unknown as Experience;
      const { _id, bullets: b, tech, ...rest } = exp;
      void _id;
      setFormData(
        Object.fromEntries(
          Object.entries(rest as Record<string, unknown>).map(([k, v]) => [k, String(v ?? "")])
        )
      );
      setBullets(b ?? []);
      setTechTags((tech ?? []).join(", "));
      return;
    }
    const { _id, bullets: b, ...rest } = item;
    void _id;
    setFormData(Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, String(v ?? "")])));
    setBullets(Array.isArray(b) ? (b as string[]) : []);
    setTechTags("");
  };

  const handleSaveDialog = async () => {
    if (!dialog) return;
    setSavingSection("dialog");
    setSaveError(null);
    const { type } = dialog;

    try {
      if (type === "experience" || type === "edit_experience") {
        const tech = parseCommaSeparatedTags(techTags);
        const company = (formData.company ?? "").trim();
        const role = (formData.role ?? "").trim();
        const period = (formData.period ?? "").trim();
        if (!company || !role || !period) {
          setSaveError("Company, role, and period are required.");
          return;
        }
        const payload = {
          company,
          role,
          period,
          location: (formData.location ?? "").trim() || undefined,
          description: (formData.description ?? "").trim() || undefined,
          bullets,
          tech,
        };
        if (type === "experience") {
          const order = resume?.experience.length ?? 0;
          const res = await patch("addExperience", { ...payload, order });
          if (!res.ok) {
            setSaveError((await readPatchError(res)) ?? `Save failed (${res.status}).`);
            return;
          }
        } else {
          const item = dialog.item as Experience;
          const res = await patch("updateExperience", payload, item._id);
          if (!res.ok) {
            setSaveError((await readPatchError(res)) ?? `Save failed (${res.status}).`);
            return;
          }
        }
      } else if (type === "education") {
        const res = await patch("addEducation", formData);
        if (!res.ok) {
          setSaveError((await readPatchError(res)) ?? `Save failed (${res.status}).`);
          return;
        }
      } else if (type === "edit_education") {
        const item = dialog.item as Education;
        const res = await patch("updateEducation", formData, item._id);
        if (!res.ok) {
          setSaveError((await readPatchError(res)) ?? `Save failed (${res.status}).`);
          return;
        }
      } else if (type === "certification") {
        const name = (formData.name ?? "").trim();
        const issuer = (formData.issuer ?? "").trim();
        if (!name || !issuer) {
          setSaveError("Certification name and issuing organization are required.");
          return;
        }
        const payload = {
          name,
          issuer,
          year: (formData.year ?? "").trim() || undefined,
          description: (formData.description ?? "").trim() || undefined,
          credentialUrl: (formData.credentialUrl ?? "").trim() || undefined,
        };
        const res = await patch("addCertification", payload);
        if (!res.ok) {
          setSaveError((await readPatchError(res)) ?? `Save failed (${res.status}).`);
          return;
        }
      } else if (type === "edit_certification") {
        const name = (formData.name ?? "").trim();
        const issuer = (formData.issuer ?? "").trim();
        if (!name || !issuer) {
          setSaveError("Certification name and issuing organization are required.");
          return;
        }
        const payload = {
          name,
          issuer,
          year: (formData.year ?? "").trim() || undefined,
          description: (formData.description ?? "").trim() || undefined,
          credentialUrl: (formData.credentialUrl ?? "").trim() || undefined,
        };
        const item = dialog.item as Certification;
        const res = await patch("updateCertification", payload, item._id);
        if (!res.ok) {
          setSaveError((await readPatchError(res)) ?? `Save failed (${res.status}).`);
          return;
        }
      }

      await fetchResume();
      setDialog(null);
    } finally {
      setSavingSection(null);
    }
  };

  const handleDelete = async (action: string, id: string) => {
    if (!confirm("Delete this entry?")) return;
    setSaveError(null);
    const res = await patch(action, undefined, id);
    if (!res.ok) {
      setSaveError((await readPatchError(res)) ?? `Delete failed (${res.status}).`);
      return;
    }
    await fetchResume();
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-border bg-card">
      <p className="text-sm text-muted-foreground">
          Import default <strong className="text-foreground">experience</strong>,{" "}
          <strong className="text-foreground">education</strong>, and{" "}
          <strong className="text-foreground">certifications</strong> from{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">config/resume.ts</code> and{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">config/experience.ts</code>.
          Your summary and PDF paths stay as-is.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-2 rounded-xl shrink-0 cursor-pointer"
          onClick={() => void seedFromPortfolioConfig()}
          disabled={seeding}
        >
          {seeding ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" /> Syncing…
            </>
          ) : (
            <>
              <Download className="h-4 w-4" /> Sync from portfolio config
            </>
          )}
        </Button>
      </div>

      {seedMessage && (
        <p className="text-sm text-muted-foreground bg-muted/50 px-4 py-3 rounded-xl">{seedMessage}</p>
      )}

      {loadError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl" role="alert">
          {loadError}
        </p>
      )}
      {saveError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl" role="alert">
          {saveError}
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <p className="text-sm text-muted-foreground">{resume?.experience.length ?? 0} entries</p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl cursor-pointer"
                onClick={() => void seedFromPortfolioConfig()}
                disabled={seeding}
              >
                {seeding ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Sync from config
              </Button>
              <Button type="button" onClick={() => openAdd("experience")} size="sm" className="gap-2 rounded-xl cursor-pointer">
              <Plus className="h-4 w-4" /> Add Experience
            </Button>
            </div>
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
                    <button type="button" onClick={() => openEdit("experience", exp as unknown as Record<string, unknown>)} className="cursor-pointer p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => handleDelete("deleteExperience", exp._id)} className="cursor-pointer p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {exp.tech && exp.tech.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium text-foreground/80">Tech: </span>
                    {exp.tech.join(", ")}
                  </p>
                )}
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
                    {edu.credentialUrl && (
                      <a href={edu.credentialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline mt-1 cursor-pointer">
                        <LinkIcon className="h-3 w-3" /> Credential
                      </a>
                    )}
                    {edu.description && <p className="text-xs text-muted-foreground mt-1">{edu.description}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button type="button" onClick={() => openEdit("education", edu as unknown as Record<string, unknown>)} className="cursor-pointer p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => handleDelete("deleteEducation", edu._id)} className="cursor-pointer p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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
                    {cert.year ? (
                      <p className="text-xs text-muted-foreground">{formatCredentialPeriod(cert.year)}</p>
                    ) : null}
                    {cert.description ? (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{cert.description}</p>
                    ) : null}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-1 transition-colors">
                        <LinkIcon className="h-3 w-3" /> View Credential
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button type="button" onClick={() => openEdit("certification", cert as unknown as Record<string, unknown>)} className="cursor-pointer p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => handleDelete("deleteCertification", cert._id)} className="cursor-pointer p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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
              Optional paths or full URLs for the two resume PDFs shown in the public download modal.
              Leave empty to use defaults from{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded-md">config/experience.ts</code>{" "}
              (<code className="text-xs bg-muted px-1.5 py-0.5 rounded-md">/sauel_almonte_resume_Software.pdf</code> and{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded-md">/sauel_almonte_resume_IT.pdf</code>).
            </p>
            <div className="space-y-2">
              <Label htmlFor="resume-file-software" className="text-sm font-semibold">
                Software resume PDF
              </Label>
              <Input
                id="resume-file-software"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="/sauel_almonte_resume_Software.pdf"
                className="rounded-xl bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume-file-it" className="text-sm font-semibold">
                IT resume PDF
              </Label>
              <Input
                id="resume-file-it"
                value={fileUrlIt}
                onChange={(e) => setFileUrlIt(e.target.value)}
                placeholder="/sauel_almonte_resume_IT.pdf"
                className="rounded-xl bg-muted"
              />
            </div>
            {(fileUrl || fileUrlIt) && (
              <p className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                {fileUrl ? (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer">
                    <LinkIcon className="h-3.5 w-3.5" /> Preview software PDF
                  </a>
                ) : null}
                {fileUrlIt ? (
                  <a href={fileUrlIt} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer">
                    <LinkIcon className="h-3.5 w-3.5" /> Preview IT PDF
                  </a>
                ) : null}
              </p>
            )}
            <Button type="button" onClick={() => void savePdfUrls()} disabled={savingSection === "fileUrl"} className="gap-2 rounded-xl cursor-pointer">
              <Save className="h-4 w-4" />
              {savingSection === "fileUrl" ? "Saving…" : "Save PDF paths"}
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
            <DialogDescription className="sr-only">
              Update the form fields and save your changes to resume data.
            </DialogDescription>
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
                  <Label htmlFor="experience-tech-tags" className="text-sm font-semibold">
                    Technologies (comma-separated)
                  </Label>
                  <Input
                    id="experience-tech-tags"
                    value={techTags}
                    onChange={(e) => setTechTags(e.target.value)}
                    placeholder="React, TypeScript, Node.js"
                    className="rounded-xl bg-card"
                  />
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
                        <button type="button" onClick={() => setBullets((bl) => bl.filter((_, j) => j !== i))} className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors" aria-label={`Remove bullet ${i + 1}`}>
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
                  { key: "credentialUrl", label: "Credential URL", placeholder: "https://…" },
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
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-semibold">{label}</Label>
                    <Input value={formData[key] ?? ""} onChange={(e) => setFormData((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="rounded-xl bg-card" />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label htmlFor="cert-issued-date" className="text-sm font-semibold">
                    Date obtained
                  </Label>
                  <Input
                    id="cert-issued-date"
                    type="date"
                    value={isoDateForPicker(formData.year)}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData((f) => {
                        const prev = (f.year ?? "").trim();
                        if (v) return { ...f, year: v };
                        if (/^\d{4}-\d{2}-\d{2}$/.test(prev)) return { ...f, year: "" };
                        return { ...f, year: prev };
                      });
                    }}
                    className="rounded-xl bg-card cursor-pointer [color-scheme:dark]"
                  />
                  {formData.year && !isoDateForPicker(formData.year) ? (
                    <p className="text-xs text-muted-foreground">
                      Shown on site as: <span className="text-foreground">{formData.year}</span> — pick a date above to switch to a calendar date.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Optional. Uses your browser date picker; stored as YYYY-MM-DD and formatted on the site.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-credential-url" className="text-sm font-semibold">
                    Credential URL
                  </Label>
                  <Input
                    id="cert-credential-url"
                    value={formData.credentialUrl ?? ""}
                    onChange={(e) => setFormData((f) => ({ ...f, credentialUrl: e.target.value }))}
                    placeholder="https://…"
                    className="rounded-xl bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-description" className="text-sm font-semibold">
                    Description
                  </Label>
                  <Textarea
                    id="cert-description"
                    value={formData.description ?? ""}
                    onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Short summary (optional)"
                    className="rounded-xl bg-card resize-none min-h-[4.5rem]"
                    rows={3}
                  />
                </div>
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
