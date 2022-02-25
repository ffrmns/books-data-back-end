const { nanoid } = require('nanoid');
const bookdatas = require('./bookdatas');

const addBookDataHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBookData = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  bookdatas.push(newBookData);
  const isFailedByName = name === undefined;
  const isFailedByPage = readPage > pageCount;
  const isSuccess = !isFailedByName && !isFailedByPage;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } if (isFailedByName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (isFailedByPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Book data succcessfully added!',
  });
  response.code(500);
  return response;
};

const getBooksListHandler = () => {};
const getBookDataHandler = () => {};
const editBookDataHandler = () => {};
const deleteBookDataHandler = () => {};

module.exports = {
  addBookDataHandler,
  getBooksListHandler,
  getBookDataHandler,
  editBookDataHandler,
  deleteBookDataHandler,
};
