import SunCalc from 'suncalc';
import React from 'react';

class Moon extends React.Component {
  componentDidMount(){
    this.updateIcon();
    this.interval = setInterval(this.updateIcon, 1000 * 60 * 60);
  }
  componentWillUnmount(){
    clearInterval(this.interval);
  }

  updateIcon(){
    const angle = (-Math.PI - SunCalc.getMoonIllumination(new Date()).phase * 2 * Math.PI) % (2*Math.PI) + Math.PI;

    const canv = document.createElement("canvas");

    const size = 64;
    canv.height = size;
    canv.width = size;

    const ctx = canv.getContext("2d");

    ctx.clearRect(0, 0, size, size);

    // first draw the lit area
    ctx.beginPath();
    ctx.fillStyle="lightyellow";
    ctx.arc(size/2, size/2, size/2, 0, 2* Math.PI);
    ctx.fill();

    // then the dark
    ctx.beginPath();
    ctx.fillStyle="midnightblue";
    ctx.moveTo(size/2, 0);

    function go(theta,phi){
      phi = Math.max(-Math.PI/2, phi);
      phi = Math.min(Math.PI/2, phi);
      let x = Math.sin(theta) * Math.sin(phi) * size/2 + size/2;
      let y = -Math.cos(theta) * size/2 + size/2;
      ctx.lineTo(x, y);
    }

    // trace the left side of the dark area
    for(let theta=0; theta <= Math.PI; theta += Math.PI/16){
      go(theta, angle - Math.PI/2);
    }

    // ... then the right
    for(let theta=Math.PI; theta >= 0; theta -= Math.PI/16){
      go(theta, angle + Math.PI/2);
    }

    ctx.fill();

    let icon = document.querySelector("link[rel=icon]");
    if(!icon){
      icon = document.createElement("link");
      icon.rel = "icon";
      document.querySelector("head").appendChild(icon);
    }
    icon.href = canv.toDataURL();

  }

  render(){ return null; }
}

export default Moon;
