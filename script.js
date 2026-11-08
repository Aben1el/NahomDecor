// =========================================
// 1. Loading Screen Logic
// =========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    }, 2500); // 2.5 seconds for nice animation
});

// Failsafe
setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(() => { loader.style.display = 'none'; }, 1000);
    }
}, 4000);

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
// 8. THREE.JS - VISIBLE 3D CHAIR
// =========================================
let scene, camera, renderer, chairGroup;
let targetRotation = 0;
let currentRotation = 0;
let targetY = 0;
let currentY = 0;
let animationFrameId;

function init3DScene() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    console.log('Initializing 3D scene...');

    // Scene setup
    scene = new THREE.Scene();
    scene.background = null;
    
    // Camera setup - positioned to see the chair clearly
    camera = new THREE.PerspectiveCamera(
        45, 
        (window.innerWidth * 0.5) / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 2, 5); // Closer to see the chair
    camera.lookAt(0, 1.5, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth * 0.5, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    console.log('Renderer initialized');

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xFFFDF8, 0.7);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xFFFDF8, 1.5);
    mainLight.position.set(3, 5, 3);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const rimLight = new THREE.SpotLight(0xD4AF37, 2);
    rimLight.position.set(-3, 4, -3);
    rimLight.lookAt(0, 1.5, 0);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x536B42, 1, 10);
    fillLight.position.set(-2, 2, 2);
    scene.add(fillLight);

    console.log('Lighting setup complete');

    // --- BUILD THE CHAIR ---
    chairGroup = new THREE.Group();

    // Materials - More visible colors
    const velvetMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8B6B4F, // Warm Mocha - clearly visible
        metalness: 0.1,
        roughness: 0.85,
        sheen: 1.0,
        sheenColor: 0xFFFFFF,
        clearcoat: 0.2,
        clearcoatRoughness: 0.5
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4AF37, // Gold
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.0
    });

    // 1. Chair Seat - larger and more visible
    const seatGeo = new THREE.BoxGeometry(1.5, 0.2, 1.3);
    const seat = new THREE.Mesh(seatGeo, velvetMaterial);
    seat.position.y = 1.2;
    seat.castShadow = true;
    seat.receiveShadow = true;
    chairGroup.add(seat);

    // 2. Chair Backrest
    const backGeo = new THREE.BoxGeometry(1.5, 1.5, 0.15);
    const back = new THREE.Mesh(backGeo, velvetMaterial);
    back.position.set(0, 2.0, -0.575);
    back.castShadow = true;
    back.receiveShadow = true;
    chairGroup.add(back);

    // 3. Chair Legs
    const legPositions = [
        [-0.65, 0.6, -0.55],
        [0.65, 0.6, -0.55],
        [-0.65, 0.6, 0.55],
        [0.65, 0.6, 0.55]
    ];

    legPositions.forEach(pos => {
        const legGeo = new THREE.CylinderGeometry(0.08, 0.06, 1.2, 16);
        const leg = new THREE.Mesh(legGeo, goldMaterial);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.castShadow = true;
        leg.receiveShadow = true;
        chairGroup.add(leg);
        
        // Gold foot caps
        const capGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16);
        const cap = new THREE.Mesh(capGeo, goldMaterial);
        cap.position.set(pos[0], 0.04, pos[2]);
        chairGroup.add(cap);
    });

    // 4. Armrests
    const armrestGeo = new THREE.BoxGeometry(0.15, 0.15, 1.0);
    const leftArmrest = new THREE.Mesh(armrestGeo, velvetMaterial);
    leftArmrest.position.set(-0.825, 1.3, 0);
    leftArmrest.castShadow = true;
    chairGroup.add(leftArmrest);

    const rightArmrest = new THREE.Mesh(armrestGeo, velvetMaterial);
    rightArmrest.position.set(0.825, 1.3, 0);
    rightArmrest.castShadow = true;
    chairGroup.add(rightArmrest);

    // 5. Decorative cushion on seat
    const cushionGeo = new THREE.BoxGeometry(1.3, 0.1, 1.1);
    const cushionMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xD4AF37, // Gold cushion for contrast
        metalness: 0.2,
        roughness: 0.7,
        sheen: 0.8
    });
    const cushion = new THREE.Mesh(cush cushionGeo, cushionMaterial);
    cushion.position.y = 1.31;
    cushion.castShadow = true;
    chairGroup.add(cushion);

    // Position chair in center of canvas view
    chairGroup.position.set(0, 0, 0);
    scene.add(chairGroup);

    console.log('Chair created and added to scene');

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
    
    console.log('3D scene initialization complete');
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
        // Smooth floating animation
        const floatY = Math.sin(Date.now() * 0.001) * 0.05;
        
        // Smooth interpolation for scroll-based movement
        currentRotation += (targetRotation - currentRotation) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        // Apply transformations
        chairGroup.rotation.y = currentRotation;
        chairGroup.position.y = currentY + floatY;
        
        // Subtle tilt
        chairGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05;
        chairGroup.rotation.z = currentY * 0.05;
    }

    renderer.render(scene, camera);
}

// Scroll-driven animation
function updateScrollAnimation() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    
    // Chair rotates 360 degrees (2 PI) over the entire page
    targetRotation = scrollFraction * (Math.PI * 2);
    
    // Chair moves down slightly
    targetY = - (scrollFraction * 1.5);
}

window.addEventListener('scroll', updateScrollAnimation, { passive: true });

// =========================================
// 9. Initialize 3D Scene with Error Handling
// =========================================
function checkWebGL() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            throw new Error('WebGL not supported');
        }
        return true;
    } catch (e) {
        console.error('WebGL check failed:', e);
        const fallback = document.getElementById('webgl-fallback');
        if (fallback) fallback.style.display = 'block';
        return false;
    }
}

if (typeof THREE !== 'undefined') {
    if (checkWebGL()) {
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init3DScene);
        } else {
            init3DScene();
        }
    }
} else {
    console.error('Three.js not loaded');
}

window.addEventListener('beforeunload', () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
