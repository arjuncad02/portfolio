// ====== particle dust background ======
(function(){
  const c = document.createElement('canvas');
  c.id = 'particles';
  document.body.insertBefore(c, document.body.firstChild);
  const ctx = c.getContext('2d');
  let w, h, particles, mouseX = 0, mouseY = 0;

  function resize(){
    w = c.width = window.innerWidth * devicePixelRatio;
    h = c.height = window.innerHeight * devicePixelRatio;
    c.style.width = window.innerWidth + 'px';
    c.style.height = window.innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  const count = Math.min(140, Math.floor(window.innerWidth / 9));
  particles = Array.from({length: count}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 0.7 + 0.3,        // depth: 0.3..1
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    r: Math.random() * 1.6 + 0.4,
    twinkle: Math.random() * Math.PI * 2,
    hue: Math.random() < 0.18 ? 'accent' : 'white'
  }));

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX * devicePixelRatio;
    mouseY = e.clientY * devicePixelRatio;
  });

  function loop(t){
    ctx.clearRect(0, 0, w, h);
    for (const p of particles){
      p.twinkle += 0.02;
      p.x += p.vx * p.z;
      p.y += p.vy * p.z;
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      // subtle mouse attraction
      const dx = mouseX - p.x, dy = mouseY - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 180 * devicePixelRatio){
        const force = (1 - dist / (180 * devicePixelRatio)) * 0.4;
        p.x += dx / dist * force;
        p.y += dy / dist * force;
      }

      const alpha = (0.35 + Math.sin(p.twinkle) * 0.3) * p.z;
      const size = p.r * p.z * devicePixelRatio;

      if (p.hue === 'accent'){
        ctx.fillStyle = `rgba(78, 161, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(78, 161, 255, 0.85)';
        ctx.shadowBlur = 8 * devicePixelRatio;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 4 * devicePixelRatio;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// ====== nav scroll state ======
const navEl = document.querySelector('nav');
if (navEl){
  const onScroll = () => navEl.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ====== scroll reveal ======
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting){
      setTimeout(() => e.target.classList.add('in'), i * 70);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ====== mobile menu drawer ======
const drawer = document.getElementById('drawer');
const menuBtn = document.querySelector('nav .menu');
if (drawer && menuBtn){
  const openDrawer = () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };
  menuBtn.addEventListener('click', openDrawer);
  drawer.querySelector('.close').addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  // close on Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
}
