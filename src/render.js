import i18next from "i18next";

const createFeeds = (state) => {
  const feeds = [];
  state.feeds.forEach((feed) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.title;
    liEl.append(feedTitle);
    const pEl = document.createElement('p');
    pEl.classList.add('m-0', 'small', 'text-black-50');
    pEl.textContent = feed.description;
    liEl.append(pEl);
    feeds.push(liEl);
  });
  return feeds;
};

const createButton = (post, i18next) => {
  const buttonEl = document.createElement('button');
  buttonEl.setAttribute('type', 'button');
  buttonEl.setAttribute('data-id', post.id);
  buttonEl.setAttribute('data-bs-toggle', 'modal');
  buttonEl.setAttribute('data-bs-target', '#modal');
  buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  buttonEl.textContent = i18next.t('elems.showModalBtn');
  return buttonEl;
};

const createPosts = (state, i18next) => {
  const posts = [];
  state.posts.forEach((post) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const aEl = document.createElement('a');
    aEl.setAttribute('href', post.link);
    aEl.setAttribute('data-id', post.id);
    aEl.setAttribute('target', '_blank');
    aEl.setAttribute('rel', 'noopener noreferrer');
    if (state.uiState.viewedPostIds.has(post.id)) {
      aEl.classList.add('fw-normal');
    } else {
      aEl.classList.add('fw-bold');
    }
    aEl.textContent = post.title;
    const buttonEl = createButton(post, i18next);
    liEl.append(aEl);
    liEl.append(buttonEl);
    posts.push(liEl);
  });
  return posts;
};

const createList = (itemsType, state, i18next) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  cardBody.append(cardTitle);
  card.append(cardBody);
  cardTitle.textContent = i18next.t(`items.${itemsType}`);
  switch (itemsType) {
    case 'feeds':
      list.append(...createFeeds(state));
      break;
    case 'posts':
      list.append(...createPosts(state, i18next));
      break;
    default:
      break;
  }
  card.append(list);
  return card;
};

const renderInvalid = (elements) => {
  const { submit, urlInput, feedback } = elements;
  submit.disabled = false;
  urlInput.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.remove('text-warning');
  feedback.classList.add('text-danger');
};

const renderSending = (elements, i18next) => {
  const { submit, urlInput, feedback } = elements;
  submit.disabled = true;
  urlInput.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-warning');
  feedback.textContent = i18next.t('status.sending');
};

const renderAdded = (elements, i18next) => {
  const {
    submit, urlInput, feedback, form,
  } = elements;
  submit.disabled = false;
  urlInput.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-warning');
  feedback.classList.add('text-success');
  feedback.textContent = i18next.t('status.success');
  form.reset();
  urlInput.focus();
};

const renderState = (elements, i18next, value) => {
  switch (value) {
    case 'invalid':
      renderInvalid(elements);
      break;
    case 'sending':
      renderSending(elements, i18next);
      break;
    case 'added': {
      renderAdded(elements, i18next);
      break;
    }
    default:
      break;
  }
};

const renderError = (state, elements, i18next, error) => {
  if (error === null) {
    return;
  }
  const { feedback } = elements;

  feedback.classList.add('text-danger');
  feedback.textContent = i18next.t(`errors.${state.error}`);
};

const renderFeeds = (state, elements, i18next) => {
  const { feedsList } = elements;
  feedsList.innerHTML = '';
  const feeds = createList('feeds', state, i18next);
  feedsList.append(feeds);
};

const renderPosts = (state, elements, i18next) => {
  const { postsList } = elements;
  postsList.innerHTML = '';
  const posts = createList('posts', state, i18next);
  postsList.append(posts);
};

const renderDisplayedPost = (state, elements, post) => {
  const { modalHeader, modalBody, modalHref } = elements;
  modalHeader.textContent = post.title;
  modalBody.textContent = post.description;
  modalHref.setAttribute('href', post.link);
  state.uiState.viewedPostIds.add(post.id);
};

const renderViewedPosts = (postIds) => {
  const lastId = [...postIds].at(-1);
  const postElement = document.querySelector(`[data-id="${lastId}"]`);
  postElement.classList.remove('fw-bold');
  postElement.classList.add('fw-normal');
};

const render = (state, elements, i18next) => (path, value) => {
  switch (path) {
    case 'formState':
      renderState(elements, i18next, value);
      break;
    case 'error':
      renderError(state, elements, i18next, value);
      break;
    case 'feeds':
      renderFeeds(state, elements, i18next);
      break;
    case 'posts':
      renderPosts(state, elements, i18next);
      break;
    case 'uiState.displayedPost':
      renderDisplayedPost(state, elements, value);
      break;
    case 'uiState.viewedPostIds':
      renderViewedPosts(value);
      break;
    default:
      break;
  }
};

export default render;
