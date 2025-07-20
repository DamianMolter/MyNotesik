import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditNote from "./EditNote";
import ChatIcon from '@mui/icons-material/Chat';
import NoteChatbot from "./NoteChatBot";

function Note(props) {
  const [note, setNote] = useState({
    id: props.id,
    title: props.title,
    content: props.content,
  });

  const [chatbotOpen, setChatbotOpen] = useState(false);

  function handleClick() {
    props.onDelete(note.id);
  }

  function handleEdit() {
    props.setEditNote(note.id);
  }

  function handleChatbot() {
    setChatbotOpen(true);
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
      <div>
        <div className="note">
          <h1>{note.title}</h1>
          <p>{note.content}</p>
          <button onClick={handleClick}>
            <DeleteIcon />
          </button>
          <button onClick={handleEdit}>
            <EditIcon />
          </button>
          <button
            onClick={handleChatbot}
            className="chat-button"
            title="Asystent AI"
          >
            <ChatIcon />
          </button>
        </div>
        <NoteChatbot
          note={note}
          isOpen={chatbotOpen}
          onClose={() => setChatbotOpen(false)}
        />
      </div>
    );
  }
}

export default Note;
