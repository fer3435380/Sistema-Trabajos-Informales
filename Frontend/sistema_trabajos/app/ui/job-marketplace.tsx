"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiRequest, buildJobQuery, clearSession, persistSession, readSession } from "../lib/api";
import {
  emptyFilters,
  emptyJobForm,
  getRoleBadgeClasses,
  roleLabels,
} from "../lib/constants";
import {
  showSystemNotification,
} from "../lib/system-notifications";
import type {
  Application,
  AuthForm,
  AuthResponse,
  Feedback,
  Filters,
  Job,
  JobForm as JobFormValues,
  NotificationItem,
  NotificationListResponse,
  Role,
  User,
  UserStats,
} from "../types/job";
import { ApplicationModal } from "./ApplicationModal";
import { AuthPanel } from "./AuthPanel";
import { FeedbackToast } from "./FeedbackToast";
import { JobFormModal } from "./JobFormModal";
import { JobList } from "./JobList";
import { Metric } from "./Metric";
import { MissionVision } from "./MissionVision";
import { NotificationCenter } from "./NotificationCenter";
import { OwnerJobList } from "./OwnerJobList";
import { PublicJobCard } from "./PublicJobCard";
import { ReceivedApplications } from "./ReceivedApplications";
import { UserSidebar } from "./UserSidebar";

function matchesFilterValue(source: string, filterValue: string) {
  return source.toLowerCase().includes(filterValue.trim().toLowerCase());
}

function jobMatchesFilters(job: Job, filters: Filters) {
  if (filters.search) {
    const searchTerm = filters.search.trim().toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm);

    if (!matchesSearch) {
      return false;
    }
  }

  if (filters.type && !matchesFilterValue(job.type, filters.type)) {
    return false;
  }

  if (filters.location && !matchesFilterValue(job.location, filters.location)) {
    return false;
  }

  if (filters.status && job.status !== filters.status) {
    return false;
  }

  return true;
}

function upsertJob(currentJobs: Job[], nextJob: Job) {
  return [nextJob, ...currentJobs.filter((job) => job.id !== nextJob.id)];
}

export function LoginLanding() {
  const router = useRouter();
  const loginRef = useRef<HTMLDivElement>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    workers: 0,
    owners: 0,
  });
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState<AuthForm>({
    name: "",
    email: "",
    password: "",
    role: "worker" as Role,
  });
  const [isWorking, setIsWorking] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

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
        const [jobs, stats] = await Promise.all([
          apiRequest<Job[]>("/jobs/?status=open"),
          apiRequest<UserStats>("/users/stats/"),
        ]);
        setRecentJobs(jobs.slice(0, 6));
        setUserStats(stats);
      } catch {
        setRecentJobs([]);
        setUserStats({ workers: 0, owners: 0 });
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFeedback(null);
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [feedback]);

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
      <section className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#eef4ff_55%,#fff6eb_100%)]">
        {/* CORRECCIÓN: Se añade 'md:items-center' para que en escritorio 
            el panel de login se alinee verticalmente con el texto.
        */}
        <div className="mx-auto grid w-full max-w-7xl items-start gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-8 lg:px-10">
          
          <div className="flex min-h-[320px] flex-col justify-between py-2 sm:min-h-[390px] sm:py-6">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex h-11 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <Image
                    alt="Logo STI"
                    height={28}
                    src="/helmet-svgrepo-com.svg"
                    width={28}
                  />
                </span>
                <span className="inline-flex min-h-8 items-center rounded-full bg-blue-100 px-3 text-xs font-black uppercase tracking-[0.12em] text-blue-900 ring-1 ring-blue-200">
                  En busqueda de empleo?
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  Confianza · Profesionalidad · Entrega
                </span>
              </div>
              <h1 className="max-w-3xl text-[2.35rem] font-black leading-tight text-slate-950 sm:text-5xl md:text-6xl">
                Sistema de trabajos informales
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                Encuentra oportunidades recientes, inicia sesion y gestiona tus
                postulaciones con el backend del proyecto.
              </p>
            </div>
            
            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
              <Metric label="Empleadores" value={userStats.owners.toString()} />
              <Metric label="Trabajadores" value={userStats.workers.toString()} />
              <div className="col-span-2 sm:col-span-1">
                <Metric
                  label="Trabajos recientes"
                  value={recentJobs.length.toString()}
                />
              </div>
            </div>
          </div>

          {/* Contenedor del Panel: 'md:justify-self-end' ayuda a que 
              el cuadro se pegue a la derecha en pantallas grandes.
          */}
          <div
            ref={loginRef}
            className="w-full max-w-md justify-self-center md:justify-self-end"
          >
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
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--orange)]">
              Recientes
            </p>
            <h2 className="text-2xl font-black text-slate-950">
              Trabajos disponibles
            </h2>
          </div>
          <span className="inline-flex min-h-8 items-center rounded-full bg-amber-100 px-3 text-xs font-black text-amber-800 ring-1 ring-amber-200">
            Solo vista informativa
          </span>
        </div>

        {recentJobs.length === 0 ? (
          <div className="mt-5 flex min-h-48 items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white px-4 text-center text-sm font-semibold text-slate-500">
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

      <footer className="bg-slate-950 text-blue-100">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
          <span>Sistema de Trabajos Informales</span>
          <span>Proyecto academico</span>
        </div>
      </footer>
      <FeedbackToast feedback={feedback} onClose={() => setFeedback(null)} />
    </main>
  );
}

