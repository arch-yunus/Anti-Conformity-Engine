// Comfort Audit Module
export class AuditModule {
    constructor(app) {
        this.app = app;
        this.setupListeners();
    }

    setupListeners() {
        const form = document.getElementById('audit-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAudit();
            });
        }
    }

    handleAudit() {
        const category = document.getElementById('audit-category').value;
        const desc = document.getElementById('audit-desc').value;
        const severity = parseInt(document.getElementById('audit-severity').value);

        if (!desc) {
            alert('Describe the behavior to audit your resistance.');
            return;
        }

        const audit = {
            id: Date.now(),
            category,
            desc,
            severity,
            timestamp: new Date().toISOString()
        };

        this.app.state.audits.push(audit);
        
        // High severity audits (big weaknesses) reduce willpower
        // Low severity (awareness) might slightly increase or stay neutral
        const wpPenalty = Math.floor(severity * 2);
        this.app.state.willpower = Math.max(0, this.app.state.willpower - wpPenalty);
        
        this.app.saveState();
        this.resetForm();
        
        // Visual feedback
        const btn = document.querySelector('#audit-form button');
        const originalText = btn.textContent;
        btn.textContent = 'WEAKNESS LOGGED';
        btn.style.background = 'var(--error-color)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'var(--accent-color)';
            this.app.switchView('dashboard');
        }, 1500);
    }

    resetForm() {
        document.getElementById('audit-form').reset();
    }
}
