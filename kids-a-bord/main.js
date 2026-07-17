
// Animation des compteurs de statistiques
document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5 // L'animation se déclenche quand 50% de la section est visible
    };

    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000); // 2 secondes d'animation
                observer.unobserve(entry.target); // On n'anime qu'une seule fois
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
});

// Menu Mobile Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });
}

// Logic pour le simulateur d'économie de CO2
document.addEventListener('DOMContentLoaded', () => {
    const calcKm = document.getElementById('calc-km');
    const calcDays = document.getElementById('calc-days');
    const calcKmVal = document.getElementById('calc-km-val');
    const calcDaysVal = document.getElementById('calc-days-val');
    const co2Result = document.getElementById('co2-result');

    if (calcKm && calcDays && calcKmVal && calcDaysVal && co2Result) {
        const updateCO2 = () => {
            const km = parseInt(calcKm.value);
            const days = parseInt(calcDays.value);

            // Mise à jour de l'affichage des valeurs des sliders
            calcKmVal.textContent = km;
            calcDaysVal.textContent = days;

            // Calcul de l'économie de CO2
            // 36 semaines scolaires, facteur ADEME : ~0.193 kg de CO2 économisé par km de voiture évitée
            const co2Saved = Math.round(km * days * 36 * 0.193);

            co2Result.textContent = co2Saved;
        };

        calcKm.addEventListener('input', updateCO2);
        calcDays.addEventListener('input', updateCO2);

        // Initialisation
        updateCO2();
    }
});

