import onChange from 'on-change';

const render = (actualState) => (path, value) => {
  if (value === 'valid') {
    const input = document.querySelector('#url-input');
    const form = document.querySelector('.rss-form');
    input.style.border = '';
    form.reset();
    input.focus();
  } else if (value === 'invalid') {
    const input = document.querySelector('#url-input');
    input.style.border = 'thick solid red';
  }
};
const state = {
  inputUrl: {
    state: '',
    data: {
      urls: [],
    },
    errors: [],
  },
};
const watchedState = onChange(state, render(state));

export { state, watchedState };
