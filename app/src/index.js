import React, { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

function App () {
    const [source, setSource] = useState('default.svg');

    let handleClearAnnot = function () {
        setSource('test.jpg');
    }

    let handleClearAll = function () {
        setSource('default.svg');
    }

    return (
        <div>
            <Platform source={source}/>
            <center>
            <input type='file' className='inline-divs' />
            <button type='button' className='inline-divs' onClick={handleClearAnnot}>
            Clear annotations
            </button>
            <button type='button' className='inline-divs' onClick={handleClearAll}>
            Clear all
            </button>
            <button type='button' className='inline-divs'>
            Download
            </button>
            </center>
        </div>
    )
}

function Capture (props) {
    console.log(props);
    return (
        <tr>
        <td>{props.index}</td>
        <td>({props.start[0]},{props.start[1]})</td>
        <td>({props.end[0]},{props.end[1]})</td>
        </tr>
    )
}

function CaptureList (props) {
    const boxes = [];

    if ((Object.keys(props.end).length>0) && (Object.keys(props.start).length==Object.keys(props.end).length)) {
        for (let i in props.start) {
            boxes.push(<Capture index={i}start={props.start[i]} end={props.end[i]} />);
        }
    }

    return (
        <table>
        <tr>
        <th>Index</th>
        <th>Start</th>
        <th>End</th>
        </tr>
        {boxes}
        </table>
    )
}

function Platform (props) {
    const [imgW, setImgW] = useState(null);
    const [imgH, setImgH] = useState(null);
    const [loc, setLoc] = useState('(0,0)');
    const [boxesStart, setBoxesStart] = useState({});
    const [boxesEnd, setBoxesEnd] = useState({});

    useEffect(() => {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        let img = new Image();

        img.onload = function() {
            canvas.height = canvas.width * (img.height / img.width);
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            setImgW(img.width);
            setImgH(img.height);
        }
        
        img.src = props.source;

    }, [props.source]); 

    let getPos = function (e) {
        let canvas = document.getElementById('canvas');
        let bbox = canvas.getBoundingClientRect();
        let pos = [Math.round((e.clientX-bbox.left) * (imgW/canvas.width)),
               Math.round((e.clientY-bbox.top) * (imgH/canvas.height))];
        return pos;
    }

    let handleMove = function (e) {
        let pos = getPos(e);
        setLoc('('+pos[0]+','+pos[1]+')');
    }

    let handleDown = function (e) {
        let pos = getPos(e);
        let n = Object.keys(boxesStart).length;
        setBoxesStart(prev => {
                      let temp = {...prev};
                      temp[n] = pos;
                      return temp;
        });
    }

    let handleUp = function (e) {
        let pos = getPos(e);
        let n = Object.keys(boxesEnd).length;
        setBoxesEnd(prev => {
                      let temp = {...prev};
                      temp[n] = pos;
                      return temp;
        });
    }

    return (
        <center>
            <canvas id='canvas' height={400} width={600} onMouseDown={handleDown}
            onMouseMove={handleMove} onMouseUp={handleUp}/>
            <div id='location'>{loc}</div>
            <CaptureList start={boxesStart} end={boxesEnd} />
        </center>
    )
}

ReactDOM.render(<App />,document.getElementById('root'));
