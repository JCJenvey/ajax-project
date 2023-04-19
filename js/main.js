const $searchBar = document.querySelector('.search-bar');
const $loading = document.querySelector('.loading');
const $view = document.getElementsByClassName('view');
const $logo = document.querySelector('.logo');
const $cardImg = document.querySelector('.card-img');
const $cardHeader = document.querySelector('.card-header');
const $cmc = document.querySelector('.cmc');
const $type = document.querySelector('.type');
const $description = document.querySelector('.description');
const $powerToughness = document.querySelector('.power-toughness');
const $loyalty = document.querySelector('.loyalty');
const $sets = document.querySelector('.sets');

// let cardList = [];

// Event Listeners Below
$searchBar.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    if ($searchBar.value.length > 0) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.magicthegathering.io/v1/cards?name=' + $searchBar.value);
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        // cardList = [];
        const $span = document.createElement('span');
        $searchBar.value = '';
        const result = xhr.response;
        $loading.classList.add('hidden');

        if (result.cards[result.cards.length - 1].imageUrl) {
          $cardImg.setAttribute('src', result.cards[result.cards.length - 1].imageUrl);
          $cardImg.setAttribute('onerror', 'src=\'images / card - back.jpg\';');
        } else {
          $cardImg.setAttribute('src', 'images/card-back.jpg');
        }

        $cardHeader.textContent = result.cards[result.cards.length - 1].name;

        if (result.cards[result.cards.length - 1].manaCost) {
          let cost = result.cards[result.cards.length - 1].manaCost.replaceAll('{', '');
          cost = cost.replaceAll('/', '');
          cost = cost.replaceAll('}', ' ').trim();
          const mana = cost.split(' ');
          $cardHeader.append($span);
          for (let i = 0; i < mana.length; i++) {
            const $manaSymbol = document.createElement('img');
            $manaSymbol.setAttribute('class', 'mana-symbol');
            $manaSymbol.setAttribute('src', 'images/mana-symbols/' + mana[i] + '.png');
            $manaSymbol.setAttribute('alt', 'mana cost');
            $cardHeader.append($manaSymbol);
          }
        }

        $cmc.textContent = 'Converted Mana Cost: ' + result.cards[result.cards.length - 1].cmc;
        $type.textContent = result.cards[result.cards.length - 1].type;

        if (result.cards[result.cards.length - 1].text) {
          $description.className = 'card-info-styling border-bottom description';
          $description.textContent = result.cards[result.cards.length - 1].text;
        } else {
          $description.className = 'card-info-styling border-bottom description hidden';
        }

        if (result.cards[result.cards.length - 1].types.includes('Creature')) {
          $powerToughness.className = 'card-info-styling border-bottom power-toughness';
          $powerToughness.textContent = result.cards[result.cards.length - 1].power +
            '/' + result.cards[result.cards.length - 1].toughness;
        } else {
          $powerToughness.className = 'card-info-styling border-bottom power-toughness hidden';
        }

        if (result.cards[result.cards.length - 1].types.includes('Planeswalker')) {
          $loyalty.className = 'card-info-styling border-bottom loyalty';
          $loyalty.textContent = 'Loyalty: ' + result.cards[result.cards.length - 1].loyalty;
        } else {
          $loyalty.className = 'card-info-styling border-bottom loyalty hidden';
        }

        $sets.textContent = 'All Sets: ';
        const sets = result.cards[result.cards.length - 1].printings;
        for (let i = 0; i < sets.length; i++) {
          if (sets[i].length > 3) {
            sets.splice(i, 1);
            i--;
          }
        }
        for (let i = 0; i < sets.length; i++) {
          const $anchor = document.createElement('a');
          $anchor.setAttribute('href', '#');
          $anchor.textContent = sets[i];
          $sets.append($anchor);
          if (i + 1 !== sets.length) {
            $sets.append(', ');
          }
        }

        viewSwap('card-info');
      });
      xhr.send();
      $loading.classList.remove('hidden');
    }
  }
});

$logo.addEventListener('click', () => {
  viewSwap('name-search');
});

// Function Declarations Below

function viewSwap(view) {
  for (var i = 0; i < $view.length; i++) {
    if ($view[i].getAttribute('data-view') === view) {
      $view[i].className = 'view';
    } else {
      $view[i].className = 'view hidden';
    }
  }
}
