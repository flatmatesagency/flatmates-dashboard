import { useState, useEffect } from 'react';
import { queries } from '../lib/api/queries';

export function useClients() {
  const [clients, setClients] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true);
        const data = await queries.fetchClients();
        setClients(['all', ...data]);
      } catch (err) {
        setError('Errore nel caricamento dei clienti');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  return { clients, loading, error };
} 