import type { AuthForm, Feedback, FormSubmitHandler, Role } from "../types/job";

type AuthPanelProps = {
  authForm: AuthForm;
  authMode: "login" | "register";
  feedback: Feedback;
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
    <form className="panel auth-panel" onSubmit={onSubmit}>
      <div className="segmented">
        <button
          className={authMode === "login" ? "active" : ""}
          onClick={() => onAuthModeChange("login")}
          type="button"
        >
          Ingresar
        </button>
        <button
          className={authMode === "register" ? "active" : ""}
          onClick={() => onAuthModeChange("register")}
          type="button"
        >
          Registro
        </button>
      </div>

      {authMode === "register" ? (
        <label>
          Nombre
          <input
            onChange={(event) =>
              onAuthFormChange({ ...authForm, name: event.target.value })
            }
            required
            value={authForm.name}
          />
        </label>
      ) : null}

      <label>
        Email
        <input
          onChange={(event) =>
            onAuthFormChange({ ...authForm, email: event.target.value })
          }
          required
          type="email"
          value={authForm.email}
        />
      </label>

      <label>
        Contrasena
        <input
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
        <label>
          Rol
          <select
            onChange={(event) =>
              onAuthFormChange({
                ...authForm,
                role: event.target.value as Role,
              })
            }
            value={authForm.role}
          >
            <option value="worker">Trabajador</option>
            <option value="owner">Dueno</option>
          </select>
        </label>
      ) : null}

      <span className={`status-message ${feedback.tone}`}>
        {feedback.message}
      </span>

      <button className="btn btn-primary w-full" disabled={isWorking}>
        <span aria-hidden="true">{authMode === "login" ? ">" : "+"}</span>
        {isWorking ? "Procesando..." : "Continuar"}
      </button>
    </form>
  );
}
