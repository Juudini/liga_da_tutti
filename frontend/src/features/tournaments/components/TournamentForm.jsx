import { useForm } from "react-hook-form";
import { Button, Field, Input } from "@shared/components/ui";

const EMPTY_VALUES = { name: "" };

function toFormValues(tournament) {
  return { name: tournament.name ?? "" };
}

export default function TournamentForm({ tournament, onSubmit, onCancel }) {
  const isEdit = Boolean(tournament);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: tournament ? toFormValues(tournament) : EMPTY_VALUES,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-md">
      <Field
        label="Nombre del torneo"
        htmlFor="name"
        error={errors.name?.message}>
        <Input
          id="name"
          type="text"
          placeholder="Ej. Torneo Apertura Barrial"
          aria-invalid={Boolean(errors.name)}
          {...register("name", {
            required: "El nombre es obligatorio",
            minLength: {
              value: 2,
              message: "El nombre debe tener al menos 2 caracteres",
            },
            validate: (value) =>
              Boolean(value && value.trim()) || "El nombre es obligatorio",
          })}
        />
      </Field>

      <div className="flex flex-col sm:flex-row gap-sm">
        <Button type="submit" disabled={isSubmitting}>
          {isEdit ? "Guardar cambios" : "Crear torneo"}
        </Button>
        {isEdit && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar edición
          </Button>
        )}
      </div>
    </form>
  );
}
