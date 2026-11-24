// Dados fixos dos 151 Pokémon de Kanto.
// Tipos e linhas evolutivas são os da 1ª geração (Red/Blue/Yellow):
// sem tipo Fada/Aço e sem evoluções/pré-evoluções das gerações seguintes.

const TYPE_NAMES = {
  nor: 'Normal', fog: 'Fogo', agu: 'Água', gra: 'Grama', ele: 'Elétrico',
  gel: 'Gelo', lut: 'Lutador', ven: 'Veneno', ter: 'Terra', voa: 'Voador',
  psi: 'Psíquico', ins: 'Inseto', ped: 'Pedra', fan: 'Fantasma', dra: 'Dragão',
};

// Índice + 1 = número da National Dex.
const POKEMON = [
  ['Bulbasaur', 'gra/ven'], ['Ivysaur', 'gra/ven'], ['Venusaur', 'gra/ven'],
  ['Charmander', 'fog'], ['Charmeleon', 'fog'], ['Charizard', 'fog/voa'],
  ['Squirtle', 'agu'], ['Wartortle', 'agu'], ['Blastoise', 'agu'],
  ['Caterpie', 'ins'], ['Metapod', 'ins'], ['Butterfree', 'ins/voa'],
  ['Weedle', 'ins/ven'], ['Kakuna', 'ins/ven'], ['Beedrill', 'ins/ven'],
  ['Pidgey', 'nor/voa'], ['Pidgeotto', 'nor/voa'], ['Pidgeot', 'nor/voa'],
  ['Rattata', 'nor'], ['Raticate', 'nor'],
  ['Spearow', 'nor/voa'], ['Fearow', 'nor/voa'],
  ['Ekans', 'ven'], ['Arbok', 'ven'],
  ['Pikachu', 'ele'], ['Raichu', 'ele'],
  ['Sandshrew', 'ter'], ['Sandslash', 'ter'],
  ['Nidoran♀', 'ven'], ['Nidorina', 'ven'], ['Nidoqueen', 'ven/ter'],
  ['Nidoran♂', 'ven'], ['Nidorino', 'ven'], ['Nidoking', 'ven/ter'],
  ['Clefairy', 'nor'], ['Clefable', 'nor'],
  ['Vulpix', 'fog'], ['Ninetales', 'fog'],
  ['Jigglypuff', 'nor'], ['Wigglytuff', 'nor'],
  ['Zubat', 'ven/voa'], ['Golbat', 'ven/voa'],
  ['Oddish', 'gra/ven'], ['Gloom', 'gra/ven'], ['Vileplume', 'gra/ven'],
  ['Paras', 'ins/gra'], ['Parasect', 'ins/gra'],
  ['Venonat', 'ins/ven'], ['Venomoth', 'ins/ven'],
  ['Diglett', 'ter'], ['Dugtrio', 'ter'],
  ['Meowth', 'nor'], ['Persian', 'nor'],
  ['Psyduck', 'agu'], ['Golduck', 'agu'],
  ['Mankey', 'lut'], ['Primeape', 'lut'],
  ['Growlithe', 'fog'], ['Arcanine', 'fog'],
  ['Poliwag', 'agu'], ['Poliwhirl', 'agu'], ['Poliwrath', 'agu/lut'],
  ['Abra', 'psi'], ['Kadabra', 'psi'], ['Alakazam', 'psi'],
  ['Machop', 'lut'], ['Machoke', 'lut'], ['Machamp', 'lut'],
  ['Bellsprout', 'gra/ven'], ['Weepinbell', 'gra/ven'], ['Victreebel', 'gra/ven'],
  ['Tentacool', 'agu/ven'], ['Tentacruel', 'agu/ven'],
  ['Geodude', 'ped/ter'], ['Graveler', 'ped/ter'], ['Golem', 'ped/ter'],
  ['Ponyta', 'fog'], ['Rapidash', 'fog'],
  ['Slowpoke', 'agu/psi'], ['Slowbro', 'agu/psi'],
  ['Magnemite', 'ele'], ['Magneton', 'ele'],
  ["Farfetch'd", 'nor/voa'],
  ['Doduo', 'nor/voa'], ['Dodrio', 'nor/voa'],
  ['Seel', 'agu'], ['Dewgong', 'agu/gel'],
  ['Grimer', 'ven'], ['Muk', 'ven'],
  ['Shellder', 'agu'], ['Cloyster', 'agu/gel'],
  ['Gastly', 'fan/ven'], ['Haunter', 'fan/ven'], ['Gengar', 'fan/ven'],
  ['Onix', 'ped/ter'],
  ['Drowzee', 'psi'], ['Hypno', 'psi'],
  ['Krabby', 'agu'], ['Kingler', 'agu'],
  ['Voltorb', 'ele'], ['Electrode', 'ele'],
  ['Exeggcute', 'gra/psi'], ['Exeggutor', 'gra/psi'],
  ['Cubone', 'ter'], ['Marowak', 'ter'],
  ['Hitmonlee', 'lut'], ['Hitmonchan', 'lut'],
  ['Lickitung', 'nor'],
  ['Koffing', 'ven'], ['Weezing', 'ven'],
  ['Rhyhorn', 'ter/ped'], ['Rhydon', 'ter/ped'],
  ['Chansey', 'nor'], ['Tangela', 'gra'], ['Kangaskhan', 'nor'],
  ['Horsea', 'agu'], ['Seadra', 'agu'],
  ['Goldeen', 'agu'], ['Seaking', 'agu'],
  ['Staryu', 'agu'], ['Starmie', 'agu/psi'],
  ['Mr. Mime', 'psi'], ['Scyther', 'ins/voa'], ['Jynx', 'gel/psi'],
  ['Electabuzz', 'ele'], ['Magmar', 'fog'], ['Pinsir', 'ins'], ['Tauros', 'nor'],
  ['Magikarp', 'agu'], ['Gyarados', 'agu/voa'],
  ['Lapras', 'agu/gel'], ['Ditto', 'nor'],
  ['Eevee', 'nor'], ['Vaporeon', 'agu'], ['Jolteon', 'ele'], ['Flareon', 'fog'],
  ['Porygon', 'nor'],
  ['Omanyte', 'ped/agu'], ['Omastar', 'ped/agu'],
  ['Kabuto', 'ped/agu'], ['Kabutops', 'ped/agu'],
  ['Aerodactyl', 'ped/voa'], ['Snorlax', 'nor'],
  ['Articuno', 'gel/voa'], ['Zapdos', 'ele/voa'], ['Moltres', 'fog/voa'],
  ['Dratini', 'dra'], ['Dragonair', 'dra'], ['Dragonite', 'dra/voa'],
  ['Mewtwo', 'psi'], ['Mew', 'psi'],
];

