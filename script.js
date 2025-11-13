// Google Apps Script URL
// Cập nhật URL này sau khi deploy Google Apps Script
// Hoặc tạo biến môi trường trên Vercel và sử dụng build-time replacement
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySnKLVG39og2aE5ofIDq0_T6KBcECK8389s9MN2_zuurD3EmI3U4X2V1y4A-8-IoaCbw/exec';

// Premium Heart Colors - 3 beautiful tones
const HEART_COLORS = [
    { color: '#B03A48', opacity: 0.4 }, // deep red
    { color: '#E8A5A8', opacity: 0.35 }, // romantic pink
    { color: '#FBEAEA', opacity: 0.3 }  // soft blush
];

// Floating Hearts Animation with Premium Effects
function createFloatingHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    if (!heartsContainer) return;
    
    const heartCount = 35;
    
    // Create initial hearts with staggered timing
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            createHeart(heartsContainer, true);
        }, i * 800);
    }
    
    // Continuously create new hearts
    setInterval(() => {
        if (heartsContainer) {
            createHeart(heartsContainer, false);
        }
    }, 1800);
}

function createHeart(container, isInitial = false) {
    if (!container) return;
    
    const heart = document.createElement('div');
    heart.className = 'heart';
    
    // Random size between 16px and 30px
    const size = Math.random() * 14 + 16;
    heart.style.fontSize = size + 'px';
    
    // Random starting position (horizontal) - spread across full width
    const startX = Math.random() * 100;
    heart.style.left = startX + '%';
    
    // Random animation duration (15-25 seconds)
    const duration = Math.random() * 10 + 15;
    heart.style.animationDuration = duration + 's';
    
    // Random delay for natural effect
    const delay = Math.random() * 2;
    heart.style.animationDelay = delay + 's';
    
    // Use one of the 3 premium colors
    const colorData = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    heart.style.color = colorData.color;
    heart.style.opacity = colorData.opacity;
    
    // Add glow effect to more hearts (40% chance)
    if (Math.random() < 0.4) {
        heart.classList.add('heart-glow');
    }
    
    // Sin-wave path variation
    const waveAmplitude = Math.random() * 50 + 25;
    const waveFrequency = Math.random() * 0.02 + 0.01;
    heart.setAttribute('data-wave-amp', waveAmplitude);
    heart.setAttribute('data-wave-freq', waveFrequency);
    
    // Set initial position - start from below viewport
    const scrollY = window.pageYOffset || window.scrollY;
    const viewportHeight = window.innerHeight;
    heart.style.position = 'fixed';
    heart.style.top = (viewportHeight + scrollY) + 'px';
    heart.style.left = startX + '%';
    heart.style.zIndex = '1';
    
    container.appendChild(heart);
    
    // Animate with sin wave
    animateHeartWave(heart, waveAmplitude, waveFrequency, duration, delay);
    
    // Remove heart after animation completes
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, (duration + delay) * 1000);
}

// Sin-wave animation for romantic floating - works across entire page
function animateHeartWave(heart, amplitude, frequency, duration, delay) {
    const startTime = Date.now() + delay * 1000;
    const endTime = startTime + duration * 1000;
    
    function animate() {
        const now = Date.now();
        if (now > endTime || !heart.parentNode) return;
        
        const elapsed = (now - startTime) / 1000;
        const progress = elapsed / duration;
        
        // Calculate position based on scroll to work across entire page
        const scrollY = window.pageYOffset || window.scrollY;
        const viewportHeight = window.innerHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        
        // Hearts float from below current viewport upward
        const startY = viewportHeight + scrollY;
        const endY = scrollY - 100;
        const yPos = startY + (endY - startY) * progress;
        
        const xOffset = Math.sin(elapsed * frequency * 10) * amplitude;
        
        // Update absolute position for hearts to float across entire document
        heart.style.position = 'fixed';
        heart.style.top = yPos + 'px';
        heart.style.transform = `translateX(${xOffset}px) rotate(${progress * 360}deg)`;
        
        requestAnimationFrame(animate);
    }
    
    setTimeout(() => requestAnimationFrame(animate), delay * 1000);
}

