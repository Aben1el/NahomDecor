// =========================================
// 1. Loading Screen Logic
// =========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }, 2000);
});

setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(() => { loader.style.display = 'none'; }, 800);
    }
}, 3000);

// =========================================
// 2. Navigation Scroll Effect
// =========================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 300)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// =========================================
// 3. Mobile Menu Toggle
// =========================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// =========================================
// 4. Scroll Reveal Animations
// =========================================
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// =========================================
// 5. Subtle 3D Tilt Effect for Service Cards
// =========================================
const tiltCards = document.querySelectorAll('[data-tilt]');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// =========================================
// 6. Lightbox Functionality
// =========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(element) {
    const img = element.querySelector('img');
    lightboxImg.src = img.src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// =========================================
// 7. Smooth Scroll for Anchor Links
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// =========================================
// 8. THREE.JS: LUXURY FLOATING CHAIR (LEFT SIDE)
// =========================================
let scene, camera, renderer, chairGroup;
let targetRotation = 0;
let currentRotation = 0;
let targetY = 0;
let currentY = 0;
let animationFrameId;

function init3DScene() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    // Transparent background to let CSS background show through
    scene.background = null; 
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Position camera to look at the left side
    camera.position.set(0, 2, 6);
    camera.lookAt(0, 1, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true // Crucial for transparent background
    });
    renderer.setSize(window.innerWidth * 0.5, window.innerHeight); // Match CSS width
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- LIGHTING (Premium Studio Setup) ---
    const ambientLight = new THREE.AmbientLight(0xFFFDF8, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xFFFDF8, 1.2);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    const rimLight = new THREE.SpotLight(0xD4AF37, 1.5);
    rimLight.position.set(-5, 5, -5);
    rimLight.lookAt(0, 1, 0);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x536B42, 0.8, 10);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    // --- BUILD THE LUXURY CHAIR ---
    chairGroup = new THREE.Group();

    // Materials
    const velvetMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8B6B4F, // Warm Mocha
        metalness: 0.1,
        roughness: 0.85,
        sheen: 1.0,
        sheenColor: 0xFFFFFF,
        clearcoat: 0.1,
        clearcoatRoughness: 0.5
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4AF37, // Gold
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.0
    });

    // 1. Chair Seat
    const seatGeo = new THREE.BoxGeometry(1.2, 0.15, 1.2);
    // Round the edges visually by using a slightly smaller top box or just rely on lighting
    const seat = new THREE.Mesh(seatGeo, velvetMaterial);
    seat.position.y = 1.0;
    seat.castShadow = true;
    seat.receiveShadow = true;
    chairGroup.add(seat);

    // 2. Chair Backrest
    const backGeo = new THREE.BoxGeometry(1.2, 1.4, 0.15);
    const back = new THREE.Mesh(backGeo, velvetMaterial);
    back.position.set(0, 1.75, -0.525);
    back.castShadow = true;
    back.receiveShadow = true;
    chairGroup.add(back);

    // 3. Chair Legs (Elegant tapered cylinders)
    const legPositions = [
        [-0.5, 0.5, -0.5],
        [0.5, 0.5, -0.5],
        [-0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5]
    ];

    legPositions.forEach(pos => {
        const legGeo = new THREE.CylinderGeometry(0.06, 0.04, 1.0, 16);
        const leg = new THREE.Mesh(legGeo, goldMaterial);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.castShadow = true;
        leg.receiveShadow = true;
        chairGroup.add(leg);
        
        // Add a small gold cap at the bottom of each leg for luxury detail
        const capGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.05, 16);
        const cap = new THREE.Mesh(capGeo, goldMaterial);
        cap.position.set(pos[0], 0.025, pos[2]);
        chairGroup.add(cap);
    });

    // 4. Subtle shadow plane beneath the chair
    const shadowGeo = new THREE.CircleGeometry(1.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.3
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.05;
    shadowPlane.receiveShadow = true;
    chairGroup.add(shadowPlane);

    // Initial Position (Left side, floating)
    chairGroup.position.set(0, 1.5, 0);
    scene.add(chairGroup);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function onWindowResize() {
    if (!camera || !renderer) return;
    
    const isMobile = window.innerWidth <= 768;
    const canvasWidth = isMobile ? window.innerWidth : window.innerWidth * 0.5;
    
    camera.aspect = canvasWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasWidth, window.innerHeight);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (chairGroup) {
        // 1. Smooth floating animation (independent of scroll)
        const floatY = Math.sin(Date.now() * 0.0015) * 0.1;
        
        // 2. Scroll-driven interpolation (Lerp for smoothness)
        // Lerp factor: 0.05 gives a heavy, luxurious, smooth follow effect
        currentRotation += (targetRotation - currentRotation) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        // Apply transformations
        chairGroup.rotation.y = currentRotation;
        chairGroup.position.y = 1.5 + currentY + floatY;
        
        // Subtle tilt based on scroll for extra dynamism
        chairGroup.rotation.x = currentY * 0.1; 
        chairGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.02;
    }

    renderer.render(scene, camera);
}

// Scroll-driven animation logic
function updateScrollAnimation() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    
    // Chair rotates 270 degrees (1.5 PI) over the course of the entire page scroll
    targetRotation = scrollFraction * (Math.PI * 1.5);
    
    // Chair moves down slightly (parallax follow effect) then settles
    // Starts at 0, goes down to -0.5, creating a "following" sensation
    targetY = - (scrollFraction * 0.8);
}

window.addEventListener('scroll', updateScrollAnimation, { passive: true });

// =========================================
// 9. Initialize 3D Scene
// =========================================
if (typeof THREE !== 'undefined') {
    function isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    if (isWebGLAvailable()) {
        init3DScene();
        updateScrollAnimation(); // Set initial state
    } else {
        const canvas = document.getElementById('three-canvas');
        if (canvas) canvas.style.display = 'none';
    }
}

window.addEventListener('beforeunload', () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
