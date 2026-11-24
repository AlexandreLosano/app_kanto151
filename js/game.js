// Estado do jogo, dicas e interface.

const STORAGE_KEY = 'kanto151:v1';
const SPRITE = id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const state = { found: new Set(), hint: null }; // hint = { id, level }

const $ = sel => document.querySelector(sel);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state.found = new Set((data.found || []).filter(id => id >= 1 && id <= 151));
    if (data.hint && !state.found.has(data.hint.id)) state.hint = data.hint;
  } catch (e) { /* sem armazenamento: começa vazio */ }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ found: [...state.found], hint: state.hint }));
  } catch (e) { /* ignora */ }
}

function stats() {
  const total = state.found.size;
  let withLine = 0;
  for (const id of state.found) if (hasEvolutionLine(id)) withLine++;
  return { total, withLine, without: total - withLine };
}

function missingIds() {
  const out = [];
  for (let id = 1; id <= 151; id++) if (!state.found.has(id)) out.push(id);
  return out;
}

// ---------- registro ----------

function register(id) {
  if (state.found.has(id)) return 'dup';
  state.found.add(id);
  let solvedHint = false;
  if (state.hint && state.hint.id === id) { state.hint = null; solvedHint = true; }
  save();
  return solvedHint ? 'hint' : 'new';
}

function submit(text) {
  const t = text.trim();
  if (!t) return;
  if (/^dicas?$/i.test(t)) { askHint(); return; }

  const results = parseInput(t);
  const entry = { input: t, rows: [] };
  const seenNow = new Set();

  for (const r of results) {
    if (r.kind === 'none') { entry.rows.push({ type: 'none', input: r.input }); continue; }
    if (r.kind === 'amb') { entry.rows.push({ type: 'amb', input: r.input, ids: r.ids }); continue; }
    const id = r.ids[0];
    if (seenNow.has(id)) continue; // mesmo nome duas vezes na mesma mensagem
    seenNow.add(id);
    const res = register(id);
    entry.rows.push({ type: res, input: r.input, id });
  }
  renderEntry(entry);
  renderAll();
}

// ---------- dicas ----------

function hintLines(id, level) {
  const lines = [];
  const types = pokeTypes(id);
  lines.push(`Tipo${types.length > 1 ? 's' : ''} na 1ª geração: ${types.join(' / ')}.`);
  if (level >= 2) {
    const fam = FAMILY_OF[id];
    lines.push(fam.length === 1
      ? 'Não evolui e não tem pré-evolução na 1ª geração.'
      : `Faz parte de uma linha evolutiva de ${fam.length} Pokémon e é o ${STAGE_OF[id]}º estágio.`);
  }
  if (level >= 3) {
    const lo = Math.floor((id - 1) / 10) * 10 + 1;
    lines.push(`Está entre ${dexNum(lo)} e ${dexNum(Math.min(lo + 9, 151))} na Dex.`);
  }
  if (level >= 4) lines.push(`É o ${dexNum(id)} da National Dex.`);
  if (level >= 5) {
    const letters = normalize(pokeName(id)).replace(/[0-9]/g, '');
    lines.push(`Começa com "${letters[0].toUpperCase()}" e tem ${letters.length} letras.`);
  }
  return lines;
}

const MAX_HINT = 6;

function askHint() {
  if (state.hint && !state.found.has(state.hint.id)) {
    state.hint.level = Math.min(state.hint.level + 1, MAX_HINT);
  } else {
    newHintTarget();
  }
  save();
  renderHint();
}

function newHintTarget() {
  const missing = missingIds().filter(id => !state.hint || id !== state.hint.id);
  if (!missing.length) { state.hint = null; return; }
  state.hint = { id: missing[Math.floor(Math.random() * missing.length)], level: 1 };
}

function swapHint() {
  newHintTarget();
  save();
  renderHint();
}

// ---------- interface ----------

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function renderEntry(entry) {
  const card = el('article', 'entry');
  card.appendChild(el('p', 'entry-input', entry.input));

  const groups = {
    new: { title: 'Novos registros', items: [] },
    hint: { title: 'Acertou a dica', items: [] },
    dup: { title: 'Já estavam registrados', items: [] },
    amb: { title: 'Qual você quis dizer?', items: [] },
    none: { title: 'Não consegui identificar', items: [] },
  };
  for (const row of entry.rows) groups[row.type].items.push(row);

  for (const [type, g] of Object.entries(groups)) {
    if (!g.items.length) continue;
    const box = el('div', 'entry-group ' + type);
    box.appendChild(el('h3', null, g.title));
    const ul = el('ul');
    for (const row of g.items) {
      const li = el('li');
      if (type === 'none') {
        li.textContent = `Não consegui identificar: ${row.input}`;
      } else if (type === 'amb') {
        li.appendChild(el('span', 'typed', `"${row.input}": `));
        const btns = el('span', 'choices');
        for (const id of row.ids) {
          const b = el('button', 'choice', `${dexNum(id)} ${pokeName(id)}`);
          b.type = 'button';
          b.addEventListener('click', () => {
            const res = register(id);
            btns.replaceWith(el('span', 'resolved',
              res === 'dup' ? `${pokeName(id)} já estava registrado` : `registrado ${dexNum(id)} ${pokeName(id)}`));
            renderAll();
          });
          btns.appendChild(b);
        }
        li.appendChild(btns);
      } else {
        li.appendChild(el('span', 'dex', dexNum(row.id)));
        li.appendChild(el('strong', null, ' ' + pokeName(row.id)));
        if (normalize(row.input) !== normalize(pokeName(row.id))) {
          li.appendChild(el('span', 'typed', ` (você escreveu "${row.input}")`));
        }
      }
      ul.appendChild(li);
    }
    box.appendChild(ul);
    card.appendChild(box);
  }

  const s = stats();
  card.appendChild(el('p', 'entry-stats',
    `Total ${s.total}/151 · com linha evolutiva ${s.withLine} · sem linha evolutiva ${s.without}`));

  const feed = $('#feed');
  feed.prepend(card);
}

