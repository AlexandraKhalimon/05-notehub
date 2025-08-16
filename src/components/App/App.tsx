import css from './App.module.css';
import type { Note } from '../../types/note';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast';


export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isSuccess } = useQuery({
    queryKey: ['notes', currentPage, searchQuery],
    queryFn: () => fetchNotes({search: searchQuery, page: currentPage, perPage: 12}),
  })

  useEffect(() => {
    if (isSuccess) {
      setNotes(data.notes);
    }

    if (data && data?.notes.length === 0) {
      toast.error("Sorry, the notelist is empty!");
      return;
    }
  }, [data, isSuccess]);


  const totalPages = data?.totalPages || 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const deboucedSearchQuery = useDebouncedCallback(setSearchQuery, 300);
  
  return (
    <div className={css.app}>
      <Toaster position='top-center'/>
      <header className={css.toolbar}>
        <SearchBox text={ searchQuery } onSearch={deboucedSearchQuery}/>
        {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>}
        <button className={css.button} onClick={openModal}>Create note +</button>
        {isModalOpen && <Modal onClose={closeModal} children={<NoteForm onClose={closeModal} onSuccess={closeModal}/>} />}
      </header>
      {data?.notes.length !== 0 && <NoteList notes={notes}/>}
    </div>
  )
};