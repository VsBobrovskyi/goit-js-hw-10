import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import countryList from './templates/country-list.hbs';
import countryCard from './templates/country-card.hbs';
import { Notify } from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputFormEl: document.getElementById('search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputFormEl.addEventListener(
  'input',
  debounce(inputHandler, DEBOUNCE_DELAY)
);

function inputHandler() {
  const onInputText = refs.inputFormEl.value.trim();

  clearCountryList();
  clearCountryCard();

  if (!onInputText.length) {
    return;
  }

  fetchCountries(onInputText)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (countries.length >= 2 && countries.length <= 10) {
        appendCountryListMarkup(countries);
        return;
      }
      appendCountryCardMarkup(countries);
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function appendCountryListMarkup(countries) {
  refs.countryListEl.insertAdjacentHTML('beforeend', countryList(countries));
}

function appendCountryCardMarkup(countries) {
  refs.countryInfoEl.insertAdjacentHTML('beforeend', countryCard(countries));
}

function clearCountryList() {
  refs.countryListEl.innerHTML = '';
}

function clearCountryCard() {
  refs.countryInfoEl.innerHTML = '';
}




