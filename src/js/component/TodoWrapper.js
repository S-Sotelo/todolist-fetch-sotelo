import React, { useState, useEffect } from "react";
import { TodoForm } from "./TodoForm";
import { Todo } from "./Todo";
import { v4 as uuidv4 } from "uuid";

const USER_NAME = 'alesanchezr';
const API_BASE_URL = 'https://playground.4geeks.com/todo';

export const TodoWrapper = () => {
    const [todos, setTodos] = useState([]);

   
    useEffect(() => {
        fetch(`${API_BASE_URL}/users/${USER_NAME}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTodos(data.todos || []);
            })
            .catch(error => {
                console.error('Error fetching todos:', error);
                setTodos([]); 
            });
    }, []);

    
    const addTodo = (task) => {
        const newTodo = {
            label: task,
            is_done: false
        };

        fetch(`${API_BASE_URL}/todos/${USER_NAME}`, {
            method: 'POST',
            body: JSON.stringify(newTodo),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTodos([...todos, data]); // Añadir el nuevo todo a la lista
            })
            .catch(error => {
                console.error('Error adding todo:', error);
            });
    };

    
    const toggleComplete = (id) => {
        const todoToUpdate = todos.find(todo => todo.id === id);
        const updatedTodo = { ...todoToUpdate, is_done: !todoToUpdate.is_done };

        fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedTodo),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
            })
            .catch(error => {
                console.error('Error toggling todo completion:', error);
            });
    };

  
    const deleteTodo = (id) => {
        fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setTodos(todos.filter(todo => todo.id !== id));
            })
            .catch(error => {
                console.error('Error deleting todo:', error);
            });
    };

  
    const clearAllTodos = () => {
        Promise.all(todos.map(todo =>
            fetch(`${API_BASE_URL}/todos/${todo.id}`, {
                method: 'DELETE',
            })
        ))
            .then(() => {
                setTodos([]);
            })
            .catch(error => {
                console.error('Error clearing all todos:', error);
            });
    };

    return (
        <div className="TodoWrapper">
            <h1>Todo List</h1>
            <TodoForm addTodo={addTodo} />
            <button onClick={clearAllTodos}>Clear All</button>
            {todos.map(todo => (
                <Todo
                    key={todo.id}
                    task={todo}
                    toggleComplete={toggleComplete}
                    deleteTodo={deleteTodo}
                />
            ))}
        </div>
    );
};
