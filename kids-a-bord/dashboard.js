// Switch Tabs Routing
function switchTab(tabId) {
    // Hide all panels
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(panel => panel.classList.remove('active'));

    // Show selected panel
    const selectedPanel = document.getElementById('panel-' + tabId);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }

    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Find the clicked item
    const clickedItem = Array.from(navItems).find(item =>
        item.getAttribute('onclick') && item.getAttribute('onclick').includes(tabId)
    );
    if (clickedItem) {
        clickedItem.classList.add('active');
    }

    // Subtitle updates
    const subtitle = document.getElementById('dashboard-subtitle');
    if (tabId === 'kpi') {
        subtitle.textContent = "Analyse d'impact, diagnostics de campagnes et leviers de pivots.";
    } else if (tabId === 'budget') {
        subtitle.textContent = "Suivi du budget d'investissement et simulateur d'efficacité publicitaire.";
    } else if (tabId === 'gantt') {
        subtitle.textContent = "Calendrier de déploiement et étapes opérationnelles de lancement.";
    }
}

// Show/Hide Diagnostics Drawer
function showDiagnostic(diagId) {
    const drawers = document.querySelectorAll('.diagnostic-drawer');
    const targetDrawer = document.getElementById('diag-' + diagId);

    // Toggle logic
    if (targetDrawer.style.display === 'block') {
        targetDrawer.style.display = 'none';
    } else {
        // Hide others first
        drawers.forEach(drawer => drawer.style.display = 'none');
        targetDrawer.style.display = 'block';
    }
}

// CAC & Acquisition Budget Simulator
document.addEventListener('DOMContentLoaded', () => {
    const sliderParents = document.getElementById('sim-parents');
    const sliderCac = document.getElementById('sim-cac');

    const valParents = document.getElementById('sim-parents-val');
    const valCac = document.getElementById('sim-cac-val');

    const costOld = document.getElementById('sim-old-cost');
    const costNew = document.getElementById('sim-new-cost');

    const labelOldModel = document.querySelector('#card-old-model .sim-result-label');

    const updateSimulation = () => {
        if (!sliderParents || !sliderCac || !costOld || !costNew) return;

        const parentsCount = parseInt(sliderParents.value);
        const cacSimulated = parseFloat(sliderCac.value);

        // Update slider values labels
        valParents.textContent = `${parentsCount} parents`;
        valCac.textContent = `${cacSimulated.toFixed(2)} €`;

        // Calculate costs
        const oldTotalCost = Math.round(parentsCount * cacSimulated);
        const newTotalCost = Math.round(parentsCount * 11.40); // Pivot B2B code model CAC is 11.40€

        // Format as Euros
        costOld.textContent = `${oldTotalCost.toLocaleString('fr-FR')} €`;
        costNew.textContent = `${newTotalCost.toLocaleString('fr-FR')} €`;

        if (labelOldModel) {
            labelOldModel.textContent = `Acquisition Ads payantes (CAC : ${cacSimulated.toFixed(2)} €)`;
        }
    };

    if (sliderParents && sliderCac) {
        sliderParents.addEventListener('input', updateSimulation);
        sliderCac.addEventListener('input', updateSimulation);

        // Initialize values
        updateSimulation();
    }
});

// Gantt Interactive Details
const ganttDetails = {
    legal: {
        title: "⚖️ Phase 1 : Validation Juridique & RGPD (Mois 1)",
        desc: "Rédaction des Conditions Générales d'Utilisation (CGU) clarifiant la responsabilité de covoiturage partagée entre parents. Mise en conformité RGPD pour le stockage sécurisé des données de localisation et de scolarité des enfants. Dépôt de la marque Kids à bord à l'INPI (budget total : 1 800 €)."
    },
    b2b: {
        title: "🏫 Phase 2 : Partenariats B2B (Mois 2-3)",
        desc: "Négociation et signature des conventions cadres avec les écoles primaires de Montpellier et les APE (Associations de Parents d'Élèves). Cette démarche permet de distribuer les 'Codes de confiance' dans les carnets de liaison des enfants et d'obtenir un canal d'acquisition gratuit et hautement sécurisé."
    },
    dev: {
        title: "💻 Phase 3 : Développement MVP (Mois 1-2)",
        desc: "Développement technique de la plateforme web légère et mobile-first. Intégration du système de cartes virtuelles sécurisées, du simulateur de gains écologiques (ADEME) et du protocole de remise par scan de QR Code pour sécuriser les trajets (budget total : 10 500 €)."
    },
    camp1: {
        title: "🚀 Phase 4 : Campagne Acquisition 'La Rentrée Sereine' (Mois 3-4)",
        desc: "Lancement du pilote à Montpellier lors de la rentrée scolaire. Déploiement des kits physiques (flyers, affiches) dans les écoles partenaires et campagnes ciblées locales. Objectif de recrutement initial de 50 parents avec levée complète des freins administratifs grâce au Code de confiance."
    },
    camp2: {
        title: "🏆 Phase 5 : Défi Éco-quartier & Rétention (Mois 5-6)",
        desc: "Challenge de fidélisation par le jeu pour inciter à la régularité. Activation de la Charte de Ponctualité obligatoire pour protéger le temps de conduite et éviter l'abandon des parents pilotes. Mise en valeur des Points Verts échangeables auprès des commerces locaux partenaires (boulangers, primeurs)."
    }
};

function showGanttDetail(phaseKey) {
    const detailBox = document.getElementById('gantt-detail-box');
    const title = document.getElementById('gantt-detail-title');
    const desc = document.getElementById('gantt-detail-desc');

    if (detailBox && title && desc && ganttDetails[phaseKey]) {
        title.textContent = ganttDetails[phaseKey].title;
        desc.textContent = ganttDetails[phaseKey].desc;
        detailBox.style.display = 'block';

        // Scroll smoothly to detail box
        detailBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
