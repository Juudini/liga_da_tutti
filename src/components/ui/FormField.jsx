export default function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-xs">
      {label && (
        <label className="font-label-md text-label-md text-on-surface-variant">
          {label}
        </label>
      )}
      {children}
      {error && (
        <span className="font-label-md text-label-md text-error">{error}</span>
      )}
    </div>
  );
}
