import "./App.css";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/todos/";

export function App() {
	const [todos, setTodos] = useState([]); //stores list of todos
	const [input, setInput] = useState(""); //stores input value

	// function to fetch data from api
	const getTodoList = async () => {
		try {
			const response = await fetch(API_URL);
			const data = await response.json();

			console.log(JSON.parse(data));
			setTodos(JSON.parse(data));
		} catch (err) {
			console.log(err);
			alert(err.message);
		}
	};

	// function to post data to api
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					taskName: input,
				}),
			});
			setInput("");
			getTodoList();
		} catch (err) {
			console.log(err);
			alert(err.message);
		}
	};

	// load data from api on component mount
	useEffect(() => {
		getTodoList();
	}, []);

	return (
		<div className="App">
			<div>
				<h1>List of TODOs</h1>
				{todos.map((todo) => (
					<li key={todo._id}>{todo.taskName}</li>
				))}
			</div>
			<div>
				<h1>Create a ToDo</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<label for="todo">ToDo: </label>
						<input type="text" onChange={(e) => setInput(e.target.value)} value={input}/>
					</div>
					<div style={{ marginTop: "5px" }}>
						<button type="submit">Add ToDo!</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default App;