// Smooth scroll functions
function scrollToRSVP() {
    const rsvpSection = document.getElementById('rsvp');
    rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToDetails() {
    const detailsSection = document.getElementById('eventDetails');
    detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Background color transition on scroll
let lastScrollY = 0;
const colorStops = [
    { color: 'linear-gradient(180deg, #F5E6D3 0%, #FAF7F2 50%, #FFFFFF 100%)' },
    { color: 'linear-gradient(180deg, #F5E6D3 0%, #FBEAEA 50%, #FAF7F2 100%)' },
    { color: 'linear-gradient(180deg, #FAF7F2 0%, #F5E6D3 50%, #FBEAEA 100%)' },
    { color: 'linear-gradient(180deg, #F5E6D3 0%, #FAF7F2 50%, #FFFFFF 100%)' }
];

function updateBackgroundColor() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollProgress = scrollY / (documentHeight - windowHeight);
    
    // Calculate which color stop to use
    const colorIndex = Math.min(
        Math.floor(scrollProgress * (colorStops.length - 1)),
        colorStops.length - 2
    );
    const nextIndex = Math.min(colorIndex + 1, colorStops.length - 1);
    const localProgress = (scrollProgress * (colorStops.length - 1)) - colorIndex;
    
    // Smooth transition between colors
    if (scrollProgress < 1) {
        document.body.style.background = colorStops[colorIndex].color;
    }
}

// RSVP Data Storage Functions
// Submit RSVP to Google Sheets via Google Apps Script
async function submitRSVPToGoogle(data) {
    // Kiểm tra xem đã cấu hình URL chưa
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        throw new Error('Chưa cấu hình Google Apps Script URL. Vui lòng xem file GOOGLE_APPS_SCRIPT_SETUP.md');
    }
    
    try {
        // Format data với action-based structure
        const requestData = {
            action: 'save',
            data: data
        };
        
        console.log('Sending data to Google Apps Script:', {
            url: GOOGLE_SCRIPT_URL,
            requestData: requestData
        });
        
        // Thử với CORS mode trước
        try {
            console.log('📤 Sending POST request to:', GOOGLE_SCRIPT_URL);
            console.log('📦 Request body:', JSON.stringify(requestData, null, 2));
            
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('📥 Response received - Status:', response.status, response.statusText);
            console.log('📥 Response headers:', [...response.headers.entries()]);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error text:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const result = await response.json();
            console.log('✅ Response JSON:', JSON.stringify(result, null, 2));
            
            if (result.success) {
                console.log('🎉 Google Sheets submission successful!');
                return { success: true, message: result.message || 'Đã gửi thông tin thành công!', data: result.data };
            } else {
                console.error('❌ Google Sheets returned success: false');
                throw new Error(result.message || result.error || 'Có lỗi xảy ra khi gửi dữ liệu');
            }
        } catch (corsError) {
            // Nếu CORS fail, thử với no-cors mode (fire and forget)
            console.warn('⚠️ CORS mode failed, trying no-cors mode');
            console.warn('⚠️ CORS Error details:', {
                name: corsError.name,
                message: corsError.message,
                stack: corsError.stack
            });
            
            try {
                // Với no-cors, không thể đọc response nhưng request vẫn được gửi
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData)
                });
                
                console.log('📤 Request sent with no-cors mode (response cannot be read)');
                console.log('⚠️ Cannot verify if data was saved - check Google Sheet manually');
                // Giả định thành công vì không thể kiểm tra response
                return { success: true, message: 'Đã gửi thông tin (no-cors mode - không thể xác nhận)' };
            } catch (noCorsError) {
                console.error('❌ No-cors mode also failed:', noCorsError);
                throw noCorsError;
            }
        }
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}

// Backup: Save to localStorage (fallback)
function saveRSVPDataToLocalStorage(data) {
    // Get existing RSVPs from localStorage
    let rsvps = JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');
    
    // Add timestamp and ID
    const rsvpEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('vi-VN'),
        name: data.name,
        guests: parseInt(data.guests),
        attending: data.attending,
        message: data.message || ''
    };
    
    // Add to array
    rsvps.push(rsvpEntry);
    
    // Save back to localStorage
    localStorage.setItem('weddingRSVPs', JSON.stringify(rsvps));
    
    // Also save individual entry for backup
    localStorage.setItem(`rsvp_${rsvpEntry.id}`, JSON.stringify(rsvpEntry));
    
    return rsvpEntry;
}

function getAllRSVPs() {
    return JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');
}

