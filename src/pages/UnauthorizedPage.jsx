import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Icon from '../components/ui/Icon'

export default function UnauthorizedPage() {
  const { isAdmin } = useAuth()
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-md text-center">
      <span className="text-error"><Icon name="block" size={64} /></span>
      <h1 className="font-display-lg text-display-lg text-error">403</h1>
      <h2 className="font-headline-md text-headline-md text-on-surface">Acceso denegado</h2>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
        Tu rol actual no tiene permiso para acceder a esta sección.
      </p>
      <Link
        to={isAdmin ? '/stats' : '/fixture'}
        className="bg-primary text-on-primary font-label-md text-label-md font-bold py-3 px-6 rounded-full glow-primary"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
