function getValue(id) {
  return (document.getElementById(id).value || "").trim();
}

function joinParts(parts) {
  return parts.filter(Boolean).map(s => s.replace(/\s+/g, ' ').trim()).join(', ');
}

function ensurePeriod(text) {
  if (!text) return '';
  return /[.!?]\s*$/.test(text) ? text : text + '.';
}

function generatePrompts() {
  const title = getValue('title');
  const brand = getValue('brand');
  const model = getValue('model');
  const color = getValue('color');
  const material = getValue('material');
  const texture = getValue('texture');
  const inscriptions = getValue('inscriptions');
  const dimensions = getValue('dimensions');
  const weight = getValue('weight');
  const scaleObjects = getValue('scaleObjects');
  const interiorStyle = getValue('interiorStyle');

  const productId = joinParts([
    title,
    brand || null,
    model || null,
  ]);

  const productProps = joinParts([
    color || null,
    material || null,
    texture || null,
    dimensions || null,
    weight || null,
  ]);

  const baseCommon = 'carr? 1:1, simulation iPhone 15 Pro, lumi?re naturelle douce uniforme (s?rie), ombres l?g?res coh?rentes, photor?alisme net propre, couleurs fid?les ?quilibr?es';

  const mainPrompt = [
    `${productId}`,
    productProps,
    'vue frontale parfaitement centr?e',
    'fond neutre propre minimal',
    baseCommon,
    'texture pr?cise',
    inscriptions ? `respect int?gral des textes/chiffres/positions: ? ${inscriptions} ?` : 'aucune erreur typographique, respect int?gral des inscriptions existantes',
    'aucun ?l?ment ajout?, aucune d?coration superflue',
  ].filter(Boolean).join(', ');

  const macroPrompt = [
    `${productId}`,
    productProps,
    'macro du d?tail le plus r?v?lateur (grain/fibre/couture/gravure)',
    'faible profondeur de champ r?aliste (bokeh naturel)',
    'fond neutre flou',
    baseCommon,
    'texture fid?le haute pr?cision (micro-d?tails nets, pas d?exag?ration)',
    inscriptions ? `inscriptions visibles et exactes: ? ${inscriptions} ?` : 'si inscriptions pr?sentes: visibles et exactes',
  ].filter(Boolean).join(', ');

  const scalePrompt = [
    `${productId}`,
    productProps,
    scaleObjects ? `avec objets d??chelle: ${scaleObjects}` : 'avec objet d??chelle naturel (tasse/main/livre/pi?ce)',
    'proportions r?elles sans d?formation',
    'fond clair propre minimal',
    baseCommon,
    'fid?lit? stricte des textes et chiffres',
  ].filter(Boolean).join(', ');

  const misePrompt = [
    `${productId}`,
    productProps,
    interiorStyle ? `mise en situation dans un d?cor ${interiorStyle}` : 'mise en situation dans un d?cor int?rieur minimaliste contemporain',
    'lumi?re diffuse naturelle',
    'cadrage carr? 1:1 coh?rent avec la s?rie',
    'pas d?objets parasites, esth?tique propre',
    baseCommon,
  ].filter(Boolean).join(', ');

  document.getElementById('out1').value = ensurePeriod(mainPrompt);
  document.getElementById('out2').value = ensurePeriod(macroPrompt);
  document.getElementById('out3').value = ensurePeriod(scalePrompt);
  document.getElementById('out4').value = ensurePeriod(misePrompt);
}

function bindUI() {
  const form = document.getElementById('productForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generatePrompts();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const target = btn.getAttribute('data-copy');
      const el = document.querySelector(target);
      if (!el) return;
      try {
        await navigator.clipboard.writeText(el.value);
        btn.textContent = 'Copi?';
        setTimeout(() => (btn.textContent = 'Copier'), 1200);
      } catch (err) {
        // fallback
        el.select();
        document.execCommand('copy');
      }
    });
  });

  document.getElementById('copyAll').addEventListener('click', async () => {
    const all = ['out1','out2','out3','out4']
      .map(id => document.getElementById(id).value.trim())
      .filter(Boolean)
      .join('\n\n');
    if (!all) return;
    try {
      await navigator.clipboard.writeText(all);
      const b = document.getElementById('copyAll');
      b.textContent = 'Tout copi?';
      setTimeout(() => (b.textContent = 'Copier tout'), 1200);
    } catch {}
  });

  document.getElementById('reset').addEventListener('click', () => {
    document.getElementById('productForm').reset();
    ['out1','out2','out3','out4'].forEach(id => document.getElementById(id).value = '');
  });
}

document.addEventListener('DOMContentLoaded', bindUI);