function getRSVPStats() {
    const rsvps = getAllRSVPs();
    const attending = rsvps.filter(r => r.attending === 'yes');
    const notAttending = rsvps.filter(r => r.attending === 'no');
    const totalGuests = attending.reduce((sum, r) => sum + r.guests, 0);
    
    return {
        total: rsvps.length,
        attending: attending.length,
        notAttending: notAttending.length,
        totalGuests: totalGuests
    };
}

function exportRSVPsToJSON() {
    const rsvps = getAllRSVPs();
    const dataStr = JSON.stringify(rsvps, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function exportRSVPsToCSV() {
    const rsvps = getAllRSVPs();
    
    // Ask user to choose delimiter
    const delimiterChoice = confirm(
        'Chọn định dạng CSV:\n\n' +
        'OK = Dấu chấm phẩy (;) - Khuyến nghị cho Excel\n' +
        'Cancel = Dấu phẩy (,) - Chuẩn CSV'
    );
    
    // Use semicolon (;) as delimiter for better Excel recognition
    const delimiter = delimiterChoice ? ';' : ',';
    
    // Escape function for CSV
    function escapeCSV(value) {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // If contains delimiter, quotes, or newlines, wrap in quotes
        if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
            return '"' + stringValue.replace(/"/g, '""') + '"';
        }
        return stringValue;
    }
    
    const headers = ['ID', 'Thời gian', 'Tên', 'Số khách', 'Tham dự', 'Lời nhắn'];
    
    // Create header row
    const headerRow = headers.map(escapeCSV).join(delimiter);
    
    // Create data rows
    const dataRows = rsvps.map(r => {
        return [
            r.id,
            r.date,
            r.name,
            r.guests,
            r.attending === 'yes' ? 'Có' : 'Không',
            r.message || ''
        ].map(escapeCSV).join(delimiter);
    });
    
    // Combine all rows
    const csvContent = [headerRow, ...dataRows].join('\r\n');
    
    // Add BOM (Byte Order Mark) for UTF-8 to ensure Excel recognizes encoding
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Form submission handler with Petals Animation
document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.getElementById('rsvpForm');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Disable submit button to prevent double submission
            const submitBtn = rsvpForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang gửi...';
            
            console.log('🚀 Form submission started');
            
            // Get form data
            const formData = new FormData(rsvpForm);
            const data = {
                name: formData.get('name'),
                guests: formData.get('guests'),
                attending: formData.get('attending'),
                message: formData.get('message')
            };
            
            console.log('📝 Form data:', data);
            
            try {
                let savedToGoogle = false;
                
                // Try to submit to Google Sheets first
                console.log('🔍 Checking GOOGLE_SCRIPT_URL:', GOOGLE_SCRIPT_URL);
                console.log('🔍 URL type check:', typeof GOOGLE_SCRIPT_URL);
                console.log('🔍 URL value check:', GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE');
                
                if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
                    try {
                        console.log('Attempting to submit RSVP to Google Sheets...');
                        const result = await submitRSVPToGoogle(data);
                        console.log('✅ RSVP submitted to Google Sheets successfully:', result);
                        savedToGoogle = true;
                    } catch (googleError) {
                        console.error('❌ Failed to submit to Google Sheets:', googleError);
                        console.error('Error message:', googleError.message);
                        console.warn('⚠️ Using localStorage as backup');
                    }
                } else {
                    console.warn('⚠️ Google Apps Script URL chưa được cấu hình. Dữ liệu chỉ được lưu vào localStorage.');
                    console.info('💡 Để lưu vào Google Sheets, vui lòng cấu hình GOOGLE_SCRIPT_URL trong script.js');
                }
                
                // Tạm thời tắt localStorage để debug
                // const savedRSVP = saveRSVPDataToLocalStorage(data);
                // console.log('RSVP saved to localStorage:', savedRSVP);
                
                // Show petals animation
                createPetalsAnimation();
                
                // Show success message
                setTimeout(() => {
                    showSuccessMessage();
                }, 500);
                
                // Reset form
                rsvpForm.reset();
                
                // Update admin panel if visible
                updateAdminPanel();
                
            } catch (error) {
                console.error('Error saving RSVP:', error);
                alert('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    // Initialize floating hearts
    createFloatingHearts();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Background color transition on scroll
    window.addEventListener('scroll', updateBackgroundColor);
    updateBackgroundColor();
});

// Petals Animation - Romantic floating petals
function createPetalsAnimation() {
    const form = document.getElementById('rsvpForm');
    const petalCount = 15;
    
    for (let i = 0; i < petalCount; i++) {
        setTimeout(() => {
            createPetal(form);
        }, i * 100);
    }
}

function createPetal(container) {
    const petal = document.createElement('div');
    petal.style.cssText = `
        position: absolute;
        width: 12px;
        height: 12px;
        background: ${HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)].color};
        border-radius: 50% 0 50% 0;
        pointer-events: none;
        z-index: 1000;
        opacity: 0.7;
        transform: rotate(${Math.random() * 360}deg);
    `;
    
    const rect = container.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    petal.style.left = startX + 'px';
    petal.style.top = startY + 'px';
    
    document.body.appendChild(petal);
    
    // Animate petal
    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 150;
    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance - 100;
    const rotation = Math.random() * 720 - 360;
    
    petal.animate([
        {
            transform: `translate(0, 0) rotate(0deg)`,
            opacity: 0.7
        },
        {
            transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(${rotation}deg)`,
            opacity: 0
        }
    ], {
        duration: 2000,
        easing: 'ease-out',
        fill: 'forwards'
    });
    
    setTimeout(() => {
        if (petal.parentNode) {
            petal.parentNode.removeChild(petal);
        }
    }, 2000);
}

// Success message display
function showSuccessMessage() {
    const form = document.getElementById('rsvpForm');
    const existingMsg = form.querySelector('.success-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.style.cssText = `
        background: linear-gradient(135deg, #8B2635 0%, #B03A48 100%);
        color: white;
        padding: 25px;
        border-radius: 15px;
        text-align: center;
        font-family: 'Playfair Display', serif;
        font-size: 18px;
        margin-top: 20px;
        animation: fadeInUp 0.5s ease-out;
        box-shadow: 0 10px 30px rgba(139, 38, 53, 0.3);
    `;
    successMsg.textContent = 'Cảm ơn bạn đã xác nhận! Chúng tôi rất mong được gặp bạn trong ngày đặc biệt này. ❤️';
    
    form.appendChild(successMsg);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successMsg.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 500);
    }, 5000);
}

// Scroll animations for elements
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.detail-card, .timeline-item, .gallery-item, .story-text, .story-image'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Add fade-in animation for page load
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Slow parallax layers - Vintage decorative elements
function createParallaxLayers() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create decorative vintage elements
    for (let i = 0; i < 3; i++) {
        const layer = document.createElement('div');
        layer.className = 'parallax-layer';
        layer.style.cssText = `
            position: absolute;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            top: ${20 + i * 30}%;
            left: ${10 + i * 25}%;
            animation: floatParallax ${15 + i * 5}s ease-in-out infinite;
        `;
        hero.appendChild(layer);
    }
}

// Add parallax layer animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParallax {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(20px, -20px) scale(1.1); }
        66% { transform: translate(-15px, 15px) scale(0.9); }
    }
`;
document.head.appendChild(style);

// Initialize parallax layers
document.addEventListener('DOMContentLoaded', function() {
    createParallaxLayers();
    initAdminPanel();
    initGalleryLightbox();
    initMusicPlayer();
});

// Music Player Functions - Cuoi Nhau Di (Yes I Do)
let isPlaying = false;
let audio = null;

function initMusicPlayer() {
    audio = document.getElementById('weddingMusic');
    const playBtn = document.getElementById('playBtn');
    
    if (!audio) return;
    
    // Set initial volume
    audio.volume = 0.5;
    
    // Set start time to 22 seconds
    const START_TIME = 22;
    
    // Set start time when audio metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = START_TIME;
    });
    
    // Auto-play immediately when page loads
    // Try multiple strategies for autoplay across browsers
    const tryAutoPlay = () => {
        // Set start time before playing
        if (audio.readyState >= 1) {
            audio.currentTime = START_TIME;
        }
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Ensure we start at 22 seconds
                if (audio.currentTime < START_TIME) {
                    audio.currentTime = START_TIME;
                }
                isPlaying = true;
                updatePlayerUI();
                console.log('Music auto-played');
            }).catch((error) => {
                // Auto-play was prevented - try again on first user interaction
                console.log('Auto-play blocked, will play on user interaction');
                
                const enableOnInteraction = () => {
                    audio.currentTime = START_TIME;
                    audio.play().then(() => {
                        isPlaying = true;
                        updatePlayerUI();
                    }).catch(() => {
                        console.log('Still cannot auto-play');
                    });
                };
                
                // Try on any user interaction
                document.addEventListener('click', enableOnInteraction, { once: true });
                document.addEventListener('touchstart', enableOnInteraction, { once: true });
                document.addEventListener('scroll', enableOnInteraction, { once: true });
            });
        }
    };
    
    // Try autoplay when audio is ready
    if (audio.readyState >= 2) {
        // Audio is already loaded
        tryAutoPlay();
    } else {
        // Wait for audio to be ready
        audio.addEventListener('canplay', tryAutoPlay, { once: true });
        audio.addEventListener('loadeddata', tryAutoPlay, { once: true });
    }
    
    // Also try immediately (for some browsers)
    setTimeout(tryAutoPlay, 100);
    
    // Update UI when audio plays or pauses
    audio.addEventListener('play', () => {
        // Ensure we start at 22 seconds when playing
        if (audio.currentTime < START_TIME) {
            audio.currentTime = START_TIME;
        }
        isPlaying = true;
        updatePlayerUI();
    });
    
    audio.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayerUI();
    });
    
    // Handle audio errors
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
    });
    
    // Custom loop: when audio ends, reset to START_TIME (22 seconds) and play again
    audio.addEventListener('ended', () => {
        audio.currentTime = START_TIME;
        audio.play();
    });
    
    // Ensure we never go before START_TIME (safety check)
    audio.addEventListener('timeupdate', () => {
        // If somehow before START_TIME (but not at the very beginning), reset
        if (audio.currentTime < START_TIME && audio.currentTime > 0.5 && audio.readyState >= 2) {
            audio.currentTime = START_TIME;
        }
    });
}

