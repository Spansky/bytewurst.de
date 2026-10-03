import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone'
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons/faCalendarCheck'
import { firma } from '../data/betrieb'

/** Die beiden Wege zur Demo: Termin buchen oder anrufen. Überall gleich. */
export default function Knoepfe({ dunkel = false, className = '' }: { dunkel?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center ${className}`}>
      <a href={firma.demo} target="_blank" rel="noopener" className={`knopf ${dunkel ? 'knopf-senf' : 'knopf-wurst'}`}>
        <FontAwesomeIcon icon={faCalendarCheck} className="h-4 w-4" aria-hidden="true" />
        Demo buchen
      </a>
      <a href={`tel:${firma.telefonRoh}`} className={`knopf knopf-linie ${dunkel ? 'text-kreide' : 'text-tinte'}`}>
        <FontAwesomeIcon icon={faPhone} className="h-4 w-4" aria-hidden="true" />
        <span>
          Lieber anrufen: <span className="ziffern whitespace-nowrap">{firma.telefon}</span>
        </span>
      </a>
    </div>
  )
}
