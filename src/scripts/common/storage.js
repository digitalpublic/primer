import localforage from "localforage"

localforage.config({
    name        : 'digGov',
    storeName   : 'digitalgovernance', // Should be alphanumeric, with underscores.
    description : 'digital governance exercises'
});

export default localforage