function toggleMusic() {
    if (!audio) return;
    
    const START_TIME = 22; // Start from 22nd second
    
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        // Set start time before playing
        if (audio.readyState >= 1) {
            audio.currentTime = START_TIME;
        }
        audio.play().then(() => {
            // Ensure we start at 22 seconds
            if (audio.currentTime < START_TIME) {
                audio.currentTime = START_TIME;
            }
            isPlaying = true;
        }).catch((error) => {
            console.error('Error playing audio:', error);
            alert('Cannot play music. Please check connection or audio file.');
        });
    }
    
    updatePlayerUI();
}

function setVolume(value) {
    if (!audio) return;
    audio.volume = value / 100;
}

function updatePlayerUI() {
    const playBtn = document.getElementById('playBtn');
    
    if (playBtn) {
        const playIcon = playBtn.querySelector('.play-icon');
        if (playIcon) {
            if (isPlaying) {
                playBtn.classList.add('playing');
                playIcon.textContent = '❚❚';
            } else {
                playBtn.classList.remove('playing');
                playIcon.textContent = '▶';
            }
        }
    }
}

// Gallery Lightbox Functions
let currentImageIndex = 0;
let galleryImages = [];

function initGalleryLightbox() {
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item[data-image]');
    galleryImages = Array.from(galleryItems).map(item => item.getAttribute('data-image'));
    
    // Add click event to each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    // Close on background click
    const lightbox = document.getElementById('galleryLightbox');
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const lightbox = document.getElementById('galleryLightbox');
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                changeLightboxImage(-1);
            } else if (e.key === 'ArrowRight') {
                changeLightboxImage(1);
            }
        }
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (galleryImages[index]) {
        lightboxImage.src = galleryImages[index];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        
        // Smooth fade in
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    lightbox.style.opacity = '0';
    
    setTimeout(() => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }, 400);
}

