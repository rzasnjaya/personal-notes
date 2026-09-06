interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isFavorite: boolean;
}

interface NoteDetailProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export default function NoteDetail({
  note,
  onEdit,
  onDelete,
  onToggleFavorite,
}: NoteDetailProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sticky top-8">
      {/* Header dengan favorite button */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-white flex-1 break-words">
          {note.title}
        </h3>
        <button
          onClick={() => onToggleFavorite(note.id)}
          className="text-2xl ml-2 hover:scale-110 transition-transform"
        >
          {note.isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      {/* Content */}
      <p className="text-gray-300 mb-6 whitespace-pre-wrap break-words">
        {note.content}
      </p>

      {/* Metadata */}
      <p className="text-sm text-gray-500 mb-6">Created: {note.createdAt}</p>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(note)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
