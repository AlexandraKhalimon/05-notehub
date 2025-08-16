import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchNotes } from '../../services/noteService';
import Pagination from '../Pagination/Pagination';
import type { Note } from '../../types/note';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);


  const { data, isSuccess } = useQuery({
    queryKey: ['notes', currentPage],
    queryFn: () => fetchNotes(),
  })

  useEffect(() => {
    if (isSuccess) {
      setNotes(data.notes);
    }

    if (data?.notes.length === 0) {
      return 
    }
  }, [data, isSuccess]);

  const totalPages = data?.totalPages || 0;
  
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
        {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>}
        {/* Кнопка створення нотатки */}
      </header>
      {data?.notes.length !== 0 && <NoteList notes={notes}/>}
    </div>
  )
};