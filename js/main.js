// js/main.js

// 1. IMPORTIAMO TUTTI I DATI E I COMPONENTI NECESSARI
import { DATA_CERTIFICAZIONI, CONFIG_CERTIFICAZIONI, DATA_VALORE_ECONOMICO, DATA_EMISSIONI, DATA_SICUREZZA } from './data.js';
import { StackedBarChart } from './components/StackedBar.js';
import { DonutChart } from './components/DonutChart.js';
import { GroupedBarChart } from './components/GroupedBarChart.js';
import { LineChart } from './components/LineChart.js';

// --- FUNZIONE DI UTILITÀ: Attiva il grafico solo quando è visibile ---
const observeAndDraw = (chartInstance) => {
    // Configuriamo l'osservatore
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            // Se l'elemento è visibile almeno al 20% (threshold: 0.2)
            if (entry.isIntersecting) {
                chartInstance.draw(); // Lancia l'animazione GSAP
                obs.unobserve(entry.target); // Smetti di osservare (lo facciamo una volta sola)
            }
        });
    }, { threshold: 0.2 }); // 0.2 significa "quando il 20% del grafico è visibile"

    // Iniziamo a osservare il contenitore del grafico
    observer.observe(chartInstance.container);
};


// --- A. Inizializzazione Grafico Certificazioni (Barre) ---
const certChart = new StackedBarChart(
    'chart-certificazioni', 
    DATA_CERTIFICAZIONI, 
    CONFIG_CERTIFICAZIONI
);
// Invece di certChart.draw(), usiamo la nostra funzione:
observeAndDraw(certChart);


// --- B. Generazione Controlli (Bottoni Legenda) ---
const controlsContainer = document.getElementById('controls-cert');

CONFIG_CERTIFICAZIONI.forEach(type => {
    const btn = document.createElement('button');
    
    // Stile base bottone
    btn.style.border = `1px solid ${type.color}`;
    btn.style.background = 'white'; 
    btn.style.color = '#333';
    btn.style.padding = '6px 12px';
    btn.style.margin = '0 5px 5px 0';
    btn.style.borderRadius = '20px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '6px';
    btn.style.transition = 'all 0.2s';

    // Pallino colorato
    const dot = document.createElement('span');
    dot.style.width = '10px';
    dot.style.height = '10px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = type.color;
    btn.appendChild(dot);
    
    // Testo
    const text = document.createTextNode(type.id);
    btn.appendChild(text);

    // Stato Attivo/Disattivo
    let isActive = true;
    
    const setActiveStyle = (active) => {
        if (active) {
            btn.style.opacity = '1';
            btn.style.background = '#f0f9ff';
            dot.style.backgroundColor = type.color;
        } else {
            btn.style.opacity = '0.5';
            btn.style.background = 'transparent';
            dot.style.backgroundColor = '#ccc';
        }
    };
    setActiveStyle(true);

    // Gestione Click
    btn.onclick = () => {
        isActive = !isActive;
        setActiveStyle(isActive);
        certChart.toggleType(type.id); // Questo ridisegna immediatamente se cliccato
    };

    controlsContainer.appendChild(btn);
}); 


// --- C. Inizializzazione Grafico Economico (Ciambella) ---
const economicChart = new DonutChart(
    'chart-economico', 
    DATA_VALORE_ECONOMICO
);
observeAndDraw(economicChart); // <--- Scroll trigger


// --- D. Inizializzazione Grafico Ambiente (Barre Raggruppate) ---
const envChart = new GroupedBarChart(
    'chart-ambiente',
    DATA_EMISSIONI
);
observeAndDraw(envChart); // <--- Scroll trigger


// --- E. Inizializzazione Grafico Sicurezza (Linee) ---
const safetyChart = new LineChart(
    'chart-sicurezza',
    DATA_SICUREZZA
);
observeAndDraw(safetyChart); // <--- Scroll trigger