import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ButtonToolbar, MenuItem, DropdownButton} from "react-bootstrap";

document.addEventListener('DOMContentLoaded', function(){
class Box extends React.Component{
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
	}
	
	render(){
		return(
		<div className ={this.props.boxClass}
			id = {this.props.id}
			onClick = {this.selectBox}
		/>
		);
	}
}
class Grid extends React.Component{
	render(){
		const width = (this.props.cols * 14)+1;
		var rowsArr = [];
		var boxClass = "";
		for(var i = 0; i < this.props.rows; i++){
		for(var j = 0; j < this.props.cols; j++){
			let boxId = i + "_" + j;
			boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
			rowsArr.push(
			<Box 	
				boxClass = {boxClass}
				key = {boxId}
				boxId = {boxId}
				row = {i}
				col = {j}
				selectBox = {this.props.selectBox}	
			/>
				);
			}
		}
		return(
		<div className = "grid" style={{width:width}}>
			{rowsArr}
		</div>
		);
	}
}

class Buttons extends React.Component {
	handleSelect = (e) =>{
		this.props.gridSize(e);
	}
	render(){
		return(
		<div className="center">
			<ButtonToolbar>
				<button className="btn btn-default" onClick={this.props.playButton}>Play</button>
				<button className="btn btn-default" onClick={this.props.pauseButton}>Pause</button>
				<button className="btn btn-default" onClick={this.props.clear}>Clear</button>
				<button className="btn btn-default" onClick={this.props.slow}>Slow</button>
				<button className="btn btn-default" onClick={this.props.fast}>Fast</button>
				<button className="btn btn-default" onClick={this.props.seed}>Seed</button>
				<DropdownButton title="Grid Size"
				id = "size-menu"
				onSelect = {this.handleSelect}>
				<MenuItem eventKey="1">20x20</MenuItem>
				<MenuItem eventKey="2">35x35</MenuItem>
				<MenuItem eventKey="3">90x40</MenuItem>
				</DropdownButton>
				</ButtonToolbar>
			</div>
	
		)
	}
}
class Main extends React.Component{
	constructor(){
		super();
		this.speed = 100;
		this.rows = 35;
		this.cols = 35;
		this.state = {	
			generation:0,
			gridFull:Array(this.rows).fill().map(() => Array(this.cols).fill(false)) 
		}
	}
	selectBox = (row, col) =>{
			let gridCopy = arrayClone(this.state.gridFull);//helping function
			gridCopy[row][col] = !gridCopy[row][col];
			this.setState({
				gridFull: gridCopy
			});
	}
	seed = () => {
		let gridCopy = arrayClone(this.state.gridFull);
		for(let i = 0; i<this.rows; i++){
			for(let j = 0; j<this.cols; j++){
				if(Math.floor(Math.random()* 4) === 1){
					gridCopy[i][j] = true;
				}
				
			}
		}
		this.setState({
				gridFull: gridCopy
		});
	}
	playButton = () => {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.play, this.speed);
	}
	pauseButton = () =>{
		clearInterval(this.intervalId);
	}
	slow = () =>{
		this.speed = 1000;
		this.playButton();
	}
	fast = () =>{
		this.speed = 100;
		this.playButton();
	}
	clear = () => {
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
		this.setState({
			gridFull: grid,
			generation: 0
		});
	}
	gridSize = (size) =>{
		switch(size){
			case "1":
				this.cols = 20;
				this.rows = 20;
			break;
			case "2":
				this.cols = 35;
				this.rows = 35;
			break;
			case "3":
				this.cols = 90;
				this.rows = 40;
		}
		this.clear();
	}
	
play = () => {
		let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);

		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});

	}

	componentDidMount() {
		this.seed();
		this.playButton();
	}
	render() {
		return( 
			<div>
				<h1>Game of Life</h1>
				<Buttons
				playButton = {this.playButton}
				pauseButton = {this.pauseButton}
				slow = {this.slow}
				fats = {this.fast}
				clear = {this.clear}
				seed = {this.seed}
				gridSize = {this.gridSize}
				/>
			<Grid
			gridFull = {this.state.gridFull}
			rows = {this.rows}
			cols = {this.cols}
			selectBox = {this.selectBox}
			/>
			<h2>Generations: {this.state.generation}</h2>
			<div className = "rules">
			<h2 className="gameRules">Rules:</h2><br></br>
				<div><p>The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:</p>
					<p>1. Any live cell with fewer than two live neighbors dies, as if by under population.</p>
					<p>2. Any live cell with two or three live neighbors lives on to the next generation.</p>
					<p>3. Any live cell with more than three live neighbors dies, as if by overpopulation.</p>
					<p>4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.</p>
					<p>The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations.</p></div><p>&copy;: <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"><i class="fab fa-wikipedia-w"></i></a></p></div>
			</div>
		);
	}
}
function arrayClone(arr){
	return JSON.parse(JSON.stringify(arr));
}
ReactDOM.render(<Main />, document.getElementById('root'));
});