function renderStats() {
  const s = stats();
  $('#stat-total').textContent = s.total;
  $('#stat-line').textContent = s.withLine;
  $('#stat-solo').textContent = s.without;
  $('#stat-check').textContent = s.withLine + s.without === s.total
    ? `${s.withLine} + ${s.without} = ${s.total}` : 'erro na soma';
  $('#progress-bar').style.width = (s.total / 151 * 100) + '%';
}

function renderList() {
  const ol = $('#found-list');
  ol.replaceChildren();
  const ids = [...state.found].sort((a, b) => a - b);
  $('#list-empty').hidden = ids.length > 0;
  for (const id of ids) {
    const li = el('li', hasEvolutionLine(id) ? 'line' : 'solo');
    li.appendChild(el('span', 'dex', dexNum(id)));
    li.appendChild(el('span', 'name', pokeName(id)));
    const rm = el('button', 'remove', '×');
    rm.type = 'button';
    rm.title = `Remover ${pokeName(id)}`;
    rm.setAttribute('aria-label', `Remover ${pokeName(id)}`);
    rm.addEventListener('click', () => { state.found.delete(id); save(); renderAll(); });
    li.appendChild(rm);
    ol.appendChild(li);
  }
}

function renderHint() {
  const box = $('#hint-box');
  const h = state.hint;
  $('#btn-hint').textContent = h ? 'Próxima dica' : 'Pedir dica';
  $('#btn-swap').hidden = !h;
  if (!h) {
    box.hidden = !missingIds().length ? false : true;
    if (!missingIds().length) { box.replaceChildren(el('p', null, 'Você lembrou os 151!')); }
    return;
  }
  box.hidden = false;
  box.replaceChildren();
  const ul = el('ol', 'hint-lines');
  for (const line of hintLines(h.id, h.level)) ul.appendChild(el('li', null, line));
  box.appendChild(ul);
  if (h.level >= 6) {
    const img = el('img', 'silhouette');
    img.src = SPRITE(h.id);
    img.alt = 'Silhueta do Pokémon da dica';
    box.appendChild(img);
  }
  box.appendChild(el('p', 'hint-level', `dica ${h.level} de ${MAX_HINT}`));
}

function renderMissing() {
  const panel = $('#missing');
  if (panel.hidden) return;
  const ids = missingIds();
  panel.replaceChildren(el('p', 'missing-title', ids.length ? `Faltam ${ids.length}:` : 'Não falta nenhum.'));
  const ul = el('ul', 'missing-list');
  for (const id of ids) ul.appendChild(el('li', null, `${dexNum(id)} ${pokeName(id)}`));
  panel.appendChild(ul);
}

function renderAll() {
  renderStats();
  renderList();
  renderHint();
  renderMissing();
}

// Botão que pede um segundo clique para confirmar (sem diálogos do navegador).
function confirmButton(btn, label, confirmLabel, action) {
  let timer = null;
  btn.addEventListener('click', () => {
    if (btn.dataset.armed) {
      clearTimeout(timer);
      delete btn.dataset.armed;
      btn.textContent = label;
      action();
      return;
    }
    btn.dataset.armed = '1';
    btn.textContent = confirmLabel;
    timer = setTimeout(() => { delete btn.dataset.armed; btn.textContent = label; }, 4000);
  });
}

function init() {
  load();

  const form = $('#entry-form');
  const input = $('#entry');
  form.addEventListener('submit', e => {
    e.preventDefault();
    submit(input.value);
    input.value = '';
    input.focus();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  $('#btn-hint').addEventListener('click', askHint);
  $('#btn-swap').addEventListener('click', swapHint);

  // Mostrar os faltantes pede confirmação (é spoiler); esconder, não.
  const missingBtn = $('#btn-missing');
  let missingTimer = null;
  missingBtn.addEventListener('click', () => {
    const panel = $('#missing');
    if (!panel.hidden) {
      panel.hidden = true;
      missingBtn.textContent = 'Ver faltantes';
      return;
    }
    if (!missingBtn.dataset.armed) {
      missingBtn.dataset.armed = '1';
      missingBtn.textContent = 'Mostrar spoiler? Clique de novo';
      missingTimer = setTimeout(() => { delete missingBtn.dataset.armed; missingBtn.textContent = 'Ver faltantes'; }, 4000);
      return;
    }
    clearTimeout(missingTimer);
    delete missingBtn.dataset.armed;
    panel.hidden = false;
    missingBtn.textContent = 'Esconder faltantes';
    renderMissing();
  });

  confirmButton($('#btn-reset'), 'Recomeçar', 'Apagar tudo? Clique de novo', () => {
    state.found.clear();
    state.hint = null;
    save();
    $('#feed').replaceChildren();
    $('#missing').hidden = true;
    $('#btn-missing').textContent = 'Ver faltantes';
    renderAll();
  });

  renderAll();
  input.focus();
}

document.addEventListener('DOMContentLoaded', init);
