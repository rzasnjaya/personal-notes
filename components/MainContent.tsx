'use client';

import SearchBar from './SearchBar';
import NotesList from './NotesList';
import NoteDetail from './NoteDetail';
import NoteModal from './NoteModal';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isFavorite: boolean;
}

interface MainContentProps {
  notes: Note[];
  selectedNoteId: number | null;
  selectedNote: Note | undefined;
  showModal: boolean;
  formData: { title: string; content: string };
  editingNoteId: number | null;
  onSelectNote: (id: number) => void;
  onNewNote: () => void;
  onSaveNote: () => void;
  onDeleteNote: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onEditNote: (note: Note) => void;
  onFormChange: (data: { title: string; content: string }) => void;
  onCloseModal: () => void;
}

export default function MainContent({
  notes,
  selectedNoteId,
  selectedNote,
  showModal,
  formData,
  editingNoteId,
  onSelectNote,
  onNewNote,
  onSaveNote,
  onDeleteNote,
  onToggleFavorite,
  onEditNote,
  onFormChange,
  onCloseModal,
}: MainContentProps) {
  return (
    <main className="flex-1 bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">All Notes</h2>
            <p className="text-gray-400">You have {notes.length} notes</p>
          </div>
          <button
            onClick={onNewNote}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            + New Note
          </button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Notes list */}
          <div className="col-span-2">
            <SearchBar />
            <NotesList
              notes={notes}
              selectedNoteId={selectedNoteId}
              onSelectNote={onSelectNote}
              onToggleFavorite={onToggleFavorite}
            />
          </div>

          {/* Right: Note detail */}
          <div>
            {selectedNote ? (
              <NoteDetail
                note={selectedNote}
                onEdit={onEditNote}
                onDelete={onDeleteNote}
                onToggleFavorite={onToggleFavorite}
              />
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
                <p>Select a note to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for create/edit */}
      {showModal && (
        <NoteModal
          formData={formData}
          onFormChange={onFormChange}
          onSave={onSaveNote}
          onCancel={onCloseModal}
          isEditing={editingNoteId !== null}
        />
      )}
    </main>
  );
}
