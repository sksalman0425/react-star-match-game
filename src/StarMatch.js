import { useEffect, useState } from "react";
import "./StarMatch.css";

// Math science
const utils = {
  // Sum an array
  sum: (arr) => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

// Color Theme
const colors = {
  available: "lightgray",
  used: "lightgreen",
  wrong: "lightcoral",
  candidate: "deepskyblue",
};


const PlayNumber = (props) => {
 // console.log("status of the Number is ::", props.status, props.number);
  return (
    <button
      className="number"
      style={{ backgroundColor: colors[props.status] }}
      onClick={() => props.onNumberClick(props.number, props.status)}
    >
      {props.number}
    </button>
  );
};

const DisplayStar = (props) => {
  return (
    <>
      {utils.range(1, props.count).map((starId) => {
        return <div key={starId} className="star" />;
      })}
    </>
  );
};
const PlayAgain = (props)=>{
  return (
    <div>
      <div style={{color: props.gameStatus === "won"? "green":"red"}}>
        {props.gameStatus === "won" ? "Nice Played" : "Game Over"}
      </div>
      <button onClick={()=>props.resetGame()}>Play Again</button>
    </div>
  )
};


// STAR MATCH - Starting Template
const StarMatch = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  //console.log("Range Function", utils.range(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const candidateWrong = utils.sum(candidateNums) > stars;
  const [secondsleft, setsecondsleft] =useState(10);
 // const gameIsDone= availableNums.length===0;
  const gameStatus= availableNums.length ===0 ? "won" : secondsleft===0 ? "lost" : "active";

  useEffect(()=>{
    //componentDidMount 
    //componentDidUpdate 
    console.log("After html render, this useEffect is called");
    if (secondsleft > 0){
     const timerID= setTimeout(()=>{
      setsecondsleft(secondsleft-1)
    },1000);
    // in useEffect's return function we can clear variable value/unsubscribe logic etc.
    // In this example we clear multiple instances of setTimeout function which are created everytime when it called.
    // Remember, here we are not making secondsleft variable clear
     return ()=>{
      clearTimeout(timerID);
     }
    }

  },[secondsleft]);//this useEffeect function is called when secondsleft value changed.

  const numberStatus = (number) => {
    console.log("Number in numbarStatus Component", number);
    if (!availableNums.includes(number)) {
      return "used";
    }
    if (candidateNums.includes(number)) {
      return candidateWrong ? "wrong" : "candidate";
    }
    return "available";
  };
  const onNumberClick = (number,currentStatus)=>{
    if(currentStatus=== "used"){
      return;
    }
    //candidate array add
    const newCandidateNums = 
    currentStatus === 'available' 
    ? candidateNums.concat(number)
    : candidateNums.filter((cn)=> cn !== number);
  
    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        (n) => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  



  }



  const resetGame =()=>{
    setStars(utils.random(1, 9));
    setAvailableNums(utils.range(1, 9));
     setCandidateNums([]);
     setsecondsleft(10);
   };
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== "active"  ?(
             <PlayAgain resetGame={resetGame} gameStatus={gameStatus}/>
              ):(
              <DisplayStar count={stars} />
              )}
        </div>
        <div className="right">
          {utils.range(1, 9).map((number) => (
            <PlayNumber
              key={number}
              number={number}
              status={numberStatus(number)}
              onNumberClick={onNumberClick}
            />
          ))}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsleft}</div>
    </div>
  );
}

export default StarMatch;
