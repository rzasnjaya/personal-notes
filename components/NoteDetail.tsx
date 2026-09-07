'use client';

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

interface NoteDetailProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: number) => void;
}

export default function NoteDetail({
  note,
  onEdit,
  onDelete,
}: NoteDetailProps) {
  const formattedDate = new Date(note.createdAt).toLocaleString();

  return (
    <div className="flex flex-col h-full">
      {/* Note Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold text-white break-words flex-1">
            {note.title}
          </h3>
          <span className={`ml-2 text-xl ${note.isFavorite ? '⭐' : '☆'}`}>
          </span>
        </div>

        {/* Metadata */}
        <p className="text-gray-400 text-sm">
          Created: {formattedDate}
        </p>
      </div>

      {/* Tags */}
      {note.noteTags && note.noteTags.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {note.noteTags.map((noteTag) => (
              <span
                key={noteTag.tag.id}
                className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm"
              >
                #{noteTag.tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 mb-6">
        <p className="text-gray-300 whitespace-pre-wrap break-words">
          {note.content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-auto">
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