// Modal & Onboarding Logic (Strategic Onboarding Inversé LAB #3)
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('onboarding-modal');
    const closeBtn = modal ? modal.querySelector('.close-modal') : null;
    const openBtns = document.querySelectorAll('.open-onboarding');
    const loginForm = document.getElementById('auth-login-form');
    const registerForm = document.getElementById('auth-register-form');

    // Steps
    const stepChoice = document.getElementById('modal-step-choice');
    const stepSuccess = document.getElementById('modal-step-success');

    // State Variables
    let currentProfile = 'parent';
    let currentTab = 'login';
    let referrerStep = 'choice'; // 'choice', 'partner-selector', 'pricing'

    // Open Modal
    const openModal = (profile = '') => {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Hide all steps
        hideAllModalSteps();

        if (profile === 'parent') {
            referrerStep = 'choice';
            openClassicAuth('parent', 'login');
        } else if (profile === 'school') {
            referrerStep = 'choice';
            openClassicAuth('school', 'login');
        } else if (profile === 'club') {
            referrerStep = 'choice';
            openClassicAuth('club', 'login');
        } else if (profile === 'partner') {
            referrerStep = 'choice';
            const authSelector = document.getElementById('modal-step-partner-auth-selector');
            if (authSelector) {
                authSelector.style.display = 'block';
                adjustModalWidth('partner-selector');
            }
        } else {
            // Show choice step by default
            stepChoice.style.display = 'block';
            adjustModalWidth('default');
        }
    };

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const profile = btn.getAttribute('data-profile') || '';
            openModal(profile);
        });
    });

    // Close Modal
    const closeModal = () => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
        const pricingContainer = document.getElementById('partner-pricing-container');
        if (e.target === pricingContainer) {
            window.closePartnerPricingModal();
        }
        const charterContainer = document.getElementById('charter-modal');
        if (e.target === charterContainer) {
            window.closeCharterModal();
        }
        const pointsVertsContainer = document.getElementById('points-verts-modal');
        if (e.target === pointsVertsContainer) {
            window.closePointsVertsModal();
        }
        const dashboardContainer = document.getElementById('dashboard-modal');
        if (e.target === dashboardContainer) {
            window.closeDashboardModal();
        }
        const partnerDashboardContainer = document.getElementById('partner-dashboard-modal');
        if (e.target === partnerDashboardContainer) {
            window.closePartnerDashboardModal();
        }
        const merchantDashboardContainer = document.getElementById('merchant-dashboard-modal');
        if (e.target === merchantDashboardContainer) {
            window.closeMerchantDashboardModal();
        }
        const authorityDashboardContainer = document.getElementById('authority-dashboard-modal');
        if (e.target === authorityDashboardContainer) {
            window.closeAuthorityDashboardModal();
        }
    });

    // Modal width helper
    const modalContent = document.querySelector('.modal-content');
    function adjustModalWidth(step) {
        if (!modalContent) return;
        if (step === 'partner-selector') {
            modalContent.style.maxWidth = '750px';
        } else {
            modalContent.style.maxWidth = '650px'; // default
        }
    }

    function hideAllModalSteps() {
        if (stepChoice) stepChoice.style.display = 'none';
        if (stepSuccess) stepSuccess.style.display = 'none';

        const authSelector = document.getElementById('modal-step-partner-auth-selector');
        const schoolClubSelector = document.getElementById('modal-step-school-club-auth-selector');
        const classicAuth = document.getElementById('modal-step-classic-auth');
        const partnerSuccess = document.getElementById('modal-step-partner-success');

        if (authSelector) authSelector.style.display = 'none';
        if (schoolClubSelector) schoolClubSelector.style.display = 'none';
        if (classicAuth) classicAuth.style.display = 'none';
        if (partnerSuccess) partnerSuccess.style.display = 'none';
    }

    // Global hooks for onclick handlers
    window.selectProfile = (profile) => {
        hideAllModalSteps();
        if (profile === 'parent') {
            referrerStep = 'choice';
            openClassicAuth('parent', 'login');
        } else if (profile === 'school_club') {
            referrerStep = 'choice';
            const schoolClubSelector = document.getElementById('modal-step-school-club-auth-selector');
            if (schoolClubSelector) {
                schoolClubSelector.style.display = 'block';
                adjustModalWidth('partner-selector');
            }
        } else if (profile === 'partner') {
            referrerStep = 'choice';
            const authSelector = document.getElementById('modal-step-partner-auth-selector');
            if (authSelector) {
                authSelector.style.display = 'block';
                adjustModalWidth('partner-selector');
            }
        }
    };

    // Open classic auth portal for dynamic profile and tab
    window.openClassicAuth = (profile, tab) => {
        currentProfile = profile;
        currentTab = tab;

        hideAllModalSteps();

        const classicAuth = document.getElementById('modal-step-classic-auth');
        if (classicAuth) {
            classicAuth.style.display = 'block';
            adjustModalWidth('default');
        }

        switchAuthTab(tab);
    };

    // Selector step for Partner: École, Commerçant, Club, Autre
    window.selectPartnerTypeForAuth = (e, type) => {
        if (e) e.preventDefault();
        referrerStep = 'partner-selector';
        openClassicAuth(type, 'login');
    };

    // Switch tabs Connexion / Inscription inside the auth modal
    window.switchAuthTab = (tab) => {
        currentTab = tab;

        const tabLogin = document.getElementById('tab-btn-login');
        const tabRegister = document.getElementById('tab-btn-register');
        const loginFormEl = document.getElementById('auth-login-form');
        const registerFormEl = document.getElementById('auth-register-form');

        if (tab === 'login') {
            if (tabLogin) tabLogin.classList.add('active');
            if (tabRegister) tabRegister.classList.remove('active');
            if (loginFormEl) loginFormEl.style.display = 'block';
            if (registerFormEl) registerFormEl.style.display = 'none';
        } else {
            if (tabLogin) tabLogin.classList.remove('active');
            if (tabRegister) tabRegister.classList.add('active');
            if (loginFormEl) loginFormEl.style.display = 'none';
            if (registerFormEl) registerFormEl.style.display = 'block';

            configureRegisterFields();
        }

        updateAuthModalText();
    };

    // Configure fields according to selected profile (Parent vs B2B)
    function configureRegisterFields() {
        const parentFields = document.querySelectorAll('.parent-only-fields');
        const partnerFields = document.querySelectorAll('.partner-only-fields');

        const parentCode = document.getElementById('parent-code');
        const agreeCharter = document.getElementById('agree-charter');
        const partnerContact = document.getElementById('partner-contact-name');
        const partnerOrg = document.getElementById('partner-org-name');
        const partnerPhone = document.getElementById('partner-phone');
        const agreeCgu = document.getElementById('agree-cgu');
        const registerEmail = document.getElementById('register-email');
        const registerPass = document.getElementById('register-password');

        if (registerEmail) registerEmail.required = true;
        if (registerPass) registerPass.required = true;

        if (currentProfile === 'parent') {
            parentFields.forEach(f => f.style.display = 'block');
            partnerFields.forEach(f => f.style.display = 'none');

            if (parentCode) parentCode.required = true;
            if (agreeCharter) agreeCharter.required = true;

            if (partnerContact) partnerContact.required = false;
            if (partnerOrg) partnerOrg.required = false;
            if (partnerPhone) partnerPhone.required = false;
            if (agreeCgu) agreeCgu.required = false;
        } else {
            parentFields.forEach(f => f.style.display = 'none');
            partnerFields.forEach(f => f.style.display = 'block');

            if (parentCode) parentCode.required = false;
            if (agreeCharter) agreeCharter.required = false;

            if (partnerContact) partnerContact.required = true;
            if (partnerOrg) partnerOrg.required = true;
            if (partnerPhone) partnerPhone.required = true;
            if (agreeCgu) agreeCgu.required = true;

            // Adapt Org Label/Placeholder
            const orgLabel = document.getElementById('partner-org-label');
            if (orgLabel && partnerOrg) {
                if (currentProfile === 'school') {
                    orgLabel.textContent = "Nom de l'établissement scolaire";
                    partnerOrg.placeholder = "Ex: École Jules Ferry";
                } else if (currentProfile === 'club') {
                    orgLabel.textContent = "Nom de l'association ou du club";
                    partnerOrg.placeholder = "Ex: Castelnau Basket";
                } else if (currentProfile === 'merchant') {
                    orgLabel.textContent = "Nom du commerce";
                    partnerOrg.placeholder = "Ex: Boulangerie du Centre";
                } else {
                    orgLabel.textContent = "Nom de la structure";
                    partnerOrg.placeholder = "Ex: Mairie de Montpellier";
                }
            }
        }
    }

    // Dynamic Title & Subtitle updates
    function updateAuthModalText() {
        const title = document.getElementById('auth-modal-title');
        const subtitle = document.getElementById('auth-modal-subtitle');
        const backBtn = document.getElementById('auth-back-btn');

        let profileName = "Parents";
        if (currentProfile === 'school') profileName = "École";
        else if (currentProfile === 'club') profileName = "Club";
        else if (currentProfile === 'merchant') profileName = "Commerçant";
        else if (currentProfile === 'other') profileName = "Autre";

        if (currentTab === 'login') {
            if (title) title.textContent = `Connexion — Espace ${profileName}`;
            if (subtitle) subtitle.textContent = "Entrez vos identifiants pour accéder à votre espace sécurisé.";
        } else {
            if (title) title.textContent = `Inscription — Espace ${profileName}`;
            if (subtitle) subtitle.textContent = "Créez votre compte en quelques instants pour rejoindre le réseau.";
        }

        // Back button visibility
        if (backBtn) {
            if (referrerStep === 'pricing') {
                backBtn.style.display = 'none';
            } else {
                backBtn.style.display = 'block';
            }
        }
    }

    window.goBackToSelector = () => {
        hideAllModalSteps();
        if (referrerStep === 'partner-selector') {
            if (currentProfile === 'school' || currentProfile === 'club') {
                const selector = document.getElementById('modal-step-school-club-auth-selector');
                if (selector) {
                    selector.style.display = 'block';
                    adjustModalWidth('partner-selector');
                }
            } else {
                const selector = document.getElementById('modal-step-partner-auth-selector');
                if (selector) {
                    selector.style.display = 'block';
                    adjustModalWidth('partner-selector');
                }
            }
        } else {
            stepChoice.style.display = 'block';
            adjustModalWidth('default');
        }
    };

    window.goBackToChoice = () => {
        hideAllModalSteps();
        stepChoice.style.display = 'block';
        adjustModalWidth('default');
    };

    window.setContactProfile = (profile) => {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            subjectSelect.value = profile;
        }
    };

    window.forgotPassword = (e) => {
        e.preventDefault();
        alert("Un e-mail de réinitialisation de mot de passe vous a été envoyé (simulation).");
    };

    window.closeModal = closeModal;

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Visual feedback
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Connexion...";
            submitBtn.style.backgroundColor = "var(--water-green)";
            submitBtn.disabled = true;

            setTimeout(() => {
                if (email.toLowerCase().trim() === 'kids@bord' && password === 'kids@bord') {
                    closeModal();
                    // Restore button
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = "";
                    submitBtn.disabled = false;
                    loginForm.reset();

                    // Open Espace connected depending on profile
                    if (currentProfile === 'parent') {
                        window.openParentDashboard();
                    } else if (currentProfile === 'school' || currentProfile === 'club') {
                        window.openPartnerDashboard(currentProfile);
                    } else if (currentProfile === 'other') {
                        window.openAuthorityDashboard();
                    } else {
                        window.openMerchantDashboard();
                    }
                } else {
                    closeModal();
                    alert(`Connexion réussie ! Bienvenue de retour sur Kids à bord.\nConnecté avec : ${email}`);
                    // Restore button
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = "";
                    submitBtn.disabled = false;
                    loginForm.reset();
                }
            }, 1000);
        });
    }

    // Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (currentProfile === 'parent') {
                const firstname = document.getElementById('parent-firstname').value;
                const lastname = document.getElementById('parent-lastname').value;
                const code = document.getElementById('parent-code').value.trim().toUpperCase();

                let schoolName = "Communauté locale Kids à bord";
                if (code === 'MONT-JULES-2026') {
                    schoolName = "École Jules Ferry (Montpellier)";
                } else if (code === 'MONT-HAND-2026') {
                    schoolName = "Castelnau Basket (Hand/Sport)";
                } else {
                    schoolName = `Communauté locale (${code})`;
                }

                // Fill virtual card details
                document.getElementById('card-user-name').textContent = `${firstname} ${lastname}`;
                document.getElementById('card-school-name').textContent = schoolName;
                document.getElementById('success-school-name').innerHTML = `Bienvenue dans la communauté :<br><strong>${schoolName}</strong>`;

                // Switch to success step
                const stepAuth = document.getElementById('modal-step-classic-auth');
                if (stepAuth) stepAuth.style.display = 'none';
                if (stepSuccess) stepSuccess.style.display = 'block';
                registerForm.reset();
            } else {
                // Partner registration success
                const stepPartnerSuccess = document.getElementById('modal-step-partner-success');
                const stepAuth = document.getElementById('modal-step-classic-auth');
                if (stepAuth) stepAuth.style.display = 'none';
                if (stepPartnerSuccess) stepPartnerSuccess.style.display = 'block';
                registerForm.reset();
            }
        });
    }
});

