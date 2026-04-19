// Contentment OS Module
export class ContentmentModule {
    constructor(app) {
        this.app = app;
        this.setupListeners();
    }

    setupListeners() {
        const needBtn = document.getElementById('filter-need');
        const wantBtn = document.getElementById('filter-want');
        const input = document.getElementById('desire-input');

        if (needBtn && wantBtn && input) {
            needBtn.addEventListener('click', () => this.evaluate(true));
            wantBtn.addEventListener('click', () => this.evaluate(false));
        }
    }

    evaluate(isNeed) {
        const input = document.getElementById('desire-input');
        const result = document.getElementById('filter-result');
        const value = input.value.trim();

        if (!value) {
            alert('Identify the desire to apply the filter.');
            return;
        }

        if (isNeed) {
            result.textContent = 'PROCEED: SUSTENANCE GRANTED.';
            result.style.color = 'var(--success-color)';
            this.app.addWillpower(5); // Small reward for conscious essential consumption
        } else {
            result.textContent = 'REJECTED: MANUFACTURED DESIRE DETECTED. RESIST.';
            result.style.color = 'var(--accent-color)';
            this.app.addWillpower(15); // Larger reward for resisting a want
        }

        input.value = '';
        setTimeout(() => {
            result.textContent = '';
        }, 3000);
    }
}
