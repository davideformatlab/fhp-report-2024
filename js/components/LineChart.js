// js/components/LineChart.js
import { BaseChart } from './BaseChart.js';

export class LineChart extends BaseChart {
    constructor(containerId, data) {
        super(containerId);
        this.data = data;
    }

    draw() {
        this.initSVG();

        // 1. Calcoli Scala (Y)
        const maxValue = Math.max(...this.data.map(d => d.injuries));
        const yMax = Math.ceil(maxValue * 1.2); // +20% margine

        // 2. Griglia e Assi
        const gridGroup = document.createElementNS(this.svgNS, 'g');
        const ticks = 4;
        
        for (let i = 0; i <= ticks; i++) {
            const val = (yMax / ticks) * i;
            const y = this.chartHeight - (val / yMax) * this.chartHeight + this.padding.top;

            // Linea Orizzontale
            const line = document.createElementNS(this.svgNS, 'line');
            line.setAttribute('x1', this.padding.left);
            line.setAttribute('x2', this.width - this.padding.right);
            line.setAttribute('y1', y);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', '#f1f5f9'); // Molto leggero
            
            // Etichetta Numero
            const text = document.createElementNS(this.svgNS, 'text');
            text.setAttribute('x', this.padding.left - 15);
            text.setAttribute('y', y + 4);
            text.setAttribute('text-anchor', 'end');
            text.setAttribute('fill', '#94a3b8');
            text.setAttribute('font-size', '11px');
            text.textContent = Math.round(val);

            gridGroup.appendChild(line);
            gridGroup.appendChild(text);
        }
        this.svg.appendChild(gridGroup);

        // 3. Calcolo Punti della Linea
        const stepX = this.chartWidth / (this.data.length - 1);
        
        const points = this.data.map((d, i) => {
            const x = this.padding.left + (i * stepX);
            const y = this.chartHeight - (d.injuries / yMax) * this.chartHeight + this.padding.top;
            return { x, y, data: d };
        });

        // 4. Disegna il Tracciato (Path)
        // Costruiamo la stringa "M x y L x y..."
        const pathD = points.map((p, i) => 
            (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)
        ).join(' ');

        const path = document.createElementNS(this.svgNS, 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#00d2ff'); // Ciano brillante (accento FHP)
        path.setAttribute('stroke-width', '4');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');

        // Animazione "Disegno a mano"
        const length = path.getTotalLength ? path.getTotalLength() : 1000; // Fallback
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length; // Nasconde tutto all'inizio
        
        if (window.gsap) {
            gsap.to(path, {
                strokeDashoffset: 0,
                duration: 2,
                ease: "power2.out",
                delay: 0.5
            });
        } else {
            // Fallback CSS se GSAP non carica
            path.style.transition = "stroke-dashoffset 2s ease-out";
            setTimeout(() => path.style.strokeDashoffset = '0', 100);
        }

        this.svg.appendChild(path);

        // 5. Disegna i Punti (Cerchi) e Etichette X
        points.forEach((p, i) => {
            // Etichetta Anno (Sotto)
            const labelX = document.createElementNS(this.svgNS, 'text');
            labelX.setAttribute('x', p.x);
            labelX.setAttribute('y', this.height - this.padding.bottom + 25);
            labelX.setAttribute('text-anchor', 'middle');
            labelX.setAttribute('font-weight', 'bold');
            labelX.setAttribute('fill', '#1a1a1a');
            labelX.textContent = p.data.year;
            this.svg.appendChild(labelX);

            // Cerchio esterno (Alone)
            const circleHalo = document.createElementNS(this.svgNS, 'circle');
            circleHalo.setAttribute('cx', p.x);
            circleHalo.setAttribute('cy', p.y);
            circleHalo.setAttribute('r', '8');
            circleHalo.setAttribute('fill', '#00d2ff');
            circleHalo.setAttribute('opacity', '0.2');
            
            // Cerchio interno (Punto vero)
            const circle = document.createElementNS(this.svgNS, 'circle');
            circle.setAttribute('cx', p.x);
            circle.setAttribute('cy', p.y);
            circle.setAttribute('r', '5');
            circle.setAttribute('fill', '#fff');
            circle.setAttribute('stroke', '#005EB8'); // Blu FHP
            circle.setAttribute('stroke-width', '3');
            circle.style.cursor = 'pointer';

            // Animazione Pop-in dei punti
            if(window.gsap) {
                gsap.from([circle, circleHalo], {
                    scale: 0,
                    duration: 0.5,
                    delay: 1.5 + (i * 0.2), // Appaiono dopo la linea
                    ease: "back.out(1.7)"
                });
            }

            // Tooltip
            const area = document.createElementNS(this.svgNS, 'circle'); // Area invisibile più grande per hover facile
            area.setAttribute('cx', p.x);
            area.setAttribute('cy', p.y);
            area.setAttribute('r', '20');
            area.setAttribute('fill', 'transparent');
            area.style.cursor = 'pointer';

            area.addEventListener('mouseenter', (e) => {
                circleHalo.setAttribute('opacity', '0.5');
                circleHalo.setAttribute('r', '12');
                this.showTooltip(e, `
                    <div style="text-align:center">
                        <strong>Anno ${p.data.year}</strong><br>
                        Infortuni: <span style="font-size:1.2em; color:#00d2ff; font-weight:bold">${p.data.injuries}</span><br>
                        <small style="color:#ccc">Indice Freq: ${p.data.freq_index}</small>
                    </div>
                `);
            });

            area.addEventListener('mouseleave', () => {
                circleHalo.setAttribute('opacity', '0.2');
                circleHalo.setAttribute('r', '8');
                this.hideTooltip();
            });

            this.svg.appendChild(circleHalo);
            this.svg.appendChild(circle);
            this.svg.appendChild(area);
        });
    }
}