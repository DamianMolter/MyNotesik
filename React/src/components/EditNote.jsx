import React, { useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from "@mui/icons-material/Cancel";

async function saveEditedNote (editedNote){
  return fetch(`http://localhost:4000/editNote`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedNote)
  }).then((data) => data.json());
}

function EditNote(props) {

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(props.note.id);
    const result = await saveEditedNote(props.note);
    console.log(result);
    props.setEditNote(0);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    props.setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function cancelEdit() {
    props.setEditNote(0);
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
          <button type="button" onClick={cancelEdit}>
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
