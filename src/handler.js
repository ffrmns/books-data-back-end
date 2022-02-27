const { nanoid } = require('nanoid');
const bookDatas = require('./bookDatas');

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

  const isFailedByName = name === undefined;
  const isFailedByPage = readPage > pageCount;
  const isSuccess = !isFailedByName && !isFailedByPage;

  if (isSuccess) {
    bookDatas.push(newBookData);
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
  const { reading, finished, name } = request.query;
  const bookDatasList = [];
  const isNoReadingFinishedNameQuery = reading === undefined
    && finished === undefined
    && name === undefined;
  bookDatas.map((book) => {
    const {
      id: idData,
      name: nameData,
      publisher: publisherData,
      reading: readingData,
      finished: finishedData,
    } = book;
    const isDefinedName = name !== undefined && nameData !== undefined;
    const isIncludedName = isDefinedName
      ? nameData.toLowerCase().includes(name.toLowerCase())
      : false;

    const isMatched = (reading === '1' && readingData === true)
      || (reading === '0' && readingData === false)
      || (finished === '1' && finishedData === true)
      || (finished === '0' && finishedData === false)
      || isIncludedName;
    if (isMatched || isNoReadingFinishedNameQuery) {
      bookDatasList.push({ id: idData, name: nameData, publisher: publisherData });
    }
    return bookDatasList;
  });
  const response = h.response({
    status: 'success',
    data: {
      books: bookDatasList,
    },
  });
  return response;
};

const getBookDataHandler = (request, h) => {
  const { bookId } = request.params;
  const bookdata = bookDatas.filter((book) => book.id === bookId)[0];
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
  const index = bookDatas.findIndex((book) => book.id === bookId);
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
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  bookDatas[index] = {
    ...bookDatas[index],
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

const deleteBookDataHandler = (request, h) => {
  const { bookId } = request.params;
  const indexToBeDeleted = bookDatas.findIndex((book) => book.id === bookId);
  if (indexToBeDeleted !== -1) {
    bookDatas.splice(indexToBeDeleted, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookDataHandler,
  getBooksListHandler,
  getBookDataHandler,
  editBookDataHandler,
  deleteBookDataHandler,
};
