const menuToggle=document.getElementById('menuToggle');const navLinks=document.getElementById('navLinks');menuToggle.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.textContent=open?'✕':'☰'});document.querySelectorAll('.nav-links a').forEach(link=>link.addEventListener('click',()=>{navLinks.classList.remove('open');menuToggle.textContent='☰';menuToggle.setAttribute('aria-expanded','false')}));const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));document.querySelectorAll('.faq-item button').forEach(button=>button.addEventListener('click',()=>button.parentElement.classList.toggle('active')));document.getElementById('contactForm').addEventListener('submit', async event => {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  let status = document.getElementById('contactStatus');
  if (!status) {
    status = document.createElement('p');
    status.id = 'contactStatus';
    status.setAttribute('role', 'status');
    status.style.marginTop = '14px';
    form.appendChild(status);
  }

  if (!name || !email || !message) {
    status.textContent = 'Please fill in all fields.';
    return;
  }

  button.disabled = true;
  button.style.opacity = '0.65';
  status.textContent = 'Sending message...';

  try {
    const response = await fetch("/api/contact", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to send message.');
    }

    status.textContent = '✓ Message sent successfully. Thank you!';
    form.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      status.textContent = error.message || 'Something went wrong.';
    }
    finally {
    button.disabled = false;
    button.style.opacity = '1';
  }
});document.getElementById('year').textContent=new Date().getFullYear();


// Smooth 3D pointer movement for the first hero image.
const heroPortrait=document.getElementById('heroPortrait');
if(heroPortrait && window.matchMedia('(pointer:fine)').matches){
  const heroVisual=heroPortrait.closest('.hero-visual');
  heroVisual.addEventListener('mousemove',event=>{
    const rect=heroVisual.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    heroPortrait.style.animationPlayState='paused';
    heroPortrait.style.transform=`rotate(${4+x*7}deg) rotateY(${x*14}deg) rotateX(${-y*10}deg) translateY(${y*8}px)`;
  });
  heroVisual.addEventListener('mouseleave',()=>{
    heroPortrait.style.transform='';
    heroPortrait.style.animationPlayState='running';
  });
}


// Light and dark mode switch. The selected theme is saved in the browser.
const themeToggle=document.getElementById('themeToggle');
const savedTheme=localStorage.getItem('jaswanth-portfolio-theme');
const systemPrefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme(theme){
  const dark=theme==='dark';
  document.body.classList.toggle('dark-mode',dark);
  themeToggle.setAttribute('aria-pressed',String(dark));
  themeToggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
  themeToggle.title=dark?'Light mode':'Dark mode';
}

applyTheme(savedTheme || (systemPrefersDark?'dark':'light'));

themeToggle.addEventListener('click',()=>{
  const nextTheme=document.body.classList.contains('dark-mode')?'light':'dark';
  applyTheme(nextTheme);
  localStorage.setItem('jaswanth-portfolio-theme',nextTheme);
});
