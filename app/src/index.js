import React, { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

function App () {
    return (
        <div>
            <Platform/>
        </div>
    )
}

function Capture (props) {
    return (
        <tr>
        <td>({props.start[0]},{props.start[1]})</td>
        <td>({props.end[0]},{props.end[1]})</td>
        <td><input type='text' /></td>
        </tr>
    )
}

function CaptureList (props) {
    const [boxes, setBoxes] = useState([]);

    useEffect(() => {
        let n = Object.keys(props.end).length;
        if (n>0) {
            setBoxes(prev => {
                return [...prev, <Capture key={n-1} start={props.start[n-1]} end={props.end[n-1]} />]
            });
        }

    }, [props.end])

    useEffect(() => {
        if (Object.keys(props.start).length==0) {
            setBoxes([]);
        }
    }, [props.start])

    return (
        <table>
        <thead>
        <tr>
        <th>Start</th>
        <th>End</th>
        <th>Label</th>
        </tr>
        </thead>
        <tbody>
        {boxes}
        </tbody>
        </table>
    )
}

function Platform (props) {
    const [imgW, setImgW] = useState(null);
    const [imgH, setImgH] = useState(null);
    const [loc, setLoc] = useState('(0,0)');
    const [boxesStart, setBoxesStart] = useState({});
    const [boxesEnd, setBoxesEnd] = useState({});
    const [imgsrc, setImgsrc] = useState('default.svg');

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
        
        img.src = imgsrc;

    }, [imgsrc]); 

    let handleClearAnnot = function () {
        setImgW(null);
        setImgH(null);
        setLoc('(0,0)');
        setBoxesStart([]);
        setBoxesEnd([]);
        setImgsrc('test.jpg');
    }

    let handleClearAll = function () {
        setLoc('(0,0)');
        setBoxesStart([]);
        setBoxesEnd([]);
        if (imgsrc!='default.svg') {
            setImgW(null);
            setImgH(null);
            setImgsrc('default.svg');
        }
    }

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
            <CaptureList start={boxesStart} end={boxesEnd} />
        </center>
    )
}

ReactDOM.render(<App />,document.getElementById('root'));
