import React, { useState } from "react";
import CreateArea from "./CreateArea";
import Note from "./Note";

function Dashboard({loggedUserId}) {
  const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes((prevNotes) => {
      return [...prevNotes, newNote];
    });
  }

  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <h1>{loggedUserId}</h1>
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
            <Note
            key={index}
            id={index}
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
