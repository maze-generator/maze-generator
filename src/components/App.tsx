import React from 'react'
import Maze from 'maze-algorithms'
import {createPipeMaze} from 'maze-visualizer'
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
			graphic: '',
			jsonString: '',
			generate: maze.generator(),
		}
	}

	updateGraphic () {
		this.setState({graphic: createPipeMaze(this.state.maze.graph)})
		const data = JSON.stringify(JSON.parse(this.state.maze.graph.json), null, 2)
		this.setState({jsonString: data})
		const node = (this.state.maze.graph.data.find((cell: any): boolean => {return cell.status === 'active'}) || {}).id
		this.setState({nodeID: node})
	}

	render () {return(
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
					this.updateGraphic()
				}}
			/>

			<input
				type='button'
				value='Generate Remainder'

				onClick={(
				): void => {
					// generate all steps of the algorithm.
					for (const _ of this.state.generate) {}
					this.updateGraphic()
				}}
			/>

			<figure>
				<div>
					<label>active node: </label>
					<output>{this.state.nodeID}</output>
				</div>
				<textarea value={this.state.graphic} readOnly />
				<textarea value={this.state.jsonString} readOnly />
				<figcaption>
					Figure 1: Maze Visual
				</figcaption>
			</figure>
		</>
	)}
}
