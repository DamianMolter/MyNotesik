import React, {useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import EditNote from "./EditNote";


function Note(props) {

  function handleClick() {
    props.onDelete(props.id);
  }

  function handleEdit(){
    props.setEditNote(props.id);
  }

  if(props.editNote === props.id){
    return <EditNote title={props.title} content={props.content} setEditNote={props.setEditNote}/>
  }else{
    return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={handleClick}>
        <DeleteIcon />
      </button>
      <button onClick={handleEdit}>
        <EditIcon/>
      </button>
    </div>
  );
  }
}

export default Note;