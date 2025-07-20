import React, { useState } from "react";
import { apiService } from "../services/api";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../contexts/AuthContext";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

function CreateArea({ onAdd}) {
  const {user} = useAuth();
  const [error, setError] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  let [note, setNote] = useState({
    id: 0,
    userId: user.id,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.saveNote({
        userId: note.userId,
        title: note.title,
        content: note.content,
      });
      const createdNote = {
        id: response.id,
        userId: note.userId,
        title: note.title,
        content: note.content,
      };
      onAdd(createdNote);
      setNote({
        id: 0,
        userId: user.id,
        title: "",
        content: "",
      });
    } catch (error) {
      setError(true);
    }
  };

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
