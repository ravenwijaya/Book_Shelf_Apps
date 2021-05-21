document.addEventListener("DOMContentLoaded", () => {

    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", (event) => {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        searchBook();
    });

});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil di simpan.");
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});