import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import i18next from 'i18next';
import { string } from 'yup';
import resources from './locales';
import { watchedState } from './render.js';
import getFlowData from './parser.js';

const app = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
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
      .then((validUrl) => getFlowData(validUrl))
      .then((data) => {
        const [doc, validUrl] = data;
        const feedName = doc.querySelector('title').textContent;
        const feedDeskr = doc.querySelector('description').textContent;
        const feed = { id: Math.floor(Math.random() * 100), feedName, feedDeskr };
        const items = doc.querySelectorAll('item');
        const arrItems = Array.from(items);
        const mappedItems = arrItems.map((item) => {
          const postTitle = item.querySelector('title').textContent;
          const postLink = item.querySelector('link').nextSibling.textContent.trim();
          const post = {
            id: Math.floor(Math.random() * 100),
            listId: feed.id,
            postTitle,
            postLink,
          };
          return post;
        });
        watchedState.inputUrl.data.urls.push(validUrl);
        watchedState.inputUrl.state = 'valid';
        watchedState.inputUrl.successMessage = i18nextInstance.t('success.rssLoaded');
        watchedState.feeds = [feed, ...watchedState.feeds];
        watchedState.posts = [...mappedItems, ...watchedState.posts];
        watchedState.inputUrl.data.urls = [...watchedState.inputUrl.data.urls, validUrl];
        watchedState.inputUrl.errors.double = '';
        watchedState.inputUrl.errors.inputUrl = '';
      })
      .catch((errors) => {
        watchedState.inputUrl.state = 'invalid';
        if (errors.message.match(/Not RSS/)) {
          watchedState.inputUrl.errors.double = '';
          watchedState.inputUrl.errors.notUrl = '';
          watchedState.inputUrl.errors.notRss = i18nextInstance.t('errors.errNotRss');
        } else if (errors.message.match(/this must not be one of the following values/)) {
          watchedState.inputUrl.errors.notUrl = '';
          watchedState.inputUrl.errors.notRss = '';
          watchedState.inputUrl.errors.double = i18nextInstance.t('errors.errDoubleUrl');
        } else if (errors.message.match(/this must be a valid URL/)) {
          watchedState.inputUrl.errors.double = '';
          watchedState.inputUrl.errors.notRss = '';
          watchedState.inputUrl.errors.notUrl = i18nextInstance.t('errors.errNotUrl');
        }
        console.log('Error:', errors.message);
      });
  });
};

export default app;