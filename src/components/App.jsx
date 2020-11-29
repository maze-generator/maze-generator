import React from 'react'
import MazeGenerator from 'maze-algorithms'
import {
	createPipedTextGraphic,
	createEdgedTextGraphic,
} from 'maze-visualizer'
import './App.css'

export default class App extends React.Component {
	constructor () {
		super()

		this.state = {
			maze: null,
			graphic: null,
			json: null,
			lengthInput: null,
			heightInput: null,
			styleOption: null,
			generate: null,
		}
	}

	createMazeGenerator () {
		this.setState(
			// Create a new maze object
			{maze: new MazeGenerator([
				this.state.lengthInput ?? 10,
				this.state.heightInput ?? 10,
			])},

			// Callback for setState()
			this.updateMazeGenerator
		)
	}

	updateMazeGenerator () {
		let {maze, generate, styleOption} = this.state

		let graphic = null
		if (styleOption === null) {
			this.setState({styleOption: 'pipe'})
			graphic = createPipedTextGraphic(maze.graph)
		}
		if (styleOption === 'pipe') {
			graphic = createPipedTextGraphic(maze.graph)
		}
		else if (styleOption === 'edge') {
			graphic = createEdgedTextGraphic(maze.graph)
		}

		const json = JSON.stringify(JSON.parse(maze.graph.json), null, 2)

		this.setState({
			maze: maze,
			graphic: graphic,
			json: json,
			generate: generate ?? maze.generator(),
		})
	}

	clearMazeGenerator () {
		this.setState({
			maze: null,
			graphic: null,
			json: null,
			lengthInput: null,
			heightInput: null,
			styleOption: null,
			generate: null,
		})
	}

	render () { return ( <>
		<h1>
			Maze Generator
		</h1>

		<p>
			Generate your maze by clicking the button a bunch.
		</p>

		<fieldset>
			<legend>Generator Parameters</legend>

			<div>
				<label>Maze Algorithm</label>
				<div>
					<div>
						<input
							name='maze-algorithm'
							id='iterative-depth-first-option'
							type='radio'
							defaultChecked={true}
							disabled={true || this.state.maze !== null}
						/>
						<label htmlFor='iterative-depth-first-option'>
							Iterative Depth-First Search
						</label>
					</div>
				</div>

				<div>
					<div>
						<input
							name='maze-algorithm'
							id='iterative-breadth-first-option'
							type='radio'
							defaultChecked={false}
							disabled={true || this.state.maze !== null}
						/>
						<label htmlFor='iterative-breadth-first-option'>
							Iterative Breadth-First Search
						</label>
					</div>
				</div>

				<label>Graphic Style</label>
				<div>
					<div>
						<input
							name='graphic-style'
							id='pipe-style-option'
							type='radio'
							defaultChecked={true}
							disabled={true || this.state.maze !== null}
						/>
						<label htmlFor='pipe-style-option'>
							Pipe-Style Text Graphic
						</label>
					</div>

					<div>
						<input
							name='graphic-style'
							id='edge-style-option'
							type='radio'
							defaultChecked={false}
							disabled={true || this.state.maze !== null}
						/>
						<label htmlFor='edge-style-option'>
							Edge-Style Text Graphic
						</label>
					</div>
				</div>
			</div>

			<div>
				<label>Maze Length</label>
				<input
					type='number'
					placeholder='Default: 10'
					min='0'
					disabled={true || this.state.maze !== null}
				/>
			</div>

			<div>
				<label>Maze Height</label>
				<input
					type='number'
					placeholder='Default: 10'
					min='0'
					disabled={true || this.state.maze !== null}
				/>
			</div>

			<div>
				<label>Autogen Interval</label>
				<input
					type='number'
					placeholder='Default: 300'
					min='0'
					disabled={true}
				/>
			</div>

			<hr />

			<input
				type='button'
				value='↪️ Generate One Step'
				disabled={this.state.maze === null}

				onClick={() => {
					// Generate next step of algorithm.
					this.state.generate.next()
					// Update state properties accordingly.
					this.updateMazeGenerator()
				}}
			/>

			<input
				type='button'
				value='⏯ Play/Pause'
				disabled={true}

				onClick={() => {
				// generate all steps of the algorithm.
					for (const _ of this.state.generate) {}
					this.updateGraphic()
				}}
			/>

			<input
				type='button'
				value='⏹ Stop Graphic'
				disabled={this.state.maze === null}

				onClick={() => {this.clearMazeGenerator()}}
			/>

			<input
				type='button'
				value='🔄 Start New Maze'
				disabled={this.state.maze !== null}

				onClick={() => {this.createMazeGenerator()}}
			/>
		</fieldset>

		<figure>
			<div>
				<label>active node: </label>
				<output>{this.state.nodeID}</output>
			</div>
			<textarea value={this.state.graphic ?? ''} readOnly />
			<textarea value={this.state.json ?? ''} readOnly />
			<figcaption>
				Figure 1: Maze Visual
			</figcaption>
		</figure>
	</> ) }
}
