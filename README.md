Ecco un README dettagliato per il progetto:

# FlatScraper Dashboard

## 📋 Descrizione
FlatScraper è un'applicazione dashboard professionale per il monitoraggio e l'analisi delle performance dei contenuti social media. L'applicazione permette di tracciare metriche chiave come visualizzazioni, like e commenti attraverso diverse piattaforme social (Instagram, YouTube, TikTok).

# TODO

- [x] URGENTE: sistemare collegamento con google sheets
- [x] Sistemare immagini instagram (problema con i CORS)
- [ ] Fai funzionare il deploy
- [ ] Aggiungere API spostando le logiche da hooks a api (lo faccio su un nuovo branch)
- [ ] Sistemare immagini tiktok
- [ ] URGENTE: sistemare collegamento con google sheets
- [ ] Sistemare immagini instagram (problema con i CORS)
- [ ] Aggiungere API spostando le logiche da hooks a api
- [ ] Fare in modo che il cron sia all'interno del server /progetto
- [ ] Aggiungi possibilità di cambiare frequenza di aggiornamento
- [ ] Quando un post viene aggiunto, lancia lo stesso script del cron per aggiungere direttamente il post in tabella
- [ ] Aggiungere parte di AI e Analytics avanzata
- [ ] Sistemare dati Tiktok
- [ ] Creare tabella utenti per migliore gestione degli accessi su supabase

to do generale
- [x] spostare supabase
- [ ] spostare repo
- [x] mettere colori belli
- [x] pipeline di deplooyment sensata
- [ ] implementare i cron job
- [ ] refactor delle repo

## 🚀 Caratteristiche Principali

### Autenticazione e Sicurezza
- Sistema di autenticazione basato su Supabase
- Protezione delle rotte per utenti autorizzati
- Gestione sicura delle credenziali

### Dashboard Principale
- Visualizzazione delle metriche chiave in tempo reale
- Grafici interattivi per l'analisi dei dati
- Filtri per cliente e intervallo date
- Engagement rate e altre metriche di performance

### Gestione Contenuti
- Tabella dati con ordinamento e paginazione
- Visualizzazione dettagliata dei post
- Grafici a torta per la distribuzione delle visualizzazioni
- Sistema di filtri avanzato

### Pannello Amministrativo
- Gestione dei contenuti
- CRUD operations per i post
- Interfaccia intuitiva per la gestione dei dati

## 🛠 Tecnologie Utilizzate

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Recharts per i grafici
- Radix UI per i componenti
- React Router per la navigazione

### Backend
- Supabase per database e autenticazione
- REST API
- Vercel per il deployment (Questo è ancora da implementare)

## 📦 Installazione

1. Clona il repository:
```bash
git clone https://github.com/flatscraper/flatscraper.git
```

2. Installa le dipendenze:
```bash
npm install
```

3. Crea un file `.env` nella root del progetto:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Avvia il server di sviluppo:
```bash
npm run dev
```

## 🔧 Configurazione

### Supabase
Riferimento al file di configurazione:

```1:28:src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Manca la variabile d\'ambiente VITE_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Manca la variabile d\'ambiente VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getAuthenticatedClient = (accessToken?: string) => {
  if (!accessToken) return supabase;
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
};

export default supabase;
```


### Tailwind
Configurazione completa in:

```1:86:tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},

			fontFamily: {
			  poppins: ['Poppins', 'sans-serif'],
			},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
```


## 📊 Componenti Principali

### Dashboard
Il componente principale che gestisce la visualizzazione dei dati:

```1:47:src/components/dashboard/Dashboard.tsx
import { useState } from 'react';
import { usePostsData } from '@/hooks/usePostsData';
import { useClients } from '@/hooks/useClients';
import { StatsSection } from './StatsSection';
import { DashboardFilters } from './DashboardFilters';
import { PostsGrid } from '@/components/posts/PostsGrid';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { calculateStats } from '@/lib/utils/statsCalculator';
import { DateRange } from 'react-day-picker';

interface Filters {
  client: string;
  dateRange: DateRange | null;
}

export function Dashboard() {
  const [filters, setFilters] = useState<Filters>({ 
    client: 'all', 
    dateRange: null 
  });
  
  const { clients, loading: clientsLoading } = useClients();
  const { posts, loading: postsLoading, error } = usePostsData({
    client: filters.client,
    dateRange: filters.dateRange
  });

  if (postsLoading || clientsLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const stats = calculateStats(posts);

  return (
    <div className="space-y-6 p-6">
      <DashboardFilters 
        onFilterChange={setFilters}
        currentFilters={filters}
        clients={clients}
      />
      
      <StatsSection stats={stats} />
      
      <PostsGrid posts={posts} />
    </div>
  );
}
```


