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
  const [inputData, setInputData] = useState<InputData[]>([]);
  const [newVideo, setNewVideo] = useState({ 
    "Link contenuto": '', 
    "Titolo breve": '', 
    "Cliente": '', 
    "Numero offerta": '',
    "Costo": ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<InputData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState<{
    key: keyof InputData;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInputData();
  }, []);

  const fetchInputData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('Input Tablev2')
        .select(`
          "Id",
          "created_at",
          "Link contenuto",
          "Titolo breve",
          "Cliente",
          "Numero offerta",
          "Costo"
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

      console.log('Dati recuperati:', data);
      setInputData(data);
    } catch (error) {
      console.error('Errore durante il fetch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVideo({ ...newVideo, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingData) {
      setEditingData({ ...editingData, [e.target.name]: e.target.value });
    }
  };
  const handleEdit = (item: InputData) => {
    if (item.Id) {
      setEditingId(item.Id);
      setEditingData(item);
    }
  };

  const handleUpdate = async () => {
    if (!editingData) return;

    const { error } = await supabase
      .from('Input Tablev2')
      .update({
        "Link contenuto": editingData["Link contenuto"],
        "Titolo breve": editingData["Titolo breve"],
        "Cliente": editingData["Cliente"],
        "Numero offerta": editingData["Numero offerta"],
        "Costo": editingData["Costo"],
      })
      .eq('Id', editingData["Id"]);

    if (error) {
      console.error('Errore nell\'aggiornamento:', error);
    } else {
      setEditingId(null);
      setEditingData(null);
      fetchInputData();
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('Input Tablev2')
      .delete()
      .eq('Id', id);

    if (error) {
      console.error('Errore nella cancellazione:', error);
    } else {
      fetchInputData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('Input Tablev2')
        .insert([{
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
        <h2 className="text-2xl font-bold tracking-tight text-white">Pannello di Amministrazione</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300">
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
          <input
            type="text"
            placeholder="Cerca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#050739] text-white p-3 border-b border-white focus:outline-none focus:ring-0 transition-all duration-300"
          />
        </div>

        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800/50 hover:bg-gray-800/70">
                <TableHead className="text-white cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Id")}>
                    <span>ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-white cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Link contenuto")}>
                    <span>Link Contenuto</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-white cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Titolo breve")}>
                    <span>Titolo Breve</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-white cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Cliente")}>
                    <span>Cliente</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-white cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Numero offerta")}>
                    <span>Numero offerta</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-white cursor-pointer text-xs font-medium">
                  <div className="flex items-center gap-1" onClick={() => handleSort("Costo")}>
                    <span>Costo</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-white text-xs font-medium text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={7} 
                    className="text-center text-gray-500 py-4"
                  >
                    Nessun risultato trovato
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((item) => (
                  <TableRow key={item.Id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="text-white text-xs">{item.Id}</TableCell>
                    <TableCell className="text-white text-xs">
                      <a href={item["Link contenuto"] || ''} className="text-blue-400 hover:text-blue-300">
                        {item["Link contenuto"]}
                      </a>
                    </TableCell>
                    <TableCell className="text-white text-xs">
                      {editingId === item.Id ? (
                        <Input
                          key={`input-titolo-${item.Id}`}
                          name="Titolo breve"
                          value={editingData?.["Titolo breve"] || ''}
                          onChange={handleEditChange}
                          className="text-white bg-gray-800"
                        />
                      ) : (
                        <span className="text-white">{item["Titolo breve"]}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-white text-xs">
                      {editingId === item.Id ? (
                        <Input
                          key={`input-cliente-${item.Id}`}
                          name="Cliente"
                          value={editingData?.["Cliente"] || ''}
                          onChange={handleEditChange}
                          className="text-white bg-gray-800"
                        />
                      ) : (
                        <span className="text-white">{item["Cliente"]}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-white text-xs">
                      {editingId === item.Id ? (
                        <Input
                          key={`input-offerta-${item.Id}`}
                          name="Numero offerta"
                          value={editingData?.["Numero offerta"] || ''}
                          onChange={handleEditChange}
                          className="text-white bg-gray-800"
                        />
                      ) : (
                        <span className="text-white">{item["Numero offerta"]}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-white text-xs">
                      {editingId === item.Id ? (
                        <Input
                          key={`input-Costo-${item.Id}`}
                          name="Costo"
                          value={editingData?.["Costo"] || ''}
                          onChange={handleEditChange}
                          className="text-white bg-gray-800"
                        />
                      ) : (
                        <span className="text-white">{item["Costo"]}</span>
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
                                handleDelete(Number(item.Id));
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
          <Pagination>
            <PaginationPrevious 
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} 
              aria-disabled={currentPage === 1}
              className="text-white text-xs data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none" 
            />
            <PaginationContent className="text-white text-xs">
              Pagina {currentPage} di {Math.max(1, totalPages)}
            </PaginationContent>
            <PaginationNext 
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} 
              aria-disabled={currentPage === totalPages || totalPages === 0}
              className="text-white text-xs data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none" 
            />
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
