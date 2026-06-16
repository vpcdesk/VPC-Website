const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const whatsappBot = document.querySelector('.whatsapp-bot');
const whatsappToggle = document.getElementById('whatsappBotToggle');
const whatsappClose = document.getElementById('whatsappBotClose');
const whatsappPanel = document.getElementById('whatsappBotPanel');
const whatsappMessage = document.getElementById('whatsappMessage');
const whatsappSend = document.getElementById('whatsappSend');
const whatsappQuickReplies = document.getElementById('whatsappQuickReplies');

function updateNavbarState() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 12);
}

function closeMobileNav() {
    navToggle?.classList.remove('active');
    navLinks?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
}

navToggle?.setAttribute('aria-expanded', 'false');

navToggle?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.toggle('active') ?? false;
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
        closeMobileNav();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMobileNav();
        closeWhatsappBot();
    }
});

const whatsappChatArea = document.querySelector('.whatsapp-panel-chat-area');
const whatsappSubmitBtn = document.getElementById('whatsappSubmitBtn');
const whatsappRepliesLabel = document.querySelector('.whatsapp-quick-replies-label');
let isChatbotResponded = false;
let typingIndicator = null;

function formatTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

function appendMessage(text, isOutgoing, senderName = '') {
    if (!whatsappChatArea) return;
    const bubble = document.createElement('div');
    bubble.className = `whatsapp-chat-bubble ${isOutgoing ? 'whatsapp-chat-outgoing' : 'whatsapp-chat-incoming'}`;
    
    let html = '';
    if (!isOutgoing && senderName) {
        html += `<div class="whatsapp-bubble-sender">${senderName}</div>`;
    }
    html += `<div class="whatsapp-bubble-text">${escapeHTML(text)}</div>`;
    html += `<div class="whatsapp-bubble-time">${formatTime()}</div>`;
    
    bubble.innerHTML = html;
    whatsappChatArea.appendChild(bubble);
    whatsappChatArea.scrollTop = whatsappChatArea.scrollHeight;
}

function showTypingIndicator() {
    if (!whatsappChatArea) return;
    removeTypingIndicator();
    
    typingIndicator = document.createElement('div');
    typingIndicator.className = 'whatsapp-typing';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    
    whatsappChatArea.appendChild(typingIndicator);
    whatsappChatArea.scrollTop = whatsappChatArea.scrollHeight;
}

function removeTypingIndicator() {
    if (typingIndicator && typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
    }
    typingIndicator = null;
}

function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    if (msg.includes('civil')) {
        return "Understood! Let's get our civil engineering estimator to help you. Click the button below to connect with us on WhatsApp and get your civil quotation started.";
    } else if (msg.includes('plumbing')) {
        return "Got it! Our plumbing supervisor is ready to assist. Click the button below to connect on WhatsApp and share details about your facility requirements.";
    } else if (msg.includes('painting') || msg.includes('facility')) {
        return "Excellent. We provide premium industrial painting and facility maintenance. Click the button below to connect with our team on WhatsApp.";
    } else {
        return "Thank you for your enquiry! Let's discuss your project details. Click the button below to open a direct chat with our VPC coordinator on WhatsApp.";
    }
}

function updateWhatsappLink(message) {
    if (!whatsappBot || !whatsappSend) return;
    const phoneNumber = whatsappBot.dataset.whatsappNumber || '919442378859';
    whatsappSend.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

function handleUserSend(messageText) {
    if (!messageText.trim() || isChatbotResponded) return;
    
    // Hide quick replies immediately
    if (whatsappRepliesLabel) whatsappRepliesLabel.style.display = 'none';
    if (whatsappQuickReplies) whatsappQuickReplies.style.display = 'none';
    
    // Append user message
    appendMessage(messageText, true);
    
    // Disable inputs
    if (whatsappMessage) {
        whatsappMessage.value = '';
        whatsappMessage.disabled = true;
        whatsappMessage.placeholder = 'Inquiry sent...';
    }
    if (whatsappSubmitBtn) whatsappSubmitBtn.disabled = true;
    
    // Set WhatsApp href link
    updateWhatsappLink(messageText);
    
    // Show typing
    showTypingIndicator();
    
    // Simulate chatbot reply
    setTimeout(() => {
        removeTypingIndicator();
        const botReplyText = getBotResponse(messageText);
        appendMessage(botReplyText, false, 'VPC Support');
        
        // Show the continue to WhatsApp button
        if (whatsappSend) {
            whatsappSend.style.display = 'flex';
        }
        
        isChatbotResponded = true;
    }, 1200);
}

function openWhatsappBot() {
    whatsappBot?.classList.add('open');
    whatsappToggle?.setAttribute('aria-expanded', 'true');
    whatsappPanel?.setAttribute('aria-hidden', 'false');
    
    // Scroll chat area to the bottom when opened
    if (whatsappChatArea) {
        whatsappChatArea.scrollTop = whatsappChatArea.scrollHeight;
    }
}

function closeWhatsappBot() {
    whatsappBot?.classList.remove('open');
    whatsappToggle?.setAttribute('aria-expanded', 'false');
    whatsappPanel?.setAttribute('aria-hidden', 'true');
}

whatsappToggle?.addEventListener('click', () => {
    if (whatsappBot?.classList.contains('open')) {
        closeWhatsappBot();
    } else {
        openWhatsappBot();
    }
});

whatsappClose?.addEventListener('click', closeWhatsappBot);

whatsappSubmitBtn?.addEventListener('click', () => {
    if (whatsappMessage) {
        handleUserSend(whatsappMessage.value);
    }
});

whatsappMessage?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        whatsappSubmitBtn?.click();
    }
});

whatsappQuickReplies?.addEventListener('click', (event) => {
    const button = event.target instanceof HTMLElement ? event.target.closest('button[data-message]') : null;
    if (!button) return;
    const message = button.dataset.message || '';
    handleUserSend(message);
});
window.addEventListener('scroll', updateNavbarState, { passive: true });
updateNavbarState();

// Contact Form Enquiry Handler
const contactForm = document.querySelector('.form-grid');
contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const service = document.getElementById('service')?.value;
    const requirement = document.getElementById('message')?.value.trim();
    
    if (!name || !phone) {
        alert('Please fill in your Name and Phone Number.');
        return;
    }
    
    const textMessage = `Hi VPC, I would like to submit a project enquiry:\n` +
                       `- Name: ${name}\n` +
                       `- Phone: ${phone}\n` +
                       `- Service Required: ${service}\n` +
                       `- Requirement: ${requirement || 'N/A'}`;
                       
    const whatsappNumber = '919442378859';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textMessage)}`;
    window.location.href = url;
});
