import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import UserPanel from "./UserPanel";
import CreateArea from "./CreateArea";
import Note from "./Note";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(0);
  const {user} = useAuth();

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
    let mounted = true;
    apiService.getNotes(user.id).then((items) => {
      if (mounted) {
        setNotes(items);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <UserPanel/>

      <CreateArea onAdd={addNote}/>
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
