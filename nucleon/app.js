document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================
    // DATA SEEDING (MOCK DATA)
    // ==========================================

    // Products Database
    const productsData = [
        {
            id: 'prod-1',
            name: 'Dell Inspiron 15 Core i5',
            category: 'laptops',
            price: 54500,
            image: 'assets/hero_banner.png', // Fallback or placeholder
            shortDesc: 'Reliable 12th Gen Intel Core i5 laptop with 8GB RAM and 512GB SSD. Perfect for students and professionals.',
            specs: [
                'Processor: Intel Core i5-1235U (up to 4.4 GHz)',
                'Memory: 8GB DDR4 RAM (Expandable to 16GB)',
                'Storage: 512GB M.2 NVMe PCIe SSD',
                'Display: 15.6" FHD (1920x1080) Anti-glare',
                'OS: Windows 11 Home + MS Office 2021',
                'Warranty: 1 Year Dell Onsite Warranty'
            ]
        },
        {
            id: 'prod-2',
            name: 'Lenovo IdeaPad Slim 3',
            category: 'laptops',
            price: 43200,
            image: 'assets/hero_banner.png',
            shortDesc: 'Slim and lightweight AMD Ryzen 5 laptop. Features a 15.6-inch screen and excellent battery life.',
            specs: [
                'Processor: AMD Ryzen 5 5500U (up to 4.0 GHz)',
                'Memory: 8GB DDR4 Soldered RAM',
                'Storage: 512GB SSD M.2 PCIe NVMe',
                'Display: 15.6" FHD IPS 300nits',
                'OS: Windows 11 Home',
                'Battery: Up to 7 Hours typical usage',
                'Warranty: 1 Year Lenovo Premium Care'
            ]
        },
        {
            id: 'prod-3',
            name: 'Nucleon Sentinel 4-Cam Kit',
            category: 'cctv',
            price: 16500,
            image: 'assets/hero_banner.png',
            shortDesc: 'Complete 4-Camera high-definition analog CCTV surveillance package. Includes 1080p cameras, DVR, and cabling.',
            specs: [
                'Cameras: 4x Hikvision 2MP Full HD Outdoor Bullet Cameras',
                'DVR: Hikvision 4-Channel Turbo HD DVR',
                'Storage: 1TB Surveillance Grade Hard Drive',
                'Cables: 90M Coaxial Cable + Connectors',
                'Power: 4-Way Centralized Power Supply Box',
                'Mobile View: Enabled via Hik-Connect Remote App'
            ]
        },
        {
            id: 'prod-4',
            name: 'Nucleon Orbit 8-Cam IP System',
            category: 'cctv',
            price: 42000,
            image: 'assets/hero_banner.png',
            shortDesc: 'Ultra high-definition network IP camera system. Perfect for commercial shops, offices, and large estates.',
            specs: [
                'Cameras: 8x CP Plus 4MP Smart IP Dome/Bullet Cameras',
                'NVR: 8-Channel PoE Network Video Recorder',
                'Storage: 2TB WD Purple Surveillance HDD',
                'Cables: Cat6 Networking Cable (Up to 150m)',
                'Power: Power-over-Ethernet (PoE) direct feed',
                'Special: AI Human Detection, Night Vision up to 30m'
            ]
        },
        {
            id: 'prod-5',
            name: 'Nucleon Alpha Gaming PC',
            category: 'desktops',
            price: 72800,
            image: 'assets/hero_banner.png',
            shortDesc: 'Custom-built gaming rig powered by RTX 4060 and Ryzen 5. Play all modern games at high settings.',
            specs: [
                'Processor: AMD Ryzen 5 7600X (6 Cores / 12 Threads)',
                'Motherboard: MSI PRO B650M-A Wi-Fi',
                'Graphics: NVIDIA GeForce RTX 4060 8GB GDDR6',
                'Memory: 16GB DDR5 5600MHz RGB RAM',
                'Storage: 1TB NVMe M.2 SSD Gen4',
                'Cabinet: Ant Esports ICE-100 TG with ARGB fans',
                'OS: Windows 11 Pro (Unactivated)'
            ]
        },
        {
            id: 'prod-6',
            name: 'Nucleon Workstation Pro',
            category: 'desktops',
            price: 145000,
            image: 'assets/hero_banner.png',
            shortDesc: 'Extreme rendering & coding workstation featuring Core i7 and RTX 4070. Optimized for productivity.',
            specs: [
                'Processor: Intel Core i7-14700K (20 Cores / 28 Threads)',
                'Motherboard: ASUS Prime Z790-P Wi-Fi D5',
                'Graphics: NVIDIA GeForce RTX 4070 Super 12GB GDDR6X',
                'Memory: 32GB (16x2) DDR5 6000MHz Corsair Vengeance',
                'Storage: 2TB NVMe SSD WD Black SN850X',
                'Cooling: Deepcool LE520 240mm Liquid AIO',
                'Power Supply: Corsair RM750e 750W Gold Fully Modular'
            ]
        },
        {
            id: 'prod-7',
            name: 'Logitech G213 Gaming Keyboard',
            category: 'accessories',
            price: 3999,
            image: 'assets/hero_banner.png',
            shortDesc: 'Premium gaming keyboard with customizable Mech-Dome keys, RGB lighting zones, and spill resistance.',
            specs: [
                'Keys: Tactile Mech-Dome switches',
                'RGB: 5 Zone RGB Backlighting',
                'Durability: Spill-resistant design up to 60ml liquid',
                'Media: Dedicated media keys and volume roller',
                'Interface: USB 2.0 Wired connection'
            ]
        },
        {
            id: 'prod-8',
            name: 'Crucial MX500 1TB SATA SSD',
            category: 'accessories',
            price: 6800,
            image: 'assets/hero_banner.png',
            shortDesc: 'SATA III 2.5-inch Internal Solid State Drive. Instantly upgrade laptops and older desktops.',
            specs: [
                'Form Factor: 2.5-inch 7mm internal SSD',
                'Performance: Sequential reads up to 560 MB/s',
                'Interface: SATA 6.0 Gb/s',
                'Technology: Micron 3D TLC NAND',
                'Warranty: 5 Year Manufacturer Warranty'
            ]
        }
    ];

    // Mock Tracking Database
    const mockTrackDb = {
        'NC-1001': {
            customer: 'Rahul Sharma',
            device: 'Dell G15 Laptop',
            date: 'June 25, 2026',
            statusStep: 2, // 0: Placed, 1: Diagnosing, 2: Repairing, 3: Quality Check, 4: Ready
            logs: [
                { time: 'June 28, 2026 at 11:30 AM', desc: 'Motherboard IC replaced. Undergoing thermal testing.' },
                { time: 'June 26, 2026 at 02:15 PM', desc: 'Diagnostic complete: Faulty voltage controller regulator IC detected.' },
                { time: 'June 25, 2026 at 04:30 PM', desc: 'Device received at Gandhi Nagar Store & registered.' }
            ]
        },
        'NC-1002': {
            customer: 'Vikramjeet Singh',
            device: 'iMac 21.5-inch',
            date: 'June 27, 2026',
            statusStep: 4,
            logs: [
                { time: 'June 29, 2026 at 03:00 PM', desc: 'iMac fully assembled. macOS loaded. Ready for customer pickup.' },
                { time: 'June 28, 2026 at 01:10 PM', desc: 'SSD installed and fusion drive split completed successfully.' },
                { time: 'June 27, 2026 at 12:00 PM', desc: 'iMac received for screen removal and SSD replacement.' }
            ]
        }
    };

    // Wizard Service Items Mapping
    const wizardServicesData = {
        'laptop-repair': [
            { id: 'lr-screen', name: 'Laptop LED Screen Replacement', price: 3200 },
            { id: 'lr-keyboard', name: 'Laptop Keyboard Fault Repair', price: 1200 },
            { id: 'lr-battery', name: 'OEM Battery Replacement', price: 2200 },
            { id: 'lr-liquid', name: 'Liquid Damage Repair & Cleaning', price: 2500 },
            { id: 'lr-os', name: 'OS Corruption Recovery & Re-installation', price: 800 },
            { id: 'lr-hinge', name: 'Laptop Body Hinge Repair', price: 1500 }
        ],
        'pc-upgrade': [
            { id: 'up-ssd-512', name: '512GB High Speed SSD + Installation', price: 4200 },
            { id: 'up-ssd-1tb', name: '1TB NVMe M.2 Gen4 SSD + Installation', price: 7800 },
            { id: 'up-ram-8', name: '8GB DDR4 RAM Upgrade + Install', price: 2400 },
            { id: 'up-ram-16', name: '16GB DDR5 High-Performance RAM Upgrade', price: 5800 },
            { id: 'up-thermal', name: 'Full Internal Cleaning & Thermal Paste Repaste', price: 800 }
        ],
        'cctv-setup': [
            { id: 'cc-4cam', name: '4-Camera HD Setup (Includes Cables, DVR, HDD, Fitting)', price: 16500 },
            { id: 'cc-8cam', name: '8-Camera HD Setup (Includes NVR, PoE, Cables, Setup)', price: 38000 },
            { id: 'cc-bullet', name: 'Add Single Outdoor Camera (Bullet)', price: 2800 },
            { id: 'cc-nvr-config', name: 'NVR Network Remote Setup (Mobile Live View)', price: 1500 }
        ],
        'pc-assembly': [
            { id: 'as-budget', name: 'Standard Office PC Assembly & Diagnostic', price: 1200 },
            { id: 'as-gaming', name: 'Advanced Gaming PC Build with Liquid Cool Setup', price: 2500 },
            { id: 'as-os-load', name: 'OS Loading, Drivers, & Stress Testing Package', price: 800 }
        ]
    };


    // ==========================================
    // DYNAMIC PARTICLE SYSTEM BACKGROUND
    // ==========================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const maxParticles = 60;
    const connectionDist = 110;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            // Atomic nucleonic glow colors
            this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.6)' : 'rgba(157, 78, 237, 0.6)';
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    function initParticles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < connectionDist) {
                    const alpha = (1 - dist / connectionDist) * 0.15;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });


    // ==========================================
    // SCROLL INTERACTIONS & NAVIGATION MENU
    // ==========================================
    const header = document.getElementById('site-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Scrolled Header Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Spy
        let currentSection = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= (secTop - 150)) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Hamburger Toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav item
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // ==========================================
    // INTERACTIVE PC CONFIGURATOR (BUILDER)
    // ==========================================
    const builderContainer = document.getElementById('pc-builder');
    const builderTotalEl = document.getElementById('builder-total-price');
    const optionButtons = document.querySelectorAll('.option-btn');
    const requestBuildBtn = document.getElementById('btn-request-build');
    
    // Core default prices and Cabinet + PSU baseline
    let buildConfig = {
        cpu: { name: 'Intel Core i5-13400', price: 18500 },
        gpu: { name: 'NVIDIA RTX 4060 8GB', price: 29500 },
        ram: { name: '16GB DDR5 5600MHz RGB', price: 5500 },
        storage: { name: '1TB NVMe Gen4 SSD', price: 6500 },
        cooler: { name: 'Stock Air Cooler', price: 0 },
        cabinet: { name: 'Nucleon Standard Package (Cabinet + 650W PSU)', price: 10000 } // Fixed baseline package
    };

    function recalculatePCBuilderPrice() {
        let total = 0;
        for (let component in buildConfig) {
            total += buildConfig[component].price;
            
            // Update Summary visual text
            const summaryLine = document.getElementById(`sum-${component}`);
            if (summaryLine) {
                const valEl = summaryLine.querySelector('.spec-val');
                valEl.textContent = buildConfig[component].name;
            }
        }
        builderTotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
        return total;
    }

    optionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const parentGroup = btn.closest('.builder-group');
            const componentType = parentGroup.getAttribute('data-component');
            
            // Clear current active sibling
            parentGroup.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
            
            // Set active
            btn.classList.add('active');
            
            // Save state
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'));
            
            buildConfig[componentType] = { name, price };
            recalculatePCBuilderPrice();
        });
    });

    // Handle "Request Custom Build" CTA click
    requestBuildBtn.addEventListener('click', () => {
        // Build summary spec text block
        let specString = `REQUESTED CUSTOM PC ASSEMBLY CONFIGURATION:\n`;
        for (let component in buildConfig) {
            specString += `- ${component.toUpperCase()}: ${buildConfig[component].name} (Estimated Component Value: ₹${buildConfig[component].price.toLocaleString('en-IN')})\n`;
        }
        specString += `Estimated Hardware Total: ${builderTotalEl.textContent}\n`;
        
        // Auto transition Booking scheduler
        const wizardCta = document.querySelector('.cat-select-card[data-category="pc-assembly"]');
        if (wizardCta) {
            // Select category card
            document.querySelectorAll('.cat-select-card').forEach(c => c.classList.remove('active'));
            wizardCta.classList.add('active');
            wizardState.category = 'pc-assembly';
            
            // Enable next step
            document.getElementById('wizard-to-step-2').disabled = false;
            
            // Fill step 3 textarea notes
            document.getElementById('b-notes').value = specString;
            
            // Move wizard to category selection
            updateWizardCategoryView();
            
            // Smooth scroll to booking
            document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
        }
    });

    recalculatePCBuilderPrice(); // Initial calculation


    // ==========================================
    // PRODUCT GALLERY & MODAL DETAIL WIDGET
    // ==========================================
    const productsGrid = document.getElementById('products-grid');
    const filtersContainer = document.getElementById('products-filters');
    const modal = document.getElementById('product-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');

    function renderProducts(categoryFilter = 'all') {
        productsGrid.innerHTML = '';
        
        const filtered = productsData.filter(prod => {
            return categoryFilter === 'all' || prod.category === categoryFilter;
        });

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card glass hover-glow fade-in';
            card.innerHTML = `
                <div class="product-img-wrapper">
                    <i data-lucide="package" class="product-placeholder-icon"></i>
                    <span class="product-badge">${p.category.toUpperCase()}</span>
                </div>
                <div class="product-card-body">
                    <div class="product-card-header">
                        <span class="product-category">${p.category}</span>
                        <h4 class="product-card-title">${p.name}</h4>
                    </div>
                    <p class="product-desc-short">${p.shortDesc}</p>
                    <div class="product-footer">
                        <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
                        <button class="product-view-btn" data-id="${p.id}" aria-label="View specifications">
                            <i data-lucide="eye"></i>
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });
        
        // Re-run lucide to render dynamic card icons
        lucide.createIcons();
        
        // Modal buttons trigger binding
        document.querySelectorAll('.product-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = btn.getAttribute('data-id');
                openProductModal(prodId);
            });
        });
    }

    // Filters event
    filtersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const category = e.target.getAttribute('data-category');
            renderProducts(category);
        }
    });

    function openProductModal(id) {
        const prod = productsData.find(p => p.id === id);
        if (!prod) return;

        modalBody.innerHTML = `
            <div class="modal-grid">
                <div class="modal-img-container">
                    <i data-lucide="package" class="modal-placeholder-icon"></i>
                </div>
                
                <div class="modal-info-col">
                    <div>
                        <span class="product-category">${prod.category.toUpperCase()}</span>
                        <h3 class="modal-title">${prod.name}</h3>
                        <div class="modal-price">₹${prod.price.toLocaleString('en-IN')}</div>
                        
                        <div class="modal-specs-list">
                            <h4>Technical Specifications:</h4>
                            <ul>
                                ${prod.specs.map(spec => `<li><i data-lucide="chevron-right"></i> ${spec}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <button class="btn btn-primary btn-full" id="modal-inquire-btn" data-prodname="${prod.name}">
                        <span>Inquire About Product</span>
                        <i data-lucide="message-square"></i>
                    </button>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        lucide.createIcons();

        // Modal inquiry click event
        document.getElementById('modal-inquire-btn').addEventListener('click', (e) => {
            const prodName = e.currentTarget.getAttribute('data-prodname');
            // Auto open contact page
            document.getElementById('c-subject').value = 'Product Inquiry';
            document.getElementById('c-message').value = `Hi Nucleon Infotech,\nI am interested in purchasing the product "${prodName}". Please provide availability and payment terms.`;
            
            modal.classList.add('hidden');
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    }

    modalClose.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    // Initial render
    renderProducts();


    // ==========================================
    // DYNAMIC INTERACTIVE SCHEDULE WIZARD
    // ==========================================
    let wizardState = {
        category: '',
        selectedIssues: [],
        baseFee: 300,
        issuesFee: 0,
        totalQuote: 300
    };

    const catSelectCards = document.querySelectorAll('.cat-select-card');
    const toStep2Btn = document.getElementById('wizard-to-step-2');
    const toStep3Btn = document.getElementById('wizard-to-step-3');
    const backTo1Btn = document.getElementById('wizard-back-to-1');
    const backTo2Btn = document.getElementById('wizard-back-to-2');
    const restartBookingBtn = document.getElementById('btn-restart-booking');
    const bookingForm = document.getElementById('booking-form');
    
    const panelStep1 = document.getElementById('panel-step-1');
    const panelStep2 = document.getElementById('panel-step-2');
    const panelStep3 = document.getElementById('panel-step-3');
    const panelStep4 = document.getElementById('panel-step-4');

    const progStep1 = document.getElementById('prog-step-1');
    const progStep2 = document.getElementById('prog-step-2');
    const progStep3 = document.getElementById('prog-step-3');
    const progStep4 = document.getElementById('prog-step-4');

    const issuesContainer = document.getElementById('issues-list-container');
    const step2Heading = document.getElementById('step-2-heading');

    // Selection of Service Category card
    catSelectCards.forEach(card => {
        card.addEventListener('click', () => {
            catSelectCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            wizardState.category = card.getAttribute('data-category');
            toStep2Btn.disabled = false;
        });
    });

    // Step navigation transitions
    toStep2Btn.addEventListener('click', () => {
        updateWizardCategoryView();
        
        panelStep1.classList.remove('active');
        panelStep2.classList.add('active');
        progStep2.classList.add('active');
        progStep1.classList.add('completed');
        progStep1.classList.remove('active');
    });

    function updateWizardCategoryView() {
        const cat = wizardState.category;
        
        // Customize heading
        if (cat === 'laptop-repair') step2Heading.textContent = 'Select Laptop Problems';
        else if (cat === 'pc-upgrade') step2Heading.textContent = 'Select Performance Upgrades';
        else if (cat === 'cctv-setup') step2Heading.textContent = 'Select Security Requirements';
        else if (cat === 'pc-assembly') step2Heading.textContent = 'Select System Assembly Services';

        // Load specific checkboxes
        issuesContainer.innerHTML = '';
        wizardState.selectedIssues = [];
        wizardState.issuesFee = 0;
        recalculateQuoteSum();

        const issuesList = wizardServicesData[cat];
        issuesList.forEach(issue => {
            const label = document.createElement('label');
            label.className = 'issue-checkbox-label';
            label.setAttribute('for', issue.id);
            label.innerHTML = `
                <div class="issue-check-left">
                    <input type="checkbox" id="${issue.id}" data-price="${issue.price}" data-name="${issue.name}">
                    <span class="issue-label-text">${issue.name}</span>
                </div>
                <span class="issue-price-tag">₹${issue.price.toLocaleString('en-IN')}</span>
            `;
            issuesContainer.appendChild(label);

            const chk = label.querySelector('input');
            chk.addEventListener('change', () => {
                if (chk.checked) {
                    label.classList.add('checked');
                    wizardState.selectedIssues.push({ name: issue.name, price: issue.price });
                } else {
                    label.classList.remove('checked');
                    wizardState.selectedIssues = wizardState.selectedIssues.filter(i => i.name !== issue.name);
                }
                
                // Re-calculate
                wizardState.issuesFee = wizardState.selectedIssues.reduce((sum, item) => sum + item.price, 0);
                recalculateQuoteSum();
            });
        });
    }

    function recalculateQuoteSum() {
        const total = wizardState.baseFee + wizardState.issuesFee;
        wizardState.totalQuote = total;

        document.getElementById('qc-base-fee').textContent = `₹${wizardState.baseFee}`;
        document.getElementById('qc-issue-fee').textContent = `₹${wizardState.issuesFee.toLocaleString('en-IN')}`;
        document.getElementById('qc-total-val').textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    backTo1Btn.addEventListener('click', () => {
        panelStep2.classList.remove('active');
        panelStep1.classList.add('active');
        progStep2.classList.remove('active');
        progStep1.classList.remove('completed');
        progStep1.classList.add('active');
    });

    toStep3Btn.addEventListener('click', () => {
        panelStep2.classList.remove('active');
        panelStep3.classList.add('active');
        progStep3.classList.add('active');
        progStep2.classList.add('completed');
        progStep2.classList.remove('active');
    });

    backTo2Btn.addEventListener('click', () => {
        panelStep3.classList.remove('active');
        panelStep2.classList.add('active');
        progStep3.classList.remove('active');
        progStep2.classList.remove('completed');
        progStep2.classList.add('active');
    });

    // Form Submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Gather details
        const name = document.getElementById('b-name').value;
        const phone = document.getElementById('b-phone').value;
        const email = document.getElementById('b-email').value;
        const date = document.getElementById('b-date').value;
        const time = document.getElementById('b-time').value;
        const mode = document.getElementById('b-service-mode').value;
        const notes = document.getElementById('b-notes').value;

        // Generate custom order id
        const orderIndex = Math.floor(Math.random() * 9000) + 1000;
        const newOrderId = `NC-${orderIndex}`;

        // Create booking object
        const booking = {
            orderId: newOrderId,
            customer: name,
            phone: phone,
            email: email,
            date: date,
            time: time,
            mode: mode,
            notes: notes,
            category: wizardState.category,
            totalQuote: wizardState.totalQuote,
            issues: wizardState.selectedIssues,
            statusStep: 0, // Order Placed
            logs: [
                { time: new Date().toLocaleString(), desc: 'Appointment booked successfully. Order registered.' }
            ]
        };

        // Save to LocalStorage
        let currentBookings = JSON.parse(localStorage.getItem('nucleon_bookings') || '[]');
        currentBookings.push(booking);
        localStorage.setItem('nucleon_bookings', JSON.stringify(currentBookings));

        // Populate receipt step
        document.getElementById('rec-order-id').textContent = newOrderId;
        
        let catText = 'Laptop Repair';
        if (wizardState.category === 'pc-upgrade') catText = 'SSD/RAM Upgrade';
        else if (wizardState.category === 'cctv-setup') catText = 'CCTV Setup';
        else if (wizardState.category === 'pc-assembly') catText = 'PC Custom Rig';
        
        document.getElementById('rec-category').textContent = catText;
        document.getElementById('rec-datetime').textContent = `${date} at ${time}`;
        document.getElementById('rec-quote').textContent = `₹${wizardState.totalQuote.toLocaleString('en-IN')}`;

        // Success transition
        panelStep3.classList.remove('active');
        panelStep4.classList.add('active');
        progStep4.classList.add('active');
        progStep3.classList.add('completed');
        progStep3.classList.remove('active');

        // Reset form inputs
        bookingForm.reset();
    });

    restartBookingBtn.addEventListener('click', () => {
        panelStep4.classList.remove('active');
        panelStep1.classList.add('active');
        
        progStep1.classList.add('active');
        progStep1.classList.remove('completed');
        progStep2.classList.remove('active', 'completed');
        progStep3.classList.remove('active', 'completed');
        progStep4.classList.remove('active');

        toStep2Btn.disabled = true;
        catSelectCards.forEach(c => c.classList.remove('active'));
        
        wizardState = {
            category: '',
            selectedIssues: [],
            baseFee: 300,
            issuesFee: 0,
            totalQuote: 300
        };
    });


    // ==========================================
    // REPAIR STATUS TRACKER ENGINE
    // ==========================================
    const trackerForm = document.getElementById('tracker-form');
    const trackerResult = document.getElementById('tracker-result');
    const trackerInput = document.getElementById('tracker-order-id');

    trackerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchId = trackerInput.value.trim().toUpperCase();

        // 1. Check local mock DB
        let order = mockTrackDb[searchId];
        
        // 2. Check LocalStorage
        if (!order) {
            const bookings = JSON.parse(localStorage.getItem('nucleon_bookings') || '[]');
            const foundBooking = bookings.find(b => b.orderId === searchId);
            if (foundBooking) {
                order = foundBooking;
            }
        }

        if (order) {
            renderOrderTrackResult(searchId, order);
        } else {
            trackerResult.innerHTML = `
                <div class="text-center" style="padding: 2rem 0;">
                    <i data-lucide="alert-triangle" style="width: 48px; height: 48px; color: var(--accent-purple); margin-bottom: 1rem;"></i>
                    <h4>Order ID Not Found</h4>
                    <p style="color: var(--text-secondary); max-width: 400px; margin: 0.5rem auto;">We couldn't locate Order "${searchId}". Please check the spelling or contact support at Gandhi Nagar store.</p>
                </div>
            `;
            trackerResult.classList.remove('hidden');
            lucide.createIcons();
        }
    });

    function renderOrderTrackResult(id, order) {
        // Steps list
        const steps = ['Order Placed', 'Diagnosis', 'Repairing', 'Quality Testing', 'Ready For Pick'];
        const activeStep = order.statusStep;

        // Calculate progress bar line fill width
        const fillPercent = (activeStep / (steps.length - 1)) * 100;

        let logsHtml = '';
        order.logs.forEach(log => {
            logsHtml += `
                <li class="tr-log-item active">
                    <span class="tr-log-bullet"></span>
                    <div class="tr-log-content">
                        <span class="tr-log-time">${log.time}</span>
                        <span class="tr-log-desc">${log.desc}</span>
                    </div>
                </li>
            `;
        });

        let stepsHtml = '';
        steps.forEach((step, index) => {
            let stateClass = '';
            let iconMarkup = '<i data-lucide="circle"></i>';
            
            if (index === activeStep) {
                stateClass = 'active';
                iconMarkup = '<i data-lucide="loader-2" class="spin"></i>';
            } else if (index < activeStep) {
                stateClass = 'completed';
                iconMarkup = '<i data-lucide="check-circle-2"></i>';
            }
            
            stepsHtml += `
                <div class="tp-step ${stateClass}">
                    <div class="tp-icon">${iconMarkup}</div>
                    <span class="tp-label">${step}</span>
                </div>
            `;
        });

        trackerResult.innerHTML = `
            <div class="tr-meta">
                <div class="tr-meta-item">Order ID: <span class="tr-meta-val highlight-cyan">${id}</span></div>
                <div class="tr-meta-item">Customer: <span class="tr-meta-val">${order.customer}</span></div>
                <div class="tr-meta-item">Device: <span class="tr-meta-val">${order.device || 'PC Setup'}</span></div>
                <div class="tr-meta-item">Registered: <span class="tr-meta-val">${order.date}</span></div>
            </div>

            <div class="tracker-progress-bar">
                <div class="progress-line-fill" style="width: ${fillPercent}%;"></div>
                ${stepsHtml}
            </div>

            <div class="tr-details">
                <h4>Status Timeline Logs</h4>
                <ul class="tr-log-list">
                    ${logsHtml}
                </ul>
            </div>
        `;

        trackerResult.classList.remove('hidden');
        lucide.createIcons();

        // Add class spin styling manually for the loading icons
        const spinIcon = trackerResult.querySelector('.spin');
        if (spinIcon) {
            spinIcon.style.animation = 'spin 1.5s linear infinite';
            // Add spin keyframe to css styles
            if (!document.getElementById('spin-keyframe-style')) {
                const styleSheet = document.createElement("style");
                styleSheet.id = 'spin-keyframe-style';
                styleSheet.innerText = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(styleSheet);
            }
        }
    }


    // ==========================================
    // REVIEWS SLIDER CAROUSEL
    // ==========================================
    const reviews = document.querySelectorAll('.review-slide');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let reviewIndex = 0;

    function showReview(index) {
        reviews.forEach(r => r.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        reviews[index].classList.add('active');
        dots[index].classList.add('active');
    }

    prevBtn.addEventListener('click', () => {
        reviewIndex--;
        if (reviewIndex < 0) reviewIndex = reviews.length - 1;
        showReview(reviewIndex);
    });

    nextBtn.addEventListener('click', () => {
        reviewIndex++;
        if (reviewIndex >= reviews.length) reviewIndex = 0;
        showReview(reviewIndex);
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            reviewIndex = idx;
            showReview(reviewIndex);
        });
    });


    // ==========================================
    // FAQ INTERACTIVE ACCORDION
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(f => f.classList.remove('active'));
            
            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });


    // ==========================================
    // CONTACT FORM INTERACTION
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-form-success');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide form fields
        contactForm.classList.add('hidden');
        // Show success screen
        contactSuccess.classList.remove('hidden');

        // Optional: clear inputs
        contactForm.reset();
    });


    // ==========================================
    // SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
});