### Grafici
- PieChart per la distribuzione delle visualizzazioni
- BarChart per le comparazioni
- LineChart per i trend temporali

## 🔐 Sicurezza
L'applicazione implementa:
- Autenticazione utente
- Protezione delle rotte
- Validazione dei dati
- Gestione sicura delle API keys

## 🌐 Deployment (DA implementare, per ora è deployato su surge.sh)
L'applicazione è configurata per il deployment su Vercel:
- Build automatica
- Integrazione continua
- Gestione delle variabili d'ambiente

## 📝 Note per gli Sviluppatori
- Utilizzare TypeScript per tutti i nuovi componenti
- Seguire le convenzioni di naming esistenti
- Documentare le nuove funzionalità
- Testare i componenti prima del merge

## 🤝 Contribuire
1. Fork del repository
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit dei cambiamenti (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza
Questo progetto è proprietario e riservato. Tutti i diritti sono riservati.

## 👥 Team
- Pietro Boschini - pietro.boschini97@gmail.com
- Alessandro Minimmo

## 📞 Supporto
Per supporto, contattare il team di sviluppo tramite email.


Ecco una descrizione dettagliata della struttura dell'applicazione:

# 🏗️ Struttura dell'Applicazione FlatScraper

## 📁 Struttura delle Directory

### `/src`
```
src/
├── components/        # Componenti React riutilizzabili
│   ├── ui/           # Componenti UI di base
│   ├── dashboard/    # Componenti specifici della dashboard
│   ├── posts/        # Componenti relativi ai post
│   └── stats/        # Componenti per le statistiche
├── contexts/         # Context React per lo state management
├── hooks/           # Custom hooks
├── lib/             # Utilities e configurazioni
│   ├── api/         # Logica API
│   ├── utils/       # Funzioni di utilità
│   └── supabase.ts  # Configurazione Supabase
├── pages/           # Componenti pagina
└── types/           # Definizioni TypeScript
```

## 🔍 Dettaglio Componenti

### 1. Componenti UI Base (`/src/components/ui/`)
- `Button.tsx` - Componente button personalizzato
- `Card.tsx` - Layout card riutilizzabile
- `Table.tsx` - Componente tabella con ordinamento
- `Dialog.tsx` - Modal dialog
- `DateRangePicker.tsx` - Selettore intervallo date
- `Select.tsx` - Menu a tendina personalizzato

### 2. Componenti Dashboard (`/src/components/dashboard/`)
```typescript:src/components/dashboard/Dashboard.tsx
export function Dashboard() {
  // ... codice esistente ...

  return (
    <div className="space-y-6 p-6">
      <DashboardFilters />      // Filtri principali
      <StatsSection />         // Sezione statistiche
      <PostsGrid />           // Griglia dei post
      <AnalyticsCharts />    // Grafici analitici
    </div>
  );
}
```

### 3. Componenti Post (`/src/components/posts/`)
```typescript:src/components/posts/PostCard.tsx
interface PostCardProps {
  post: {
    input_id: string;
    post_thumbnail: string;
    input_title: string;
    platform: string;
    metrics: {
      views: number;
      likes: number;
      comments: number;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <CardHeader>
        <PostThumbnail src={post.post_thumbnail} />
        <PostTitle>{post.input_title}</PostTitle>
      </CardHeader>
      <CardContent>
        <PostMetrics metrics={post.metrics} />
        <PlatformBadge platform={post.platform} />
      </CardContent>
    </Card>
  );
}
```

### 4. Componenti Statistiche (`/src/components/stats/`)
```typescript:src/components/stats/StatsCard.tsx
interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: number;
  format?: (value: number) => string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  format = (v) => v.toLocaleString()
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{format(value)}</div>
        {trend && <TrendIndicator value={trend} />}
      </CardContent>
    </Card>
  );
}
```

## 🎯 Funzionalità Principali

### 1. Sistema di Autenticazione
```typescript:src/contexts/AuthContext.tsx
export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gestione autenticazione Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  // ... resto del codice
};
```

### 2. Gestione Dati
```typescript:src/lib/api/queries.ts
export const queries = {
  fetchDashboardData: async (client: string, dateRange: DateRange | null) => {
    const query = supabase
      .from('posts')
      .select('*')
      .order('post_published_at', { ascending: false });

    if (client !== 'all') {
      query.eq('input_client', client);
    }

    if (dateRange?.from && dateRange?.to) {
      query.gte('post_published_at', dateRange.from.toISOString())
           .lte('post_published_at', dateRange.to.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  // ... altre query
};
```

### 3. Hooks Personalizzati
```typescript:src/hooks/usePostsData.ts
export function usePostsData(options: UsePostsDataOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await queries.fetchDashboardData(
          options.client || 'all', 
          options.dateRange || null
        );
        setPosts(data);
      } catch (err) {
        setError('Errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [options.client, options.dateRange]);

  return { posts, loading, error };
}
```

## 📊 Visualizzazione Dati

### 1. Grafici
- `PieChart.tsx` - Distribuzione contenuti per piattaforma
- `BarChart.tsx` - Confronto metriche tra post
- `LineChart.tsx` - Trend temporali delle performance

### 2. Tabelle
- Ordinamento multi-colonna
- Paginazione
- Filtri avanzati
- Export dati

## 🔒 Sicurezza e Permessi

### 1. Route Protection
```typescript:src/components/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <LoadingSpinner />;
  
  return user ? <>{children}</> : null;
}
```

### 2. Gestione API
- Rate limiting
- Validazione input
- Gestione errori
- Logging

## 🎨 Temi e Stili
- Sistema di theming dark/light
- Variabili CSS personalizzate
- Componenti responsive
- Animazioni fluide

Questa struttura modulare permette:
- Facile manutenzione
- Riutilizzo dei componenti
- Testing efficace
- Scalabilità del progetto

# Flatmates Dashboard - Architettura MCD

## Model (Modello)

### Database (Supabase)
- **Tabelle Principali**:
  - `combined_data`: Contiene i dati dei post social
    - Campi: input_id, post_thumbnail, input_title, post_description, post_view_count, post_like_count, post_comment_count, input_client, post_creator_name, platform, post_published_at
  - `auth`: Gestita da Supabase per l'autenticazione
    - Campi: email, password (hash), provider (Google)

### Tipi di Dati (TypeScript)
- `Post`: Interfaccia per i post social
- `User`: Interfaccia per gli utenti autenticati
- `InputData`: Interfaccia per i dati di input nel pannello admin

## Controller (Controllo)

### Autenticazione
- `AuthContext`: Gestisce lo stato di autenticazione
  - Funzioni: login, loginWithGoogle, logout
  - Stati: user, isAuthenticated, isLoading

### Gestione Dati
- `DashboardPage`: Controller principale per la dashboard
  - Gestione metriche e statistiche
  - Filtri per client e date
  - Calcolo engagement rate

- `AdminPanel`: Controller per la gestione amministrativa
  - CRUD operazioni sui dati
  - Gestione autorizzazioni utente
  - Validazione input

- `SocialPostCards`: Controller per la visualizzazione dei post
  - Filtri e ordinamento
  - Gestione paginazione
  - Calcolo metriche di engagement

## Data (Dati)

### API Endpoints (Supabase)
- `/auth/*`: Endpoints per autenticazione
- `/combined_data`: Endpoint per i dati dei post
- `/input_data`: Endpoint per i dati amministrativi

### Servizi Esterni
- Google OAuth per autenticazione
- CORS proxy per immagini Instagram
- Potenziale integrazione con Retool per email

## Componenti UI Principali

### Layout
- `App`: Componente root con routing e layout principale
- `Sidebar`: Navigazione principale
- `ThemeProvider`: Gestione tema chiaro/scuro

### Pagine
- `DashboardPage`: Dashboard principale con metriche
- `AdminPanel`: Pannello amministrativo
- `SocialPostCards`: Griglia di post social
- `Login`: Pagina di autenticazione

### Componenti Riutilizzabili
- `Card`: Componente base per le card
- `DataTable`: Tabella dati con ordinamento
- `PieChart`: Visualizzazione dati circolare
- `DatePickerWithRange`: Selezione range date

## Flusso dei Dati

1. **Autenticazione**:
   - Login con Google OAuth
   - Gestione sessione con Supabase
   - Protezione rotte

2. **Dashboard**:
   - Fetch dati da Supabase
   - Calcolo metriche in tempo reale
   - Filtri e ordinamento lato client

3. **Admin Panel**:
   - Validazione autorizzazioni
   - CRUD operazioni su dati
   - Gestione errori e feedback

4. **Social Cards**:
   - Fetch e caching dati
   - Filtri multipli
   - Ordinamento dinamico

## Sicurezza

- Autenticazione OAuth con Google
- Protezione rotte basata su ruoli
- Validazione input lato client e server
- Gestione sicura delle sessioni

## Performance

- Caching dati lato client
- Lazy loading componenti
- Ottimizzazione query Supabase
- Gestione efficiente delle immagini


