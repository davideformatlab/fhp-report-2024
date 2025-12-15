# 📊 FHP Holding Portuale - ESG Dashboard

Dashboard interattiva per la visualizzazione dei KPI di Sostenibilità (Certificazioni, Emissioni, Sicurezza, Valore Economico) del gruppo **FHP (F2i Holding Portuale)**.

### 🟢 [Clicca qui per vedere la Dashboard online](https://davideformatlab.github.io/fhp-report-2024/)

---

## 📌 Descrizione
Il progetto visualizza i dati estratti dai **Report di Sostenibilità 2022-2024** e mappa le certificazioni attive per ogni azienda del gruppo.
La dashboard è costruita in **HTML/CSS/JS puro** (senza framework complessi) ed è ospitata direttamente su GitHub Pages.

## ⚙️ Come aggiornare i dati
I dati sono completamente separati dalla grafica per facilitare la manutenzione.
Per modificare numeri, aggiungere anni o aggiornare le certificazioni:

1.  Apri il file `js/data.js` nella repository.
2.  Modifica i valori all'interno degli oggetti (es. aggiungere "CCPB" o cambiare i valori di CO2).

### Esempio: Aggiornamento Certificazioni
Nel file `js/data.js`, modifica l'array `certs` dell'azienda interessata:

```javascript
export const DATA_CERTIFICAZIONI = [
    { 
      company: "FHP Multiservice", 
      // Inserire o rimuovere le certificazioni qui:
      certs: ["ISO 9001", "ISO 14001", "ISO 22000", "AEO", "GMP+"] 
    },
    // ...
];
