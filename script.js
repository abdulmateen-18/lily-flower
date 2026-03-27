"use strict";
// ============================================================
// LILY GIFT — script.ts
// Handles: bloom animation, particles, parallax, tab re-bloom
// ============================================================
// ── Constants ──────────────────────────────────────────────
const BLOOM_TOTAL_DURATION = 3800; // ms — full bloom sequence
const HEADING_DELAY = 400; // ms — heading fades in first (before petals)
const STAMEN_DELAY = 2800; // ms — stamens appear after petals mostly open
const MESSAGE_DELAY = 3600; // ms — message fades in after full bloom
const PARTICLE_COUNT = 80;
const PARTICLE_COLORS = [
    'rgba(220, 200, 210, alpha)',
    'rgba(200, 160, 180, alpha)',
    'rgba(240, 220, 200, alpha)',
    'rgba(180, 140, 160, alpha)',
    'rgba(255, 240, 230, alpha)',
];
// ── State ──────────────────────────────────────────────────
let particles = [];
let animFrame = 0;
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let parallaxActive = false;
let bloomTimeouts = [];
// ── DOM refs ───────────────────────────────────────────────
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const flowerWrap = document.getElementById('flowerWrap');
const heading = document.getElementById('heading');
const messageWrap = document.getElementById('messageWrap');
const centerGlow = document.getElementById('centerGlow');
const stamens = document.getElementById('stamens');
const lily = document.getElementById('lily');
const petalGroups = document.querySelectorAll('.petal-group');
// ── PARTICLE SYSTEM ────────────────────────────────────────
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}
function createParticle() {
    const colorTemplate = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    const alpha = randomBetween(0.05, 0.35);
    return {
        x: randomBetween(0, canvas.width),
        y: randomBetween(0, canvas.height),
        vx: randomBetween(-0.18, 0.18),
        vy: randomBetween(-0.28, -0.05),
        radius: randomBetween(0.8, 2.6),
        alpha: alpha,
        alphaSpeed: randomBetween(0.001, 0.004) * (Math.random() > 0.5 ? 1 : -1),
        color: colorTemplate.replace('alpha', String(alpha)),
    };
}
function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
}
function updateParticle(p) {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha += p.alphaSpeed;
    // Wrap horizontally
    if (p.x < -5)
        p.x = canvas.width + 5;
    if (p.x > canvas.width + 5)
        p.x = -5;
    // Reset if floated off top
    if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = randomBetween(0, canvas.width);
    }
    // Clamp alpha and reverse direction
    if (p.alpha <= 0.02 || p.alpha >= 0.38) {
        p.alphaSpeed *= -1;
        p.alpha = Math.max(0.02, Math.min(0.38, p.alpha));
    }
}
function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    // Soft glow via shadow
    ctx.shadowBlur = p.radius * 4;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.alpha})`);
    ctx.fill();
    ctx.shadowBlur = 0;
}
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        updateParticle(p);
        drawParticle(p);
    });
    animFrame = requestAnimationFrame(animateParticles);
}
// ── BLOOM SEQUENCE ─────────────────────────────────────────
function clearBloom() {
    // Cancel any pending timeouts from a previous bloom
    bloomTimeouts.forEach(clearTimeout);
    bloomTimeouts = [];
    // Reset all animated elements
    heading.classList.remove('visible');
    messageWrap.classList.remove('visible');
    centerGlow.classList.remove('visible');
    stamens.classList.remove('visible');
    lily.classList.remove('breathing');
    petalGroups.forEach(pg => {
        pg.classList.remove('open');
        // Force reflow so CSS animation restarts cleanly
        void pg.getBoundingClientRect();
    });
}
function startBloom() {
    clearBloom();
    // 1. Heading fades in first — gentle intro
    const t1 = setTimeout(() => {
        heading.classList.add('visible');
    }, HEADING_DELAY);
    bloomTimeouts.push(t1);
    // 2. Petals open one by one (CSS handles stagger via --delay vars)
    const t2 = setTimeout(() => {
        petalGroups.forEach(pg => {
            pg.classList.add('open');
        });
    }, 900);
    bloomTimeouts.push(t2);
    // 3. Center glow appears
    const t3 = setTimeout(() => {
        centerGlow.classList.add('visible');
    }, 2000);
    bloomTimeouts.push(t3);
    // 4. Stamens rise in
    const t4 = setTimeout(() => {
        stamens.classList.add('visible');
    }, STAMEN_DELAY);
    bloomTimeouts.push(t4);
    // 5. Message fades in
    const t5 = setTimeout(() => {
        messageWrap.classList.add('visible');
    }, MESSAGE_DELAY);
    bloomTimeouts.push(t5);
    // 6. Enable breathing pulse once fully bloomed
    const t6 = setTimeout(() => {
        lily.classList.add('breathing');
        parallaxActive = true;
    }, BLOOM_TOTAL_DURATION);
    bloomTimeouts.push(t6);
}
// ── PARALLAX ───────────────────────────────────────────────
function handleMouseMove(e) {
    if (!parallaxActive)
        return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    // Normalize: -1 to 1
    targetX = (e.clientX - cx) / cx;
    targetY = (e.clientY - cy) / cy;
}
function updateParallax() {
    // Smooth lerp toward target
    mouseX += (targetX - mouseX) * 0.06;
    mouseY += (targetY - mouseY) * 0.06;
    const maxShift = 18; // px
    const tx = mouseX * maxShift;
    const ty = mouseY * maxShift;
    const tz = Math.abs(mouseX * mouseY) * 6; // slight z-depth scale
    flowerWrap.style.transform = `translate(${tx}px, ${ty}px) scale(${1 + tz * 0.005})`;
    requestAnimationFrame(updateParallax);
}
// ── TAB VISIBILITY ─────────────────────────────────────────
function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
        // Re-bloom from scratch when user returns to tab
        parallaxActive = false;
        mouseX = 0;
        mouseY = 0;
        targetX = 0;
        targetY = 0;
        flowerWrap.style.transform = '';
        startBloom();
    }
}
// ── TOUCH PARALLAX (mobile) ────────────────────────────────
function handleTouchMove(e) {
    if (!parallaxActive)
        return;
    const touch = e.touches[0];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetX = (touch.clientX - cx) / cx;
    targetY = (touch.clientY - cy) / cy;
}
// ── INIT ───────────────────────────────────────────────────
function init() {
    // Canvas setup
    resizeCanvas();
    initParticles();
    animateParticles();
    // Start the bloom on load
    startBloom();
    // Parallax loop
    updateParallax();
    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
}
// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
}
else {
    init();
}
//# sourceMappingURL=script.js.map