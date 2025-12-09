// js/components/DonutChart.js
import { BaseChart } from './BaseChart.js';

export class DonutChart extends BaseChart {
    constructor(containerId, data) {
        super(containerId);
        this.data = data;
    }

    draw() {
        this.initSVG();

        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(this.width, this.height) / 2 - 20; 
        const holeRadius = radius * 0.6; 

        let accumulatedAngle = 0; 
        const totalValue = this.data.reduce((acc, curr) => acc + curr.value, 0);

        // Gruppo principale
        const chartGroup = document.createElementNS(this.svgNS, 'g');
        
        this.data.forEach((slice, index) => {
            // Calcolo geometria (invariato)
            const sliceAngle = (slice.value / totalValue) * 2 * Math.PI;
            
            const x1 = centerX + radius * Math.cos(accumulatedAngle);
            const y1 = centerY + radius * Math.sin(accumulatedAngle);
            const x2 = centerX + radius * Math.cos(accumulatedAngle + sliceAngle);
            const y2 = centerY + radius * Math.sin(accumulatedAngle + sliceAngle);
            
            const x3 = centerX + holeRadius * Math.cos(accumulatedAngle + sliceAngle);
            const y3 = centerY + holeRadius * Math.sin(accumulatedAngle + sliceAngle);
            const x4 = centerX + holeRadius * Math.cos(accumulatedAngle);
            const y4 = centerY + holeRadius * Math.sin(accumulatedAngle);

            const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

            const pathData = [
                `M ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `L ${x3} ${y3}`,
                `A ${holeRadius} ${holeRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                `Z`
            ].join(' ');

            const path = document.createElementNS(this.svgNS, 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('fill', slice.color);
            path.setAttribute('stroke', '#fff');
            path.setAttribute('stroke-width', '2');
            path.style.cursor = 'pointer';
            
            // MODIFICA QUI: Rimosso 'transform' dalla transizione, lasciamo solo opacity
            path.style.transition = 'opacity 0.2s'; 

            // Animazione ingresso (GSAP) - Questa rimane perché è l'intro, non l'hover
            if (window.gsap) {
                gsap.from(path, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    transformOrigin: `${centerX}px ${centerY}px`, // Necessario per l'animazione di ingresso corretta
                    ease: "back.out(1.7)"
                });
            }

            // Eventi Mouse - VERSIONE CON DOT A CONTRASTO
            path.addEventListener('mouseenter', (e) => {
                path.style.opacity = '0.7'; 
                
                this.showTooltip(e, `
                    <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:4px;">
                        
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="
                                display:inline-block; 
                                width:12px; 
                                height:12px; 
                                background-color:${slice.color}; 
                                border: 2px solid white; 
                                border-radius:50%;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                            "></span>
                            <strong style="color: #ffffff; font-size:14px;">${slice.label}</strong>
                        </div>
                        
                        <div style="margin-top:4px;">
                            <span style="font-size: 1.4em; font-weight:bold; color: #ffffff">${slice.value}%</span>
                            <div style="font-size: 0.9em; color: #cbd5e1; border-top:1px solid rgba(255,255,255,0.2); padding-top:2px; margin-top:2px;">
                                € ${slice.amount}
                            </div>
                        </div>
                    </div>
                `);
            });

            path.addEventListener('mouseleave', () => {
                // MODIFICA QUI: Ripristino opacità originale, niente scale/transform
                path.style.opacity = '1';
                this.hideTooltip();
            });

            this.svg.appendChild(path);
            accumulatedAngle += sliceAngle;
        });

        // Testo al centro (invariato)
        const textCenter = document.createElementNS(this.svgNS, 'text');
        textCenter.setAttribute('x', centerX);
        textCenter.setAttribute('y', centerY);
        textCenter.setAttribute('text-anchor', 'middle');
        textCenter.setAttribute('dy', '0.3em');
        textCenter.setAttribute('font-weight', 'bold');
        textCenter.setAttribute('fill', '#1a1a1a');
        textCenter.innerHTML = `<tspan font-size="24">167M €</tspan><tspan x="${centerX}" dy="1.4em" font-size="12" fill="#666">Generato</tspan>`;
        
        this.svg.appendChild(textCenter);
    }
}