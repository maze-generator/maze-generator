import React, { useState } from 'react'
import Maze from 'maze-algorithms'
import {createPipeMaze} from '../classes/unicode-graphic'

import './App.css'

let myMaze = new Maze([5,5])

console.log(myMaze)

const App = () => {
	const [words, setWords] = useState('wow')
	return (
		<>
			<h1>Maze Generator</h1>
			<p>
				Generate your maze by clicking the button.
			</p>
			<input
				type='button'
				onClick={() => {
					myMaze = new Maze([2,2])
					console.log(myMaze)
					const maze = createPipeMaze(myMaze)
					console.log(maze)
					setWords(maze)
				}}
				value='Generate'
			/>

			<textarea
				className='results'
				value={words}
				readOnly={true}
			/>
		</>
	)
}

export default App;
