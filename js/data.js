// js/data.js

// Palette colori ufficiale FHP (estratta dal PDF/Immagini)
export const COLORS = {
    navy: '#002554',      // Blu scuro istituzionale
    blue: '#005EB8',      // Blu standard
    lightBlue: '#405080', // Azzurro polvere
    periwinkle: '#b4c6e7',// Azzurro chiaro
    grey: '#cbd5e1',      // Grigio chiaro
    white: '#ffffff',
    text: '#1a1a1a'
};

// Dati Certificazioni (Pagina 63 e Immagine fornita)
// AGGIORNATO: Rimossi "Fitok" e "CCPB" da Multiservice
export const DATA_CERTIFICAZIONI = [
    { company: "FHP Porto di Carrara", certs: ["ISO 9001", "ISO 45001", "Fitok", "ISO 14001"] },
    { company: "FHP Lifting", certs: ["ISO 9001", "ISO 45001", "ISO 14001"] },
    { company: "FHP MarterNeri", certs: ["ISO 9001", "ISO 45001", "Fitok", "AEO", "GMP+"] },
    { company: "FHP CPM", certs: ["ISO 9001", "ISO 45001", "ISO 14001"] },
    { company: "FHP Multiservice", certs: ["ISO 9001", "ISO 45001", "AEO", "GMP+"] }, // CORRETTO: No Fitok, No CCPB
    { company: "FHP SO.RI.MA.", certs: ["ISO 9001", "ISO 45001", "Fitok", "ISO 14001", "GMP+"] },
    { company: "FHP Transped", certs: ["ISO 9001", "ISO 45001", "ISO 14001"] }
];

// Configurazione Certificazioni (Legenda e Colori)
export const CONFIG_CERTIFICAZIONI = [
    { id: 'ISO 9001', color: COLORS.navy },
    { id: 'ISO 45001', color: COLORS.lightBlue },
    { id: 'Fitok', color: '#6c7d9c' }, // Blu Ardesia
    { id: 'ISO 14001', color: '#aebccc' },
    { id: 'AEO', color: COLORS.periwinkle },
    { id: 'CCPB', color: '#dbe5f1' }, // Certificazione Biologica
    { id: 'ISO 22001', color: '#cccccc' },
    { id: 'GMP+', color: '#e5e5e5' }
];

// Dati Valore Economico (Pagina 13)
export const DATA_VALORE_ECONOMICO = [
    { label: "Fornitori", value: 55, amount: "91.4M", color: COLORS.navy },
    { label: "Dipendenti", value: 23, amount: "37.7M", color: COLORS.lightBlue },
    { label: "Pubblica Amm.", value: 4, amount: "5.4M", color: '#aebccc' },
    { label: "Finanziatori", value: 2, amount: "3.1M", color: COLORS.periwinkle },
    { label: "Trattenuto", value: 17, amount: "29.3M", color: '#e5e5e5' }
];

// Dati Emissioni CO2 (Tabella 8 PDF)
export const DATA_EMISSIONI = [
    {
        year: '2022',
        values: [
            { label: 'Scope 1', value: 8336, color: COLORS.navy },
            { label: 'Scope 2', value: 630, color: COLORS.lightBlue }
        ]
    },
    {
        year: '2023',
        values: [
            { label: 'Scope 1', value: 8726, color: COLORS.navy },
            { label: 'Scope 2', value: 672, color: COLORS.lightBlue }
        ]
    },
    {
        year: '2024',
        values: [
            { label: 'Scope 1', value: 8087, color: COLORS.navy }, // Calo significativo
            { label: 'Scope 2', value: 573, color: COLORS.lightBlue }
        ]
    }
];

// Dati Sicurezza (Tabella 18, Pag. 57)
export const DATA_SICUREZZA = [
    { year: '2022', injuries: 31, freq_index: 32 },
    { year: '2023', injuries: 26, freq_index: 28 },
    { year: '2024', injuries: 19, freq_index: 22 }
];