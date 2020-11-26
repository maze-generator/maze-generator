import React from 'react'
import MazeGenerator from 'maze-algorithms'
import {
	createPipedTextGraphic,
	createEdgedTextGraphic,
} from 'maze-visualizer'
import './App.css'

export default class App extends React.Component {
	constructor (props) {
		super(props)

		const maze = new MazeGenerator([3, 3])

		this.state = {
			maze: maze,
			graphic: '',
			jsonString: '',
			nodeID: '',
			generate: maze.generator(),
		}
	}

	restartGraphic () {
		const maze = new MazeGenerator([3, 3])

		this.setState({
			maze: maze,
			graphic: '',
			jsonString: '',
			nodeID: '',
			generate: maze.generator(),
		})
	}

	updateGraphic () {
		this.setState({graphic: createEdgedTextGraphic(this.state.maze.graph)})
		const data = JSON.stringify(JSON.parse(this.state.maze.graph.json), null, 2)
		this.setState({jsonString: data})
		const node = (this.state.maze.graph.data.find((cell) => {return cell.status === 'active'}) || {}).id
		this.setState({nodeID: node})
	}

	render () { return ( <>
		<h1>
			Maze Generator
		</h1>

		<p>
			Generate your maze by clicking the button a bunch.
		</p>

		<input
			type='button'
			value='Generate One Step'

			onClick={() => {
				// generate next step of algorithm.
				this.state.generate.next()
				this.updateGraphic()
			}}
		/>

		<input
			type='button'
			value='Generate Remainder'

			onClick={() => {
				// generate all steps of the algorithm.
				for (const _ of this.state.generate) {}
				this.updateGraphic()
			}}
		/>

		<input
			type='button'
			value='Restart Graphic'

			onClick={() => {this.restartGraphic()}}
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
	</> ) }
}
