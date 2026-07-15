import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Field, Input, Icon } from "@shared/components/ui";
import { resolveAssetUrl } from "@shared/utils/assetUrl";

const EMPTY_VALUES = { name: "", dt: "" };
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function toFormValues(team) {
  return {
    name: team.name ?? "",
    dt: team.dt ?? "",
  };
}

export default function TeamForm({ team, onSubmit, onCancel }) {
  const isEdit = Boolean(team);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: team ? toFormValues(team) : EMPTY_VALUES });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(() =>
    resolveAssetUrl(team?.logoUrl),
  );
  const [logoError, setLogoError] = useState("");

  function handleLogoChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setLogoFile(null);
      setLogoPreview(resolveAssetUrl(team?.logoUrl));
      setLogoError("");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setLogoError("El logo debe ser una imagen (JPEG, PNG, WEBP o GIF)");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setLogoError("La imagen no puede superar los 5 MB");
      event.target.value = "";
      return;
    }

    setLogoError("");
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleFormSubmit(values) {
    return onSubmit({ ...values, logoFile });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="flex flex-col gap-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
        <Field
          label="Nombre del equipo"
          htmlFor="name"
          error={errors.name?.message}>
          <Input
            id="name"
            type="text"
            placeholder="Ej. Los Pibes FC"
            aria-invalid={Boolean(errors.name)}
            {...register("name", {
              required: "El nombre es obligatorio",
              validate: (value) =>
                Boolean(value && value.trim()) || "El nombre es obligatorio",
            })}
          />
        </Field>

        <Field label="Director técnico" htmlFor="dt" error={errors.dt?.message}>
          <Input
            id="dt"
            type="text"
            placeholder="Opcional"
            {...register("dt")}
          />
        </Field>

        <Field label="Logo" htmlFor="logo" error={logoError}>
          <div className="flex items-center gap-sm">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Preview del logo"
                className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
              />
            ) : (
              <span className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0">
                <Icon name="sports_soccer" size={18} />
              </span>
            )}
            <Input
              id="logo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="cursor-pointer"
              onChange={handleLogoChange}
            />
          </div>
        </Field>
      </div>

      <div className="flex flex-col sm:flex-row gap-sm">
        <Button type="submit" disabled={isSubmitting}>
          {isEdit ? "Guardar cambios" : "Agregar equipo"}
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
