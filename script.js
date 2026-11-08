// =========================================
// 1. Loading Screen Logic
// =========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    // Ensure it doesn't get stuck: force hide after 2 seconds
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }, 2000);
});

// Failsafe: ensure loader always disappears
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
    
    // Active link highlighting based on scroll position
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
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
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

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
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// =========================================
// 8. THREE.JS 3D SCENE - Floating Table with Rotating Chair
// =========================================
let scene, camera, renderer, table, chair;
let scrollProgress = 0;
let animationFrameId;

function init3DScene() {
    const canvas = document.getElementById('three-canvas');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x183D2B, 5, 30);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xF5F0E7, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xFFFDF8, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0x8B6B4F, 0.6, 10);
    pointLight1.position.set(-3, 3, 2);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x536B42, 0.4, 10);
    pointLight2.position.set(3, 2, -2);
    scene.add(pointLight2);
    
    // Create elegant table
    const tableGroup = new THREE.Group();
    
    // Table top
    const tableTopGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    const tableTopMaterial = new THREE.MeshStandardMaterial({
        color: 0x6B4B35,
        metalness: 0.3,
        roughness: 0.4
    });
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
    tableTop.position.y = 0.8;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);
    
    // Table leg
    const tableLegGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.8, 16);
    const tableLegMaterial = new THREE.MeshStandardMaterial({
        color: 0x6B4B35,
        metalness: 0.4,
        roughness: 0.3
    });
    const tableLeg = new THREE.Mesh(tableLegGeometry, tableLegMaterial);
    tableLeg.position.y = 0.4;
    tableLeg.castShadow = true;
    tableGroup.add(tableLeg);
    
    // Table base
    const tableBaseGeometry = new THREE.CylinderGeometry(0.6, 0.7, 0.1, 32);
    const tableBase = new THREE.Mesh(tableBaseGeometry, tableLegMaterial);
    tableBase.position.y = 0.05;
    tableBase.castShadow = true;
    tableBase.receiveShadow = true;
    tableGroup.add(tableBase);
    
    // Floral centerpiece
    const flowerGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * 0.3;
        const z = Math.sin(angle) * 0.3;
        
        // Flower stem
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
        const stemMaterial = new THREE.MeshStandardMaterial({
            color: 0x536B42,
            roughness: 0.6
        });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set(x, 1.05, z);
        flowerGroup.add(stem);
        
        // Flower head
        const flowerGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const flowerMaterial = new THREE.MeshStandardMaterial({
            color: i % 2 === 0 ? 0xF5F0E7 : 0x8B6B4F,
            roughness: 0.5,
            emissive: i % 2 === 0 ? 0xF5F0E7 : 0x8B6B4F,
            emissiveIntensity: 0.2
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(x, 1.3, z);
        flowerGroup.add(flower);
    }
    tableGroup.add(flowerGroup);
    
    // Candles
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 + Math.PI / 6;
        const x = Math.cos(angle) * 0.5;
        const z = Math.sin(angle) * 0.5;
        
        const candleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16);
        const candleMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFDF8,
            roughness: 0.3,
            emissive: 0xFFFDF8,
            emissiveIntensity: 0.3
        });
        const candle = new THREE.Mesh(candleGeometry, candleMaterial);
        candle.position.set(x, 1.0, z);
        candle.castShadow = true;
        tableGroup.add(candle);
        
        // Candle flame (glowing sphere)
        const flameGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const flameMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            emissive: 0xFFA500,
            emissiveIntensity: 0.8
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(x, 1.2, z);
        tableGroup.add(flame);
    }
    
    scene.add(tableGroup);
    table = tableGroup;
    
    // Create elegant chair
    const chairGroup = new THREE.Group();
    
    // Chair seat
    const seatGeometry = new THREE.BoxGeometry(0.6, 0.08, 0.6);
    const chairMaterial = new THREE.MeshStandardMaterial({
        color: 0x183D2B,
        metalness: 0.2,
        roughness: 0.5
    });
    const seat = new THREE.Mesh(seatGeometry, chairMaterial);
    seat.position.y = 0.5;
    seat.castShadow = true;
    seat.receiveShadow = true;
    chairGroup.add(seat);
    
    // Chair back
    const backGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.08);
    const back = new THREE.Mesh(backGeometry, chairMaterial);
    back.position.set(0, 0.9, -0.26);
    back.castShadow = true;
    chairGroup.add(back);
    
    // Chair legs
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x6B4B35,
        metalness: 0.3,
        roughness: 0.4
    });
    
    const legPositions = [
        [-0.25, 0.25, -0.25],
        [0.25, 0.25, -0.25],
        [-0.25, 0.25, 0.25],
        [0.25, 0.25, 0.25]
    ];
    
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.castShadow = true;
        chairGroup.add(leg);
    });
    
    // Position chair at initial orbit position
    chairGroup.position.set(2.5, 0, 0);
    chairGroup.rotation.y = -Math.PI / 2;
    scene.add(chairGroup);
    chair = chairGroup;
    
    // Ground plane for shadow
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x183D2B,
        roughness: 0.8,
        transparent: true,
        opacity: 0.3
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    if (table && chair) {
        // Smooth floating animation for table
        table.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        
        // Rotate chair based on scroll position
        const orbitRadius = 2.5;
        const angle = scrollProgress * Math.PI * 2;
        chair.position.x = Math.cos(angle) * orbitRadius;
        chair.position.z = Math.sin(angle) * orbitRadius;
        chair.rotation.y = -angle - Math.PI / 2;
        
        // Subtle camera movement based on scroll
        camera.position.y = 3 - scrollProgress * 1;
        camera.position.z = 8 - scrollProgress * 2;
        camera.lookAt(0, 0, 0);
    }
    
    renderer.render(scene, camera);
}

// Scroll-driven animation
window.addEventListener('scroll', () => {
    const heroSection = document.getElementById('home');
    const heroHeight = heroSection.offsetHeight;
    const scrollY = window.scrollY;
    
    // Calculate scroll progress (0 to 1) for hero section
    scrollProgress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
});

// =========================================
// 9. Initialize 3D Scene when DOM is ready
// =========================================
if (typeof THREE !== 'undefined') {
    // Check if WebGL is available
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
    } else {
        console.warn('WebGL not available, 3D scene disabled');
        const canvas = document.getElementById('three-canvas');
        if (canvas) canvas.style.display = 'none';
    }
} else {
    console.warn('Three.js not loaded, 3D scene disabled');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