// Interactive Pricing Section logic under "Comment ça marche"
window.showPartnerPricingSection = (event) => {
    if (event) event.preventDefault();
    const container = document.getElementById('partner-pricing-container');
    if (container) {
        container.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset all selector cards (none are active by default)
        const cards = document.querySelectorAll('.partner-select-card');
        cards.forEach(card => card.classList.remove('active'));

        // Hide all pricing tab content by default
        const contents = document.querySelectorAll('.partner-tab-content');
        contents.forEach(content => content.classList.remove('active'));
    }
};

window.closePartnerPricingModal = () => {
    const container = document.getElementById('partner-pricing-container');
    if (container) {
        container.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.openCharterModal = (event) => {
    if (event) event.preventDefault();
    const container = document.getElementById('charter-modal');
    if (container) {
        container.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeCharterModal = (event) => {
    if (event) event.preventDefault();
    const container = document.getElementById('charter-modal');
    if (container) {
        container.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.selectPartnerTab = (event, tab) => {
    if (event) event.preventDefault();

    // Reset cards active states
    const cards = document.querySelectorAll('.partner-select-card');
    cards.forEach(card => card.classList.remove('active'));

    // Highlight active card
    if (event) {
        event.currentTarget.classList.add('active');
    } else {
        const defaultCard = document.querySelector(`.partner-select-card[onclick*="'${tab}'"]`);
        if (defaultCard) defaultCard.classList.add('active');
    }

    // Hide all pricing contents
    const contents = document.querySelectorAll('.partner-tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Show selected pricing content
    const selectedContent = document.getElementById(`pricing-tab-${tab}`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
};

window.openPartnerAuthModal = (event, partnerType, tab) => {
    if (event) event.preventDefault();

    // Close pricing modal first
    window.closePartnerPricingModal();

    const modal = document.getElementById('onboarding-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Custom referrer to hide back button
        window.openClassicAuth(partnerType, tab);

        // Access states inside the DOM scope
        const backBtn = document.getElementById('auth-back-btn');
        if (backBtn) backBtn.style.display = 'none';
    }
};

window.closePartnerPricingAndContact = (event, profile) => {
    if (event) event.preventDefault();

    // Close pricing modal
    window.closePartnerPricingModal();

    // Autofill contact subject
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        if (profile === 'other' || profile === 'partner') {
            subjectSelect.value = 'partner';
        } else if (profile === 'school' || profile === 'club') {
            subjectSelect.value = 'school';
        }
    }

    setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 300);
};

// --- Espace Points Verts (Parents) Logic ---
let userPointsVerts = 150;

window.openPointsVertsModal = (event) => {
    if (event) event.preventDefault();
    const container = document.getElementById('points-verts-modal');
    if (container) {
        updatePointsDisplay();
        container.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closePointsVertsModal = () => {
    const container = document.getElementById('points-verts-modal');
    if (container) {
        container.classList.remove('active');
        document.body.style.overflow = '';
    }
};

function updatePointsDisplay() {
    const balanceNum = document.getElementById('points-balance-value');
    if (balanceNum) {
        balanceNum.innerHTML = `${userPointsVerts} <span style="font-size: 18px; font-weight: 500; opacity: 0.9;">Points Verts</span>`;
    }
}

window.redeemOffer = (merchantName, cost) => {
    if (userPointsVerts >= cost) {
        userPointsVerts -= cost;
        updatePointsDisplay();

        // Show a beautiful toast notification
        showToast(`🎉 Succès : Offre chez ${merchantName} échangée (-${cost} pts) !`, 'success');

        // Add to history list dynamically
        const historyList = document.getElementById('points-history-list');
        if (historyList) {
            const newItem = document.createElement('div');
            newItem.style.borderLeft = '3px solid #fe6d73'; // coral border for spent points
            newItem.style.paddingLeft = '10px';
            newItem.style.fontSize = '12.5px';
            newItem.style.animation = 'slideIn 0.3s ease-out forwards';
            newItem.innerHTML = `
                <span style="font-weight: 700; color: #fe6d73; display: block;">-${cost} Points Verts</span>
                <span style="color: var(--main-blue); font-weight: 600;">Échange : ${merchantName}</span>
                <p style="margin: 2px 0 0 0; color: #888; font-size: 11px;">À l'instant</p>
            `;
            historyList.insertBefore(newItem, historyList.firstChild);
        }
    } else {
        showToast(`⚠️ Solde insuffisant pour obtenir cette offre (${cost} pts requis).`, 'error');
    }
};

// Global toast utility
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '30px';
        container.style.right = '30px';
        container.style.zIndex = '10000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = '12px';
    toast.style.color = 'white';
    toast.style.fontWeight = '600';
    toast.style.fontSize = '14px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    toast.style.animation = 'slideIn 0.3s ease-out forwards';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.transition = 'all 0.3s ease';

    if (type === 'success') {
        toast.style.backgroundColor = '#17c3b2'; // mint
    } else {
        toast.style.backgroundColor = '#fe6d73'; // coral
    }

    toast.innerText = message;
    container.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// --- Espace Parents Dashboard Logic ---
window.openParentDashboard = () => {
    const container = document.getElementById('dashboard-modal');
    if (container) {
        // Reset to passenger mode by default
        window.switchDashboardMode('passenger');
        container.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeDashboardModal = () => {
    const container = document.getElementById('dashboard-modal');
    if (container) {
        container.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.switchDashboardMode = (mode) => {
    const viewPassenger = document.getElementById('dash-view-passenger');
    const viewDriver = document.getElementById('dash-view-driver');
    const btnPassenger = document.getElementById('btn-dash-passenger');
    const btnDriver = document.getElementById('btn-dash-driver');

    if (mode === 'passenger') {
        if (viewPassenger) viewPassenger.style.display = 'block';
        if (viewDriver) viewDriver.style.display = 'none';
        if (btnPassenger) btnPassenger.classList.add('active');
        if (btnDriver) btnDriver.classList.remove('active');
    } else {
        if (viewPassenger) viewPassenger.style.display = 'none';
        if (viewDriver) viewDriver.style.display = 'block';
        if (btnPassenger) btnPassenger.classList.remove('active');
        if (btnDriver) btnDriver.classList.add('active');
    }
};

window.requestRide = (buttonEl, driverName) => {
    if (!buttonEl) return;

    // Disable and change visual state
    buttonEl.disabled = true;
    buttonEl.style.backgroundColor = "#ccc";
    buttonEl.style.color = "#fff";
    buttonEl.textContent = "Demande envoyée...";

    showToast(`🎉 Demande envoyée à ${driverName} ! Vous recevrez une alerte dès validation.`, 'success');

    setTimeout(() => {
        buttonEl.textContent = "En attente...";
    }, 1000);
};

window.acceptRide = (buttonEl, childName) => {
    if (!buttonEl) return;

    // Disable and change visual state
    buttonEl.disabled = true;
    buttonEl.style.backgroundColor = "var(--water-green)";
    buttonEl.style.color = "#fff";
    buttonEl.textContent = "Validé ✓";

    // Disable the sibling refuse button
    const row = buttonEl.closest('.points-verts-flex-row');
    if (row) {
        const declineBtn = row.querySelector('.btn-secondary-outline');
        if (declineBtn) declineBtn.style.display = 'none';
    }

    showToast(`🎉 Demande de ${childName} acceptée ! Le QR Code de sécurité est disponible.`, 'success');
};

window.declineRide = (buttonEl) => {
    if (!buttonEl) return;

    const row = buttonEl.closest('.points-verts-flex-row');
    if (row) {
        row.style.opacity = '0.5';
        buttonEl.disabled = true;
        const acceptBtn = row.querySelector('.btn-mint');
        if (acceptBtn) acceptBtn.style.display = 'none';
        showToast("Demande refusée.", 'error');
    }
};

window.updatePassengerSearch = () => {
    const from = document.getElementById('dash-search-from').value;
    const to = document.getElementById('dash-search-to').value;
    const time = document.getElementById('dash-search-time').value;

    showToast(`🔍 Recherche mise à jour de "${from}" vers "${to}" pour ${time}.`, 'success');
};

let isDriverEditing = false;
window.toggleDriverEdit = () => {
    const displayDiv = document.getElementById('driver-trajet-display');
    const editDiv = document.getElementById('driver-trajet-edit');
    const btn = document.getElementById('btn-driver-edit-toggle');

    if (!isDriverEditing) {
        // Start editing
        if (displayDiv) displayDiv.style.display = 'none';
        if (editDiv) editDiv.style.display = 'block';
        if (btn) {
            btn.textContent = "Enregistrer";
            btn.style.backgroundColor = "var(--water-green)";
            btn.style.color = "white";
        }
        isDriverEditing = true;
    } else {
        // Save
        const routeVal = document.getElementById('edit-driver-route').value;
        const timeVal = document.getElementById('edit-driver-time').value;

        const routeStrong = document.getElementById('driver-trajet-route');
        const timeSpan = document.getElementById('driver-trajet-time');

        if (routeStrong) routeStrong.textContent = routeVal;
        if (timeSpan) timeSpan.textContent = timeVal;

        if (displayDiv) displayDiv.style.display = 'block';
        if (editDiv) editDiv.style.display = 'none';
        if (btn) {
            btn.textContent = "Modifier";
            btn.style.backgroundColor = "";
            btn.style.color = "";
        }
        isDriverEditing = false;
        showToast("✏️ Trajet mis à jour avec succès !", "success");
    }
};

// --- Espace Partenaires (School & Club) Dashboard Logic ---
window.openPartnerDashboard = (profile) => {
    const container = document.getElementById('partner-dashboard-modal');
    if (container) {
        // Adjust titles based on profile (school vs club vs merchant)
        const titleEl = document.getElementById('partner-dash-title');
        const subtitleEl = document.getElementById('partner-dash-subtitle');
        const linesHeader = document.getElementById('partner-lines-header');

        // Members list labels
        const schoolLabel1 = document.getElementById('partner-member-school-1');
        const schoolLabel2 = document.getElementById('partner-member-school-2');
        const schoolLabel3 = document.getElementById('partner-member-school-3');

        // Stats elements
        const familiesInput = document.getElementById('partner-stat-families');
        const ridesInput = document.getElementById('partner-stat-rides');
        const co2El = document.getElementById('partner-stat-co2');

        // Lines elements
        const lineTitle1 = document.getElementById('school-line-title-1');
        const lineDesc1 = document.getElementById('school-line-desc-1');
        const editLineTitle1 = document.getElementById('edit-school-line-title-1');
        const editLineDesc1 = document.getElementById('edit-school-line-desc-1');

        const lineTitle2 = document.getElementById('school-line-title-2');
        const lineDesc2 = document.getElementById('school-line-desc-2');
        const editLineTitle2 = document.getElementById('edit-school-line-title-2');
        const editLineDesc2 = document.getElementById('edit-school-line-desc-2');

        if (profile === 'school') {
            if (titleEl) titleEl.textContent = "Espace École — Jules Ferry";
            if (subtitleEl) subtitleEl.textContent = "Portail d'administration et de suivi du covoiturage scolaire";
            if (linesHeader) linesHeader.textContent = "Lignes de covoiturage actives";
            if (schoolLabel1) schoolLabel1.textContent = "Maman de Thomas (8 ans) • École Jules Ferry";
            if (schoolLabel2) schoolLabel2.textContent = "Papa de Lucas (10 ans) • École Jules Ferry";
            if (schoolLabel3) schoolLabel3.textContent = "Maman de Léa (9 ans) • École Jules Ferry";

            if (familiesInput) familiesInput.value = "84";
            if (ridesInput) ridesInput.value = "312";
            if (co2El) co2El.textContent = "1 240 kg";

            if (lineTitle1) lineTitle1.textContent = "Ligne 1 : Castelnau-le-Lez ➔ École";
            if (lineDesc1) lineDesc1.textContent = "Départ 08:00 • 12 enfants inscrits";
            if (editLineTitle1) editLineTitle1.value = "Ligne 1 : Castelnau-le-Lez ➔ École";
            if (editLineDesc1) editLineDesc1.value = "Départ 08:00 • 12 enfants inscrits";

            if (lineTitle2) lineTitle2.textContent = "Ligne 2 : Rond-point Lachenal ➔ École";
            if (lineDesc2) lineDesc2.textContent = "Départ 08:10 • 8 enfants inscrits";
            if (editLineTitle2) editLineTitle2.value = "Ligne 2 : Rond-point Lachenal ➔ École";
            if (editLineDesc2) editLineDesc2.value = "Départ 08:10 • 8 enfants inscrits";

        } else if (profile === 'club') {
            if (titleEl) titleEl.textContent = "Espace Club — Castelnau Basket";
            if (subtitleEl) subtitleEl.textContent = "Portail de suivi de la mobilité de vos adhérents sportifs";
            if (linesHeader) linesHeader.textContent = "Lignes de ramassage du club";
            if (schoolLabel1) schoolLabel1.textContent = "Maman de Thomas (8 ans) • U11 Garçons";
            if (schoolLabel2) schoolLabel2.textContent = "Papa de Lucas (10 ans) • U13 Garçons";
            if (schoolLabel3) schoolLabel3.textContent = "Maman de Léa (9 ans) • U11 Filles";

            if (familiesInput) familiesInput.value = "42";
            if (ridesInput) ridesInput.value = "156";
            if (co2El) co2El.textContent = "620 kg";

            if (lineTitle1) lineTitle1.textContent = "Ligne U11 : Gymnase Municipal ➔ Matchs";
            if (lineDesc1) lineDesc1.textContent = "Départ Mercredi 14:00 • 16 inscrits";
            if (editLineTitle1) editLineTitle1.value = "Ligne U11 : Gymnase Municipal ➔ Matchs";
            if (editLineDesc1) editLineDesc1.value = "Départ Mercredi 14:00 • 16 inscrits";

            if (lineTitle2) lineTitle2.textContent = "Ligne U13 : Piscine ➔ Entraînements";
            if (lineDesc2) lineDesc2.textContent = "Départ Samedi 09:30 • 10 inscrits";
            if (editLineTitle2) editLineTitle2.value = "Ligne U13 : Piscine ➔ Entraînements";
            if (editLineDesc2) editLineDesc2.value = "Départ Samedi 09:30 • 10 inscrits";
        } else {
            if (titleEl) titleEl.textContent = "Espace Partenaire — Kids à bord";
            if (subtitleEl) subtitleEl.textContent = "Suivi de votre impact local";
        }

        container.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closePartnerDashboardModal = () => {
    const container = document.getElementById('partner-dashboard-modal');
    if (container) {
        container.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.updatePartnerStats = () => {
    const familiesVal = document.getElementById('partner-stat-families').value;
    const ridesVal = document.getElementById('partner-stat-rides').value;

    showToast(`📊 Statistiques mises à jour : ${familiesVal} familles actives & ${ridesVal} trajets partagés.`, 'success');
};

window.remindParent = (buttonEl, parentName) => {
    if (!buttonEl) return;

    buttonEl.disabled = true;
    buttonEl.textContent = "Rappel envoyé ✉️";
    buttonEl.style.backgroundColor = "#ccc";

    showToast(`✉️ Email de rappel envoyé à ${parentName} pour la signature de la charte.`, 'success');
};

const schoolLineEditingStates = {};

window.toggleSchoolLineEdit = (lineId) => {
    const displayDiv = document.getElementById(`school-line-display-${lineId}`);
    const editDiv = document.getElementById(`school-line-edit-${lineId}`);
    const btn = document.getElementById(`btn-school-line-edit-${lineId}`);

    if (!schoolLineEditingStates[lineId]) {
        // Edit mode
        if (displayDiv) displayDiv.style.display = 'none';
        if (editDiv) editDiv.style.display = 'block';
        if (btn) {
            btn.textContent = "Enregistrer";
            btn.style.backgroundColor = "var(--water-green)";
            btn.style.color = "white";
        }
        schoolLineEditingStates[lineId] = true;
    } else {
        // Save mode
        const titleVal = document.getElementById(`edit-school-line-title-${lineId}`).value;
        const descVal = document.getElementById(`edit-school-line-desc-${lineId}`).value;

        const titleText = document.getElementById(`school-line-title-${lineId}`);
        const descText = document.getElementById(`school-line-desc-${lineId}`);

        if (titleText) titleText.textContent = titleVal;
        if (descText) descText.textContent = descVal;

        if (displayDiv) displayDiv.style.display = 'block';
        if (editDiv) editDiv.style.display = 'none';
        if (btn) {
            btn.textContent = "Modifier";
            btn.style.backgroundColor = "";
            btn.style.color = "";
        }
        schoolLineEditingStates[lineId] = false;
        showToast("✏️ Ligne de covoiturage mise à jour !", "success");
    }
};

// --- Espace Commerçants & Autres (Merchant & Other) Dashboard Logic ---
window.openMerchantDashboard = (profile) => {
    const container = document.getElementById('merchant-dashboard-modal');
    if (container) {
        const titleEl = document.getElementById('merchant-dash-title');
        const subtitleEl = document.getElementById('merchant-dash-subtitle');

        if (profile === 'merchant') {
            if (titleEl) titleEl.textContent = "Espace Commerçant — Boulangerie L'Épi d'Or";
            if (subtitleEl) subtitleEl.textContent = "Programme Points Verts & Fidélité locale";
        } else {
            if (titleEl) titleEl.textContent = "Espace Partenaire — Association Autre";
            if (subtitleEl) subtitleEl.textContent = "Suivi de votre impact local et récompenses parentales";
        }

        container.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeMerchantDashboardModal = () => {
    const container = document.getElementById('merchant-dashboard-modal');
    if (container) {
        container.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.updateMerchantStats = () => {
    const points = document.getElementById('merchant-stat-points').value;
    const vouchers = document.getElementById('merchant-stat-vouchers').value;
    const visits = document.getElementById('merchant-stat-visits').value;

    showToast(`📊 Indicateurs commerçant enregistrés : ${points} pts distribués, ${vouchers} bons, ${visits} visites.`, 'success');
};

const merchantOfferEditingStates = {};
window.toggleMerchantOfferEdit = (offerId) => {
    const displayDiv = document.getElementById(`merchant-offer-display-${offerId}`);
    const editDiv = document.getElementById(`merchant-offer-edit-${offerId}`);
    const btn = document.getElementById(`btn-merchant-offer-edit-${offerId}`);

    if (!merchantOfferEditingStates[offerId]) {
        // Edit mode
        if (displayDiv) displayDiv.style.display = 'none';
        if (editDiv) editDiv.style.display = 'block';
        if (btn) {
            btn.textContent = "Enregistrer";
            btn.style.backgroundColor = "var(--water-green)";
            btn.style.color = "white";
        }
        merchantOfferEditingStates[offerId] = true;
    } else {
        // Save mode
        const titleVal = document.getElementById(`edit-merchant-offer-title-${offerId}`).value;
        const descVal = document.getElementById(`edit-merchant-offer-desc-${offerId}`).value;

        const titleText = document.getElementById(`merchant-offer-title-${offerId}`);
        const descText = document.getElementById(`merchant-offer-desc-${offerId}`);

        if (titleText) titleText.textContent = titleVal;
        if (descText) descText.textContent = descVal;

        if (displayDiv) displayDiv.style.display = 'block';
        if (editDiv) editDiv.style.display = 'none';
        if (btn) {
            btn.textContent = "Modifier";
            btn.style.backgroundColor = "";
            btn.style.color = "";
        }
        merchantOfferEditingStates[offerId] = false;
        showToast("✏️ Offre Points Verts mise à jour !", "success");
    }
};

// --- Espace Collectivités (Local Authority) Dashboard Logic ---
window.openAuthorityDashboard = () => {
    const container = document.getElementById('authority-dashboard-modal');
    if (container) {
        container.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeAuthorityDashboardModal = () => {
    const container = document.getElementById('authority-dashboard-modal');
    if (container) {
        container.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.updateAuthorityStats = () => {
    const families = document.getElementById('authority-stat-families').value;
    const schools = document.getElementById('authority-stat-schools').value;
    const budget = document.getElementById('authority-stat-budget').value;

    showToast(`📊 Indicateurs collectivité enregistrés : ${families} familles, ${schools} écoles, budget de ${budget}€.`, 'success');
};

// --- Proposer des Offres (Merchant Offers Management) ---
window.showCreateOfferForm = () => {
    const formContainer = document.getElementById('create-offer-form-container');
    if (formContainer) {
        formContainer.style.display = 'block';
    }
};

window.cancelCreateOffer = () => {
    const formContainer = document.getElementById('create-offer-form-container');
    if (formContainer) {
        formContainer.style.display = 'none';
        document.getElementById('new-offer-title').value = '';
        document.getElementById('new-offer-points').value = '30';
        document.getElementById('new-offer-conditions').value = '';
    }
};

window.submitNewOffer = () => {
    const type = document.getElementById('new-offer-type').value;
    const title = document.getElementById('new-offer-title').value.trim();
    const points = document.getElementById('new-offer-points').value;
    const conditions = document.getElementById('new-offer-conditions').value.trim();

    if (!title) {
        showToast("⚠️ Veuillez entrer un titre pour l'offre.", "error");
        return;
    }

    const listContainer = document.getElementById('merchant-offers-list');
    if (listContainer) {
        const newId = Date.now();
        const newOfferDiv = document.createElement('div');
        newOfferDiv.style.backgroundColor = 'var(--cream)';
        newOfferDiv.style.border = '1px solid rgba(0,0,0,0.04)';
        newOfferDiv.style.padding = '15px';
        newOfferDiv.style.borderRadius = '16px';

        newOfferDiv.innerHTML = `
            <div id="merchant-offer-display-${newId}">
                <strong id="merchant-offer-title-${newId}" style="display: block; font-size: 13.5px; color: var(--main-blue);">${type} : ${title}</strong>
                <span id="merchant-offer-desc-${newId}" style="font-size: 12px; color: #666; display: block; margin-top: 3px;">Coût : ${points} pts • ${conditions || 'Sans condition'}</span>
            </div>
            <div id="merchant-offer-edit-${newId}" style="display: none; margin-bottom: 8px;">
                <input type="text" id="edit-merchant-offer-title-${newId}" value="${type} : ${title}" style="width: 100%; border: 1px solid rgba(0,0,0,0.1); padding: 5px 8px; border-radius: 6px; font-size: 12.5px; margin-bottom: 5px;">
                <input type="text" id="edit-merchant-offer-desc-${newId}" value="Coût : ${points} pts • ${conditions || 'Sans condition'}" style="width: 100%; border: 1px solid rgba(0,0,0,0.1); padding: 5px 8px; border-radius: 6px; font-size: 12px;">
            </div>
            <div style="text-align: right; margin-top: 8px;">
                <button type="button" id="btn-merchant-offer-edit-${newId}" class="btn-secondary-outline" onclick="toggleMerchantOfferEdit('${newId}')" style="padding: 4px 10px; font-size: 11px; border-radius: 50px;">Modifier</button>
            </div>
        `;
        listContainer.appendChild(newOfferDiv);

        cancelCreateOffer();
        showToast("🎉 Offre fidélité ajoutée avec succès !", "success");
    }
};

// --- Interactive Map of France (Leaflet) ---
document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById('map-leaflet');
    if (mapElement) {
        // Initialize Map centered on France
        const map = L.map('map-leaflet', {
            center: [46.2276, 2.2137],
            zoom: 5.5,
            zoomControl: true,
            scrollWheelZoom: false
        });

        // Add beautiful minimalist light tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Custom pulsing marker icon for Montpellier
        const customPulseIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `
                <div style="position: relative; width: 40px; height: 40px;">
                    <div style="position: absolute; top: 50%; left: 50%; width: 28px; height: 28px; background: var(--water-green); border-radius: 50%; opacity: 0.4; animation: mapPulse 2s infinite;"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: var(--water-green); border: 2.5px solid white; border-radius: 50%; box-shadow: 0 2px 10px rgba(0,0,0,0.25);"></div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        // Add marker at Montpellier coordinates
        const marker = L.marker([43.6107, 3.8767], { icon: customPulseIcon }).addTo(map);

        // Custom popup content
        marker.bindPopup(`
            <div style="font-family: var(--font-title); padding: 5px; text-align: center; min-width: 160px;">
                <h4 style="margin: 0 0 5px; color: var(--main-blue); font-size: 13.5px; font-weight: 700;">Kids à bord — Montpellier</h4>
                <p style="margin: 0 0 8px; color: #666; font-size: 11px; line-height: 1.4;">Siège Social &<br>Déploiement initial</p>
                <button type="button" class="btn-mint" onclick="window.celebrateMontpellier()" style="padding: 4px 10px; font-size: 10px; border-radius: 6px; border: none; cursor: pointer; color: white; font-weight: 700; width: 100%;">Découvrir</button>
            </div>
        `);

        // Open by default
        setTimeout(() => {
            marker.openPopup();
        }, 500);
    }
});

window.celebrateMontpellier = () => {
    showToast("☀️ Bienvenue à Montpellier ! C'est ici que l'aventure Kids à bord a commencé.", "success");
};

