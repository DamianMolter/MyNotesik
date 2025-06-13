import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditNote from "./EditNote";

function Note(props) {

  const [note, setNote] = useState({
    id: props.id,
    title: props.title,
    content: props.content
  })

  function handleClick() {
    props.onDelete(note.id);
  }

  function handleEdit() {
    props.setEditNote(note.id);
    
  }

  if (props.editNote === props.id) {
    return (
      <EditNote
        id={props.id}
        title={props.title}
        content={props.content}
        setEditNote={props.setEditNote}
        note={note}
        setNote={setNote}
      />
    );
  } else {
    return (
      <div className="note">
        <h1>{note.title}</h1>
        <p>{note.content}</p>
        <button onClick={handleClick}>
          <DeleteIcon />
        </button>
        <button onClick={handleEdit}>
          <EditIcon />
        </button>
      </div>
    );
  }
}

export default Note;
