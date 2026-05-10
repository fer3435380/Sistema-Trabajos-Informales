"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiRequest, buildJobQuery, clearSession, persistSession, readSession } from "../lib/api";
import { emptyFilters, emptyJobForm, roleLabels } from "../lib/constants";
import type { Application, AuthForm, AuthResponse, Feedback, Filters, Job, JobForm as JobFormValues, Role, User } from "../types/job";
import { ApplicationModal } from "./ApplicationModal";
import { AuthPanel } from "./AuthPanel";
import { JobForm } from "./JobForm";
import { JobList } from "./JobList";
import { Metric } from "./Metric";
import { MissionVision } from "./MissionVision";
import { PublicJobCard } from "./PublicJobCard";
import { ReceivedApplications } from "./ReceivedApplications";
import { UserSidebar } from "./UserSidebar";

export function LoginLanding() {
  const router = useRouter();
  const loginRef = useRef<HTMLDivElement>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState<AuthForm>({
    name: "",
    email: "",
    password: "",
    role: "worker" as Role,
  });
  const [isWorking, setIsWorking] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    tone: "info",
    message: "Ingresa para postular o publicar trabajos.",
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const session = readSession();
      if (session) {
        router.replace("/dashboard");
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [router]);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        const jobs = await apiRequest<Job[]>("/jobs/?status=open");
        setRecentJobs(jobs.slice(0, 6));
      } catch {
        setRecentJobs([]);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsWorking(true);

    const body =
      authMode === "register"
        ? authForm
        : { email: authForm.email, password: authForm.password };

    try {
      const data = await apiRequest<AuthResponse>(
        `/auth/${authMode}/`,
        { method: "POST", body: JSON.stringify(body) },
      );
      persistSession(data);
      setFeedback({
        tone: "success",
        message: `Bienvenido, ${data.user.name}.`,
      });
      router.push("/dashboard");
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo iniciar sesion.",
      });
    } finally {
      setIsWorking(false);
    }
  }

  function handleRecentJobClick() {
    loginRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setFeedback({
      tone: "info",
      message: "Inicia sesion para postular a un trabajo.",
    });
  }

    return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--ink)]">
      <section className="hero-band">
        {/* CORRECCIÓN: Se añade 'md:items-center' para que en escritorio 
            el panel de login se alinee verticalmente con el texto.
        */}
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-8 items-start md:items-center md:grid-cols-[1.05fr_0.95fr] md:px-8 lg:px-10">
          
          <div className="flex min-h-[390px] flex-col justify-between py-6">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="brand-mark">STI</span>
                <span className="pill pill-blue">En busqueda de empleo?</span>
                <span className="text-sm font-semibold text-slate-600">
                  Confianza · Profesionalidad · Entrega
                </span>
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
                Sistema de trabajos informales
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
                Encuentra oportunidades recientes, inicia sesion y gestiona tus
                postulaciones con el backend del proyecto.
              </p>
            </div>
            
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              <Metric label="Contratistas" value="?" />
              <Metric label="Trabajadores" value="?" />
              <Metric
                label="Trabajos recientes"
                value={recentJobs.length.toString()}
              />
            </div>
          </div>

          {/* Contenedor del Panel: 'md:justify-self-end' ayuda a que 
              el cuadro se pegue a la derecha en pantallas grandes.
          */}
          <div ref={loginRef} className="md:justify-self-end w-full max-w-md">
            <AuthPanel
              authForm={authForm}
              authMode={authMode}
              feedback={feedback}
              isWorking={isWorking}
              onAuthFormChange={setAuthForm}
              onAuthModeChange={setAuthMode}
              onSubmit={handleAuthSubmit}
            />
          </div>
        </div>
      </section>

      <MissionVision />

      {/* Resto del código se mantiene igual... */}
      <section className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 lg:px-10">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recientes</p>
            <h2>Trabajos disponibles</h2>
          </div>
          <span className="status-message info">Solo vista informativa</span>
        </div>

        {recentJobs.length === 0 ? (
          <div className="empty-state mt-5">
            No se pudieron cargar trabajos recientes.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentJobs.map((job) => (
              <PublicJobCard
                job={job}
                key={job.id}
                onClick={handleRecentJobClick}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="site-footer">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
          <span>Sistema de Trabajos Informales</span>
          <span>Proyecto academico</span>
        </div>
      </footer>
    </main>
  );
}

export function DashboardApp() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<Application[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(emptyFilters);
  const [coverLetters, setCoverLetters] = useState<Record<number, string>>({});
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [jobForm, setJobForm] = useState<JobFormValues>(emptyJobForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [, setFeedback] = useState<Feedback>({
    tone: "info",
    message: "Sincronizando panel.",
  });

  const isOwner = user?.role === "owner" || user?.role === "admin";
  const appliedJobIds = useMemo(
    () => new Set(myApplications.map((application) => application.job)),
    [myApplications],
  );

  const loadApplications = useCallback(
    async (authToken: string, currentUser: User) => {
      try {
        const mine = await apiRequest<Application[]>(
          "/applications/mine/",
          {},
          authToken,
        );
        setMyApplications(mine);

        if (currentUser.role === "owner" || currentUser.role === "admin") {
          const received = await apiRequest<Application[]>(
            "/applications/received/",
            {},
            authToken,
          );
          setReceivedApplications(received);
        } else {
          setReceivedApplications([]);
        }
      } catch {
        setMyApplications([]);
        setReceivedApplications([]);
      }
    },
    [],
  );

  const loadJobs = useCallback(async (activeFilters: Filters) => {
    setIsLoading(true);
    try {
      const query = buildJobQuery(activeFilters);
      const data = await apiRequest<Job[]>(`/jobs/?${query}`);
      setJobs(data);
      setFeedback({
        tone: "success",
        message: "Trabajos actualizados.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los trabajos.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const session = readSession();

      if (!session) {
        router.replace("/");
        return;
      }

      setToken(session.token);
      setUser(session.user);
      void loadApplications(session.token, session.user);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadApplications, router]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedFilters(filters);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [filters]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadJobs(debouncedFilters);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [debouncedFilters, loadJobs]);

  async function handleCreateJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setIsWorking(true);

    try {
      await apiRequest<Job>(
        "/jobs/",
        {
          method: "POST",
          body: JSON.stringify({
            ...jobForm,
            payment: Number(jobForm.payment || 0).toFixed(2),
          }),
        },
        token,
      );
      setJobForm(emptyJobForm);
      setFeedback({ tone: "success", message: "Trabajo publicado." });
      await loadJobs(debouncedFilters);
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error ? error.message : "No se pudo publicar.",
      });
    } finally {
      setIsWorking(false);
    }
  }

  async function handleApply(jobId: number) {
    if (!token || !user) return;
    setIsWorking(true);

    try {
      await apiRequest<Application>(
        "/applications/",
        {
          method: "POST",
          body: JSON.stringify({
            job: jobId,
            cover_letter: coverLetters[jobId] ?? "",
          }),
        },
        token,
      );
      setCoverLetters((current) => ({ ...current, [jobId]: "" }));
      setFeedback({ tone: "success", message: "Postulacion enviada." });
      await loadApplications(token, user);
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error ? error.message : "No se pudo postular.",
      });
    } finally {
      setIsWorking(false);
    }
  }

  async function handleApplicationStatus(
    applicationId: number,
    status: "accept" | "reject",
  ) {
    if (!token || !user) return;
    setIsWorking(true);

    try {
      await apiRequest<Application>(
        `/applications/${applicationId}/${status}/`,
        { method: "PATCH" },
        token,
      );
      setFeedback({
        tone: "success",
        message:
          status === "accept"
            ? "Postulacion aceptada."
            : "Postulacion rechazada.",
      });
      await loadApplications(token, user);
      await loadJobs(debouncedFilters);
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar la postulacion.",
      });
    } finally {
      setIsWorking(false);
    }
  }

  function handleLogout() {
    clearSession();
    router.replace("/");
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--app-bg)]">
        <div className="empty-state m-5">Preparando tu panel...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--ink)]">
      <header className="dashboard-header">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="brand-mark">STI</span>
            <span className="pill pill-blue">{roleLabels[user.role]}</span>
          </div>
          <h1>Panel de trabajo</h1>
          <p>Postulaciones, filtros y oportunidades </p>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout} type="button">
          Salir
        </button>
      </header>

      <section className="dashboard-shell">
        <UserSidebar
          applications={myApplications}
          filters={filters}
          isLoading={isLoading}
          user={user}
          onFilterChange={setFilters}
          onRefresh={() => loadJobs(filters)}
          onSelectApplication={setSelectedApplication}
        />

        <div className="dashboard-content">
          {isOwner ? (
            <div className="owner-panel-slot">
              <JobForm
                form={jobForm}
                isWorking={isWorking}
                onChange={setJobForm}
                onSubmit={handleCreateJob}
              />
            </div>
          ) : null}

          <section className="space-y-5">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Oportunidades</p>
                <h2>Trabajos disponibles</h2>
              </div>
            </div>

            <JobList
              appliedJobIds={appliedJobIds}
              coverLetters={coverLetters}
              isLoading={isLoading}
              isWorking={isWorking}
              jobs={jobs}
              onApply={handleApply}
              onCoverLetterChange={(jobId, value) =>
                setCoverLetters((current) => ({
                  ...current,
                  [jobId]: value,
                }))
              }
            />
          </section>

          {isOwner ? (
            <ReceivedApplications
              applications={receivedApplications}
              isWorking={isWorking}
              onStatusChange={handleApplicationStatus}
            />
          ) : null}
        </div>
      </section>

      {selectedApplication ? (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      ) : null}
    </main>
  );
}
