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

		// these items are programmatic "strings" or "threads"
		// that "tug" the ties of various components.
		this.intervalTimer = null
		this.generate = null

		this.state = {
			// this is the primary object the app focuses on.
			maze: null,

			// it can generate a few different things.
			graphic: null,
			json: null,
			nodeID: null,

			// to control the object and its generation,
			// the user gets some input options.
			lengthInput: null,
			heightInput: null,
			intervalInput: null,
			styleOption: null,
			methodOption: null,
			playMode: null,
		}
	}

	componentDidMount() {
		this.intervalTimer = setInterval(
			// Give the timer function.
			() => this.tick(),

			// Determine the interval amount.
			this.state.intervalInput ?? 100,
		)
	}

	componentWillUnmount() {
		// When the component is gone, destroy the timer.
		clearInterval(this.intervalTimer)
	}

	tick() {
		if (this.state.playMode) {
			// Generate next step of algorithm.
			this.generate.next()
			// Update state properties accordingly.
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
		let {maze, styleOption} = this.state

		let graphic = null
		if (styleOption === null) {
			this.setState({styleOption: 'pipe'})
			graphic = createPipedTextGraphic(maze.graph)
		}
		else if (styleOption === 'pipe') {
			graphic = createPipedTextGraphic(maze.graph)
		}
		else if (styleOption === 'edge') {
			graphic = createEdgedTextGraphic(maze.graph)
		}

		const nodeID = (
			maze.graph.data.find((node) => {
				return node.status === 'active'
			}) ?? {}
		).id ?? null

		const json = JSON.stringify(JSON.parse(maze.graph.json), null, 2)

		this.generate ??= maze.generator()
		this.setState({
			maze: maze,
			graphic: graphic,
			json: json,
			nodeID: nodeID,
		})
	}

	clearMazeGenerator () {
		this.generate = null
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
			Welcome to my maze generator!
		</p>
		<p>
			Not only is this open-source maze generator available on github, but its components are available as npm packages.
			That includes the maze algorithms, the graph representation, and the ASCII graph visualizer as well.
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
							Iterative Depth-First Path
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
							Iterative Breadth-First Path
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
				<label>Autogen Speed</label>
				<input
					className='input-box'
					type='range'
					list='tickmarks'
					min='0'
					max='300'
					value={this.state.intervalInput ?? 200}
					step='5'

					disabled={this.state.playMode}

					onChange={(event) => {
						let {value} = event.target
						if (value !== null) {
							value = this.validateNaturalNumber(300 - parseInt(value))
						}
						// Clear and reset interval timer.
						clearInterval(this.intervalTimer)
						this.intervalTimer = setInterval(() => this.tick(), value ?? 100)
						this.setState({intervalInput: 300 - value})
					}}
				/>
				<datalist id='tickmarks'>
					<option value='0' label='slow'></option>
					<option value='100'></option>
					<option value='200'  label='fast'></option>
					<option value='225'></option>
					<option value='250'></option>
					<option value='275'></option>
					<option value='300'></option>
				</datalist>
			</div>

			<hr />

			<input
				className='button'
				type='button'
				value='↪️ Step'
				disabled={this.state.maze === null || this.state.playMode}

				onClick={() => {
					// Generate next step of algorithm.
					this.generate.next()
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
				value='⏹ Stop'
				disabled={this.state.maze === null}

				onClick={() => {this.clearMazeGenerator()}}
			/>

			<input
				className='button'
				type='button'
				value='🔄 Create New'
				disabled={this.state.maze !== null}

				onClick={() => {this.createMazeGenerator()}}
			/>
		</fieldset>

		<progress
			max={this.state.maze?.graph?.data?.length ?? 1}
			value={this.state.maze?.graph?.data?.filter((cell) => {
				return cell.status === 'complete'
			}).length ?? 0}
		/>

		<figure>
			{/* <div>
				<label>active node: </label>
				<output>{this.state.nodeID ?? 'not selected'}</output>
			</div> */}
			<pre><code>{this.state.graphic ?? ''}</code></pre>
			{/* <pre><code>{this.state.json ?? ''}</code></pre> */}
			<figcaption>
				ASCII Maze
			</figcaption>
		</figure>
	</> ) }
}
