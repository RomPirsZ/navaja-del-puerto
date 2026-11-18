import { useEffect, useState } from 'react';
import { t } from '../../i18n';

/**
 * Booking island (plan §6). The first render, on the server and during hydration, shows the
 * no-JS notice; an effect marks the island ready, so server and client markup always match.
 * The real steps arrive in R07.
 */
export default function Reserva() {
  const [lista, setLista] = useState(false);
  useEffect(() => setLista(true), []);

  return (
    <div data-reserva data-lista={lista ? 'true' : 'false'}>
      <p role="status">{lista ? t('reserva.lista') : t('reserva.sinJs')}</p>
    </div>
  );
}
