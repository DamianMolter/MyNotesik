import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import UserPanel from "./UserPanel";
import CreateArea from "./CreateArea";
import Note from "./Note";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(0);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function addNote(newNote) {
    setNotes((prevNotes) => {
      return [...prevNotes, newNote];
    });
  }

  const deleteNote = async (id) => {
    await apiService.deleteNote(id);
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem) => {
        return noteItem.id !== id;
      });
    });
  };

  useEffect(() => {
    if (!user?.id) return;

    let mounted = true;

    const loadNotes = async () => {
      try {
        setLoading(true);
        setError(null);

        const items = await apiService.getNotes(user.id);

        if (mounted) {
          setNotes(items);
        }
      } catch (error) {
        if (mounted) {
          setError("Nie udało się załadować notatek. Spróbuj ponownie.");
          console.error("Error loading notes:", error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNotes();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  if (loading) {
  return <div className="loading">Ładowanie notatek...</div>;
}

if (error) {
  return (
    <div className="error">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>
        Odśwież stronę
      </button>
    </div>
  );
}

  return (
    <div>
      <UserPanel />

      <CreateArea onAdd={addNote} />
      
      {notes.map((noteItem) => {
        return (
          <Note
            key={noteItem.id}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
            editNote={editNote}
            setEditNote={setEditNote}
          />
        );
      })}
    </div>
  );
}

export default Dashboard;
