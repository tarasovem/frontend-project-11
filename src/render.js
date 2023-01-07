import onChange from 'on-change';

const render = () => {
  const p = document.querySelector('.text-danger');
  const input = document.querySelector('#url-input');
  const form = document.querySelector('.rss-form');
  input.style.border = '';
  p.textContent = '';
  form.reset();
  input.focus();
};
const renderErrors = (watchedState) => {
  console.log(watchedState.inputUrl.errors);
  if (watchedState.inputUrl.state === 'invalid') {
    const input = document.querySelector('#url-input');
    input.style.border = 'medium solid red';
  } if (watchedState.inputUrl.errors.notUrl.includes('валидным')) {
    const p = document.querySelector('.text-danger');
    p.textContent = '';
    p.textContent = watchedState.inputUrl.errors.notUrl;
  } if (watchedState.inputUrl.errors.double.includes('существует')) {
    const p = document.querySelector('.text-danger');
    p.textContent = '';
    p.textContent = watchedState.inputUrl.errors.double;
  }
};
const state = {
  inputUrl: {
    state: '',
    data: {
      urls: [],
    },
    errors: {
      double: '',
      notUrl: '',
    },
  },
};
const watchedState = onChange(state, (path, value) => {
  switch (value) {
    case 'valid':
      render(watchedState);
      break;

    case 'invalid':
    case 'RSS уже существует':
    case 'Ссылка должна быть валидным URL':
      renderErrors(watchedState);
      break;

    default:
      break;
  }
});

export { state, watchedState };
