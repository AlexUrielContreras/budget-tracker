let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event){
    db = event.target.result;
    db.createObjectStore('new-transaction', { autoIncrement: true})
};

request.onsuccess = function(event) {
    db = event.target.result
    if (navigator.onLine) {
        //uploadTransaction()
    }
};

request.onerror = function(event){
    console.log(event.target.errorCode)
}

function saveRecord(record) {
    const transaction = db.transaction(['new-transaction'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new-transaction')

    budgetObjectStore.add(record)
}