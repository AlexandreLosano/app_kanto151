// Testes do reconhecimento de nomes. Rodar com: node tests/run.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = vm.createContext({});
for (const f of ['js/data.js', 'js/matcher.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), ctx, { filename: f });
}
const run = expr => vm.runInContext(expr, ctx);

let fail = 0;
function check(label, ok, extra = '') {
  if (!ok) { fail++; console.log('FALHOU  ' + label + (extra ? '  → ' + extra : '')); }
}

// Dados
check('151 Pokémon', run('POKEMON.length') === 151);
const withLine = run('Object.keys(FAMILY_OF).filter(id => hasEvolutionLine(+id)).length');
check('126 com linha evolutiva', withLine === 126, withLine);
const famIds = run('FAMILIES.flat()');
check('famílias sem número repetido', new Set(famIds).size === famIds.length);

// Todo nome oficial reconhece a si mesmo
for (let id = 1; id <= 151; id++) {
  const name = run(`pokeName(${id})`);
  const r = run(`matchName(${JSON.stringify(name)})`);
  check(`nome oficial ${name}`, r.kind === 'match' && r.ids[0] === id, JSON.stringify(r));
}

// [digitado, esperado]: número = deve reconhecer; 'amb' = deve perguntar; null = não reconhece
const CASES = [
  ['bulbassauro', 1], ['ivissauro', 2], ['venussauro', 3],
  ['charmander', 4], ['chamander', 4], ['charmilion', 5], ['charizardi', 6], ['xarizard', 6],
  ['esquirtle', 7], ['squirtou', 7], ['wartortou', 8], ['blastoise', 9], ['blastoyse', 9],
  ['caterpi', 10], ['metapodi', 11], ['butterfri', 12], ['butefree', 12],
  ['wedle', 13], ['kakuna', 14], ['bedril', 15],
  ['pidgei', 16], ['pidjeoto', 17], ['pidgeot', 18], ['pidgeoto', 17],
  ['ratata', 19], ['raticate', 20], ['spiro', 21], ['fiarou', 22],
  ['equans', 23], ['arbok', 24], ['picachu', 25], ['pikatchu', 25], ['raitchu', 26],
  ['sandshru', 27], ['sandslash', 28],
  ['nidoran', 'amb'], ['nidoran femea', 29], ['nidoran macho', 32], ['nidorina', 30], ['nidoquin', 31],
  ['nidorino', 33], ['nidokin', 34],
  ['clefairi', 35], ['clefable', 36], ['vulpix', 37], ['ninetails', 38],
  ['jigglypuf', 39], ['jiguilipufe', 39], ['wigglituf', 40],
  ['zubat', 41], ['golbat', 42], ['odish', 43], ['glum', 44], ['vileplume', 45],
  ['paras', 46], ['parasect', 47], ['venonat', 48], ['venomoth', 49],
  ['diglet', 50], ['dugtrio', 51], ['miaut', 52], ['meowth', 52], ['persian', 53],
  ['psiduck', 54], ['saiduck', 54], ['golduck', 55], ['mankey', 56], ['primeape', 57],
  ['growlite', 58], ['arcanine', 59], ['arcanaine', 59],
  ['poliwag', 60], ['poliwirl', 61], ['poliwrath', 62],
  ['abra', 63], ['kadabra', 64], ['alakazam', 65], ['alakazan', 65],
  ['machop', 66], ['machoke', 67], ['machamp', 68], ['matchamp', 68],
  ['belsprout', 69], ['weepinbel', 70], ['victribel', 71],
  ['tentacool', 72], ['tentacul', 72], ['tentacruel', 73],
  ['geodude', 74], ['jiodude', 74], ['graveler', 75], ['golem', 76],
  ['ponita', 77], ['rapidash', 78], ['slowpoke', 79], ['slopoque', 79], ['slowbro', 80],
  ['magnemite', 81], ['magneton', 82], ['farfetchd', 83], ['farfetchi', 83],
  ['doduo', 84], ['dodrio', 85], ['seel', 86], ['dewgong', 87], ['dugong', 87],
  ['grimer', 88], ['muk', 89], ['shelder', 90], ['cloister', 91],
  ['gastly', 92], ['gasly', 92], ['haunter', 93], ['honter', 93], ['gengar', 94],
  ['onix', 95], ['onyx', 95], ['drowzee', 96], ['drauzi', 96], ['hipno', 97],
  ['krabby', 98], ['crabi', 98], ['kingler', 99], ['voltorb', 100], ['eletrode', 101],
  ['exeggcute', 102], ['exegcute', 102], ['exeguitor', 103],
  ['cubone', 104], ['marowak', 105], ['hitmonlee', 106], ['hitmonli', 106], ['hitmonchan', 107],
  ['lickitung', 108], ['likitung', 108], ['koffing', 109], ['cofing', 109], ['weezing', 110], ['wizing', 110],
  ['rhyhorn', 111], ['raihorn', 111], ['rhydon', 112], ['raidon', 112],
  ['chansey', 113], ['chansei', 113], ['tangela', 114], ['kangaskhan', 115], ['cangascan', 115],
  ['horsea', 116], ['horsi', 116], ['seadra', 117], ['goldeen', 118], ['goldin', 118], ['seaking', 119],
  ['staryu', 120], ['stariu', 120], ['starmie', 121], ['starmi', 121],
  ['mr mime', 122], ['mister maime', 122], ['mrmime', 122],
  ['scyther', 123], ['scaither', 123], ['jynx', 124], ['jinx', 124],
  ['electabuzz', 125], ['eletabuz', 125], ['magmar', 126], ['pinsir', 127], ['tauros', 128], ['touros', 128],
  ['magikarp', 129], ['magicarpa', 129], ['gyarados', 130], ['garados', 130], ['giarados', 130],
  ['lapras', 131], ['ditto', 132], ['dito', 132],
  ['eevee', 133], ['ivi', 133], ['vaporeon', 134], ['jolteon', 135], ['flareon', 136],
  ['porygon', 137], ['porigon', 137], ['omanyte', 138], ['omanite', 138], ['omastar', 139],
  ['kabuto', 140], ['kabutops', 141], ['aerodactyl', 142], ['aerodactil', 142],
  ['snorlax', 143], ['esnorlax', 143],
  ['articuno', 144], ['zapdos', 145], ['moltres', 146],
  ['dratini', 147], ['dragonair', 148], ['dragonite', 149], ['dragonaite', 149],
  ['mewtwo', 150], ['mew two', 150], ['miutu', 150], ['mew', 151], ['miu', 151],
  // não deve reconhecer
  ['ok', null], ['banana', null], ['agumon', null], ['xyzw', null],
];

for (const [input, expected] of CASES) {
  const r = run(`matchName(${JSON.stringify(input)})`);
  let ok;
  if (expected === null) ok = r.kind === 'none';
  else if (expected === 'amb') ok = r.kind === 'amb';
  else ok = r.kind === 'match' && r.ids[0] === expected;
  const got = r.kind === 'none' ? 'nada' : r.ids.map(id => run(`pokeName(${id})`)).join(' | ') + ` (${r.kind})`;
  check(`"${input}"`, ok, got);
}

// Separação de mensagens
const parsed = run(`parseInput("pikachu, mr mime charizard e nidoran femea\\nmew two mew")`);
const ids = parsed.map(p => p.ids[0]);
check('parseInput mistura vírgula, espaço, linha e nomes compostos',
  JSON.stringify(ids) === JSON.stringify([25, 122, 6, 29, 150, 151]), JSON.stringify(ids));

const total = 3 + 151 + CASES.length + 1;
console.log(fail ? `\n${fail} de ${total} verificações falharam` : `OK: ${total} verificações`);
process.exit(fail ? 1 : 0);
