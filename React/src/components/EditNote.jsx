import React, { useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from "@mui/icons-material/Cancel";

async function saveEditedNote (editedNote){
  const token = JSON.parse(sessionStorage.getItem("token"));
  return fetch(`http://localhost:4000/notes`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(editedNote)
  }).then((data) => data.json());
}

function EditNote(props) {

  const [newNote, setNewNote] = useState({
    id: props.note.id,
    userId: props.note.userId,
    title: props.note.title,
    content: props.note.content
  })

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await saveEditedNote(newNote);
    props.setEditNote(0);
    props.setNote(newNote);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setNewNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  const cancelEdit = e => {
    e.preventDefault();
    props.setEditNote(0);
    setNewNote(props.note);
  }

  return (
    <div className="edit-note-form-container">
      <form className="edit-note-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Tytuł..."
          defaultValue={props.note.title}
          onChange={handleChange}
        />
        <textarea
          type="text"
          name="content"
          placeholder="Treść notatki..."
          rows="3"
          defaultValue={props.note.content}
          onChange={handleChange}
        ></textarea>
        <div className="form-buttons">
          <button type="reset" onClick={cancelEdit}>
            <CancelIcon />
          </button>
          <button type="submit">
            <CheckCircleIcon />
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditNote;
