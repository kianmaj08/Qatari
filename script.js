// Scroll reveal for sections
const ioSection = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if (e.isIntersecting){
      e.target.classList.add('visible');
      ioSection.unobserve(e.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>ioSection.observe(el));

// Active nav highlight
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('header nav a')];
function setActiveLink(){
  let current = sections[0]?.id;
  for (const sec of sections){
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom > 120) { current = sec.id; break; }
  }
  navLinks.forEach(a => {
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    else a.classList.remove('active');
  });
}
document.addEventListener('scroll', setActiveLink);
setActiveLink();

// Buttons micro motion
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('mouseenter', ()=> btn.style.transform='translateY(-1px)');
  btn.addEventListener('mouseleave', ()=> btn.style.transform='translateY(0)');
});

// Scroll progress
const bar = document.getElementById('scrollbar');
function updateBar(){
  const h = document.documentElement;
  const scrolled = (h.scrollTop)/(h.scrollHeight - h.clientHeight) * 100;
  bar.style.width = scrolled + '%';
}
document.addEventListener('scroll', updateBar); updateBar();

// Parallax for hero image
const parallaxEl = document.querySelector('.parallax');
if (parallaxEl){
  const depth = parseFloat(parallaxEl.dataset.depth || '12');
  document.addEventListener('mousemove', (e)=>{
    const { innerWidth:w, innerHeight:h } = window;
    const x = (e.clientX - w/2) / w;
    const y = (e.clientY - h/2) / h;
    parallaxEl.style.transform = `rotateY(${x*depth}deg) rotateX(${-y*depth}deg)`;
  });
  window.addEventListener('mouseout', ()=> parallaxEl.style.transform='rotateY(0) rotateX(0)');
}

// Tilt cards follow mouse (lightweight)
document.querySelectorAll('.tilt').forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    card.style.transform = `translateY(-4px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg)`;
  });
  card.addEventListener('mouseleave', ()=> card.style.transform='');
});

// Stagger paragraphs and list items
document.querySelectorAll('.stagger').forEach((el)=>{
  ioSection.observe(el);
});
document.querySelectorAll('.stagger-list').forEach(list=>{
  const items = list.querySelectorAll('li');
  items.forEach((li,i)=> li.style.setProperty('--i', i));
  const io = new IntersectionObserver(([entry])=>{
    if(entry.isIntersecting){ list.classList.add('visible'); io.disconnect(); }
  }, {threshold:.15});
  io.observe(list);
});
