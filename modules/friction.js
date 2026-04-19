// Friction Injection Module
export class FrictionModule {
    constructor(app) {
        this.app = app;
        this.challengePool = [
            { id: 1, title: 'Manual Gear Mode', desc: 'Disable "Autoplay" on all platforms for 24 hours.', wp: 20 },
            { id: 2, title: 'Dopamine Fast', desc: 'No screens for 4 hours. Connect with physical reality.', wp: 50 },
            { id: 3, title: 'Delayed Gratification', desc: 'Wait 48 hours before purchasing any non-essential item.', wp: 30 },
            { id: 4, title: 'Algorithmic Boycott', desc: 'Only watch/read specific items you searched for, no "recommended" feeds.', wp: 25 },
            { id: 5, title: 'Fıtrat Movement', desc: 'Walk to any destination within 2km, regardless of weather.', wp: 15 },
            { id: 6, title: 'The Silent Hour', desc: '60 minutes of solitude with zero digital or audio input.', wp: 40 }
        ];
        this.setupListeners();
        this.renderChallenges();
    }

    setupListeners() {
        const genBtn = document.getElementById('generate-challenge-btn');
        if (genBtn) {
            genBtn.addEventListener('click', () => this.injectFriction());
        }
    }

    injectFriction() {
        // Select a random challenge not already active
        const activeIds = this.app.state.challenges.map(c => c.challengeId);
        const available = this.challengePool.filter(c => !activeIds.includes(c.id));

        if (available.length === 0) {
            alert('Maximum friction reached. Overcome existing hardships first.');
            return;
        }

        const template = available[Math.floor(Math.random() * available.length)];
        const challenge = {
            id: Date.now(),
            challengeId: template.id,
            title: template.title,
            desc: template.desc,
            wpBonus: template.wp,
            completed: false,
            timestamp: new Date().toISOString()
        };

        this.app.state.challenges.push(challenge);
        this.app.saveState();
        this.renderChallenges();
    }

    completeChallenge(id) {
        const challenge = this.app.state.challenges.find(c => c.id === id);
        if (challenge && !challenge.completed) {
            challenge.completed = true;
            this.app.addWillpower(challenge.wpBonus);
            this.app.saveState();
            this.renderChallenges();
        }
    }

    renderChallenges() {
        const container = document.getElementById('available-challenges');
        if (!container) return;

        const active = this.app.state.challenges.filter(c => !c.completed);
        
        if (active.length === 0) {
            container.innerHTML = `
                <div class="card" style="border-style: dashed; text-align: center; opacity: 0.5;">
                    <p>No active friction protocols. Generate one to build willpower.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = active.map(c => `
            <div class="card" style="border-left: 4px solid var(--accent-color);">
                <h3>${c.title}</h3>
                <p style="margin: 10px 0; color: var(--text-secondary);">${c.desc}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span style="font-weight: 800; color: var(--accent-color);">Reward: +${c.wpBonus} WP</span>
                    <button class="btn-outline complete-btn" data-id="${c.id}" style="padding: 5px 15px; font-size: 0.7rem;">Protocol Complete</button>
                </div>
            </div>
        `).join('');

        // Re-attach listeners
        container.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                this.completeChallenge(id);
            });
        });
    }
}
