/**
 * KineticTitle – segmentierte Wort-/Buchstaben-Animation ohne Blur.
 */
(function(){
  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
  function spring(t){ return 1 - Math.cos(t * Math.PI) * Math.exp(-2*t); }

  function animateSegments(container, mode){
    const text = container.textContent.trim();
    const segments = mode === 'chars' ? [...text] : text.split(' ');
    container.textContent = '';
    const segEls = segments.map((seg, i)=>{
      const span = document.createElement('span');
      span.className = 'kinetic-seg';
      span.textContent = seg === ' ' ? '\u00A0' : seg;
      container.appendChild(span);
      if (mode === 'words' && i < segments.length-1) {
        const space = document.createElement('span');
        space.textContent = '\u00A0';
        container.appendChild(space);
      }
      return span;
    });
    const delay = 100, duration = 460, start = performance.now();
    function tick(now){
      const elapsed = now - start;
      let done = true;
      segEls.forEach((el, i)=>{
        const local = Math.max(0, elapsed - i*delay);
        const t = Math.min(1, local / duration);
        if (t < 1) done = false;
        const e = spring(t);
        const y = (1 - e) * -26;
        const rot = (1 - e) * -1.2;
        const op = easeOutCubic(t);
        el.style.transform = `translateY(${y}px) rotate(${rot}deg)`;
        el.style.opacity = op.toFixed(3);
      });
      if (!done) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function init(){
    const els = document.querySelectorAll('.kinetic-title');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          const el = entry.target;
          io.unobserve(el);
          animateSegments(el, el.dataset.animate === 'chars' ? 'chars' : 'words');
        }
      });
    }, {threshold: 0.2});
    els.forEach(el=>io.observe(el));
  }
  document.addEventListener('DOMContentLoaded', init);
})();
