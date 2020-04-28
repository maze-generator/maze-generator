import React, { useState } from 'react'
import Graph from 'tessellatron'
// import Graphic from '../classes/unicode-graphic'
import './App.css'
import {recursiveDFS} from '../helpers/generator'

let myMaze = new Graph([5,5])
recursiveDFS(myMaze, 0)

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
					myMaze = new Graph([5,5])
					recursiveDFS(myMaze, 0)
					console.log(myMaze)
					setWords('cool')
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
