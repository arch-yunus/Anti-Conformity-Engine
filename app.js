// ACE-Core Main Application Logic
import { AuditModule } from './modules/audit.js';
import { FrictionModule } from './modules/friction.js';
import { ContentmentModule } from './modules/contentment.js';

class ACEApp {
    constructor() {
        this.state = {
            willpower: 0,
            audits: [],
            challenges: [],
            activeView: 'dashboard'
        };

        this.init();
    }

    init() {
        this.loadState();
        this.setupNavigation();
        this.updateUI();

        // Initialize Modules
        this.auditModule = new AuditModule(this);
        this.frictionModule = new FrictionModule(this);
        this.contentmentModule = new ContentmentModule(this);

        console.log('ACE-Core Initialized. Resistance is functional.');
    }

    loadState() {
        const savedState = localStorage.getItem('ace_state');
        if (savedState) {
            this.state = JSON.parse(savedState);
        }
    }

    saveState() {
        localStorage.setItem('ace_state', JSON.stringify(this.state));
        this.updateUI();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('#main-nav button');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const viewId = btn.getAttribute('data-view');
                this.switchView(viewId);
                
                // Update active button state
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchView(viewId) {
        this.state.activeView = viewId;
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            view.classList.remove('active');
            if (view.id === viewId) {
                view.classList.add('active');
            }
        });
    }

    updateUI() {
        // Update Willpower displays
        const wpValue = document.getElementById('wp-value');
        const navWpValue = document.getElementById('nav-wp-value');
        const resistanceLabel = document.getElementById('resistance-label');

        if (wpValue) wpValue.textContent = this.state.willpower;
        if (navWpValue) navWpValue.textContent = this.state.willpower;

        if (resistanceLabel) {
            if (this.state.willpower < 50) resistanceLabel.textContent = 'Dormant';
            else if (this.state.willpower < 200) resistanceLabel.textContent = 'Awakened';
            else if (this.state.willpower < 500) resistanceLabel.textContent = 'Resistant';
            else resistanceLabel.textContent = 'Unbreakable';
        }

        this.renderDashboardLists();
    }

    renderDashboardLists() {
        const challengesList = document.getElementById('active-challenges-list');
        const auditsList = document.getElementById('recent-audits-list');

        if (challengesList) {
            const active = this.state.challenges.filter(c => !c.completed);
            if (active.length > 0) {
                challengesList.innerHTML = active.map(c => `
                    <div class="challenge-item" style="padding: 10px; border-bottom: 1px solid #222; margin-bottom: 5px;">
                        <span style="color: var(--accent-color); font-weight: 700;">[X]</span> ${c.title}
                    </div>
                `).join('');
            } else {
                challengesList.innerHTML = `<p style="color: var(--text-secondary); font-style: italic;">No active friction. Systematic uyuşukluk imminent.</p>`;
            }
        }

        if (auditsList) {
            if (this.state.audits.length > 0) {
                const recent = this.state.audits.slice(-3).reverse();
                auditsList.innerHTML = recent.map(a => `
                    <div class="audit-item" style="padding: 10px; border-bottom: 1px solid #222; margin-bottom: 5px;">
                        <span style="color: var(--text-secondary); font-size: 0.7rem;">${a.category.toUpperCase()}</span><br>
                        ${a.desc.substring(0, 40)}${a.desc.length > 40 ? '...' : ''}
                    </div>
                `).join('');
            } else {
                auditsList.innerHTML = `<p style="color: var(--text-secondary); font-style: italic;">Memory bank empty. Establish baseline.</p>`;
            }
        }
    }

    addWillpower(amount) {
        this.state.willpower += amount;
        this.saveState();
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', () => {
    window.ace = new ACEApp();
});