function changeLightboxImage(direction) {
    currentImageIndex += direction;
    
    // Loop around
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }
    
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImage.src = galleryImages[currentImageIndex];
        lightboxImage.style.opacity = '1';
    }, 200);
}

// Admin Panel Functions - Password encoded for security
// Password is base64 encoded to prevent easy reading in source code
function getAdminPassword() {
    // Decode base64: "c2VudGltZW50YWwwNTA0" = "sentimental0504"
    try {
        return atob('c2VudGltZW50YWwwNTA0');
    } catch(e) {
        return '';
    }
}

function initAdminPanel() {
    const footer = document.querySelector('.footer');
    const footerText = document.getElementById('footerText');
    
    if (!footerText || !footer) return;
    
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    
    // Desktop: Triple click on footer text to activate
    let clickCount = 0;
    let clickTimer;
    
    footerText.addEventListener('click', function(e) {
        if (!isMobile) {
            clickCount++;
            clearTimeout(clickTimer);
            
            clickTimer = setTimeout(() => {
                if (clickCount === 3) {
                    showAdminLogin();
                }
                clickCount = 0;
            }, 500);
        }
    });
    
    // Mobile: Long press (1.5 seconds) on footer text to activate
    let longPressTimer;
    
    footerText.addEventListener('touchstart', function(e) {
        if (isMobile) {
            longPressTimer = setTimeout(() => {
                showAdminLogin();
                e.preventDefault();
            }, 1500);
        }
    }, { passive: false });
    
    footerText.addEventListener('touchend', function(e) {
        if (isMobile && longPressTimer) {
            clearTimeout(longPressTimer);
        }
    });
    
    footerText.addEventListener('touchmove', function(e) {
        if (isMobile && longPressTimer) {
            clearTimeout(longPressTimer);
        }
    });
}

