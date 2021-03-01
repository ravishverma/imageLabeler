import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Canvas from './canvas.js';

function App () {
    const [source, setSource] = useState('default.svg');
    const [loc, setLoc] = useState('(0,0)');
    const [boxesStart, setBoxesStart] = useState({});
    const [boxesEnd, setBoxesEnd] = useState({});
    const [nBoxes, setNBoxes] = useState(0);
    const [active, setActive] = useState(false);
    const [activeText, setActiveText] = useState('Activate');

    function handleMove (pos) {
        setLoc('('+pos[0]+','+pos[1]+')');
    }

    function handleDown (pos) {
        setBoxesStart({...boxesStart, [nBoxes]:pos});
    }

    function handleUp (pos) {
        setBoxesEnd({...boxesEnd, [nBoxes]:pos});
        setNBoxes(nBoxes+1);
    }

    function changeActive (e) {
        setActive(!active);
    }

    useEffect(() => {
        setActiveText(active?'Deactivate':'Activate');
        setLoc('(0,0)');
    }, [active])

    useEffect(() => {
        console.log(boxesStart);
        console.log(boxesEnd);
    }, [boxesEnd])
    
    return (
        <center>
            <Canvas source={source} onMove={handleMove}
             onDown={handleDown} onUp={handleUp} active={active}/>
            <p>{loc}</p>
            <button onClick={changeActive}>{activeText}</button>
        </center>
    )
}

ReactDOM.render(<App />,document.getElementById('root'));
