import type { AuthForm, Feedback, FormSubmitHandler, Role } from "../types/job";

type AuthPanelProps = {
  authForm: AuthForm;
  authMode: "login" | "register";
  feedback: Feedback | null;
  isWorking: boolean;
  onAuthFormChange: (form: AuthForm) => void;
  onAuthModeChange: (mode: "login" | "register") => void;
  onSubmit: FormSubmitHandler;
};

export function AuthPanel({
  authForm,
  authMode,
  feedback,
  isWorking,
  onAuthFormChange,
  onAuthModeChange,
  onSubmit,
}: AuthPanelProps) {
  return (
    <form
      className="grid gap-5 rounded-[28px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_30px_70px_rgba(15,23,42,0.12)] backdrop-blur sm:p-6"
      onSubmit={onSubmit}
    >
      <div className="grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-100 p-1">
        <button
          className={`min-h-11 rounded-xl px-4 text-sm font-black transition ${
            authMode === "login"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500"
          }`}
          onClick={() => onAuthModeChange("login")}
          type="button"
        >
          Ingresar
        </button>
        <button
          className={`min-h-11 rounded-xl px-4 text-sm font-black transition ${
            authMode === "register"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500"
          }`}
          onClick={() => onAuthModeChange("register")}
          type="button"
        >
          Registro
        </button>
      </div>

      {authMode === "register" ? (
        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Nombre
          <input
            className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
            onChange={(event) =>
              onAuthFormChange({ ...authForm, name: event.target.value })
            }
            required
            value={authForm.name}
          />
        </label>
      ) : null}

      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Email
        <input
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
          onChange={(event) =>
            onAuthFormChange({ ...authForm, email: event.target.value })
          }
          required
          type="email"
          value={authForm.email}
        />
      </label>

      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Contrasena
        <input
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
          minLength={8}
          onChange={(event) =>
            onAuthFormChange({ ...authForm, password: event.target.value })
          }
          required
          type="password"
          value={authForm.password}
        />
      </label>

      {authMode === "register" ? (
        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Rol
          <select
            className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
            onChange={(event) =>
              onAuthFormChange({
                ...authForm,
                role: event.target.value as Role,
              })
            }
            value={authForm.role}
          >
            <option value="worker">Trabajador</option>
            <option value="owner">Propietario</option>
          </select>
        </label>
      ) : null}

      {feedback ? (
        <span className={`status-message ${feedback.tone}`}>
          {feedback.message}
        </span>
      ) : (
        <span className="text-sm font-semibold leading-6 text-slate-500">
          Ingresa o registrate para continuar.
        </span>
      )}

      <button
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--blue)] px-4 text-sm font-black text-white shadow-[0_18px_40px_rgba(47,110,232,0.24)] transition hover:bg-[var(--blue-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isWorking}
      >
        <span aria-hidden="true">{authMode === "login" ? ">" : "+"}</span>
        {isWorking ? "Procesando..." : "Continuar"}
      </button>
    </form>
  );
}
