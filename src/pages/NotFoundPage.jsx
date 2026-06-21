import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-md text-center p-margin-mobile bg-background text-on-surface">
      <span className="text-primary">
        <Icon name="sentiment_dissatisfied" size={64} />
      </span>
      <h1 className="font-display-lg text-display-lg text-primary">404</h1>
      <h2 className="font-headline-md text-headline-md text-on-surface">
        Página no encontrada
      </h2>
      <Link
        to="/"
        className="bg-primary text-on-primary font-label-md text-label-md font-bold py-3 px-6 rounded-full glow-primary">
        Ir al inicio
      </Link>
    </div>
  );
}
