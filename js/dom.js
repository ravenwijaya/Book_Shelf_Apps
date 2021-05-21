const COMPLETED_BOOK_ID = "completeBookshelfList";
const UNCOMPLETED_BOOK_ID = "incompleteBookshelfList";
const BOOK_ITEMID = "itemId";

function makeBook(title, author, year, isCompleted) {

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis: " + author;

    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun: " + year

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action")

    const article = document.createElement("article");
    article.classList.add("book_item")
    article.append(bookTitle, bookAuthor, bookYear, buttonContainer);

    if (isCompleted) {
        buttonContainer.append(
            createuncompleteButton(),
            createDeleteButton()
        );
    } else {
        buttonContainer.append(
            createFinishButton(),
            createDeleteButton()
        );
    }

    return article;
}

function createFinishButton() {
    return createButton("green", "Selesai dibaca", (event) => {
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createDeleteButton() {
    return createButton("red", "Hapus buku", (event) => {
        removeBook(event.target.parentElement.parentElement);
    });
}

function createuncompleteButton() {
    return createButton("green", "Belum Selesai dibaca", (event) => {
        undoBookFromCompleted(event.target.parentElement.parentElement);
    });
}



function createButton(buttonTypeClass, innertext, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = innertext;
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function addBook() {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_BOOK_ID);
    const completedBookList = document.getElementById(COMPLETED_BOOK_ID);
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;


    if (document.getElementById("inputBookIsComplete").checked) {

        const book = makeBook(title, author, year, true);
        const bookObject = composebookObject(title, author, year, true);
        book[BOOK_ITEMID] = bookObject.id;
        books.push(bookObject);
        completedBookList.append(book);
    } else {
        const book = makeBook(title, author, year, false);
        const bookObject = composebookObject(title, author, year, false);
        book[BOOK_ITEMID] = bookObject.id;
        books.push(bookObject);
        uncompletedBookList.append(book);
    }

    updateDataToStorage();
}

function addBookToCompleted(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_BOOK_ID);
    const bookTitle = bookElement.querySelector(".book_item > h3").innerText;
    const bookAuthor = bookElement.querySelector(".book_item  p:nth-child(2)").innerText.split(": ")[1];
    const bookYear = bookElement.querySelector(".book_item  p:nth-child(3)").innerText.split(": ")[1];

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function removeBook(bookElement) {

    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    Swal.fire({
        title: 'Book Deleted',
        text: 'success delete book',
        icon: 'success',
        confirmButtonText: 'OK'
    })
    updateDataToStorage();
}

function undoBookFromCompleted(bookElement) {

    const listUnCompleted = document.getElementById(UNCOMPLETED_BOOK_ID);
    const bookTitle = bookElement.querySelector(".book_item > h3").innerText;
    const bookAuthor = bookElement.querySelector(".book_item  p:nth-child(2)").innerText.split(": ")[1];
    const bookYear = bookElement.querySelector(".book_item  p:nth-child(3)").innerText.split(": ")[1];

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);


    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listUnCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function searchBook() {
    const booktitle = document.getElementById("searchBookTitle").value;
    const article = document.querySelectorAll(".book_item")
    if (booktitle.length > 0) {
        for (i = 0; i < article.length; i++) {
            if (article[i].firstElementChild.innerText.toLowerCase() != booktitle.toLowerCase()) {
                article[i].remove()
            }
        }

    } else {
        for (i = 0; i < article.length; i++) {
            article[i].remove()
        }
        loadDataFromStorage();
    }

}



function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_BOOK_ID);

    for (book of books) {
        const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if (book.isCompleted) {
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }
}