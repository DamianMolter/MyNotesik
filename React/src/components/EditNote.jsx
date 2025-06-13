import React from "react";
import PublishIcon from "@mui/icons-material/Publish";
import CancelIcon from "@mui/icons-material/Cancel";

function EditNote(props) {
  function handleCancelEdit() {
    props.setEditNote(0);
  }

  return (
    <div className="edit-note-form-container">
      <form className="edit-note-form" id="editNoteForm">
        <input
          type="text"
          name="editTitle"
          placeholder="Tytuł..."
          defaultValue={props.title}
        />
        <textarea
          type="text"
          name="editContent"
          placeholder="Treść notatki..."
          rows="3"
          defaultValue={props.content}
        ></textarea>
        <div className="form-buttons">
          <button type="button" onClick={handleCancelEdit}>
            <CancelIcon />
          </button>
          <button type="submit">
            <PublishIcon />
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditNote;
