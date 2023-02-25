import axios from 'axios';

const getFlowData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .then((response) => {
    if (!response.data.contents.match(/rss/)) {
      throw new Error('Not RSS');
    }    
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data.contents, 'text/xml');
    const items = Array.from(doc.querySelectorAll('item'));
    const feedName = doc.querySelector('title').textContent;
    const feedDescr = doc.querySelector('description').textContent;
    
    return {items, feedName, feedDescr, url};
  });

export default getFlowData;
