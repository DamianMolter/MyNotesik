import React, { useState, useEffect } from "react";
import UserPanel from "./UserPanel";
import CreateArea from "./CreateArea";
import Note from "./Note";

async function getNotes(loggedUserId) {
  return fetch(`http://localhost:4000/notes/${loggedUserId}`).then((data) =>
    data.json()
  );
}

async function sendDeleteNoteRequest(id) {
  return fetch(`http://localhost:4000/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
}

function Dashboard({
  loggedUserId,
  loggedUserEmail,
  setLoggedUserId,
  setLoggedUserEmail,
  setToken,
}) {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(0);

  function addNote(newNote) {
    setNotes((prevNotes) => {
      return [...prevNotes, newNote];
    });
  }

  const deleteNote = async (id) => {
    const result = await sendDeleteNoteRequest(id);
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem) => {
        return noteItem.id !== id;
      });
    });
  }

  useEffect(() => {
    let mounted = true;
    getNotes(loggedUserId).then((items) => {
      if (mounted) {
        setNotes(items);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <UserPanel
        loggedUserEmail={loggedUserEmail}
        setToken={setToken}
        loggedUserId={loggedUserId}
        setLoggedUserId={setLoggedUserId}
        setLoggedUserEmail={setLoggedUserEmail}
      />

      <CreateArea onAdd={addNote} loggedUserId={loggedUserId} />
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
