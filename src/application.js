import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import i18next from 'i18next';
import { string } from 'yup';
import resources from './locales';
import { watchedState } from './render.js';

const app = async () => {
  await i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  });
  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const schema = string().url().nullable().notOneOf(watchedState.inputUrl.data.urls);
    const formData = new FormData(form);
    const url = formData.get('url');
    schema.validate(url)
      .then((validUrl) => {
        watchedState.inputUrl.data.urls.push(validUrl);
        watchedState.inputUrl.state = 'valid';
        watchedState.inputUrl.errors.double = '';
        watchedState.inputUrl.errors.inputUrl = '';
      })
      .catch((errors) => {
        watchedState.inputUrl.state = 'invalid';
        if (errors.message.includes('following')) {
          watchedState.inputUrl.errors.notUrl = '';
          watchedState.inputUrl.errors.double = i18next.t('errDoubleUrl');
        } else {
          watchedState.inputUrl.errors.double = '';
          watchedState.inputUrl.errors.notUrl = i18next.t('errNotUrl');
        }
        console.log('Error:', errors.message);
      });
  });
};

export default app;