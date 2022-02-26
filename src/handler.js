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

const getBooksListHandler = (request, h) => {
  const bookDatasArray = [];
  for (const {id: id, name: name, publisher: publisher} of bookdatas) {
    bookDatasArray.push({id: id, name: name, publisher: publisher});
  };
  const response = h.response ({
    status: 'success',
    data: {
      books: bookDatasArray,
    },
  });
  return response;
};

const getBookDataHandler = (request, h) => {
  const { bookId } = request.params;
  const bookdata = bookdatas.filter((book) => book.id === bookId)[0];
  if (bookdata !== undefined) {
    return {
      status: 'success',
      data: {
        book: bookdata,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookDataHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = bookdatas.findIndex((book) => book.id === bookId);
  const isFound = index !== -1;
  const isPageCorrect = readPage <= pageCount;
  const isNameDefined = name !== undefined;
  if (!isNameDefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (!isPageCorrect) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } if (!isFound) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }
  bookdatas[index] = {
    ...bookdatas[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookDataHandler = () => {};

module.exports = {
  addBookDataHandler,
  getBooksListHandler,
  getBookDataHandler,
  editBookDataHandler,
  deleteBookDataHandler,
};
