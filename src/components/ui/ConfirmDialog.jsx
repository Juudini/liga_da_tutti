export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true">
      <div className="w-full max-w-md bg-surface-container-high/90 backdrop-blur-xl border-t border-l border-white/10 rounded-xl p-md md:p-lg glass-edge flex flex-col gap-sm">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          {title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {message}
        </p>
        <div className="flex justify-end gap-sm mt-sm">
          <button
            type="button"
            onClick={onCancel}
            className="border border-outline text-on-surface font-label-md text-label-md py-2 px-5 rounded-full hover:bg-surface-variant/40 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-error text-on-error font-label-md text-label-md font-bold py-2 px-5 rounded-full hover:opacity-90 transition-opacity cursor-pointer">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
