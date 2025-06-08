import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

async function deleteNote(id) {
  return fetch(`http://localhost:4000/deleteNote/{id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  }).then((data) => data.json());
}

function Note(props) {
  const handleClickDelete = () => {
    const response = deleteNote({
      id: props.id,
    });
    props.onDelete(props.id);
    deleteNote(props.id);
  };

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={handleClickDelete}>
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
