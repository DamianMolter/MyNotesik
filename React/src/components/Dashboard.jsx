import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import UserPanel from "./UserPanel";
import CreateArea from "./CreateArea";
import Note from "./Note";

async function getNotes(loggedUserId) {
  const token = JSON.parse(sessionStorage.getItem("token"));
  return fetch(`http://localhost:4000/notes/${loggedUserId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }).then((data) => data.json());
}

async function sendDeleteNoteRequest(id) {
  const token = JSON.parse(sessionStorage.getItem("token"));
  return fetch(`http://localhost:4000/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }).then((data) => data.json());
}

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
    const result = await sendDeleteNoteRequest(id);
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem) => {
        return noteItem.id !== id;
      });
    });
  };

  useEffect(() => {
    let mounted = true;
    getNotes(user.id).then((items) => {
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
