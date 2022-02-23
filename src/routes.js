const {
  addBookDataHandler,
  getBooksListHandler,
  getBookDataHandler,
  editBookDataHandler,
  deleteBookDataHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookDataHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooksListHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookDataHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookDataHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookDataHandler,
  },
];

module.exports = routes;
