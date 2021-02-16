import React, { useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

function App () {
    return (
        <div>
            <Platform/>
        </div>
    )
}

function Platform (props) {
    const [src, setSrc] = useState('default.svg');

    useEffect(() => {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        let img = new Image();

        img.onload = function() {
                       canvas.height = canvas.width * (img.height / img.width);
                       ctx.drawImage(img,0,0,canvas.width,canvas.height);
        }
        
        img.src = src;
    }); 

    return (
        <center>
            <canvas id='canvas' height={400} width={600} />
        </center>
    )
}

// <img src={props.source} height={400} width={600} />

ReactDOM.render(<App />,document.getElementById('root'));
