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
			methodOption: null,
			generate: null,
		}
	}

	createMazeGenerator () {
		const mazeDimensions = [
			this.state.lengthInput ?? 10,
			this.state.heightInput ?? 10,
		]
		const mazeShape = 'hypercube'
		const mazeMethod = this.state.methodOption
			?? 'iterative depth-first traversal'

		this.setState(
			// Create a new maze object
			{maze: new MazeGenerator(
				mazeDimensions,
				mazeShape,
				mazeMethod,
			)},

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
			generate: null,
		})
	}

	validateNaturalNumber (value) {
		if (value < 0) {
			value = 0
		}
		else if (value === '' || isNaN(value)) {
			value = null
		}
		console.log(value)
		return value
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
				<label>Generator Method/Algorithm</label>
				<div>
					<div>
						<input
							id='iterative-depth-first-option'
							className='toggle'
							name='maze-algorithm'
							type='radio'
							defaultChecked={true}
							disabled={this.state.maze !== null}

							onChange={() => this.setState({
								methodOption: 'iterative depth-first traversal'
							})}
						/>
						<label htmlFor='iterative-depth-first-option'>
							Iterative Depth-First Search
						</label>
					</div>
				</div>

				<div>
					<div>
						<input
							id='iterative-breadth-first-option'
							className='toggle'
							name='maze-algorithm'
							type='radio'
							defaultChecked={false}
							disabled={this.state.maze !== null}

							onChange={() => this.setState({
								methodOption: 'iterative breadth-first traversal'
							})}
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
							id='pipe-style-option'
							className='toggle'
							name='graphic-style'
							type='radio'
							defaultChecked={true}
							disabled={this.state.maze !== null}

							onChange={() => this.setState({
								styleOption: 'pipe'
							})}
						/>
						<label htmlFor='pipe-style-option'>
							Pipe-Style Text Graphic
						</label>
					</div>

					<div>
						<input
							id='edge-style-option'
							className='toggle'
							name='graphic-style'
							type='radio'
							defaultChecked={false}
							disabled={this.state.maze !== null}

							onChange={() => this.setState({
								styleOption: 'edge'
							})}
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
					className='input-box'
					type='number'
					placeholder='Default: 10'
					min='0'
					disabled={this.state.maze !== null}
					value={this.state.lengthInput ?? ''}

					onChange={(event) => {
						let {value} = event.target
						if (value !== null) {
							value = this.validateNaturalNumber(parseInt(value))
						}
						this.setState({lengthInput: value})
					}}
				/>
			</div>

			<div>
				<label>Maze Height</label>
				<input
					className='input-box'
					type='number'
					placeholder='Default: 10'
					min='0'
					disabled={this.state.maze !== null}
					value={this.state.heightInput ?? ''}

					onChange={(event) => {
						let {value} = event.target
						if (value !== null) {
							value = this.validateNaturalNumber(parseInt(value))
						}
						this.setState({heightInput: value})
					}}
				/>
			</div>

			<div>
				<label>Autogen Interval</label>
				<input
					className='input-box'
					type='number'
					placeholder='Default: 300'
					min='0'
					disabled={true}
				/>
			</div>

			<hr />

			<input
				className='button'
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
				className='button'
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
				className='button'
				type='button'
				value='⏹ Stop Graphic'
				disabled={this.state.maze === null}

				onClick={() => {this.clearMazeGenerator()}}
			/>

			<input
				className='button'
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
