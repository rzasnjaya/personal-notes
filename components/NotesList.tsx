interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isFavorite: boolean;
}

interface NotesListProps {
  notes: Note[];
  selectedNoteId: number | null;
  onSelectNote: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export default function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  onToggleFavorite,
}: NotesListProps) {
  return (
    <div className="space-y-4 mb-6">
      {notes.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No notes yet. Create one to get started!</p>
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedNoteId === note.id
                ? 'bg-blue-900 border-blue-500 shadow-lg'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-white flex-1 break-words">
                {note.title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent note selection
                  onToggleFavorite(note.id);
                }}
                className="text-xl ml-2 hover:scale-110 transition-transform flex-shrink-0"
              >
                {note.isFavorite ? '⭐' : '☆'}
              </button>
            </div>
            <p className="text-gray-300 mb-2 line-clamp-2 break-words">
              {note.content}
            </p>
            <p className="text-xs text-gray-400">{note.createdAt}</p>
          </div>
        ))
      )}
    </div>
  );
}
