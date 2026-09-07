interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isArchived: boolean;
}

interface CreateNoteData {
  title: string;
  content: string;
}

interface UpdateNoteData {
  title?: string;
  content?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

// Fetch all notes
export async function fetchNotes(): Promise<Note[]> {
  const response = await fetch('/api/notes');
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
