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

		this.intervalTimer = null
		this.state = {
			maze: null,
			graphic: null,
			json: null,
			nodeID: null,
			lengthInput: null,
			heightInput: null,
			intervalInput: null,
			styleOption: null,
			methodOption: null,
			generate: null,
			playMode: null,
		}
	}

	componentDidMount() {
		this.intervalTimer = setInterval(() => this.tick(), this.intervalInput ?? 200)
	}

	componentWillUnmount() {
		clearInterval(this.intervalTimer)
	}

	tick() {
		if (this.state.playMode) {
			// Generate next step of algorithm.
			this.state.generate.next()
			// Update state properties accordingly.f
			this.updateMazeGenerator()
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

		const nodeID = (maze.graph.data.find((node) => {
			return node.status === 'active'
		}) || {}).id ?? null

		const json = JSON.stringify(JSON.parse(maze.graph.json), null, 2)

		this.setState({
			maze: maze,
			graphic: graphic,
			json: json,
			nodeID: nodeID,
			generate: generate ?? maze.generator(),
		})
	}

	clearMazeGenerator () {
		this.setState({
			maze: null,
			graphic: null,
			json: null,
			nodeID: null,
			generate: null,
			playMode: null
		})
	}

	validateNaturalNumber (value) {
		if (value < 0) {
			value = 0
		}
		else if (value === '' || isNaN(value)) {
			value = null
		}
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
					placeholder='Default: 100'
					min='0'
					disabled={this.state.playMode}

					onChange={(event) => {
						let {value} = event.target
						if (value !== null) {
							value = this.validateNaturalNumber(parseInt(value))
						}
						// Clear and reset interval timer.
						clearInterval(this.intervalTimer)
						this.intervalTimer = setInterval(() => this.tick(), value ?? 100)
					}}
				/>
			</div>

			<hr />

			<input
				className='button'
				type='button'
				value='↪️ Generate One Step'
				disabled={this.state.maze === null || this.state.playMode}

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
				value={this.state.playMode ? '⏸️ Pause' : '▶️ Play'}
				disabled={this.state.maze === null}

				onClick={() => this.setState({playMode: !this.state.playMode})}
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
				<output>{this.state.nodeID ?? 'not selected'}</output>
			</div>
			<pre><code>{this.state.graphic ?? ''}</code></pre>
			<pre><code>{this.state.json ?? ''}</code></pre>
			<figcaption>
				Figure 1: Maze Visual
			</figcaption>
		</figure>
	</> ) }
}
