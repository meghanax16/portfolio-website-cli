import React, { useEffect, useRef, useState } from 'react';
import './Terminal.css';

interface TerminalLine {
  type: 'input' | 'output';
  text: string | React.ReactNode;
}

const COMMANDS: Record<string, string | React.ReactNode> = {
  help: 'Available commands:\nhelp, whois, work, projects, contact, cat, tip, clear',
  whois: 'Hi, I am Meghana.\nEngineer | Developer | Explorer | Optimist',
  work: 'SDE Intern at Junglee Games',
  projects: 'This is one of them !! Completely built by AI, was testing out the freedom AI provides.\nSafe to say, I was not disappointed !',
  contact: (
    <>
      LinkedIn:{' '}
      <a
        href="https://www.linkedin.com/in/meghana-prasad16"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#61dafb' }}
      >
        Click Here Please
      </a>
    </>
  ),
  tip:'Try hovering over the bubbles, dots, and stars!',
  cat: ` /\\_/\\\n( o.o )\n > ^ <`,
};

export const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: 'output',
      text: "Welcome! Type `help` to get started.",
    },
    {
      type: 'output',
      text: ' ', // This will render as a blank line under the welcome text
    }
  ]);

  const [input, setInput] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouse = { x: width / 2, y: height / 2 };
    let velocityBoost = 1;
    let lastMove = Date.now();
    function handleMouse(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      velocityBoost = 2;
      lastMove = Date.now();
    }
    window.addEventListener('mousemove', handleMouse);

    // Bubble, dot, and star config
    const bubbles = Array.from({ length: 18 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 18 + Math.random() * 22,
      dx: (Math.random() - 0.5) * 1.2, // increased from 0.3
      dy: (Math.random() - 0.5) * 1.2, // increased from 0.3
      color: `rgba(173, 148, 255, 0.13)`
    }));
    const dots = Array.from({ length: 32 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2 + Math.random() * 2,
      dx: (Math.random() - 0.5) * 1.2, // increased from 0.6
      dy: (Math.random() - 0.5) * 1.2, // increased from 0.6
      color: `rgba(255,255,255,0.18)`
    }));
    const stars = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 2.5,
      twinkle: Math.random() * Math.PI * 3,
      color: `#fff`
    }));

    let running = true;
    function animate() {
      if (!ctx) return;
      // Decay velocity boost if mouse hasn't moved recently
      if (velocityBoost > 1 && Date.now() - lastMove > 300) {
        velocityBoost -= 0.05;
        if (velocityBoost < 1) velocityBoost = 1;
      }
      ctx.clearRect(0, 0, width, height);
      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#c0c0f9');
      grad.addColorStop(1, '#493687');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      // Bubbles
      for (const b of bubbles) {
        // Parallax/repel effect
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          b.x += dx / dist * 0.7 * velocityBoost;
          b.y += dy / dist * 0.7 * velocityBoost;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
        ctx.fillStyle = b.color;
        ctx.filter = 'blur(2px)';
        ctx.fill();
        ctx.filter = 'none';
        b.x += b.dx * (1 + (mouse.x - width / 2) / width * 0.2) * velocityBoost;
        b.y += b.dy * (1 + (mouse.y - height / 2) / height * 0.2) * velocityBoost;
        if (b.x < -b.r) b.x = width + b.r;
        if (b.x > width + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = height + b.r;
        if (b.y > height + b.r) b.y = -b.r;
      }
      // Dots
      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          d.x += dx / dist * 0.7 * velocityBoost;
          d.y += dy / dist * 0.7 * velocityBoost;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
        ctx.fillStyle = d.color;
        ctx.fill();
        d.x += d.dx * (1 + (mouse.x - width / 2) / width * 0.2) * velocityBoost;
        d.y += d.dy * (1 + (mouse.y - height / 2) / height * 0.2) * velocityBoost;
        if (d.x < -d.r) d.x = width + d.r;
        if (d.x > width + d.r) d.x = -d.r;
        if (d.y < -d.r) d.y = height + d.r;
        if (d.y > height + d.r) d.y = -d.r;
      }
      // Stars
      for (const s of stars) {
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let twinkleBoost = 1;
        if (dist < 100) twinkleBoost = 1.5;
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.7 + 0.3 * Math.abs(Math.sin(s.twinkle * twinkleBoost))), 0, 2 * Math.PI);
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 0.7 + 0.3 * Math.abs(Math.sin(s.twinkle * twinkleBoost));
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
        s.twinkle += 0.03 + Math.random() * 0.01;
      }
      if (running) requestAnimationFrame(animate);
    }
    animate();
    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas || !ctx) return;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', handleResize);
    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  const handleCommand = (cmd: string) => {
  const command = cmd.trim();

  if (command === 'clear') {
      setLines([
        { type: 'output', text: "Type `help` to continue." },
        { type: 'output', text: ' ' }
      ]);
      return;
    }


  let output = COMMANDS[command] || `Command not found: ${command}`;
  setLines(prev => [
    ...prev,
    { type: 'input', text: `> ${command}` },
    { type: 'output', text: output },
  ]);
};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };

  const PROMPT = 'meghanaprasad@Meghanas-Portfolio ~ %';

  return (
    <>
      <canvas ref={canvasRef} className="terminal-bg-canvas" />
      <div className="terminal-container">
        <div className="terminal-window">
          <div className="terminal-topbar">
            <div className="terminal-traffic-lights">
              <span className="traffic-light traffic-red" />
              <span className="traffic-light traffic-yellow" />
              <span className="traffic-light traffic-green" />
            </div>
          </div>
          <div className="terminal-content">
            {lines.map((line, idx) => (
              <div key={idx} className={`terminal-line terminal-${line.type}`}>
              {line.type === 'input'
                  ? <span className="terminal-prompt">{PROMPT} </span>
                  : null}
                  {line.text}
              </div>
            ))}
            <div className="terminal-input-line">
              <span className="terminal-prompt">{PROMPT} </span>
              <input
                className="terminal-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 