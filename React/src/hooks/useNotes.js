import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadNotes();
    }
  }, [user?.id]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const userNotes = await apiService.getNotes(user.id);
      setNotes(userNotes);
      setError(null);
    } catch (err) {
      setError("Failed to load notes");
      console.error("Error loading notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (noteData) => {
    try {
      const newNote = await apiService.saveNote({
        ...noteData,
        userId: user.id,
      });
      setNotes((prev) => [...prev, newNote]);
      return { success: true };
    } catch (err) {
      setError("Failed to create note");
      return { success: false, error: err.message };
    }
  };

  const updateNote = async (noteData) => {
    try {
      await apiService.updateNote(noteData);
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId ? { ...note, ...noteData } : note
        )
      );
      return { success: true };
    } catch (err) {
      setError("Failed to update note");
      return { success: false, error: err.message };
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await apiService.deleteNote(noteId);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      return { success: true };
    } catch (err) {
      setError("Failed to delete note");
      return { success: false, error: err.message };
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refetch: loadNotes,
  };
};
