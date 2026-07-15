import { useForm } from "react-hook-form";
import { Button, Field, Input, Icon } from "@shared/components/ui";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm({ onSubmit, authError, isSubmitting }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  function handleFormSubmit({ email, password }) {
    return onSubmit({ email, password });
  }

  return (
    <form
      className="flex flex-col gap-md"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate>
      <Field
        label="Correo electrónico"
        htmlFor="email"
        error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="jugador@equipo.com"
          autoComplete="username"
          aria-invalid={Boolean(errors.email)}
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: EMAIL_PATTERN,
              message: "El formato del email no es válido",
            },
          })}
        />
      </Field>

      <Field
        label="Contraseña"
        htmlFor="password"
        error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: {
              value: 4,
              message: "La contraseña debe tener al menos 4 caracteres",
            },
          })}
        />
      </Field>

      <Field
        label="Confirmar contraseña"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword", {
            required: "Confirmá la contraseña",
            validate: (value) =>
              value === watch("password") || "Las contraseñas no coinciden",
          })}
        />
      </Field>

      {authError && (
        <p className="font-body-md text-body-md text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-sm py-xs text-center">
          {authError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-sm w-full">
        Crear cuenta
        <Icon name="arrow_forward" size={18} />
      </Button>
    </form>
  );
}
