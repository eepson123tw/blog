---
title: Particle Practice
description: Canvas, Drawing art, Particles
icon: 'lucide:alarm-clock-check'
gitTalk: false
date: 2025-01-19 15:32:20
read: '20'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Canvas Particle Practice - Day 001 [Lyrics Player](https://fet-skills.zeabur.app/canvas-lyrics-player.html)

Based on my curiosity about Canvas, plus having nothing to do on a typhoon day, I saw a YouTube video about Canvas particles, so I started this research.
I'll expand on the following points:

- Synchronized lyrics display + lyrics embedded in canvas
- Interactive particle effects
- RWD + particles

Let's get started!

### Table of Contents

1. [Canvas Basic Introduction](#canvas-basic-introduction)
2. [Audio File Playback and Lyrics](#audio-file-playback-and-lyrics)
3. [Interactive Particles](#interactive-particles)
4. [Lyrics Embedding](#lyrics-embedding)
5. [RWD and Other Improvement Points](#rwd-and-other-improvement-points)
6. [Reference](#reference)

## Canvas Basic Introduction

### What is Canvas?

Canvas is a powerful graphics drawing API provided by HTML5 that allows developers to dynamically draw graphics and animations on web pages. Through JavaScript, you can draw 2D or 3D graphics on Canvas to achieve various visual effects.

### Canvas Application Scenarios

- **Game Development**: Creating 2D or 3D games.
- **Data Visualization**: Drawing charts and graphics.
- **Animation Effects**: Implementing dynamic backgrounds or interactive animations.
- **Image Processing**: Performing image editing and filter processing.

### Basic Usage

Here's a simple Canvas practice for drawing rectangles:

```html
<canvas id="myCanvas" width="500" height="500"></canvas>
<script>
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d"); // Get properties and methods in the canvas 2d instance

  ctx.fillStyle = "#FF0000";
  ctx.fillRect(50, 50, 150, 100);
</script>
```

In this practice, a 500x500 pixel Canvas is placed and a red rectangle is drawn on it.

## Audio File Playback and Lyrics

### Audio Player Setup

In this practice, the `<audio>` tag is used to play music files. Basic setup:

```html
<audio src="./02.mp3" type="audio/ogg" controls id="audio-player"></audio>
```

- `src`: Points to the path of the audio file.
- `controls`: Displays the browser's default audio control elements.
- `id`: Used for referencing the audio element in JavaScript.

### Synchronized Lyrics Data Structure

To achieve synchronization between lyrics and audio, lyrics are stored with corresponding timestamps in an array. Each lyrics object contains `time` (in seconds) and `text`.

```js
const lyrics = [
  { time: 0, text: '(Sad Bar city pop)' },
  { time: 21, text: 'Cold light, mournful songs, drinkers have no heart' },
  // More lyrics...
];
```

### Lyrics Synchronization Logic

By listening to the audio's `timeupdate` event, we can continuously check the current time during playback and display corresponding lyrics.

```js
audio.addEventListener('timeupdate', updateLyrics);

function updateLyrics() {
  const currentTime = audio.currentTime;
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time <= currentTime) {
      currentLineIndex = i;
    }
  }

  if (currentLineIndex !== previousLineIndex) {
    createParticles(lyrics[currentLineIndex].text);
    previousLineIndex = currentLineIndex;
  }
}
```

This ensures that when the current playback time reaches a certain line's time marker, it dynamically updates to display new lyrics and creates corresponding particle effects in the canvas.

## Interactive Particles

### Basic Principles of Particle Effects

Particle effects typically consist of many small particles that move according to specific physical rules, creating dynamic visual effects. In this case, particles represent each character or word of the lyrics and perform animated displays as the music plays.

### Particle Class

Define a `Particle` Class to manage each particle's properties and actions.

```js
const mouse = { x: 0, y: 0, radius: 80 }; // Record mouse position and influence radius
const particles = []; // One-dimensional array responsible for storing and managing all particle objects

function Particle(x, y, color) {
  this.x = x + canvas.width / 2 - textWidth / 2; // Particle's initial x coordinate on Canvas
  this.y = y + canvas.height / 2 - textHeight / 2; // Particle's initial y coordinate on Canvas
  this.baseX = this.x; // Particle's base x coordinate, target x coordinate when particle returns to position
  this.baseY = this.y; // Particle's base y coordinate, target y coordinate when particle returns to position
  this.color = color; // Particle's color
  this.size = particleSize; // Particle's size (width and height)
  this.vx = 0; // Particle's velocity on x-axis
  this.vy = 0; // Particle's velocity on y-axis
  this.alpha = Math.random() * 0.5 + 0.5; // Particle's transparency, randomly initialized between 0.5 and 1
}

Particle.prototype.update = function () {
  const dx = mouse.x - this.x; // Calculate distance between particle and mouse on x-axis
  const dy = mouse.y - this.y; // Calculate distance between particle and mouse on y-axis
  const distance = Math.sqrt(dx * dx + dy * dy); // Calculate distance between particle and mouse

  if (isMouseOver && distance < mouse.radius) {
    const angle = Math.atan2(dy, dx); // Calculate angle between particle and mouse
    const force = (mouse.radius - distance) / mouse.radius; // Calculate magnitude of force applied to particle
    const forceX = Math.cos(angle) * force * 6; // Calculate force applied on x-axis
    const forceY = Math.sin(angle) * force * 6; // Calculate force applied on y-axis

    this.vx -= forceX; // Update particle's x velocity
    this.vy -= forceY; // Update particle's y velocity
  } else {
    this.vx = (this.baseX - this.x) * 0.1; // Calculate particle's x velocity returning to base position
    this.vy = (this.baseY - this.y) * 0.1; // Calculate particle's y velocity returning to base position
  }

  this.x += this.vx; // Update particle's x coordinate
  this.y += this.vy; // Update particle's y coordinate

  this.vx *= 0.9; // Reduce x velocity, implementing easing effect
  this.vy *= 0.9; // Reduce y velocity, implementing easing effect

  this.alpha = 0.7 + Math.sin(Date.now() * 0.005 + this.x * 0.01) * 0.3; // Update particle's transparency, creating flickering effect
};

Particle.prototype.draw = function () {
  ctx.fillStyle = this.color; // Set fill color to particle's color
  ctx.globalAlpha = this.alpha; // Set global transparency to particle's transparency
  ctx.fillRect(this.x, this.y, this.size, this.size); // Draw particle as a small square
  ctx.globalAlpha = 1; // Reset transparency
};
```

### Particle Animation Loop

Use `requestAnimationFrame` to create a smooth animation loop that continuously updates and draws particles.

```js
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  requestAnimationFrame(animate); // Usually calls the callback function at about 60 frames per second (FPS), depending on browser and device performance
}
```

### Interactive Effects

Mouse movement affects particle movement, causing particles to create repulsion effects near the mouse, enhancing interactivity.

```js
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  isMouseOver = true;
});

canvas.addEventListener('mouseleave', () => {
  isMouseOver = false;
});
```

## Lyrics Embedding

### Rendering Lyrics to Canvas

To convert lyrics into particles, **we need to render text to a temporary Canvas, then extract pixel data to generate particles**.

```js
function createParticles(text) {
  particles = []; // Clear existing particle array

  // Create a temporary Canvas element for rendering text and extracting pixels
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width; // Set temporary Canvas width same as main Canvas
  tempCanvas.height = canvas.height; // Set temporary Canvas height same as main Canvas

  // Set font size, dynamically adjusted based on Canvas width
  fontSize = canvas.width / 15;
  tempCtx.font = `${fontSize}px 'Microsoft YaHei', sans-serif`; // Set font style
  tempCtx.textAlign = 'center'; // Center text horizontally
  tempCtx.textBaseline = 'middle'; // Center text vertically

  const maxWidth = canvas.width * 0.8; // Set maximum text width to 80% of Canvas width
  const lineHeight = fontSize * 1.2; // Set line height to 1.2 times font size
  const lines = wrapText(tempCtx, text, maxWidth); // Perform automatic text wrapping

  textHeight = lines.length * lineHeight; // Calculate total text height

  tempCtx.fillStyle = '#FFFFFF'; // Set fill color to white

  // Draw each line of text on temporary Canvas
  for (let i = 0; i < lines.length; i++) {
    tempCtx.fillText(
      lines[i],
      tempCanvas.width / 2, // x coordinate set to Canvas center
      tempCanvas.height / 2 - textHeight / 2 + i * lineHeight + lineHeight / 2 // y coordinate calculation, ensuring text is vertically centered
    );
  }

  textWidth = maxWidth; // Set text width to maximum width

  // Get image data from temporary Canvas
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

  // Iterate through each pixel of image data, checking every 2 pixels
  for (let y = 0; y < tempCanvas.height; y += 2) {
    for (let x = 0; x < tempCanvas.width; x += 2) {
      const index = (y * tempCanvas.width + x) * 4; // Calculate pixel index in data
      const alpha = imageData.data[index + 3]; // Get pixel's transparency value

      if (alpha > 128) {
        // If pixel is opaque (transparency greater than 128)
        const color = '#FFFFFF'; // Set particle color to white

        // Create new particle, position adjusted based on Canvas center
        const particle = new Particle(
          x - canvas.width / 2 + textWidth / 2, // Adjust x coordinate to center particle
          y - canvas.height / 2 + textHeight / 2, // Adjust y coordinate to center particle
          color // Particle color
        );
        particles.push(particle); // Add particle to particle array
      }
    }
  }
}
```

### Automatic Text Wrapping Function

Ensures lyrics wrap neatly on Canvas, maintaining readability.

```js
function wrapText(context, text, maxWidth) {
  const words = text.split(' '); // Split text by spaces into word array
  const lines = []; // Initialize empty array to store lines after wrapping
  let currentLine = words[0]; // Set first word as start of current line

  // Iterate through all words starting from the second word
  for (let i = 1; i < words.length; i++) {
    const word = words[i]; // Get current word
    // Calculate total width after adding current word to current line
    const width = context.measureText(`${currentLine} ${word}`).width;

    // If total width is less than maximum width, add word to current line
    if (width < maxWidth) {
      currentLine += ` ${word}`;
    } else {
      // Otherwise, push current line to lines array and start a new line
      lines.push(currentLine);
      currentLine = word;
    }
  }

  // Add last line to lines array
  lines.push(currentLine);

  return lines; // Return wrapped text array
}
```

## RWD and Other Improvement Points

### Responsive Web Design (RWD)

Ensure Canvas and audio player display properly across different devices and sizes.

```js
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

window.addEventListener('resize', () => {
  fontSize = canvas.width / 10;
  resizeCanvas();
  createParticles(lyrics[currentLineIndex].text);
});
```

### Dynamic Font Size Adjustment

```js
fontSize = canvas.width / 15; // Adjust font size
tempCtx.font = `${fontSize}px 'Microsoft YaHei', sans-serif`;
```

### Performance Optimization

- **Particle Count Control**: Balance performance and visual effects by adjusting particle spacing and size.
- **Efficient Rendering**: Use `requestAnimationFrame` to ensure smooth animation loops.
- **Resource Management**: When handling large amounts of text or high particle counts, manage memory and processing power well to avoid performance bottlenecks.

### Other Improvement Points

- **More Particle Effects**: Introduce different shapes and colors of particles to enhance visual diversity.
- **User Customization**: Allow users to customize particle appearance and behavior, such as color, size, movement patterns, etc.
- **Karaoke Style**: Implement karaoke-style lyrics highlighting to enhance user experience and visual appeal.
- **Performance Optimization**: Optimize program performance, dynamically decide whether particles should render or not.
- **Multiple Animation Effects**: Add particle rotation, bouncing, and other diverse animations to enhance visual dynamics.
- **Music Rhythm Synchronization**: Adjust particle movement based on music rhythm to enhance synchronization with music.
- **Enhanced Mobile Interactivity**: Support touch interaction on mobile devices to improve mobile user experience.
- **Particle Lifecycle Management**: Design particle operation cycle mechanisms to make particle effects more natural.

## Summary

Through this Canvas particle practice, I implemented an interactive particle effect player with synchronized lyrics. I accelerated the development experience through ChatGPT-4o-mini and Perplexity, and combined functionalities through my own knowledge of JavaScript.
Overall, it was quite interesting! 🌟

The next article will focus on drawing fluid particle effects based on the improvement points!

## Reference

- [Franks laboratory](https://www.youtube.com/@Frankslaboratory) Highly recommended resource!
- [MDN - Canvas API](https://developer.mozilla.org/zh-TW/docs/Web/API/Canvas_API)
- [Code](https://github.com/eepson123tw/fet-practice-skills/blob/master/fet-trick/canvas/canvas-lyrics-player.html)
