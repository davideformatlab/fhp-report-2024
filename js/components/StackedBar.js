// js/components/StackedBar.js
import { BaseChart } from './BaseChart.js';

export class StackedBarChart extends BaseChart {
    constructor(containerId, data, configTypes) {
        super(containerId);
        this.originalData = data;
        this.configTypes = configTypes; // La legenda con i colori
        this.activeTypes = new Set(configTypes.map(t => t.id)); // All'inizio tutti attivi
    }

    // Chiamato quando clicchi un bottone filtro
    toggleType(typeId) {
        if (this.activeTypes.has(typeId)) {
            this.activeTypes.delete(typeId);
        } else {
            this.activeTypes.add(typeId);
        }
        this.draw(); // Ridisegna con i nuovi filtri
    }

    draw() {
        this.initSVG();

        // 1. Disegna Griglia e Assi (Y fisso a 7 come nel PDF)
        const maxY = 7;
        const gridGroup = document.createElementNS(this.svgNS, 'g');
        
        for (let i = 0; i <= maxY; i++) {
            const y = this.padding.top + this.chartHeight - (i / maxY) * this.chartHeight;
            
            // Linea orizzontale
            const line = document.createElementNS(this.svgNS, 'line');
            line.setAttribute('x1', this.padding.left);
            line.setAttribute('x2', this.width - this.padding.right);
            line.setAttribute('y1', y);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', '#e2e8f0');
            line.setAttribute('stroke-width', '1');
            
            // Etichetta numero
            const text = document.createElementNS(this.svgNS, 'text');
            text.setAttribute('x', this.padding.left - 10);
            text.setAttribute('y', y + 4);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('fill', '#64748b');
            text.setAttribute('font-size', '12px');
            text.textContent = i;

            gridGroup.appendChild(line);
            gridGroup.appendChild(text);
        }
        this.svg.appendChild(gridGroup);

        // 2. Disegna le Barre
        const slotWidth = this.chartWidth / this.originalData.length;
        const barWidth = slotWidth * 0.5; // La barra occupa il 50% dello spazio disponibile

        this.originalData.forEach((companyData, index) => {
            const xCenter = this.padding.left + (index * slotWidth) + (slotWidth / 2);
            const xLeft = xCenter - (barWidth / 2);
            
            // Etichetta Azienda (sotto la barra)
            const label = document.createElementNS(this.svgNS, 'text');
            label.setAttribute('x', xCenter);
            label.setAttribute('y', this.height - this.padding.bottom + 20);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', '#1a1a1a');
            label.setAttribute('font-size', '11px');
            label.setAttribute('font-weight', 'bold');
            
            // Gestione testo su due righe (Togli "FHP" per pulizia)
            const cleanName = companyData.company.replace('FHP ', '');
            const words = cleanName.split(' ');
            words.forEach((word, wIndex) => {
                const tspan = document.createElementNS(this.svgNS, 'tspan');
                tspan.textContent = word;
                tspan.setAttribute('x', xCenter);
                tspan.setAttribute('dy', wIndex === 0 ? 0 : '1.1em');
                label.appendChild(tspan);
            });
            this.svg.appendChild(label);

            // Costruzione Pila (Stack)
            let currentY = this.height - this.padding.bottom;
            const unitHeight = this.chartHeight / maxY; // Altezza di 1 certificazione

            // Iteriamo sulla CONFIGURAZIONE per mantenere l'ordine dei colori corretto
            this.configTypes.forEach(typeConfig => {
                // Se l'azienda ha la certificazione E il filtro è attivo
                if (companyData.certs.includes(typeConfig.id) && this.activeTypes.has(typeConfig.id)) {
                    
                    const rect = document.createElementNS(this.svgNS, 'rect');
                    rect.setAttribute('x', xLeft);
                    rect.setAttribute('y', currentY - unitHeight);
                    rect.setAttribute('width', barWidth);
                    rect.setAttribute('height', unitHeight - 1); // -1 per fare la righetta bianca tra i blocchi
                    rect.setAttribute('fill', typeConfig.color);
                    rect.style.cursor = 'pointer';
                    rect.style.transition = 'opacity 0.2s';

                    // Animazione ingresso (GSAP)
                    if (window.gsap) {
                        gsap.from(rect, {
                            y: currentY,
                            height: 0,
                            duration: 0.6,
                            ease: "power2.out",
                            delay: index * 0.1
                        });
                    }

                    // Eventi Mouse
                    rect.addEventListener('mouseenter', (e) => {
                        rect.style.opacity = '0.8';
                        this.showTooltip(e, `
                            <strong>${companyData.company}</strong><br>
                            <span style="color:${typeConfig.color}">●</span> ${typeConfig.id}
                        `);
                    });
                    rect.addEventListener('mouseleave', () => {
                        rect.style.opacity = '1';
                        this.hideTooltip();
                    });

                    this.svg.appendChild(rect);
                    currentY -= unitHeight; // Saliamo per il prossimo blocco
                }
            });
        });
    }
}