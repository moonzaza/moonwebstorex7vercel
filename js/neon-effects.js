(function() {
    const neonCSS = `
        body { position: relative; overflow-x: hidden; }
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: -2;
            background: radial-gradient(circle at top left, rgba(99, 102, 241, 0.18), transparent 20%),
                        radial-gradient(circle at bottom right, rgba(34, 211, 238, 0.16), transparent 22%),
                        radial-gradient(circle at center, rgba(168, 85, 247, 0.08), transparent 30%);
            mix-blend-mode: screen;
            opacity: 0.95;
        }
        body::after {
            content: '';
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: -1;
            background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
            background-size: 100% 40px;
            opacity: 0.15;
            mix-blend-mode: overlay;
        }
        #neonParticlesCanvas {
            position: fixed;
            inset: 0;
            z-index: -3;
            pointer-events: none;
            opacity: 0.85;
            transition: opacity 0.3s ease;
        }
        .neon-glow {
            text-shadow: 0 0 18px rgba(56, 189, 248, 0.45), 0 0 32px rgba(99, 102, 241, 0.28);
        }
        .neon-hover, .btn-primary, .btn-secondary, .glass-card {
            transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
        }
        .neon-hover:hover {
            box-shadow: 0 0 30px rgba(56, 189, 248, 0.22), inset 0 0 20px rgba(56, 189, 248, 0.08);
            transform: translateY(-1px);
        }
        .neon-button {
            box-shadow: 0 0 24px rgba(56, 189, 248, 0.2);
        }
        .neon-card {
            border-color: rgba(56, 189, 248, 0.22) !important;
            box-shadow: 0 24px 50px rgba(56, 189, 248, 0.1) !important;
        }
    `;

    const style = document.createElement('style');
    style.id = 'neonEffectsStyle';
    style.textContent = neonCSS;
    document.head.appendChild(style);

    function applyNeonClasses() {
        document.querySelectorAll('h1, h2, h3, h4, .hero-badge, .tag-pill').forEach(el => el.classList.add('neon-glow'));
        document.querySelectorAll('.btn-primary, .btn-secondary, button, .sidebar-link, .nav-panel button, .menu-toggle, .cart-badge').forEach(el => el.classList.add('neon-hover', 'neon-button'));
        document.querySelectorAll('.glass-card, .stat-card, .modal-card, .modal-content, .plans-section').forEach(el => el.classList.add('neon-card'));
    }

    function createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'neonParticlesCanvas';
        document.body.prepend(canvas);
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let particles = [];
        let mouse = { x: width / 2, y: height / 2 };

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        function createParticle() {
            return {
                x: random(0, width),
                y: random(0, height),
                radius: random(0.8, 2.5),
                speedX: random(-0.2, 0.2),
                speedY: random(-0.1, 0.1),
                hue: random(185, 260),
                alpha: random(0.15, 0.55),
                drift: random(0.2, 0.8)
            };
        }

        function initParticles() {
            const targetCount = width < 768 ? 70 : 140;
            particles = Array.from({ length: targetCount }, createParticle);
        }

        function drawParticle(p) {
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 12);
            gradient.addColorStop(0, `hsla(${p.hue}, 95%, 75%, ${p.alpha})`);
            gradient.addColorStop(1, 'hsla(220, 95%, 45%, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 8, 0, Math.PI * 2);
            ctx.fill();
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 90%, 70%, ${0.12 - dist / 130 * 0.1})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
        }

        function updateParticles() {
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'lighter';
            particles.forEach(p => {
                p.x += p.speedX + Math.sin(p.drift + p.y * 0.002) * 0.2;
                p.y += p.speedY + Math.cos(p.drift + p.x * 0.002) * 0.2;
                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;
                if (Math.random() < 0.002) {
                    p.alpha = random(0.2, 0.65);
                }
                drawParticle(p);
            });
            connectParticles();
            requestAnimationFrame(updateParticles);
        }

        function setupEvents() {
            window.addEventListener('resize', () => {
                resize();
                initParticles();
            });
            window.addEventListener('mousemove', (event) => {
                mouse.x = event.clientX;
                mouse.y = event.clientY;
            });
        }

        resize();
        initParticles();
        setupEvents();
        updateParticles();
    }

    document.addEventListener('DOMContentLoaded', () => {
        applyNeonClasses();
        createCanvas();
    });
})();
