import {
    addNewBookHandler,
    deleteSpecificBookhandler,
    editSpecificBookHandler,
    getAllBooksHandler,
    getBookDetailsHandler,
} from './handler.js';

const routes = [
    // Menambahkan buku
    {
        method: 'POST',
        path: '/books',
        handler: addNewBookHandler,
    },
    // Menampilkan semua buku
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    // Menampilkan buku berdasarkan Id
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookDetailsHandler,
    },
    // Edit buku berdasarkan Id
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editSpecificBookHandler,
    },
    // Hapus buku berdasarkan Id
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteSpecificBookhandler,
    },

];

export default routes;
