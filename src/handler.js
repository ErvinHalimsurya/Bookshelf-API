import { nanoid } from 'nanoid';
import bookShelf from './books.js';

// Make new book an initialize some parameters
const addNewBookHandler = (request, h) => {
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

    const id = nanoid(16);
    let finished = false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // Jika sudah selesai membaca
    if (pageCount === readPage) {
        finished = true;
    }

    // Error karena tidak melampirkan nama
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });

        response.code(400);
        return response;
    }

    // Error karena read page > page count
    if (pageCount < readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }
    const newBook = {
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

    bookShelf.push(newBook);

    // Memastikan buku berhasil ditambahkan ke database
    const isSuccess = bookShelf.filter((book) => book.id === id).length > 0;

    // Success response
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
    }

    // Generic Error
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });

    response.code(500);
    return response;
};

// To be added with the optional features
// Send specific data of every books
const getAllBooksHandler = (request, h) => {
    const quer = request.query;

    // Query name
    if (quer.name) {
        const book = bookShelf.filter((b) => {
            const srcName = (quer.name).toLowerCase();
            const name = (b.name).toLowerCase();
            return (name).includes(srcName);
        });

        const books = book.map((b) => {
            const { id, name, publisher } = b;
            return { id, name, publisher };
        });

        const response = h.response({
            status: 'success',
            data: {
                books,
            },
        });

        response.code(200);
        return response;
    }
    // Query reading
    if (quer.reading) {
        if (quer.reading === '0') {
            const book = bookShelf.filter((b) => b.reading === false);

            const books = book.map((b) => {
                const { id, name, publisher } = b;
                return { id, name, publisher };
            });

            const response = h.response({
                status: 'success',
                data: {
                    books,
                },
            });

            response.code(200);
            return response;
        }
        if (quer.reading === '1') {
            const book = bookShelf.filter((b) => b.reading === true);

            const books = book.map((b) => {
                const { id, name, publisher } = b;
                return { id, name, publisher };
            });

            const response = h.response({
                status: 'success',
                data: {
                    books,
                },
            });

            response.code(200);
            return response;
        }
        const response = h.response({
            status: 'fail',
            message: 'Gagal menampilkan buku. Query parameter tidak sesuai ekspektasi',
        });
        response.code(400);
        return response;
    }

    // Query reading
    if (quer.finished) {
        if (quer.finished === '0') {
            const book = bookShelf.filter((b) => b.finished === false);

            const books = book.map((b) => {
                const { id, name, publisher } = b;
                return { id, name, publisher };
            });

            const response = h.response({
                status: 'success',
                data: {
                    books,
                },
            });

            response.code(200);
            return response;
        }
        if (quer.finished === '1') {
            const book = bookShelf.filter((b) => b.finished === true);

            const books = book.map((b) => {
                const { id, name, publisher } = b;
                return { id, name, publisher };
            });

            const response = h.response({
                status: 'success',
                data: {
                    books,
                },
            });

            response.code(200);
            return response;
        }
        const response = h.response({
            status: 'fail',
            message: 'Gagal menampilkan buku. Query parameter tidak sesuai ekspektasi',
        });
        response.code(400);
        return response;
    }

    const books = bookShelf.map((book) => {
        const { id, name, publisher } = book;
        return { id, name, publisher };
    });

    const response = h.response({
        status: 'success',
        data: {
            books,
        },
    });

    response.code(200);
    return response;
};

// Send all data of a book based on the book id received
const getBookDetailsHandler = (request, h) => {
    const { bookId } = request.params;

    const book = bookShelf.filter((b) => b.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
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

// Receive new value and save them into a specific book based on id
const editSpecificBookHandler = (request, h) => {
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
    let finished = false; // Initialize finished = false, jika sudah selesai membaca nanti jadi true
     // Cari buku berdasarkan id
    const index = bookShelf.findIndex((book) => book.id === bookId);

    // Error karena tidak ada nama
     if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    // Error karena read page > page count
    if (pageCount < readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }

    // Jika sudah selesai membaca
    if (pageCount === readPage) {
        finished = true;
    }

    if (index !== -1) {
        bookShelf[index] = {
            ...bookShelf[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',

        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

const deleteSpecificBookhandler = (request, h) => {
    const { bookId } = request.params;

    const index = bookShelf.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        bookShelf.splice(index, 1);

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

export {
    addNewBookHandler,
    getAllBooksHandler,
    getBookDetailsHandler,
    editSpecificBookHandler,
    deleteSpecificBookhandler,
};
