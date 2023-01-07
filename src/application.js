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
        const feed = {
          id: Math.floor(Math.random() * 100), feedName, feedDeskr, feedUrl: validUrl,
        };
        const items = doc.querySelectorAll('item');
        const arrItems = Array.from(items);
        const mappedItems = arrItems.map((item) => {
          const postTitle = item.querySelector('title').textContent;
          const postLink = item.querySelector('link').textContent;
          const postDescription = item.querySelector('description').textContent;
          const post = {
            id: Math.floor(Math.random() * 10000),
            listId: feed.id,
            postTitle,
            postLink,
            postDescription,
          };
          return post;
        });
        watchedState.inputUrl.state = 'valid';
        watchedState.inputUrl.successMessage = i18nextInstance.t('success.rssLoaded');
        watchedState.feeds = [feed, ...watchedState.feeds];
        watchedState.posts = [...mappedItems, ...watchedState.posts];
        watchedState.inputUrl.data.urls = [...watchedState.inputUrl.data.urls, validUrl];
        watchedState.inputUrl.errors.double = '';
        watchedState.inputUrl.errors.inputUrl = '';
      })
      .then(() => {
        const buttons = document.querySelectorAll('.btn-outline-primary');
        buttons.forEach((button) => {
          button.addEventListener('click', (el) => {
            const element = el.target.previousSibling;
            watchedState.uiState = element.dataset.id;
          });
        });
      })
      .catch((errors) => {
        watchedState.inputUrl.state = 'invalid';
        if (errors.message.match(/Network Error/)) {
          watchedState.inputUrl.errors.double = '';
          watchedState.inputUrl.errors.notUrl = '';
          watchedState.inputUrl.errors.networkError = i18nextInstance.t('errors.errNetworkError');
        } else if (errors.message.match(/Not RSS/)) {
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
        console.log('error!!!', errors.message);
      });
  });

  const updatePosts = (state) => { // обновление постов
    const handler = (counter = 0) => {
      if (state.inputUrl.data.urls.length > 0) {
        state.inputUrl.data.urls.forEach((url) => {
          getFlowData(url)
            .then((data) => {
              const [doc, validUrl] = data;
              const items = doc.querySelectorAll('item');
              const arrItems = Array.from(items);
              const postHeadlines = watchedState.posts.map((post) => post.postTitle);
              const mappedItems = arrItems.map((item) => {
                const postTitle = item.querySelector('title').textContent;
                if (!postHeadlines.includes(postTitle)) {
                  const actualFeed = watchedState.feeds.filter((feed) => feed.feedUrl === validUrl);
                  const [feed] = actualFeed;
                  const actualFeedId = feed.id;
                  const postLink = item.querySelector('link');
                  const postDescription = item.querySelector('description').textContent.trim();
                  const post = {
                    id: Math.floor(Math.random() * 10000),
                    listId: actualFeedId,
                    postTitle,
                    postLink,
                    postDescription,
                  };
                  return post;
                }
                return null;
              });
              const newPosts = mappedItems.filter((elem) => elem !== null);
              if (newPosts.length > 0) {
                watchedState.posts = [...newPosts, ...watchedState.posts];
                watchedState.inputUrl.errors.double = '';
                watchedState.inputUrl.errors.inputUrl = '';
              }
            })
            .then(() => {
              const buttons = document.querySelectorAll('.btn-outline-primary');
              buttons.forEach((button) => {
                button.addEventListener('click', (el) => {
                  const element = el.target.previousSibling;
                  watchedState.uiState = element.dataset.id;
                });
              });
            })
            .catch((errors) => {
              watchedState.inputUrl.state = 'invalid';
              if (errors.message.match(/Network Error/)) {
                watchedState.inputUrl.errors.double = '';
                watchedState.inputUrl.errors.notUrl = '';
                watchedState.inputUrl.errors.networkError = i18nextInstance.t('errors.errNetworkError');
              }
              console.log('error!!!', errors.message);
            });
        });
      }
      setTimeout(() => handler(counter + 1), 5000);
    };
    handler();
  };
  updatePosts(watchedState);
};

export default app;
