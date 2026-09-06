'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isFavorite: boolean;
}

export default function Home() {
  // Initial notes data
  const initialNotes: Note[] = [
    {
      id: 1,
      title: 'Grocery List',
      content: 'Buy milk, eggs, and bread',
      createdAt: '2026-09-06',
      isFavorite: true,
    },
    {
      id: 2,
      title: 'Project Ideas',
      content: 'Build a personal notes app with React and Next.js',
      createdAt: '2026-09-05',
      isFavorite: false,
    },
    {
      id: 3,
      title: 'Meeting Notes',
      content: 'Discussed Q4 roadmap and team goals',
      createdAt: '2026-09-04',
      isFavorite: true,
    },
    {
      id: 4,
      title: 'Bikin Game',
      content: 'Membuat Game Car Mechanic Simulator',
      createdAt: '2026-09-07',
      isFavorite: false,
    },
  ];

  // State management
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  // Get selected note
  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  // Handle: Create new note
  const handleNewNote = () => {
    setFormData({ title: '', content: '' });
    setEditingNoteId(null);
    setShowModal(true);
  };

  // Handle: Save note (create or edit)
  const handleSaveNote = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content cannot be empty');
      return;
    }

    if (editingNoteId) {
      // Edit existing note
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? { ...note, title: formData.title, content: formData.content }
            : note
        )
      );
    } else {
      // Create new note
      const newNote: Note = {
        id: Math.max(...notes.map((n) => n.id), 0) + 1,
        title: formData.title,
        content: formData.content,
        createdAt: new Date().toISOString().split('T')[0],
        isFavorite: false,
      };
      setNotes([newNote, ...notes]);
    }

    setShowModal(false);
    setFormData({ title: '', content: '' });
  };

  // Handle: Delete note
  const handleDeleteNote = (id: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter((note) => note.id !== id));
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
    }
  };

  // Handle: Toggle favorite
  const handleToggleFavorite = (id: number) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      )
    );
  };

  // Handle: Edit note
  const handleEditNote = (note: Note) => {
    setFormData({ title: note.title, content: note.content });
    setEditingNoteId(note.id);
    setShowModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar onNewNote={handleNewNote} />
      <MainContent
        notes={notes}
        selectedNoteId={selectedNoteId}
        selectedNote={selectedNote}
        showModal={showModal}
        formData={formData}
        editingNoteId={editingNoteId}
        onSelectNote={setSelectedNoteId}
        onNewNote={handleNewNote}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
        onToggleFavorite={handleToggleFavorite}
        onEditNote={handleEditNote}
        onFormChange={setFormData}
        onCloseModal={() => setShowModal(false)}
      />
    </div>
  );
}