// Linhas evolutivas da 1ª geração, em ordem de estágio.
// Quem não aparece aqui não evolui nem tem pré-evolução na Gen 1.
const FAMILIES = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12], [13, 14, 15], [16, 17, 18],
  [19, 20], [21, 22], [23, 24], [25, 26], [27, 28], [29, 30, 31], [32, 33, 34],
  [35, 36], [37, 38], [39, 40], [41, 42], [43, 44, 45], [46, 47], [48, 49],
  [50, 51], [52, 53], [54, 55], [56, 57], [58, 59], [60, 61, 62], [63, 64, 65],
  [66, 67, 68], [69, 70, 71], [72, 73], [74, 75, 76], [77, 78], [79, 80],
  [81, 82], [84, 85], [86, 87], [88, 89], [90, 91], [92, 93, 94], [96, 97],
  [98, 99], [100, 101], [102, 103], [104, 105], [109, 110], [111, 112],
  [116, 117], [118, 119], [120, 121], [129, 130], [133, 134, 135, 136],
  [138, 139], [140, 141], [147, 148, 149],
];

// As três evoluções do Eevee são todas 2º estágio.
const STAGE_OVERRIDE = { 134: 2, 135: 2, 136: 2 };

// Grafias alternativas que a correção automática não pega sozinha.
// Valor = número da Dex, ou lista de números quando é ambíguo (o app pergunta).
const ALIASES = {
  'nidoran': [29, 32],
  'nidoran femea': 29, 'nidoran fêmea': 29, 'nidoran female': 29, 'nidorana': 29,
  'nidoran macho': 32, 'nidoran male': 32,
  'mister mime': 122, 'mister maime': 122, 'mr maime': 122, 'senhor mime': 122,
  'mister maimi': 122, 'misterime': 122,
  'farfetch': 83, 'farfetched': 83, 'farfetchi': 83,
  'mew two': 150, 'mew 2': 150, 'mew dois': 150, 'miutu': 150, 'miu tu': 150,
  'miu': 151,
  'ivi': 133, 'evee': 133,
  // Nidoqueen lido em português soa "nidokin"; aqui vale a leitura de Nidoking.
  'nidokin': 34, 'nidokingue': 34, 'nidoquin': 31, 'nidoquim': 31,
};

// Mapa número → família (array) e número → estágio.
const FAMILY_OF = {};
const STAGE_OF = {};
for (let id = 1; id <= POKEMON.length; id++) { FAMILY_OF[id] = [id]; STAGE_OF[id] = 1; }
for (const fam of FAMILIES) {
  fam.forEach((id, i) => { FAMILY_OF[id] = fam; STAGE_OF[id] = STAGE_OVERRIDE[id] || i + 1; });
}

function pokeName(id) { return POKEMON[id - 1][0]; }
function pokeTypes(id) { return POKEMON[id - 1][1].split('/').map(t => TYPE_NAMES[t]); }
function hasEvolutionLine(id) { return FAMILY_OF[id].length > 1; }
function dexNum(id) { return '#' + String(id).padStart(3, '0'); }
