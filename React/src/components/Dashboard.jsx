import React, { useState, useEffect } from "react";
import UserPanel from "./UserPanel";
import CreateArea from "./CreateArea";
import Note from "./Note";

async function getNotes(loggedUserId) {
  return fetch(`http://localhost:4000/loadNotes/${loggedUserId}`).then((data) =>
    data.json()
  );
}

function sendDeleteNoteRequest(id) {
  return fetch(`http://localhost:4000/deleteNote/${id}`, {
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

  function addNote(newNote) {
    setNotes((prevNotes) => {
      return [...prevNotes, newNote];
    });
  }

  function deleteNote(id) {
    sendDeleteNoteRequest(id);
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
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
      <h1>{loggedUserId}</h1>

      <UserPanel
        loggedUserEmail={loggedUserEmail}
        setToken={setToken}
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
          />
        );
      })}
    </div>
  );
}

export default Dashboard;
