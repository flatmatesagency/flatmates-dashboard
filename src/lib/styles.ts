import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility per combinare classi Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Configurazione stili componenti
export const styles = {
  // Layout
  page: "min-h-screen flex flex-col bg-background font-sans",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-6 space-y-6",

  // Card e contenitori
  card: "bg-card text-card-foreground rounded-lg border border-border",
  cardHeader: "p-6 flex flex-col space-y-1.5",
  cardTitle: "text-2xl font-semibold text-card-foreground",
  cardDescription: "text-sm text-muted-foreground",
  cardContent: "p-6 pt-0",
  cardFooter: "p-6 pt-0",

  // Post Card specifica
  postCard: {
    wrapper: "w-full max-w-sm flex flex-col justify-between bg-transparent text-card-foreground overflow-hidden border-none",
    imageWrapper: "relative w-full h-40",
    image: "w-full h-full object-cover filter grayscale contrast-125 hover:filter-none transition-all duration-300 p-0",
    overlay: "absolute inset-0 bg-card opacity-40 hover:opacity-0 transition-all duration-300",
    platformIcon: "absolute top-2 right-2 p-1 rounded-full",
    content: "p-4 flex flex-col justify-between flex-1",
    title: "text-base font-medium mb-2 text-center text-card-foreground hover:text-primary transition-colors duration-300",
    description: "text-xs mb-4 text-muted-foreground",
    metadata: "flex justify-between text-sm text-muted-foreground mb-4",
    stats: "mt-auto pt-4 border-t border-border",
    statsWrapper: "flex justify-between text-sm text-card-foreground",
    statItem: "flex items-center gap-1 font-bold",
  },

  // Tabelle
  table: "w-full border-collapse",
  tableHeader: "bg-muted hover:bg-muted/70",
  tableHeaderCell: "text-card-foreground text-xs font-medium",
  tableRow: "border-b border-border hover:bg-muted/50",
  tableCell: "text-card-foreground text-xs p-2",

  // Form e input
  input: "bg-background text-card-foreground border border-input",
  select: "bg-background text-card-foreground border border-input",
  button: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },

  // Testo
  text: {
    primary: "text-card-foreground",
    secondary: "text-muted-foreground",
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  },

  // Navigazione
  nav: {
    link: "text-card-foreground hover:text-primary transition-colors",
    activeLink: "text-primary font-medium",
  },

  // Grid
  grid: {
    container: "grid gap-6",
    cols2: "grid-cols-1 md:grid-cols-2",
    cols3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    cols4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  },

  // Sorting
  sort: {
    container: "flex gap-4 mb-6 items-center justify-center",
    button: "bg-transparent text-card-foreground p-3 border-b transition-all duration-300 focus:outline-none focus:ring-0",
    buttonActive: "border-primary",
    buttonInactive: "border-border",
  },

  // Filters
  filters: {
    container: "flex flex-col md:flex-row gap-4 mb-6 items-center justify-center",
    select: "bg-background text-card-foreground p-3 border-b border-border focus:outline-none focus:ring-0 transition-all duration-300 hover:border-primary",
  },

  // Pagination
  pagination: {
    container: "flex justify-center items-center gap-2 mt-4",
    item: "text-card-foreground text-xs",
    link: "px-3 py-2 hover:bg-muted rounded-md transition-colors",
    activeLink: "bg-primary text-primary-foreground",
    inactiveLink: "text-card-foreground hover:text-card-foreground/80",
    ellipsis: "text-card-foreground text-xs px-2",
    nav: "text-card-foreground text-xs hover:text-card-foreground/80 data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none",
  },
} as const; 