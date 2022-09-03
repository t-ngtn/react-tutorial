import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ToggleButton from 'react-toggle-button';

function Square(props) {
    return (
        <button className='square' onClick={props.onClick} style={{ color: props.isWin ? "red" : "black" }}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, isWin) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isWin={isWin}
                key={i}
            />
        );
    }

    render() {

        let list = []
        for (var i = 0; i < 3; i++) {
            let _list = []
            for (var j = 0; j < 3; j++) {
                const isWin = this.props.win_line.includes(i * 3 + j);
                _list.push(this.renderSquare(i * 3 + j, isWin))
            }
            list.push(<div className="board-row" key={i}>{_list}</div>)
        }
        return (
            <div>
                {list}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coord: null
            }],
            stepNumber: 0,
            xIsNext: true,
            historyIsIncreasing: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const [winner, _] = calculateWinner(squares); // eslint-disable-line no-unused-vars
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                coord: [Math.floor(i / 3), i % 3]
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const [winner, win_line] = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + " (" + step.coord[0] + "," + step.coord[1] + ")" :
                'Go to game start';
            if (move === this.state.stepNumber) {
                return (
                    <li key={move} style={{
                        order: this.state.historyIsIncreasing ? move : -move
                    }}>
                        <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
                    </li>
                );
            } else {
                return (
                    <li key={move} style={{
                        order: this.state.historyIsIncreasing ? move : -move
                    }}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
        });


        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        win_line={win_line}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol style={{ display: 'flex', flexDirection: 'column' }}>{moves}</ol>
                    <div>{"increasing order"}
                        <ToggleButton
                            value={this.state.historyIsIncreasing || false}
                            onToggle={(value) => {
                                this.setState({
                                    historyIsIncreasing: !value,
                                })
                            }}
                        />
                    </div>
                </div>
            </div >
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], [a, b, c]];
        }
    }
    return [null, []];
}