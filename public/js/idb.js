
let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event){
    db = event.target.result;
    db.createObjectStore('new-transaction', { autoIncrement: true})
};

request.onsuccess = function(event) {
    db = event.target.result
    if (navigator.onLine) {
        uploadTransaction()
    }
};

request.onerror = function(event){
    console.log(event.target.errorCode)
}

function saveRecord(record) {
    const transaction = db.transaction(['new-transaction'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new-transaction')

    budgetObjectStore.add(record)
};

function uploadTransaction() {
    const transaction = db.transaction(['new-transaction'], 'readwrite')

    const budgetObjectStore = transaction.objectStore('new-transaction');

    const getAll = budgetObjectStore.getAll()


getAll.onsuccess = function() {
    if (getAll.result.length > 0){
        fetch('/api/transaction', {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getAll.result)
        }).then(response => response.json())
        .then(serverResponse => {
            if (serverResponse.message) {
              throw new Error(serverResponse);
            }
            // open one more transaction
            const transaction = db.transaction(['new-transaction'], 'readwrite');
            // access the new_transaction object store
            const budgetObjectStore = transaction.objectStore('new-transaction');
            // clear all items in your store
            budgetObjectStore.clear();
  
            alert('All saved transaction has been submitted!');
          })
          .catch(err => {
            console.log(err);
          });
      
    }
}
}

window.addEventListener('online', uploadTransaction);