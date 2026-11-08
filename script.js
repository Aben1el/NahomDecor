// =========================================
// LOADER - GUARANTEED TO WORK
// =========================================
window.addEventListener('load', function() {
    setTimeout(function() {
        var loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hide');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1500); // 1.5 seconds - fast and elegant
});

// Failsafe - force remove loader after 3 seconds max
setTimeout(function() {
    var loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hide')) {
        loader.classList.add('hide');
        setTimeout(function() {
            loader.style.display = 'none';
        }, 500);
    }
}, 3000);

// =========================================
// 3D CHAIR - SIMPLIFIED & WORKING
// =========================================
let scene, camera, renderer, chair;
let scrollProgress = 0;

function init3D() {
    var canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(45, 0.5 * window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 4);
    camera.lookAt(0, 1, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth * 0.5, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);

    // Create Chair Group
    chair = new THREE.Group();

    // Materials
    var velvetMat = new THREE.MeshPhysicalMaterial({
        color: 0x8B6B4F,
        metalness: 0.1,
        roughness: 0.8,
        sheen: 1
    });

    var goldMat = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        metalness: 0.9,
        roughness: 0.2
    });

    // Seat
    var seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1), velvetMat);
    seat.position.y = 1;
    seat.castShadow = true;
    chair.add(seat);

    // Back
    var back = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.1), velvetMat);
    back.position.set(0, 1.7, -0.45);
    back.castShadow = true;
    chair.add(back);

    // Legs
    var legPositions = [
        [-0.5, 0.5, -0.4],
        [0.5, 0.5, -0.4],
        [-0.5, 0.5, 0.4],
        [0.5, 0.5, 0.4]
    ];

    legPositions.forEach(function(pos) {
        var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 1, 8), goldMat);
        leg.position.set(pos[0], pos[1], pos[2]);
        chair.add(leg);
    });

    // Cushion (gold for contrast)
    var cushion = new THREE.Mesh(new THREE.BoxGeometry(1, 0.08, 0.8), goldMat);
    cushion.position.y = 1.08;
    chair.add(cushion);

    chair.position.set(0, 0, 0);
    scene.add(chair);

    // Handle resize
    window.addEventListener('resize', function() {
        if (camera && renderer) {
            var isMobile = window.innerWidth <= 768;
            var width = isMobile ? window.innerWidth : window.innerWidth * 0.5;
            camera.aspect = width / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(width, window.innerHeight);
        }
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (chair) {
        // Floating animation
        chair.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        
        // Scroll rotation
        chair.rotation.y = scrollProgress * Math.PI * 2;
        chair.rotation.x = scrollProgress * 0.2;
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Scroll handler
window.addEventListener('scroll', function() {
    var maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollProgress = Math.min(window.scrollY / maxScroll, 1);
});

// Initialize 3D when page loads
if (typeof THREE !== 'undefined') {
    if (document.readyState === 'complete') {
        init3D();
    } else {
        window.addEventListener('load', init3D);
    }
}

// Navigation scroll effect
window.addEventListener('scroll', function() {
    var navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 253, 248, 0.95)';
    } else {
        navbar.style.background = 'rgba(255, 253, 248, 0.1)';
    }
});