export function DashboardApp() {
  const router = useRouter();
  const hasInitializedNotifications = useRef(false);
  const announcedNotificationIds = useRef<Set<number>>(new Set());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<Application[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(emptyFilters);
  const [coverLetters, setCoverLetters] = useState<Record<number, string>>({});
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [jobForm, setJobForm] = useState<JobFormValues>(emptyJobForm);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const isOwner = user?.role === "owner" || user?.role === "admin";
  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications],
  );
  const appliedJobIds = useMemo(
    () => new Set(myApplications.map((application) => application.job)),
    [myApplications],
  );
  const rejectedJobIds = useMemo(
    () =>
      new Set(
        myApplications
          .filter((application) => application.status === "rejected")
          .map((application) => application.job),
      ),
    [myApplications],
  );
  const availableJobs = useMemo(
    () => jobs.filter((job) => !rejectedJobIds.has(job.id)),
    [jobs, rejectedJobIds],
  );
  const ownerJobs = useMemo(
    () => jobs.filter((job) => job.creator === user?.id && job.status === "open"),
    [jobs, user?.id],
  );

  const loadNotifications = useCallback(
    async (
      authToken: string,
      options: { showLoading?: boolean } = {},
    ) => {
      const { showLoading = true } = options;

      if (showLoading) {
        setIsNotificationsLoading(true);
      }

      try {
        const response = await apiRequest<NotificationListResponse>(
          "/notifications/?limit=12",
          {},
          authToken,
        );

        setNotifications(response.items);
      } catch {
        setNotifications([]);
      } finally {
        if (showLoading) {
          setIsNotificationsLoading(false);
        }
      }
    },
    [],
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

  const loadJobs = useCallback(
    async (
      activeFilters: Filters,
      options: { showLoading?: boolean } = {},
    ) => {
      const { showLoading = true } = options;

      if (showLoading) {
        setIsLoading(true);
      }

      try {
        const query = buildJobQuery(activeFilters);
        const data = await apiRequest<Job[]>(`/jobs/?${query}`);
        setJobs(data);
      } catch (error) {
        if (showLoading) {
          setFeedback({
            tone: "error",
            message:
              error instanceof Error
                ? error.message
                : "No se pudieron cargar los trabajos.",
          });
        }
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const refreshDashboardData = useCallback(
    async (
      authToken: string,
      currentUser: User,
      activeFilters: Filters,
      options: { includeApplications?: boolean; showLoading?: boolean } = {},
    ) => {
      const { includeApplications = true, showLoading = false } = options;
      const tasks: Promise<unknown>[] = [
        loadJobs(activeFilters, { showLoading }),
        loadNotifications(authToken, { showLoading }),
      ];

      if (includeApplications) {
        tasks.unshift(loadApplications(authToken, currentUser));
      }

      await Promise.all(tasks);
    },
    [loadApplications, loadJobs, loadNotifications],
  );

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
      void loadNotifications(session.token, { showLoading: true });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadApplications, loadNotifications, router]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedFilters(filters);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [filters]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadJobs(debouncedFilters, { showLoading: true });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [debouncedFilters, loadJobs]);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refreshDashboardData(token, user, debouncedFilters, {
        includeApplications: user.role === "owner" || user.role === "admin",
      });
    }, 8000);

    return () => window.clearInterval(intervalId);
  }, [debouncedFilters, refreshDashboardData, token, user]);

  useEffect(() => {
    if (notifications.length === 0) {
      return;
    }

    if (!hasInitializedNotifications.current) {
      announcedNotificationIds.current = new Set(
        notifications.map((notification) => notification.id),
      );
      hasInitializedNotifications.current = true;
      return;
    }

    let shouldRefreshWorkerApplications = false;

    for (const notification of notifications) {
      if (announcedNotificationIds.current.has(notification.id)) {
        continue;
      }

      announcedNotificationIds.current.add(notification.id);
      if (token && user && user.role === "worker") {
        shouldRefreshWorkerApplications = true;
      }
      void showSystemNotification(notification);
    }

    if (shouldRefreshWorkerApplications && token && user && user.role === "worker") {
      const timeoutId = window.setTimeout(() => {
        void loadApplications(token, user);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [loadApplications, notifications, token, user]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFeedback(null);
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [feedback]);

  async function handleCreateJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !user) return;
    setIsWorking(true);

    try {
      const createdJob = await apiRequest<Job>(
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
      setJobs((currentJobs) =>
        jobMatchesFilters(createdJob, debouncedFilters)
          ? upsertJob(currentJobs, createdJob)
          : currentJobs,
      );
      setJobForm(emptyJobForm);
      setIsJobModalOpen(false);
      setFeedback({ tone: "success", message: "Trabajo publicado." });
      await refreshDashboardData(token, user, debouncedFilters, {
        includeApplications: true,
        showLoading: false,
      });
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
      const createdApplication = await apiRequest<Application>(
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
      setMyApplications((currentApplications) => [
        createdApplication,
        ...currentApplications.filter(
          (application) => application.id !== createdApplication.id,
        ),
      ]);
      setCoverLetters((current) => ({ ...current, [jobId]: "" }));
      setFeedback({ tone: "success", message: "Postulacion enviada." });
      await refreshDashboardData(token, user, debouncedFilters, {
        includeApplications: true,
        showLoading: false,
      });
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
      const updatedApplication = await apiRequest<Application>(
        `/applications/${applicationId}/${status}/`,
        { method: "PATCH" },
        token,
      );
      setReceivedApplications((currentApplications) =>
        currentApplications.map((application) => {
          if (application.id === updatedApplication.id) {
            return updatedApplication;
          }

          if (
            updatedApplication.status === "accepted" &&
            application.job === updatedApplication.job &&
            application.status === "pending"
          ) {
            return { ...application, status: "rejected" };
          }

          return application;
        }),
      );
      if (updatedApplication.status === "accepted") {
        setJobs((currentJobs) =>
          currentJobs.map((job) =>
            job.id === updatedApplication.job
              ? { ...job, status: "assigned" }
              : job,
          ),
        );
      }
      setFeedback({
        tone: "success",
        message:
          status === "accept"
            ? "Postulacion aceptada."
            : "Postulacion rechazada.",
      });
      await refreshDashboardData(token, user, debouncedFilters, {
        includeApplications: true,
        showLoading: false,
      });
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

  async function handleMarkNotificationRead(notificationId: number) {
    if (!token) {
      return;
    }

    try {
      const updatedNotification = await apiRequest<NotificationItem>(
        `/notifications/${notificationId}/read/`,
        { method: "PATCH" },
        token,
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === updatedNotification.id
            ? updatedNotification
            : notification,
        ),
      );
    } catch {
      return;
    }
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
      <header className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#eef4ff_54%,#fff7ee_100%)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex h-11 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image
                alt="Logo STI"
                height={28}
                src="/helmet-svgrepo-com.svg"
                width={28}
              />
            </span>
            <span
              className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-black uppercase tracking-[0.12em] ${getRoleBadgeClasses(user.role)}`}
            >
              {roleLabels[user.role]}
            </span>
          </div>
          <h1 className="text-[2.55rem] font-black leading-tight text-slate-950 sm:text-5xl">
            Panel de trabajo
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Postulaciones, filtros y oportunidades
          </p>
        </div>
        <div className="flex w-full items-center gap-3 self-start sm:w-auto md:self-auto">
          <NotificationCenter
            isLoading={isNotificationsLoading}
            notifications={notifications}
            unreadCount={unreadNotifications}
            onMarkAsRead={handleMarkNotificationRead}
          />
          <button
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-700 transition hover:bg-slate-200 sm:flex-none"
            onClick={handleLogout}
            type="button"
          >
            Salir
          </button>
        </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-start gap-5 px-4 py-4 sm:px-6 md:px-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:px-10">
        <UserSidebar
          applications={myApplications}
          filters={filters}
          isLoading={isLoading}
          user={user}
          onFilterChange={setFilters}
          onRefresh={() => loadJobs(filters, { showLoading: true })}
          onSelectApplication={setSelectedApplication}
        />

        <div className="grid gap-5">
          {isOwner ? (
            <div className="flex max-w-full flex-wrap items-center gap-3 lg:max-w-[720px]">
              <button
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--orange)] px-4 text-sm font-black text-white shadow-[0_18px_40px_rgba(251,114,22,0.24)] transition hover:bg-orange-600 sm:w-auto"
                onClick={() => setIsJobModalOpen(true)}
                type="button"
              >
                <span aria-hidden="true">+</span>
                Publicar trabajo
              </button>
            </div>
          ) : null}

          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--orange)]">
                  {isOwner ? "Gestion" : "Oportunidades"}
                </p>
                <h2 className="text-2xl font-black text-slate-950">
                  {isOwner ? "Mis publicaciones" : "Trabajos disponibles"}
                </h2>
              </div>
            </div>

            {isOwner ? (
              <OwnerJobList isLoading={isLoading} jobs={ownerJobs} />
            ) : (
              <JobList
                appliedJobIds={appliedJobIds}
                coverLetters={coverLetters}
                isLoading={isLoading}
                isWorking={isWorking}
                jobs={availableJobs}
                onApply={handleApply}
                onCoverLetterChange={(jobId, value) =>
                  setCoverLetters((current) => ({
                    ...current,
                    [jobId]: value,
                  }))
                }
              />
            )}
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
      {isJobModalOpen ? (
        <JobFormModal
          form={jobForm}
          isWorking={isWorking}
          onChange={setJobForm}
          onClose={() => setIsJobModalOpen(false)}
          onSubmit={handleCreateJob}
        />
      ) : null}
      <FeedbackToast feedback={feedback} onClose={() => setFeedback(null)} />
    </main>
  );
}
