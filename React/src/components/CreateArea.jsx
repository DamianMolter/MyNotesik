import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

async function saveNote(note) {
  return fetch("http://localhost:4000/saveNote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  }).then((data) => data.json());
}

function CreateArea({ onAdd, loggedUserId }) {
  const [isExpanded, setExpanded] = useState(false);

  let [note, setNote] = useState({
    id: 0,
    userId: loggedUserId,
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function expand() {
    setExpanded(true);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const newNote = await saveNote({
      userId: note.userId,
      title: note.title,
      content: note.content
    });
    onAdd(newNote);
    setNote({
    id: 0,
    userId: loggedUserId,
    title: "",
    content: "",
  });
  }

  return (
    <div>
      <form className="create-note" onSubmit={handleSubmit}>
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Tytuł..."
          />
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Treść notatki..."
          rows={isExpanded ? 3 : 1}
        />
        <Zoom in={isExpanded}>
          <Fab type="submit">
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