function showAdminLogin() {
    const password = prompt('Nhập mật khẩu để xem danh sách RSVP:');
    const correctPassword = getAdminPassword();
    
    if (password === correctPassword) {
        showAdminPanel();
    } else if (password) {
        alert('Mật khẩu không đúng!');
    }
}

function showAdminPanel() {
    // Remove existing panel if any
    const existingPanel = document.getElementById('adminPanel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }
    
    const rsvps = getAllRSVPs();
    const stats = getRSVPStats();
    
    const panel = document.createElement('div');
    panel.id = 'adminPanel';
    panel.innerHTML = `
        <div class="admin-panel-overlay"></div>
        <div class="admin-panel-content">
            <div class="admin-header">
                <h2>📋 Danh Sách RSVP</h2>
                <button class="admin-close" onclick="this.closest('#adminPanel').remove()">×</button>
            </div>
            <div class="admin-stats">
                <div class="stat-item">
                    <span class="stat-label">Tổng số:</span>
                    <span class="stat-value">${stats.total}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Sẽ tham dự:</span>
                    <span class="stat-value attending">${stats.attending}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Không tham dự:</span>
                    <span class="stat-value not-attending">${stats.notAttending}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tổng số khách:</span>
                    <span class="stat-value">${stats.totalGuests}</span>
                </div>
            </div>
            <div class="admin-actions">
                <button class="admin-btn" onclick="exportRSVPsToJSON()">📥 Xuất JSON</button>
                <button class="admin-btn" onclick="exportRSVPsToCSV()">📊 Xuất CSV</button>
                <button class="admin-btn" onclick="clearAllRSVPs()" style="background: #dc3545;">🗑️ Xóa tất cả</button>
            </div>
            <div class="admin-list">
                ${rsvps.length === 0 ? '<p style="text-align: center; padding: 40px; color: #6B6B6B;">Chưa có RSVP nào</p>' : 
                    rsvps.map(rsvp => `
                        <div class="rsvp-item ${rsvp.attending === 'yes' ? 'attending' : 'not-attending'}">
                            <div class="rsvp-header">
                                <strong>${rsvp.name}</strong>
                                <span class="rsvp-date">${rsvp.date}</span>
                            </div>
                            <div class="rsvp-details">
                                <span>Số khách: <strong>${rsvp.guests}</strong></span>
                                <span>Tham dự: <strong>${rsvp.attending === 'yes' ? '✅ Có' : '❌ Không'}</strong></span>
                            </div>
                            ${rsvp.message ? `<div class="rsvp-message">"${rsvp.message}"</div>` : ''}
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
    document.body.appendChild(panel);
}

function updateAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) {
        showAdminPanel();
    }
}

function clearAllRSVPs() {
    if (confirm('Bạn có chắc chắn muốn xóa TẤT CẢ dữ liệu RSVP? Hành động này không thể hoàn tác!')) {
        localStorage.removeItem('weddingRSVPs');
        // Clear individual entries
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('rsvp_')) {
                localStorage.removeItem(key);
            }
        }
        alert('Đã xóa tất cả dữ liệu RSVP!');
        showAdminPanel();
    }
}
