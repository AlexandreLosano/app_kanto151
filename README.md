# Kanto 151

Desafio de memória: lembrar, sem consultar listas, os 151 Pokémon da primeira geração (National Dex #001 a #151).

## Como jogar

Abra o `index.html` no navegador (duplo clique já funciona) e digite os nomes que lembrar, separados por vírgula, espaço ou linha. Pode escrever errado: "bulbassauro", "charizardi", "esquirtou" e "mister maime" são reconhecidos.

- Quando o nome fica parecido com mais de um Pokémon, o app pede para escrever de outro jeito, sem mostrar os candidatos (mostrar seria entregar nomes). No caso de "nidoran", ele pede "nidoran fêmea" ou "nidoran macho".
- Quando não reconhece, ele avisa: "Não consegui identificar: …".
- Ninguém é registrado duas vezes.
- O painel lateral mostra o total, quantos têm linha evolutiva e quantos não têm, contando só as evoluções da 1ª geração. Hitmonlee, por exemplo, conta como sem linha, porque o Tyrogue só aparece na 2ª.
- As dicas começam pelo tipo e ficam mais específicas: linha evolutiva, faixa da Dex, número, primeira letra e, por último, a silhueta. Elas nunca saem de um Pokémon que você já registrou.
- O progresso fica salvo no navegador.

## Como o reconhecimento funciona

Fica em `js/matcher.js`. Para cada nome digitado:

1. **Normaliza:** minúsculas, sem acento e sem pontuação.
2. **Procura nos apelidos:** uma lista curta em `js/data.js` para os casos que as regras não pegam (Mr. Mime, Farfetch'd, Nidoran).
3. **Gera uma chave fonética para leitores de português:** ph→f, ch/sh→x, y→i, w→u, z→s, "h" mudo, "ee"→i, "au"→o, "e"/"i" de apoio no fim caem e "l" final vira "u".
4. **Mede a distância de edição** contra os 151 nomes. O número de erros aceitos depende do tamanho do nome: 1, 2 ou 3.
5. Se um nome fica sozinho no melhor resultado, ele é registrado. Se dá empate, o app pede outra grafia, sem dizer quais nomes empataram. Se nada fica perto o bastante, o nome não é reconhecido.

## Testes

```
node tests/run.js
```

Os testes conferem os dados (151 nomes, 126 com linha evolutiva e 25 sem) e uma lista de grafias erradas com a resposta esperada. Achou um nome que não foi reconhecido? Inclua em `CASES` e ajuste as regras ou os apelidos até o teste passar.
