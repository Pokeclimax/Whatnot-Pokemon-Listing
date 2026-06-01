// ==UserScript==
// @name         Pokecardex - Ajouter au Google Sheet
// @namespace    https://pokecardex.com/
// @version      2.1
// @description  Ajoute le titre en C et l'image en N dans ton Google Sheet Whatnot
// @match        https://www.pokecardex.com/collection*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const BTN_ID = 'pcdx-add-google-sheet-btn';
  const WEBAPP_URL = 'VOTRE_URL_WEBAPP';
  const API_TOKEN = 'VOTRE_TOKEN_SECRET';

  function normalizeText(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function getName(modal) {
    const title =
      modal.querySelector('h2 span.text-2xl.font-bold') ||
      modal.querySelector('span.text-2xl.font-bold');

    return normalizeText(title?.textContent || '');
  }

  function getRarity(modal) {
    const spans = [...modal.querySelectorAll('span')]
      .map(el => normalizeText(el.textContent))
      .filter(Boolean);

    const known = [
      'C', 'U', 'R', 'RR', 'RRR', 'AR', 'SAR', 'SR', 'SSR', 'UR',
      'PR', 'CHR', 'CSR', 'ACE SPEC', 'BWR', 'Sans rareté'
    ];

    for (let i = 0; i < spans.length; i++) {
      if (spans[i] === 'Rareté' && spans[i + 1]) {
        return spans[i + 1];
      }
    }

    for (const value of spans) {
      if (known.includes(value)) return value;
    }

    return '';
  }

  function getSerieCode(modal) {
    const imgs = [...modal.querySelectorAll('img')];
    const serieImg = imgs.find(img => {
      const src = img.src || '';
      return src.includes('/symboles_jp/');
    });

    if (!serieImg) return '';

    const match = serieImg.src.match(/\/symboles_jp\/([^/.?#]+)\.(png|webp|jpg|jpeg|svg)/i);
    return match ? match[1].toUpperCase() : '';
  }

  function getCardImageUrl(modal) {
    const imgs = [...modal.querySelectorAll('img')];
    const cardImg = imgs.find(img => {
      const src = img.src || '';
      return src.includes('pokecardex-scans.b-cdn.net') &&
             !src.includes('placeholder');
    });

    return cardImg ? cardImg.src : '';
  }

  function formatListingText(data) {
    const rareteNormalisee = (data.rarete || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();

    const rareteFinale = rareteNormalisee === 'sans rarete'
      ? ''
      : (data.rarete || '').trim();

    return [
      (data.nom || '').trim(),
      rareteFinale,
      (data.codeSerie || '').trim()
    ].filter(Boolean).join(' ');
  }

  function getCardData(modal) {
    const data = {
      nom: getName(modal),
      rarete: getRarity(modal),
      codeSerie: getSerieCode(modal),
      imageUrl: getCardImageUrl(modal)
    };

    data.title = formatListingText(data);
    return data;
  }

  function showFeedback(button, message) {
    const old = button.textContent;
    button.textContent = message;
    setTimeout(() => {
      button.textContent = old;
    }, 1600);
  }

  function insertButtonInHeader(header, btn) {
    const closeBtn = [...header.querySelectorAll('button')].pop();
    if (closeBtn && closeBtn.parentElement === header) {
      header.insertBefore(btn, closeBtn);
    } else {
      header.appendChild(btn);
    }
  }

  function createAddButton(modal) {
    if (modal.querySelector(`#${BTN_ID}`)) return;

    const header = modal.querySelector('h2');
    if (!header) return;

    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.type = 'button';
    btn.textContent = 'Ajouter au Google Sheet';
    btn.style.marginRight = '10px';
    btn.style.padding = '8px 12px';
    btn.style.borderRadius = '10px';
    btn.style.fontWeight = '600';
    btn.style.cursor = 'pointer';
    btn.style.border = '1px solid rgba(120,120,120,.25)';
    btn.style.background = '#16a34a';
    btn.style.color = '#fff';
    btn.style.fontSize = '14px';
    btn.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const data = getCardData(modal);

      if (!data.title || !data.imageUrl) {
        console.log('Données manquantes :', data);
        showFeedback(btn, 'Données manquantes');
        return;
      }

      showFeedback(btn, 'Ajout...');

      GM_xmlhttpRequest({
        method: 'POST',
        url: WEBAPP_URL,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          title: data.title,
          imageUrl: data.imageUrl,
          token: API_TOKEN
        }),
        onload: function (response) {
          console.log('HTTP status:', response.status);
          console.log('Réponse brute:', response.responseText);

          try {
            const json = JSON.parse(response.responseText);
            console.log('JSON reçu:', json);

            if (json.ok) {
              showFeedback(btn, 'Ajouté !');
            } else {
              console.error('Erreur Apps Script:', json.error);
              showFeedback(btn, json.error || 'Erreur sheet');
            }
          } catch (err) {
            console.error('Réponse non JSON:', err);
            showFeedback(btn, 'Réponse invalide');
          }
        },
        onerror: function (err) {
          console.error('Erreur requête :', err);
          showFeedback(btn, 'Erreur réseau');
        }
      });
    });

    insertButtonInHeader(header, btn);
  }

  function findOpenPreview() {
    const headers = [...document.querySelectorAll('h2.border-b.px-5.py-3.font-semibold')];

    for (const h2 of headers) {
      const modal = h2.parentElement;
      if (!modal) continue;

      const hasTitle = !!modal.querySelector('span.text-2xl.font-bold');
      const hasScan = !!modal.querySelector('img[src*="pokecardex-scans.b-cdn.net"]');

      if (hasTitle && hasScan) return modal;
    }

    return null;
  }

  function inject() {
    const modal = findOpenPreview();
    if (!modal) return;
    createAddButton(modal);
  }

  const observer = new MutationObserver(() => inject());
  observer.observe(document.body, { childList: true, subtree: true });

  inject();
})();
