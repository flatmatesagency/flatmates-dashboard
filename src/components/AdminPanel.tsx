import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import supabase from '../lib/supabase';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowUpDown, Search } from "lucide-react"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';
import { styles } from '@/lib/styles';

interface InputData {
  "Id": string;
  created_at: string;
  "Link contenuto": string | null;
  "Titolo breve": string | null;
  "Cliente": string | null;
  "Numero offerta": string | null;
  "Costo": string | null;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inputData, setInputData] = useState<InputData[]>([]);
  const [newVideo, setNewVideo] = useState({ 
    "Id": '',
    "Link contenuto": '', 
    "Titolo breve": '', 
    "Cliente": '', 
    "Numero offerta": '',
    "Costo": ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<InputData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState<{
    key: keyof InputData;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Lista degli utenti autorizzati (email)
    const authorizedUsers = [
      'pietro.boschini97@gmail.com',
      'alessandro@flatmatesagency.com'
      // Aggiungi altre email autorizzate qui
    ];

    if (!user || !authorizedUsers.includes(user.email)) {
      navigate('/'); // Reindirizza alla home se non autorizzato
      return;
    }

    fetchInputData();
  }, [user, navigate]);

  const fetchInputData = async () => {
    setIsLoading(true);
    try {
      console.log('Inizio recupero dati...');
      const { data, error } = await supabase
        .from('Input Tablev2')
        .select(`
          Id,
          "Link contenuto",
          "Titolo breve",
          "Cliente",
          "Numero offerta",
          "Costo",
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Errore nel recupero dei dati:', error);
        return;
      }

      if (!data) {
        console.log('Nessun dato trovato');
        setInputData([]);
        return;
      }

      console.log('Dati recuperati dal server:', data);
      
      setInputData(data);
    } catch (error) {
      console.error('Errore durante il fetch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVideo(prev => ({ ...prev, [name]: value }));

    // Se il campo modificato è "Link contenuto", estrai l'ID
    if (name === "Link contenuto") {
      let videoId = null;
      if (value) {
        const patterns = [
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
          /(?:vimeo\.com\/(?:video\/)?)([\d]+)/i
        ];

        for (const pattern of patterns) {
          const match = value.match(pattern);
          if (match && match[1]) {
            videoId = match[1];
            break;
          }
        }
      }
      setNewVideo(prev => ({ ...prev, "Id": videoId || '' }));
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingData) {
      const newEditingData = { 
        ...editingData, 
        [e.target.name]: e.target.value 
      };
      console.log('Aggiornamento dati in modifica:', {
        campo: e.target.name,
        nuovoValore: e.target.value,
        nuoviDati: newEditingData
      });
      setEditingData(newEditingData);
    }
  };
  const handleEdit = (item: InputData) => {
    console.log('Avvio modifica per item:', item);
    if (item.Id) {
      setEditingId(item.Id);
      setEditingData(item);
      console.log('Stato di modifica impostato:', {
        editingId: item.Id,
        editingData: item
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingData || !editingData.Id) return;

    console.log('Tentativo di aggiornamento con i dati:', editingData);
    
    try {
      // Creiamo un oggetto con solo i campi che vogliamo aggiornare
      const updateData = {
        "Link contenuto": editingData["Link contenuto"] || null,
        "Titolo breve": editingData["Titolo breve"] || null,
        "Cliente": editingData["Cliente"] || null,
        "Numero offerta": editingData["Numero offerta"] || null,
        "Costo": editingData["Costo"] || null
      };

      console.log('Dati da aggiornare:', updateData);

      // Eseguiamo l'aggiornamento
      const { error } = await supabase
        .from('Input Tablev2')
        .update(updateData)
        .eq('Id', editingData.Id);

      if (error) {
        console.error('Errore nell\'aggiornamento:', error);
        return;
      }

      console.log('Aggiornamento completato con successo');

      // Aggiorniamo lo stato locale
      setInputData(prevData => 
        prevData.map(item => 
          item.Id === editingData.Id ? { ...item, ...updateData } : item
        )
      );

      setEditingId(null);
      setEditingData(null);

      // Ricarica i dati dal server
      await fetchInputData();

    } catch (error) {
      console.error('Errore durante l\'operazione di aggiornamento:', error);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Tentativo di eliminazione del record con ID:', id);
    
    const { error } = await supabase
      .from('Input Tablev2')
      .delete()
      .eq('Id', id);

    if (error) {
      console.error('Errore nella cancellazione:', error);
      console.error('Dettagli errore:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
    } else {
      // Aggiorniamo localmente i dati
      setInputData(prevData => 
        prevData.filter(item => item.Id !== id)
      );
      console.log('Eliminazione completata con successo');
      // Ricarica i dati dal server per sicurezza
      await fetchInputData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('Input Tablev2')
        .insert([{
          "Id": newVideo["Id"] || null,
          "Link contenuto": newVideo["Link contenuto"] || null,
          "Titolo breve": newVideo["Titolo breve"] || null,
          "Cliente": newVideo["Cliente"] || null,
          "Numero offerta": newVideo["Numero offerta"] || null,
          "Costo": newVideo["Costo"] || null
        }])
        .select();

      if (error) {
        console.error('Errore nell\'inserimento:', error);
        return;
      }

      console.log('Record inserito:', data);
      setNewVideo({ 
        "Id": '',
        "Link contenuto": '', 
        "Titolo breve": '', 
        "Cliente": '', 
        "Numero offerta": '',
        "Costo": ''
      });
      setIsDialogOpen(false);
      fetchInputData();
    } catch (error) {
      console.error('Errore durante l\'inserimento:', error);
    }
  };

  const handleSort = (key: keyof InputData) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const filteredAndSortedData = React.useMemo(() => {
    let filtered = [...inputData];
    
    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const searchFields = [
          item.Id,
          item["Link contenuto"],
          item["Titolo breve"],
          item["Cliente"],
          item["Numero offerta"],
          item["Costo"],
        ];
        
        return searchFields.some((field) => 
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue === null) return sortConfig.direction === 'asc' ? 1 : -1;
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [inputData, searchQuery, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const currentItems = filteredAndSortedData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Pannello di Amministrazione</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="bg-background text-card-foreground p-3 border-b border-border hover:border-primary focus:outline-none focus:ring-0 transition-all duration-300">
              Aggiungi Video
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#050739] border border-white">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-semibold text-white">Aggiungi Nuovo Video</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="Link contenuto"
                value={newVideo["Link contenuto"]}
                onChange={handleInputChange}
                placeholder="Link del contenuto"
                className="w-full bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
              />
              <input
                name="Id"
                value={newVideo["Id"]}
                onChange={handleInputChange}
                placeholder="ID Video (estratto automaticamente)"
                className="w-full bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
              />
              <input
                name="Titolo breve"
                value={newVideo["Titolo breve"]}
                onChange={handleInputChange}
                placeholder="Titolo breve"
                className="w-full bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
              />
              <input
                name="Cliente"
                value={newVideo["Cliente"]}
                onChange={handleInputChange}
                placeholder="Cliente"
                className="w-full bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
              />
              <input
                name="Numero offerta"
                value={newVideo["Numero offerta"]}
                onChange={handleInputChange}
                placeholder="Numero offerta"
                className="w-full bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
              />
              <input
                name="Costo"
                value={newVideo["Costo"]}
                onChange={handleInputChange}
                placeholder="Costo"
                className="w-full bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
              />
              <div className="flex justify-end gap-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
                >
                  Annulla
                </button>
                <button 
                  type="submit"
                  className="bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
                >
                  Aggiungi Record
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4 w-full overflow-x-auto text-xs">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050739] text-white pl-10 p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
            />
          </div>
        </div>

        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted/70">
                <TableHead className="text-card-foreground cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Id")}>
                    <span>ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-card-foreground cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Link contenuto")}>
                    <span>Link Contenuto</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-card-foreground cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Titolo breve")}>
                    <span>Titolo Breve</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-card-foreground cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Cliente")}>
                    <span>Cliente</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-card-foreground cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Numero offerta")}>
                    <span>Numero offerta</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-card-foreground cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Costo")}>
                    <span>Costo</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-card-foreground text-xs font-medium text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={7} 
                    className="text-center text-muted-foreground py-4"
                  >
                    Nessun risultato trovato
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((item) => (
                  <TableRow key={item.Id} className="border-b border-border hover:bg-muted/50">
                    <TableCell className="text-card-foreground text-xs">{item.Id}</TableCell>
                    <TableCell className="text-card-foreground text-xs">
                      <a href={item["Link contenuto"] || ''} className="text-primary hover:text-primary/80">
                        {item["Link contenuto"]}
                      </a>
                    </TableCell>
                    <TableCell className="text-card-foreground text-xs">
                      {editingId === item.Id ? (
                        <Input
                          key={`input-titolo-${item.Id}`}
                          name="Titolo breve"
                          value={editingData?.["Titolo breve"] || ''}
                          onChange={handleEditChange}
                          className="text-card-foreground bg-background"
                        />
                      ) : (
                        <span className="text-card-foreground">{item["Titolo breve"]}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-card-foreground text-xs">
                      {editingId === item.Id ? (
                        <Input
                          key={`input-cliente-${item.Id}`}
                          name="Cliente"
                          value={editingData?.["Cliente"] || ''}
                          onChange={handleEditChange}
                          className="text-card-foreground bg-background"
                        />
                      ) : (
                        <span className="text-card-foreground">{item["Cliente"]}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-card-foreground text-xs">
                      {editingId === item.Id ? (
                        <Input
                          key={`input-offerta-${item.Id}`}
                          name="Numero offerta"
                          value={editingData?.["Numero offerta"] || ''}
                          onChange={handleEditChange}
                          className="text-card-foreground bg-background"
                        />
                      ) : (
                        <span className="text-card-foreground">{item["Numero offerta"]}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-card-foreground text-xs">
                      {editingId === item.Id ? (
                        <Input
                          key={`input-Costo-${item.Id}`}
                          name="Costo"
                          value={editingData?.["Costo"] || ''}
                          onChange={handleEditChange}
                          className="text-card-foreground bg-background"
                        />
                      ) : (
                        <span className="text-card-foreground">{item["Costo"]}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === item.Id ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            onClick={handleUpdate}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          >
                            Salva
                          </Button>
                          <Button 
                            onClick={() => {
                              setEditingId(null);
                              setEditingData(null);
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white text-xs"
                          >
                            Annulla
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button 
                            onClick={() => handleEdit(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          >
                            Modifica
                          </Button>
                          <Button 
                            className="bg-red-600 hover:bg-red-700 text-white text-xs"
                            onClick={() => {
                              if (window.confirm('Sei sicuro di voler eliminare questo record?')) {
                                handleDelete(item.Id);
                              }
                            }}
                          >
                            Elimina
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {currentItems.length > 0 && (
          <Pagination className={styles.pagination.container}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} 
                  aria-disabled={currentPage === 1}
                  className={styles.pagination.nav}
                />
              </PaginationItem>

              {/* Aggiungi numeri di pagina */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber} className={styles.pagination.item}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className={cn(
                        styles.pagination.link,
                        currentPage === pageNumber ? styles.pagination.activeLink : styles.pagination.inactiveLink
                      )}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && (
                <>
                  <PaginationItem className={styles.pagination.item}>
                    <span className={styles.pagination.ellipsis}>...</span>
                  </PaginationItem>
                  <PaginationItem className={styles.pagination.item}>
                    <PaginationLink
                      onClick={() => setCurrentPage(totalPages)}
                      isActive={currentPage === totalPages}
                      className={cn(
                        styles.pagination.link,
                        currentPage === totalPages ? styles.pagination.activeLink : styles.pagination.inactiveLink
                      )}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} 
                  aria-disabled={currentPage === totalPages || totalPages === 0}
                  className={styles.pagination.nav}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
