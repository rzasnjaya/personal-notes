interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isArchived: boolean;
  userId: number;
  noteTags?: Array<{
    tag: {
      id: number;
      name: string;
    };
  }>;
}

interface CreateNoteData {
  title: string;
  content: string;
  tags?: string[];
}

interface UpdateNoteData {
  title?: string;
  content?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  tags?: string[];
}

interface FetchNotesParams {
  search?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

// Fetch all notes with optional filters
export async function fetchNotes(params?: FetchNotesParams): Promise<Note[]> {
  const searchParams = new URLSearchParams();
  
  if (params?.search) {
    searchParams.append('search', params.search);
  }
  if (params?.isFavorite) {
    searchParams.append('isFavorite', 'true');
  }
  if (params?.isArchived !== undefined) {
    searchParams.append('isArchived', params.isArchived ? 'true' : 'false');
  }

  const query = searchParams.toString();
  const url = `/api/notes${query ? `?${query}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }
  return response.json();
}

// Fetch single note
export async function fetchNote(id: number): Promise<Note> {
  const response = await fetch(`/api/notes/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch note');
  }
  return response.json();
}

// Create note
export async function createNote(data: CreateNoteData): Promise<Note> {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create note');
  }
  return response.json();
}

// Update note
export async function updateNote(
  id: number,
  data: UpdateNoteData
): Promise<Note> {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update note');
  }
  return response.json();
}

// Delete note
export async function deleteNote(id: number): Promise<Note> {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete note');
  }
  return response.json();
}
