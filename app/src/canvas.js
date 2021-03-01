import React, { useState, useEffect } from 'react';

export default function Canvas(props) {
    const [imgW, setImgW] = useState(null);
    const [imgH, setImgH] = useState(null);

    function getPos (e, imgW, imgH) {
        let canvas = document.getElementById('canvas');
        let bbox = canvas.getBoundingClientRect();
        let pos = [Math.round((e.clientX-bbox.left) * (imgW/canvas.width)),
               Math.round((e.clientY-bbox.top) * (imgH/canvas.height))];
        return pos;
    }

    const onAction = (action) => {
        return (e) => {
            let pos = getPos(e,imgW,imgH);
            action(pos);
        }
    }

    const onMove = onAction(props.onMove);
    const onDown = onAction(props.onDown);
    const onUp = onAction(props.onUp);

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

    }, [props.source])

    useEffect(() => {
        let canvas = document.getElementById('canvas');
        if (props.active) {
            canvas.addEventListener('mousemove',onMove);
            canvas.addEventListener('mousedown',onDown);
            canvas.addEventListener('mouseup',onUp);
        } else {
            canvas.removeEventListener('mousemove',onMove);
            canvas.removeEventListener('mousedown',onDown);
            canvas.removeEventListener('mouseup',onUp);
        }

        return () => {
            canvas.removeEventListener('mousemove',onMove);
            canvas.removeEventListener('mousedown',onDown);
            canvas.removeEventListener('mouseup',onUp);
        }

    }, [props.active])

    return <canvas id='canvas' height={400} width={600} />
}

function getAnnotation(start, end) {
    let midpoint = [Math.round((start[0]+end[0])/2),
                    Math.round((start[1]+end[1])/2)]

    let width = Math.abs(Math.round(start[0]-end[0]));
    let height = Math.abs(Math.round(start[1]-end[1]));

    return {center: midpoint, width: width, height: height}
}

function Capture (props) {
    let annotation = getAnnotation(props.start, props.end);

    return (
        <li>
        Center:({annotation.center[0]},{annotation.center[1]}) Width:{annotation.width} Height:{annotation.height} Label:<input type='text'/>
        </li>
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
        <div>
        <h2>Annotations</h2>
        <ul>
        {boxes}
        </ul>
        </div>
    )
}
