import React, { useState, useRef } from "react";

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [title, setTitle] = useState("");
  const [filterText, setFilterText] = useState("");
  const [error, setError] = useState("");
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [editedText, setEditedText] = useState(""); // Aggiunto stato per il testo modificato
  const titleInputRef = useRef(null);

  const addTask = () => {
    if ((task && title) || isTitleFocused) {
      const newTask = {
        title: title,
        text: task,
      };
      setTasks([...tasks, newTask]);
      setTask("");
      setTitle("");
      setError("");
    } else {
      setError("Inserisci un titolo prima di salvare la nota.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === titleInputRef.current) {
        if (title) {
          addTask();
        } else {
          setIsTitleFocused(true);
        }
      } else {
        e.preventDefault();
        setTask(task + "\n");
      }
    }
  };

  const editTask = (index) => {
    setEditIndex(index);
    setEditedText(tasks[index].text); // Imposta il testo modificato con il testo esistente
    setTitle(tasks[index].title); // Mantieni invariato il titolo
  };

  const saveEdit = (index) => {
    if (editedText) {
      // Controlla il testo modificato invece del task
      const newTasks = [...tasks];
      newTasks[index].text = editedText; // Utilizza il testo modificato
      setTasks(newTasks);
      setEditIndex(-1);
      setEditedText(""); // Pulisci il testo modificato
      setError("");
    } else {
      setError("Inserisci un titolo prima di salvare la nota.");
    }
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(filterText.toLowerCase()) ||
      task.text.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return (
    <div className="container mt-4">
      <h1 className="text-white"></h1>
      <div className="mb-3 mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Cerca note per titolo o testo..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Titolo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          ref={titleInputRef}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsTitleFocused(true)}
          onBlur={() => setIsTitleFocused(false)}
        />
        <button className="btn btn-success" onClick={addTask}>
          Aggiungi
        </button>
      </div>
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
      <textarea
        className="form-control mb-4"
        placeholder="Scrivi qui..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyPress={handleKeyPress}
        rows={Math.max(Math.ceil(task.length / 30), 1)}
      />
      <ul className="list-group">
        {filteredTasks.map((task, index) => (
          <li className="list-group-item" key={index}>
            <div className="note-content">
              <div className="note-text">
                <strong>{task.title}</strong>
                <br />
                {index === editIndex ? (
                  <textarea
                    rows="4"
                    cols="50"
                    value={editedText} // Utilizza il testo modificato
                    onChange={(e) => setEditedText(e.target.value)} // Aggiorna il testo modificato
                  />
                ) : (
                  <div style={{ whiteSpace: "pre-wrap" }}>{task.text}</div>
                )}
              </div>
              <div className="note-buttons">
                {index === editIndex ? (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => saveEdit(index)}
                  >
                    Salva
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-success btn-sm mx-2"
                      onClick={() => editTask(index)}
                    >
                      Modifica
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTask(index)}
                    >
                      Elimina
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;
