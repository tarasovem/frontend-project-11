import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { string } from 'yup';
import { state, watchedState } from './render.js';

const app = () => {
  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const schema = string().url().nullable().notOneOf(watchedState.inputUrl.data.urls);
    const formData = new FormData(form);
    const url = formData.get('url');
    schema.validate(url)
      .then(() => {
        watchedState.inputUrl.data.urls.push(url);
        watchedState.inputUrl.state = 'valid';
        watchedState.inputUrl.errors = [];
      })
      .catch((errors) => {
        watchedState.inputUrl.errors.push(errors.message);
        watchedState.inputUrl.state = 'invalid';
        console.log('Error:', errors.message);
      });
  });
};

export default app;