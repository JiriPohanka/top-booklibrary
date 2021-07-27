const newBookBtn = document.querySelector('.create-book-btn')
const bookGrid = document.querySelector('.book-grid')
const formSection = document.querySelector('.form-section')
const bookLibrary = [{title: 'Martian', author: 'Ray Bradbury', pageCount: 349, status: 'no'},{title: 'Martian', author: 'Ray Bradbury', pageCount: 349, status: 'no'}]

const createNewBook = () => {
    const formWrapper = document.createElement('div');
    formSection.appendChild(formWrapper);
    formWrapper.innerHTML = 
    `<form id="new-book-form" class="new-book-form">
        <label name="title">Title</label>
        <input name="title" id="title" placeholder="Lord of the Rings" type="text">
        <label name="author">Author</label>
        <input name="author" id="author" placeholder="J.R.R. Tolkien" type="text">
        <label name="page-count">Page count</label>
        <input name="page-count" id="page-count" placeholder="475" type="number">
        <label name="status">Finished reading?</label>
        <input name="status" id="status" placeholder="no" type="text">
        <input type="submit" id="submit-book-btn" value="Add new book">
    </form>`

    const newBookForm = document.querySelector('#new-book-form');


    newBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = e.target.elements.title.value;
        const author = e.target.elements.author.value;
        const pageCount = e.target.elements['page-count'].value;
        const status = e.target.elements.status.value;
        console.log(e, title, author, pageCount, status);

        const book = new Book(title, author, pageCount, status)
        bookLibrary.push(book)
        book.logCreation()
        console.log(bookLibrary);
        cleanBookGrid();
        populateBookGrid(bookLibrary);
    })
}

const cleanBookGrid = () => {
    document.querySelector('.book-grid').innerHTML = "";
}

const populateBookGrid = (arr) => {
    for (let book of bookLibrary) {
        function createBookSheet(book) {
            const bookSheetWrap = document.createElement('div');
            document.querySelector('.book-grid').appendChild(bookSheetWrap);
            bookSheetWrap.innerHTML = `<p>${book.title}</p>
            <p>${book.author}</p>
            <p>${book.pageCount} pages</p>
            <p>have read?: ${book.status}</p>`
        }
        createBookSheet(book);
    }
}

function Book (title, author, pageCount, status) {
    this.title = title
    this.author = author
    this.pageCount = pageCount
    this.status = status
}

Book.prototype.logCreation = () => console.log('new book has been added');


newBookBtn.addEventListener('click', (e) => createNewBook())


// a plus button onclick pops up a form for book insertion
// form contains title, author, number of pages, reading status