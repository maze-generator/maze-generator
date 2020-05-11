import React from 'react'
import Maze from 'maze-algorithms'
import './App.css'

export default class App extends React.Component {
	state: Record<string, any>

	constructor (
		props: any
	) {
		super(props)

		const maze = Maze([10, 10])

		this.state = {
			maze: maze,
			graph: maze.graph,
			generate: maze.generator(),
		}
	}

	updateSVG () {

	}

	render () { return (
		<>
			<h1>
				Maze Generator
			</h1>

			<p>
				Generate your maze by clicking the button a bunch.
			</p>

			<input
				type='button'
				value='Generate One Step'

				onClick={(
				): void => {
					// generate next step of algorithm.
					this.state.generate.next()
					this.updateSVG()
				}}
			/>

			<input
				type='button'
				value='Generate Remainder'

				onClick={(
				): void => {
					// generate all steps of the algorithm.
					for (const _ of this.state.generate) {console.log(_)}
					this.updateSVG()
				}}
			/>

			<figure>
				<div id='maze'>
				</div>
				<figcaption>
					Figure 1: Maze Visual
				</figcaption>
			</figure>
		</>
	)}
}
