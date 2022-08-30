import "./style.css"
import React, {useEffect, useState} from "react";
import {Button} from '@material-ui/core';

import {colors, utils} from "./utils"

const StarsDisplay = (props) => {
    return (
        utils.range(1, props.count).map(countId =>
            <div key={countId} className="star"/>)
    );
};

const PlayNumber = (props) => {
    return (<Button className="number"
                    style={{backgroundColor: colors[props.status],margin:'1%'}}
                    key={props.key}
                    onClick={() => props.onClick(props.number, props.status)}>
        {props.number}</Button>);
};
const PlayAgain = (props) => {
    return (
        <div className={"game-done"}>
            <div className={"message"}
                 style={{fontSize:"35px" ,color: props.gameStatus === "lost" ? "lightcoral" : "lightgreen"}}> {props.gameStatus === "lost" ? "Game Over" : "Nice"}</div>
            <Button style={{backgroundColor:"white", margin:"1%"}} variant="outlined" onClick={() => props.onClick()}>Play Again</Button>
        </div>
    );
};

const Game = (props) => {
    const [stars, setStars] = useState(utils.random(1, 9));
    const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
    const [candidateNums, setCandidateNums] = useState([]);
    const [secLeft, setSecLeft] = useState(10);
    useEffect(() => {
        if (secLeft > 0 && availableNums.length > 0) {

            const timerId = setTimeout(() => {
                setSecLeft(secLeft - 1)
            }, 1000);
            return () => clearTimeout(timerId);
        }

    });

    const candidatesAreWrong = utils.sum(candidateNums) > stars;

    const gameStatus = availableNums.length === 0 ? "won" : secLeft === 0 ? "lost" : "active";


    const numberStatus = (number) => {
        if (!availableNums.includes(number)) {
            return "used";
        } else if (candidateNums.includes(number)) {
            return candidatesAreWrong ? "wrong" : "candidate";
        }
        return "available";
    };

    const onNumClick = (number, status) => {
        if (gameStatus !== "active" || status === "used") {
            return;
        }

        const newCandidateNums = status === "available" ? candidateNums.concat(number) : candidateNums.filter(n => n !== number);
        if (utils.sum(newCandidateNums) !== stars) {
            setCandidateNums(newCandidateNums);
        } else {
            const newAvailableNums = availableNums.filter(n => !newCandidateNums.includes(n));
            setStars(utils.randomSumIn(newAvailableNums, 9));
            setAvailableNums(newAvailableNums);
            setCandidateNums([]);
        }

    };
    return (
        <div className="game">
            <div className="help">
                Pick 1 or more numbers that sum to the number of stars
            </div>
            <div className="body">
                <div className="left">
                    {gameStatus !== "active" ? (
                            <PlayAgain
                                gameStatus={gameStatus}
                                onClick={props.startNewGame}/>
                        ) :
                        (
                            <StarsDisplay
                                count={stars}/>
                        )}
                </div>
                <div className="right">
                    {utils.range(1, 9).map(number =>
                        <PlayNumber
                            key={number}
                            number={number}
                            status={numberStatus(number)}
                            onClick={onNumClick}
                        />)}
                </div>
            </div>
            <div className="timer">Time Remaining: {secLeft}</div>
        </div>
    );
};

export default Game;