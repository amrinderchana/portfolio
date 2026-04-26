// ─── CURSOR ────────────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, button, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); ring.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); ring.classList.remove('hovered'); });
});

// ─── THREE.JS HERO PARTICLE MESH ────────────────────────────────────────────
(function() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 28);

  // Particle field
  const count = 2000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    const t = Math.random();
    colors[i * 3] = t * 0.6;
    colors[i * 3 + 1] = (1 - t) * 0.85 + 0.1;
    colors[i * 3 + 2] = 1.0;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.18, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true });
  scene.add(new THREE.Points(geo, mat));

  const lineCount = 180;
  const linePositions = new Float32Array(lineCount * 6);
  const lineGeo = new THREE.BufferGeometry();
  for (let i = 0; i < lineCount; i++) {
    const idx1 = Math.floor(Math.random() * count);
    const idx2 = Math.floor(Math.random() * count);
    linePositions[i * 6] = positions[idx1 * 3];
    linePositions[i * 6 + 1] = positions[idx1 * 3 + 1];
    linePositions[i * 6 + 2] = positions[idx1 * 3 + 2];
    linePositions[i * 6 + 3] = positions[idx2 * 3];
    linePositions[i * 6 + 4] = positions[idx2 * 3 + 1];
    linePositions[i * 6 + 5] = positions[idx2 * 3 + 2];
  }
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00d4b8, transparent: true, opacity: 0.08 });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  const icoGeo = new THREE.IcosahedronGeometry(5, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x00d4b8, wireframe: true, transparent: true, opacity: 0.12 });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(14, 0, -5);
  scene.add(ico);

  const icoInner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.5, 0),
    new THREE.MeshBasicMaterial({ color: 0x8855ff, wireframe: true, transparent: true, opacity: 0.08 })
  );
  icoInner.position.set(14, 0, -5);
  scene.add(icoInner);

  const torusGeo = new THREE.TorusGeometry(7, 0.05, 8, 60);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x6644dd, transparent: true, opacity: 0.15 });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(14, 0, -5);
  torus.rotation.x = Math.PI / 4;
  scene.add(torus);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let t = 0;
  function render() {
    t += 0.004;
    scene.rotation.y = mouseX * 0.06 + t * 0.05;
    scene.rotation.x = mouseY * 0.04;
    ico.rotation.y = t * 0.4;
    ico.rotation.x = t * 0.25;
    icoInner.rotation.y = -t * 0.6;
    torus.rotation.z = t * 0.3;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ─── GSAP SCROLL ANIMATIONS ─────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

gsap.to('.hero-tag', { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' });
gsap.to('.hero-name', { opacity: 1, y: 0, duration: 0.9, delay: 0.5, ease: 'power3.out' });
gsap.to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, delay: 0.7, ease: 'power3.out' });
gsap.to('.hero-btns', { opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'power3.out' });

gsap.utils.toArray('.reveal').forEach((el, i) => {
  if (el.closest('#hero')) return;
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      }
    }
  );
});

// ─── 3D CARD TILT ────────────────────────────────────────────────────────────
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
    card.style.transition = 'transform 0.4s ease';
  });
  card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
});

// ─── NAV ACTIVE STATE ─────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  let minDistance = Infinity;
  
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const distance = Math.abs(rect.top);
    
    // If section is in viewport or closest to top
    if ((rect.top <= 200 && rect.bottom >= 200) || distance < minDistance) {
      minDistance = distance;
      current = section.id;
    }
  });
  
  // Ensure contact stays active when scrolled to bottom
  const scrollBottom = window.innerHeight + window.scrollY;
  const docHeight = document.documentElement.scrollHeight;
  if (scrollBottom >= docHeight - 50) {
    current = 'contact';
  }
  
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
  });
});

// ─── DYNAMIC YEARS ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const startDate = new Date('2016-04-01');
  const currentDate = new Date();
  const years = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 365.25));

  // Update hero experience
  const heroSub = document.querySelector('.hero-sub');
  if (heroSub) {
    heroSub.textContent = heroSub.textContent.replace('8+ years', `${years}+ years`);
  }

  // Update hero stats
  const statNum = document.querySelector('.stat-num');
  if (statNum && statNum.textContent === '8+') {
    statNum.textContent = `${years}+`;
  }

  // Update about experience
  const aboutParas = document.querySelectorAll('#about p');
  aboutParas.forEach(p => {
    if (p.textContent.includes('8+ years')) {
      p.innerHTML = p.innerHTML.replace('8+ years', `${years}+ years`);
    }
  });

  // Update footer year
  const footerP = document.querySelector('footer p');
  if (footerP && footerP.textContent.includes('© 2026')) {
    footerP.textContent = footerP.textContent.replace('© 2026', `© ${currentDate.getFullYear()}`);
  }
});
