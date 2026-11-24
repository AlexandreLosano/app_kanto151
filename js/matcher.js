// Reconhecimento de nomes digitados com erro.
// Etapas: normalizar → apelidos → chave fonética (PT-BR) → distância de edição.

function normalize(s) {
  return s
    .replace(/♀/g, 'f').replace(/♂/g, 'm')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Aproxima "como se fala" para quem lê em português.
function phonetic(n) {
  let s = n
    .replace(/y$/, '#') // "y" final é vogal de verdade (Gastly, Pidgey); protege da regra abaixo
    .replace(/2/g, 'tu')
    .replace(/ph/g, 'f')
    .replace(/tch/g, 'x').replace(/sh/g, 'x').replace(/ch/g, 'x')
    .replace(/ck/g, 'k').replace(/qu/g, 'k').replace(/q/g, 'k')
    .replace(/c(?=[eiy])/g, 's').replace(/c/g, 'k')
    .replace(/ee/g, 'i').replace(/oo/g, 'u').replace(/ea/g, 'i').replace(/au/g, 'o')
    .replace(/y/g, 'i').replace(/w/g, 'u').replace(/z/g, 's')
    .replace(/h/g, '')
    .replace(/ite$/, 'ait') // dragonite, magnemite: "-aite" na leitura em inglês
    .replace(/(.)\1+/g, '$1');
  // "e"/"i" final depois de consoante costuma ser só vogal de apoio: charizardi, slowpoke.
  s = s.replace(/([^aeiou])[ei]$/, '$1');
  // "l" final soa "u" em português: Squirtle → "esquirtou", Beedrill → "bidriu".
  s = s.replace(/l$/, 'u').replace(/#$/, 'i').replace(/(.)\1+/g, '$1');
  return s;
}

// Distância de edição com transposição de letras vizinhas (Damerau-Levenshtein restrita).
function editDistance(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[m][n];
}

// Quantos erros aceitar, proporcional ao tamanho do nome.
function allowedErrors(len) {
  if (len <= 4) return 1;
  if (len <= 7) return 2;
  return 3;
}

const KEYS = POKEMON.map(([name], i) => {
  const n = normalize(name);
  return { id: i + 1, norm: n, phon: phonetic(n) };
});

const ALIAS_MAP = {};
for (const [k, v] of Object.entries(ALIASES)) ALIAS_MAP[normalize(k)] = Array.isArray(v) ? v : [v];

// Resultado: { kind: 'match' | 'amb' | 'none', ids: [...], exact: bool }
function matchName(raw) {
  const n = normalize(raw);
  if (!n) return { kind: 'none', ids: [], exact: false };

  if (ALIAS_MAP[n]) {
    const ids = ALIAS_MAP[n];
    return { kind: ids.length === 1 ? 'match' : 'amb', ids, exact: true };
  }

  const p = phonetic(n);
  const scored = [];
  for (const k of KEYS) {
    const d = Math.min(editDistance(n, k.norm), editDistance(p, k.phon));
    if (d <= allowedErrors(k.phon.length)) scored.push({ id: k.id, d });
  }
  if (!scored.length) return { kind: 'none', ids: [], exact: false };

  scored.sort((a, b) => a.d - b.d || a.id - b.id);
  const best = scored[0].d;
  const tied = scored.filter(s => s.d === best).map(s => s.id);
  if (tied.length === 1) return { kind: 'match', ids: tied, exact: best === 0 };
  return { kind: 'amb', ids: tied, exact: false };
}

const STOPWORDS = new Set(['e', 'and', 'o', 'a', 'de', 'com']);

// Separa a mensagem em nomes. Vírgula, ponto e vírgula, barra, "+" e quebra de linha
// sempre separam; espaço separa, exceto quando 2–3 palavras juntas formam um nome
// exato (mr mime, nidoran femea, mew two).
function parseInput(text) {
  const out = [];
  for (const chunk of text.split(/[,;\n\/+]+/)) {
    const words = chunk.trim().split(/\s+/).filter(w => normalize(w) && !STOPWORDS.has(normalize(w)));
    let i = 0;
    while (i < words.length) {
      let used = 0;
      for (let len = Math.min(3, words.length - i); len >= 2; len--) {
        const input = words.slice(i, i + len).join(' ');
        const r = matchName(input);
        if (r.exact && r.kind === 'match') { out.push({ input, ...r }); used = len; break; }
      }
      if (!used) { out.push({ input: words[i], ...matchName(words[i]) }); used = 1; }
      i += used;
    }
  }
  return out;
}
