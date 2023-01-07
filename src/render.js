import onChange from 'on-change';

const renderClearForm = () => {
  const p = document.querySelector('.text-danger') ?? document.querySelector('.text-success');
  const input = document.querySelector('#url-input');
  const form = document.querySelector('.rss-form');
  input.style.border = '';
  p.textContent = '';
  form.reset();
  input.focus();
};

const renderErrors = (watchedState) => {
  const p = document.querySelector('.text-danger') ?? document.querySelector('.text-success');
  if (watchedState.inputUrl.state === 'invalid') {
    const input = document.querySelector('#url-input');
    input.style.border = 'medium solid red';
    p.textContent = '';
    p.classList.replace('text-success', 'text-danger');
  } if (watchedState.inputUrl.errors.notUrl.match(/валидным/)) {
    p.textContent = watchedState.inputUrl.errors.notUrl;
  } if (watchedState.inputUrl.errors.double.match(/существует/)) {
    p.textContent = watchedState.inputUrl.errors.double;
  } if (watchedState.inputUrl.errors.notRss.match(/RSS/)) {
    p.textContent = watchedState.inputUrl.errors.notRss;
  } if (watchedState.inputUrl.errors.networkError.match(/сети/)) {
    p.textContent = watchedState.inputUrl.errors.networkError;
  }
};

const renderFeeds = (watchedState) => {
  const successText = document.querySelector('.text-danger') ?? document.querySelector('.text-success');
  successText.classList.replace('text-danger', 'text-success'); // следить, чтобы было ок
  successText.textContent = watchedState.inputUrl.successMessage;
  const containerFeeds = document.querySelector('.feeds');
  const divFeeds = document.createElement('div');
  divFeeds.classList.add('card', 'border-0');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = 'Фиды';
  const div2 = document.createElement('div');
  div2.classList.add('card-body');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  watchedState.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.feedName;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.feedDeskr;
    li.append(h3);
    h3.append(p);
    ul.append(li);
  });
  containerFeeds.innerHTML = '';
  containerFeeds.append(divFeeds);
  divFeeds.append(div2);
  divFeeds.append(ul);
  div2.append(h2);
};

const buildButton = () => {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.textContent = 'Просмотр';
  return button;
};

const addTextInModal = (watchedState) => {
  const postId = watchedState.uiState;
  const a = document.querySelector(`a[data-id="${postId}"]`);
  const currentPostData = watchedState.posts.filter((elem) => elem.id === Number(postId));
  const currentPostTitle = currentPostData[0].postTitle;
  const currentPostDescription = currentPostData[0].postDescription;
  const currentPostLink = currentPostData[0].postLink;
  const popupTitle = document.querySelector('.modal-title');
  popupTitle.textContent = currentPostTitle;
  const popupDescription = document.querySelector('.modal-body');
  popupDescription.textContent = currentPostDescription;
  const postLink = document.querySelector('.full-article');
  postLink.setAttribute('href', currentPostLink);
  a.classList.replace('fw-bold', 'fw-normal');
  a.classList.add('link-secondary');
};

const renderPosts = (watchedState) => {
  const containerPosts = document.querySelector('.posts');
  containerPosts.innerHTML = '';
  const divPosts = document.createElement('div');
  divPosts.classList.add('card', 'border-0');
  const innerDiv = document.createElement('div');
  innerDiv.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = 'Посты';
  containerPosts.append(divPosts);
  divPosts.append(innerDiv);
  innerDiv.append(h2);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const newPosts = watchedState.posts.map((elem) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    ul.append(li);
    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('href', `${elem.postLink}`);
    a.setAttribute('target', 'blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.dataset.id = elem.id;
    a.textContent = elem.postTitle;
    a.addEventListener('click', () => {
      a.classList.replace('fw-bold', 'fw-normal');
      a.classList.add('link-secondary');
    });
    const button = buildButton();
    li.append(a);
    li.append(button);
    return li;
  });
  divPosts.append(ul);
  return newPosts;
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
      notRss: '',
      networkError: '',
    },
    successMessage: '',
  },
  feeds: [],
  posts: [],
  uiState: '',
};

const watchedState = onChange(state, (path, value) => {
  switch (value) {
    case 'valid':
      renderClearForm(watchedState);
      break;

    case 'invalid':
    case 'RSS уже существует':
    case 'Ссылка должна быть валидным URL':
    case 'Ресурс не содержит валидный RSS':
    case 'Ошибка сети':
      renderErrors(watchedState);
      break;

    default:
      break;
  }
  switch (path) {
    case 'feeds':
      renderClearForm();
      renderFeeds(watchedState);
      break;

    case 'posts':
      renderPosts(watchedState);
      break;

    case 'uiState':
      addTextInModal(watchedState);
      break;

    default:
      break;
  }
});

export { state, watchedState };
