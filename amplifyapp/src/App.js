import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import { listTodos } from './graphql/queries';
import { createTodo as CreateTodoMutation, deleteTodo as DeleteTodoMutation } from './graphql/mutations';
import './App.css';
import { API } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const initialFormState = { name: '', description: '' }

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listTodos });
    setNotes(apiData.data.listNotes.items);
  }

  async function createTodo() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: CreateTodoMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteTodo({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: DeleteTodoMutation, variables: { input: { id } }});
  }

  return (
   <Authenticator>
       {({ signOut, user }) => (
     <div className="App">
          <p>
            Welcome, create your note!
          </p>
          <button onClick={signOut}>Sign out</button>
        
      
      <h1>My Notes App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <button onClick={createTodo}>Create Note</button>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
              <button onClick={() => deleteTodo(note)}>Delete note</button>
             </div>
             
          ))
        }
      </div>
      
    </div>
    )}
   </Authenticator>
   
   
  );
}



export default App;
