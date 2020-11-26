import React, { useState } from 'react'
import Maze from 'maze-algorithms'
import {createPipeMaze} from 'maze-visualizer'
import './App.css'

let amazing = Maze([10,10])

let visual = createPipeMaze(amazing.graph)
const generate = amazing.generator()

const App = () => {
	const [words, setWords] = useState()
	return (
		<>
			<h1>Maze Generator</h1>
			<p>
				Generate your maze by clicking the button.
				You will have to click it a bunch...!
				Sometimes the stack empties and the state isnt changed.
				Keep pressing until your maze is full.
			</p>
			<input
				type='button'
				onClick={() => {
					generate.next()
					visual = createPipeMaze(amazing.graph)
					setWords(visual)
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
