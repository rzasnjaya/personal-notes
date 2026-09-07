'use client';

import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import NotesList from './NotesList';
import NoteDetail from './NoteDetail';
import NoteModal from './NoteModal';
import { fetchNotes, createNote, updateNote, deleteNote } from '@/lib/api';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isArchived: boolean;
  noteTags?: Array<{
    tag: {
      id: number;
      name: string;
    };
  }>;
}

interface MainContentProps {
  onNewNote: () => void;
}

export default function MainContent({ onNewNote }: MainContentProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [filterArchived, setFilterArchived] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Filter notes whenever search or filter changes
  useEffect(() => {
    applyFilters();
  }, [notes, searchQuery, filterFavorite, filterArchived]);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchNotes({ isArchived: false });
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...notes];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    // Favorite filter
    if (filterFavorite) {
      filtered = filtered.filter((note) => note.isFavorite);
    }

    setFilteredNotes(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewNote = () => {
    setFormData({ title: '', content: '', tags: [] });
    setSelectedNoteId(null);
    setShowModal(true);
    onNewNote();
  };

  const handleSelectNote = (noteId: number) => {
    setSelectedNoteId(noteId);
  };

  const handleEditNote = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.noteTags?.map((nt) => nt.tag.name) || [],
    });
    setSelectedNoteId(note.id);
    setShowModal(true);
  };

  const handleSaveNote = async (data: {
    title: string;
    content: string;
    tags: string[];
  }) => {
    try {
      if (selectedNoteId) {
        // Update existing note - pass tags too!
        const updated = await updateNote(selectedNoteId, {
          title: data.title,
          content: data.content,
          tags: data.tags, // Include tags in update
        });
        setNotes(notes.map((n) => (n.id === selectedNoteId ? updated : n)));
      } else {
        // Create new note
        const created = await createNote({
          title: data.title,
          content: data.content,
          tags: data.tags,
        });
        setNotes([created, ...notes]);
        setSelectedNoteId(created.id);
      }
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await deleteNote(noteId);
      setNotes(notes.filter((n) => n.id !== noteId));
      setSelectedNoteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  const handleToggleFavorite = async (noteId: number) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    try {
      const updated = await updateNote(noteId, {
        isFavorite: !note.isFavorite,
      });
      setNotes(notes.map((n) => (n.id === noteId ? updated : n)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
    }
  };

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  return (
    <main className="flex-1 bg-gray-900 border-l border-gray-700 p-8 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">All Notes</h2>
        <p className="text-gray-400">
          You have {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-300 hover:text-red-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilterFavorite(!filterFavorite)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterFavorite
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          ⭐ Favorites
        </button>
        <button
          onClick={handleNewNote}
          className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          + New Note
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Notes List */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <p className="text-gray-400">Loading notes...</p>
          ) : filteredNotes.length === 0 ? (
            <p className="text-gray-400">
              {searchQuery ? 'No notes match your search' : 'No notes yet. Create one!'}
            </p>
          ) : (
            <NotesList
              notes={filteredNotes}
              selectedNoteId={selectedNoteId}
              onSelectNote={handleSelectNote}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </div>

        {/* Note Detail */}
        {selectedNote && (
          <div className="w-96 border-l border-gray-700 pl-6">
            <NoteDetail
              note={selectedNote}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          </div>
        )}
      </div>

      {/* Note Modal */}
      {showModal && (
        <NoteModal
          initialData={formData}
          onSave={handleSaveNote}
          onCancel={() => setShowModal(false)}
          isEditing={selectedNoteId !== null}
        />
      )}
    </main>
  );
}
