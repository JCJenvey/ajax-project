const $searchBar = document.querySelector('.search-bar');
const $loading = document.querySelector('.loading');
const $error = document.querySelector('.error');
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
const $result = document.querySelector('.result');
const $setResultCol = document.querySelector('.set-result-col');
const $nameResultCol = document.querySelector('.name-result-col');
const $typeResultCol = document.querySelector('.type-result-col');
let $resultListSet = document.querySelector('.result-list-set');
let $resultListName = document.querySelector('.result-list-name');
let $resultListType = document.querySelector('.result-list-type');

let cardList = [];

// Event Listeners Below
$searchBar.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    if ($searchBar.value.length > 0) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.magicthegathering.io/v1/cards?name=' + $searchBar.value);
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          $error.classList.remove('hidden');
          setTimeout(() => {
            $error.classList.add('hidden');
          }, 5000);
        } else {
          cardList = [];
          const result = xhr.response;

          for (let i = 0; i < result.cards.length; i++) {
            let cardNotInList = true;
            if (cardList.length === 0) {
              if (result.cards[i].set.length === 3) {
                cardList.push(result.cards[i]);
              }
            } else {
              for (let j = 0; j < cardList.length; j++) {
                if (cardList[j].name === result.cards[i].name) {
                  cardNotInList = false;
                }
              }
              if (cardNotInList && result.cards[i].set.length === 3) {
                cardList.push(result.cards[i]);
              }
            }
          }

          $loading.classList.add('hidden');

          if (cardList.length === 1) {
            renderCardInfo(cardList[0]);
            viewSwap('card-info');
            $searchBar.value = '';
          } else {
            $resultListSet.remove();
            $resultListName.remove();
            $resultListType.remove();
            $result.textContent = 'Results for: "' + $searchBar.value + '"';

            $resultListSet = document.createElement('ul');
            $resultListSet.className = 'result-list-set';

            $resultListName = document.createElement('ul');
            $resultListName.className = 'result-list-name';

            $resultListType = document.createElement('ul');
            $resultListType.className = 'result-list-type';

            if (cardList.length === 0) {
              $setResultCol.append($resultListSet);
              $nameResultCol.append($resultListName);
              $typeResultCol.append($resultListType);
            } else {
              for (let i = 0; i < cardList.length; i++) {
                const $setLi = document.createElement('li');
                $setLi.textContent = cardList[i].set;

                const $typeLi = document.createElement('li');
                for (let j = 0; j < cardList[i].types.length; j++) {
                  $typeLi.textContent += cardList[i].types[j];
                  if (j + 1 !== cardList[i].types.length) {
                    $typeLi.textContent += ' ';
                  }
                }

                const $nameLi = document.createElement('li');
                $nameLi.setAttribute('data-result-id', i);

                const $button = document.createElement('button');
                $button.className = 'view-result';
                $button.textContent = cardList[i].name;

                $nameLi.append($button);

                $resultListSet.append($setLi);
                $resultListName.append($nameLi);
                $resultListType.append($typeLi);

                $setResultCol.append($resultListSet);
                $nameResultCol.append($resultListName);
                $typeResultCol.append($resultListType);
              }
            }
            viewSwap('many-results');
            $searchBar.value = '';
          }
        }
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

function renderCardInfo(card) {
  const $span = document.createElement('span');
  if (card.imageUrl) {
    $cardImg.setAttribute('src', card.imageUrl);
    $cardImg.setAttribute('onerror', 'src=\'images / card - back.jpg\';');
  } else {
    $cardImg.setAttribute('src', 'images/card-back.jpg');
  }

  $cardHeader.textContent = card.name;

  if (card.manaCost) {
    let cost = card.manaCost.replaceAll('{', '');
    cost = cost.replaceAll('/', '');
    cost = cost.replaceAll('}', ' ').trim();
    const mana = cost.split(' ');
    $cardHeader.append($span);
    for (let i = 0; i < mana.length; i++) {
      const $manaSymbol = document.createElement('img');
      $manaSymbol.setAttribute('class', 'mana-symbol');
      $manaSymbol.setAttribute('src', 'images/mana-symbols/' + mana[i] + '.png');
      $manaSymbol.setAttribute('alt', 'mana symbol');
      $cardHeader.append($manaSymbol);
    }
  }

  $cmc.textContent = 'Converted Mana Cost: ' + card.cmc;
  $type.textContent = card.type;

  if (card.text) {
    $description.className = 'card-info-styling border-bottom description';
    $description.textContent = card.text;
  } else {
    $description.className = 'card-info-styling border-bottom description hidden';
  }

  if (card.types.includes('Creature')) {
    $powerToughness.className = 'card-info-styling border-bottom power-toughness';
    $powerToughness.textContent = card.power +
      '/' + card.toughness;
  } else {
    $powerToughness.className = 'card-info-styling border-bottom power-toughness hidden';
  }

  if (card.types.includes('Planeswalker')) {
    $loyalty.className = 'card-info-styling border-bottom loyalty';
    $loyalty.textContent = 'Loyalty: ' + card.loyalty;
  } else {
    $loyalty.className = 'card-info-styling border-bottom loyalty hidden';
  }

  $sets.textContent = 'All Sets: ';
  const sets = card.printings;
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
}
