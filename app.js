const newBookBtn = document.querySelector('.create-book-btn')
const bookGrid = document.querySelector('.book-grid')
const formPopup = document.querySelector('.form-popup')
const newBookForm = document.querySelector('#new-book-form')
const bookDetailPopup = document.querySelector('.book-detail-popup')
let bookLibrary = [];

const updateLocalStorage = () => {
    localStorage.setItem('bookLibraryKey', JSON.stringify(bookLibrary))
}

const fetchBookLibrary = () => {
    const bookLibraryJSON = localStorage.getItem('bookLibraryKey');
    bookLibrary = JSON.parse(bookLibraryJSON);
    if (bookLibrary === null) {
        bookLibrary = [];
    }
}

// when + button gets clicked //
newBookBtn.addEventListener('click', createNewBook);

// after clicking the button to create a new book //
function createNewBook() {
    generateFormPopup();
    newBookBtn.disabled = true;
    newBookForm.addEventListener('submit', submitForm);
}

const submitForm = (e) => {
    newBookForm.removeEventListener('submit', submitForm);
    e.preventDefault();
    let title = e.target.elements.title.value;
    let author = e.target.elements.author.value;
    let pageCount = e.target.elements['page-count'].value;
    let status = e.target.elements.status.value;

    bookLibrary.push(new Book(title, author, pageCount, status));

    localStorage.removeItem('bookLibraryKey');
    updateLocalStorage();
    populateBookGrid();
    newBookForm.reset();
    formPopup.classList.toggle('show');
    newBookBtn.disabled = false;
    newBookBtn.addEventListener('click', createNewBook);
}

function Book(title, author, pageCount, status) {
    this.title = title
    this.author = author
    this.pageCount = pageCount
    this.status = status
}

Book.prototype.logCreation = () => console.log('new book has been added');

const generateFormPopup = () => {
    formPopup.classList.toggle('show');
}

const generateBookDetailPopup = () => {
    bookDetailPopup.classList.toggle('show');
}

const attachEventListeners = () => {
    const detailButtons = document.querySelectorAll('.detail-book-btn');
    const deleteButtons = document.querySelectorAll('.delete-book-btn');

    for (let detailButton of detailButtons) {
        detailButton.addEventListener('click', (e) => {
            const currentBookObj = bookLibrary[e.target.dataset.bookId];
            const index = e.target.dataset.bookId;
            showBookDetail(index, currentBookObj);
        })
    }

    for (let deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', (e) => {
            bookLibrary.splice(e.target.dataset.bookId, 1);
        })
        deleteButton.addEventListener('click', () => {
            localStorage.removeItem('bookLibraryKey');
            updateLocalStorage();
            populateBookGrid()
        }
        )
    }
}

const showBookDetail = (i, obj) => {
    newBookBtn.disabled = false
    generateBookDetailPopup();
    generateBookDetail(i, obj);
}

const generateBookDetail = (i, obj) => {
    bookDetail = document.querySelector('.book-detail');
    bookDetail.innerHTML =
        `
    <p>${obj.title}</p>
    <p>${obj.author}</p>
    <p>${obj.pageCount} pages</p>
    <p>have read?: ${obj.status}</p>
    <button data-book-id="${i}" class="edit-book-btn">edit</button>
    <button data-book-id="${i}" class="btn delete-book-btn">delete</button>
    <button class="btn ok-btn">ok</button>
    `
    const editButton = document.querySelector('div.book-detail-popup button.edit-book-btn');
    const deleteButton = document.querySelector('div.book-detail-popup button.delete-book-btn');
    const okButton = document.querySelector('div.book-detail-popup button.ok-btn');

    editButton.addEventListener('click', () => editBookDetail(i, obj));
    deleteButton.addEventListener('click', () => bookLibrary.splice(i, 1));
    deleteButton.addEventListener('click', () => bookDetailPopup.classList.toggle('show'));
    deleteButton.addEventListener('click', () => {
        localStorage.removeItem('bookLibraryKey');
        updateLocalStorage();
        populateBookGrid()
    })
    okButton.addEventListener('click', () => bookDetailPopup.classList.toggle('show'));
}

const editBookDetail = (i, obj) => {
    bookDetail = document.querySelector('.book-detail');
    bookDetail.innerHTML =
        `<form id="edit-book-form" class="edit-book-form">
        <input name="edit-title" id="edit-title" value="${obj.title}" type="text">
        <input name="edit-author" id="edit-author" value="${obj.author}" type="text">
        <input name="edit-page-count" id="edit-page-count" value="${obj.pageCount}" type="number">
        <input name="edit-status" id="edit-status" value="${obj.status}" type="text">
        <button data-book-id="${i}" class="btn cancel-book-btn">cancel</button>
        <input type="submit" id="update-book-btn" value="save changes">
    </form>`

    console.log(i, obj);
    const editBookForm = document.querySelector('#edit-book-form');
    editBookForm.addEventListener('submit', (e) => {
        console.log(e);
        console.log(i);
        console.log(obj);
        updateBookDetails(e, i, obj)
    })

}

const updateBookDetails = (e, i, obj) => {
    e.preventDefault();
    obj.title = e.target.elements['edit-title'].value;
    obj.author = e.target.elements['edit-author'].value;
    obj.pageCount = e.target.elements['edit-page-count'].value;
    obj.status = e.target.elements['edit-status'].value;
    generateBookDetail(i, obj);
}

const cleanBookGrid = () => {
    document.querySelector('.book-grid').innerHTML = "";
}

const populateBookGrid = () => {
    cleanBookGrid();
    fetchBookLibrary();
    for (let [i, book] of bookLibrary.entries()) {
        createBookSheet(i, book);
    }
    attachEventListeners();
}

function createBookSheet(i, obj) {
    const bookSheetWrap = document.createElement('div');
    bookSheetWrap.setAttribute("data-book-id", i)
    document.querySelector('.book-grid').appendChild(bookSheetWrap);
    bookSheetWrap.innerHTML =
        `
        <p>${obj.title}</p>
        <p>${obj.author}</p>
        <p>${obj.pageCount} pages</p>
        <p>have read?: ${obj.status}</p>
        <button data-book-id="${i}" class="detail-book-btn">detail</button>
        <button data-book-id="${i}" class="btn delete-book-btn">delete</button>
        `
}

document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('bookLibraryKey');
    fetchBookLibrary();
    populateBookGrid();
    newBookBtn.addEventListener('click', populateBookGrid);
    formPopup.querySelector('.blocker').addEventListener('click', () => formPopup.classList.toggle('show'));
    formPopup.querySelector('.blocker').addEventListener('click', () => newBookBtn.disabled = false);
    bookDetailPopup.querySelector('.blocker').addEventListener('click', () => bookDetailPopup.classList.toggle('show'));
    bookDetailPopup.querySelector('.blocker').addEventListener('click', () => newBookBtn.disabled = false);

});