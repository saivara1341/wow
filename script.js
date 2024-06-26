
const animationDuration = 24000;
const updateInterval = 400;
let startTimeMap = new Map();
let intervalMap = new Map();

function createLetters(text, rad, offset, frontColor, direction, id) {
    const radius = rad;
    let letters = text.split('');
    if(direction != 'backwards') { letters = letters.reverse(); }
    let dir = ( direction == 'backwards') ? -1 : 1;
    

    const container = document.createElement('div');
    container.classList.add('text-container');
    container.classList.add(id);
    document.body.appendChild(container);

    startTimeMap.set(id, Date.now());

    letters.forEach((letter, index) => {
        const angle = (360 / letters.length) * (dir) * index - 8;
        const radian = angle * (Math.PI / 180);
        const x = radius * Math.cos(radian);
        const y = radius * Math.sin(radian);

        const letterElement = document.createElement('div');
        letterElement.classList.add('letter');
        letterElement.classList.add(id);
        letterElement.textContent = letter;
        letterElement.setAttribute("data-text", letter);

        letterElement.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotateX(90deg) rotateY(${angle + 90}deg) rotateZ(180deg) translateY(${offset}px)`;

        container.appendChild(letterElement);
    });

    if (!intervalMap.has(id)) {
        const intervalId = setInterval(() => {
            updateLetters(container, letters.length, 0.54, 1, frontColor, dir, id);
        }, updateInterval);
        intervalMap.set(id, intervalId);
    }
}
    
function updateLetters(container, totalLetters, op1, op2, colorFront, dir, id) {
    const startTime = startTimeMap.get(id);
    const elapsedTime = Date.now() - startTime;
    const rotation = (elapsedTime % animationDuration) / animationDuration * 360;
    const activeAngleRange = 180;

    const letters = container.querySelectorAll(`.${id}`); 
    letters.forEach((letter, index) => {
        const letterAngle = 270 + (360 / totalLetters * index);
        const angleDifference = Math.abs(rotation - letterAngle) % 360;

        let isActive = angleDifference < activeAngleRange / 2 || angleDifference > 360 - activeAngleRange / 2;
        let activeDirection = dir === 1 ? !isActive : isActive;

        letter.style.opacity = activeDirection ? op1 : op2;
        letter.style.color = activeDirection ? '' : colorFront;
    });
}



function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}
if (isMobileDevice()) {
    createLetters(" ⟩ ASHOK ⟩ ASHOK", 124, 0, 'white' , 'forwards', 'set1');
} else {
    createLetters(" ⟩ ASHOK ⟩ ASHOK", 124, 0, 'white' , 'forwards','set1');
    createLetters(" ⟨ Happy Birthday ⟨ Happy Birthday ⟨ Happy Birthday", 200, 0, 'white', 'backwards','set2');
}


function updateText(newText) {
    document.querySelectorAll('.text-container').forEach(container => {
        container.remove();
    });

    startTimeMap.clear();
    intervalMap.forEach(intervalId => clearInterval(intervalId));
    intervalMap.clear();

    if (isMobileDevice()) {
        createLetters(` ⟩ ${newText} ⟩ ${newText}`, 124, 0, 'white' , 'forwards', 'set1');
    } else {
        createLetters(` ⟩ ${newText} ⟩ ${newText}`, 124, 0, 'white' , 'forwards','set1');
        createLetters(` ⟨ ${newText} ⟨ ${newText} ⟨ ${newText}`, 200, 0, 'white', 'backwards','set2');
    }
}


/* GUI */
import { GUI } from 'https://cdn.skypack.dev/dat.gui'
const CONFIG = { shadowHeight: 24, fontSize: 26, refOpacity: 0.7, refBlur: 2, newText: 'Revolving Text'}
const CTRL = new GUI()
const UPDATE = () => {
  for (const key of Object.keys(CONFIG)) {
    document.documentElement.style.setProperty(`--${key}`, CONFIG[key])
  }
}
CTRL.add(CONFIG, 'fontSize', 14, 42, 1).name("Font Size").onChange(UPDATE)
CTRL.add(CONFIG, 'shadowHeight', 0, 264, 1).name("Height").onChange(UPDATE)
CTRL.add(CONFIG, 'refOpacity', 0, 1, 0.01).name("Reflection Opacity").onChange(UPDATE)
CTRL.add(CONFIG, 'refBlur', 0, 12, 1).name("Reflection Blur").onChange(UPDATE)
CTRL.add(CONFIG, 'newText').name("Text").onChange(updateText);
UPDATE()