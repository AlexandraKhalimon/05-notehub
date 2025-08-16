import type { Note, NewNote } from "../types/note";
import axios from "axios";

// interface FetchNotesParams {
//     search: string;
//     tag: string;
//     page: number;
//     perPage: number;
//     sortBy: string;
// }

interface FetchNotesResponse{
    notes: Note[];
    totalPages: number;
}

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] = `Bearer ${myKey}`;

export const fetchNotes = async (): Promise<FetchNotesResponse> => {
    const response = await axios.get<FetchNotesResponse>('/notes');
    return response.data;
};

// export const fetchNotes = async ({search, tag, page, perPage, sortBy }: FetchNotesParams): Promise<FetchNotesResponse> => {
//     const response = await axios.get<FetchNotesResponse>('/notes', {
//         params: {
//             search,
//             tag,
//             page,
//             perPage,
//             sortBy,
//         }
//     });
//     return response.data;
// };

export const createNote = async (newNote: NewNote): Promise<Note> => {
    const response = await axios.post<Note>('/notes', newNote);
    return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
    const response = await axios.delete<Note>(`/notes/${noteId}`);
    return response.data;
};

// export default fetchNotes;