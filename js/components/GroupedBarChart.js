// js/components/GroupedBarChart.js
import { BaseChart } from './BaseChart.js';

export class GroupedBarChart extends BaseChart {
    constructor(containerId, data) {
        super(containerId);
        this.data = data;
    }

    draw() {
        this.initSVG();

        // 1. Trova il valore massimo per scalare l'asse Y
        // Cerchiamo il valore più alto tra tutti gli Scope 1 e Scope 2
        const allValues = this.data.flatMap(d => d.values.map(v => v.value));
        const maxValue = Math.max(...allValues);
        // Aggiungiamo un 10% di margine in alto per estetica
        const yMax = Math.ceil(maxValue * 1.1);

        // 2. Disegna Griglia e Assi
        const gridGroup = document.createElementNS(this.svgNS, 'g');
        const ticks = 5; // Numero di righe della griglia

        for (let i = 0; i <= ticks; i++) {
            const val = (yMax / ticks) * i;
            const y = this.chartHeight - (val / yMax) * this.chartHeight + this.padding.top;

            // Linea
            const line = document.createElementNS(this.svgNS, 'line');
            line.setAttribute('x1', this.padding.left);
            line.setAttribute('x2', this.width - this.padding.right);
            line.setAttribute('y1', y);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', '#e2e8f0');
            
            // Testo asse Y
            const text = document.createElementNS(this.svgNS, 'text');
            text.setAttribute('x', this.padding.left - 10);
            text.setAttribute('y', y + 4);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('fill', '#64748b');
            text.setAttribute('font-size', '11px');
            text.textContent = Math.round(val);

            gridGroup.appendChild(line);
            gridGroup.appendChild(text);
        }
        this.svg.appendChild(gridGroup);

        // 3. Disegna le Barre Raggruppate
        const groupWidth = this.chartWidth / this.data.length;
        const barWidth = (groupWidth * 0.6) / 2; // Due barre che occupano il 60% dello spazio disponibile
        const gap = 4; // Spazio tra le due barre dello stesso anno

        this.data.forEach((yearData, i) => {
            // Centro del gruppo (Anno)
            const groupCenter = this.padding.left + (i * groupWidth) + (groupWidth / 2);
            
            // Etichetta Anno (X Axis)
            const label = document.createElementNS(this.svgNS, 'text');
            label.setAttribute('x', groupCenter);
            label.setAttribute('y', this.height - this.padding.bottom + 20);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-weight', 'bold');
            label.setAttribute('fill', '#1a1a1a');
            label.textContent = yearData.year;
            this.svg.appendChild(label);

            // Disegna le barre interne (Scope 1 e Scope 2)
            yearData.values.forEach((v, j) => {
                // Calcolo posizione X: 
                // Se j=0 (Scope 1) va a sinistra del centro
                // Se j=1 (Scope 2) va a destra del centro
                const x = groupCenter + (j === 0 ? -(barWidth + gap/2) : (gap/2));
                
                const barHeight = (v.value / yMax) * this.chartHeight;
                const y = this.chartHeight - barHeight + this.padding.top;

                const rect = document.createElementNS(this.svgNS, 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', barWidth);
                rect.setAttribute('height', barHeight);
                rect.setAttribute('fill', v.color);
                rect.setAttribute('rx', '4'); // Bordi leggermente arrotondati in alto
                rect.style.cursor = 'pointer';
                rect.style.transition = 'opacity 0.2s';

                // Animazione GSAP
                if (window.gsap) {
                    gsap.from(rect, {
                        y: this.chartHeight + this.padding.top,
                        height: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        delay: i * 0.2 + j * 0.1
                    });
                }

                // Tooltip
                rect.addEventListener('mouseenter', (e) => {
                    rect.style.opacity = '0.8';
                    this.showTooltip(e, `
                        <div style="text-align:center">
                            <strong>${yearData.year}</strong><br>
                            <span style="color:${v.color}">●</span> ${v.label}<br>
                            <span style="font-size:1.2em; font-weight:bold">${v.value}</span> tCO₂eq
                        </div>
                    `);
                });

                rect.addEventListener('mouseleave', () => {
                    rect.style.opacity = '1';
                    this.hideTooltip();
                });

                this.svg.appendChild(rect);
            });
        });
    }
} // Fine Classe GroupedBarChart