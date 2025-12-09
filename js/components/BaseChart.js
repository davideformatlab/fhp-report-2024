// js/components/BaseChart.js

export class BaseChart {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) console.error(`Errore: Container #${containerId} non trovato!`);
        
        this.svgNS = 'http://www.w3.org/2000/svg';
        this.svg = null;
        this.width = 0;
        this.height = 0;
        this.padding = { top: 40, right: 20, bottom: 60, left: 60 };
        
        // Crea un tooltip unico appeso al body
        this.tooltip = document.getElementById('global-tooltip');
        if (!this.tooltip) {
            this.tooltip = document.createElement('div');
            this.tooltip.id = 'global-tooltip';
            this.tooltip.style.position = 'fixed';
            this.tooltip.style.padding = '8px 12px';
            this.tooltip.style.background = 'rgba(0, 37, 84, 0.95)'; // Navy Blue FHP
            this.tooltip.style.color = 'white';
            this.tooltip.style.borderRadius = '4px';
            this.tooltip.style.pointerEvents = 'none';
            this.tooltip.style.opacity = '0';
            this.tooltip.style.zIndex = '1000';
            this.tooltip.style.fontSize = '12px';
            this.tooltip.style.transition = 'opacity 0.2s';
            this.tooltip.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            document.body.appendChild(this.tooltip);
        }

        // Gestione Resize automatica
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.draw(), 300);
        });
    }

    initSVG() {
        this.container.innerHTML = '';
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.chartWidth = this.width - this.padding.left - this.padding.right;
        this.chartHeight = this.height - this.padding.top - this.padding.bottom;

        this.svg = document.createElementNS(this.svgNS, 'svg');
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        this.container.appendChild(this.svg);
    }

    showTooltip(e, htmlContent) {
        this.tooltip.innerHTML = htmlContent;
        this.tooltip.style.opacity = '1';
        this.tooltip.style.left = (e.clientX + 15) + 'px';
        this.tooltip.style.top = (e.clientY + 15) + 'px';
    }

    hideTooltip() {
        this.tooltip.style.opacity = '0';
    }

    draw() {
        console.warn('Il metodo draw() deve essere sovrascritto dalla classe figlia');
    }
}