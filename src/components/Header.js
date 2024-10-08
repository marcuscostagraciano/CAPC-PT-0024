const page_header = `
    <h1><a href="#">Suite Store</a></h1>

    <ul>
        <li><a href="src/views/products.html">Products</a></li>
        <li><a href="src/views/categories.html">Categories</a></li>
        <li><a href="src/views/history.html">History</a></li>
    </ul>
`;

const page_header_inside_src = `
    <h1><a href="../../index.html">Suite Store</a></h1>

    <ul>
        <li><a href="./products.html">Products</a></li>
        <li><a href="./categories.html">Categories</a></li>
        <li><a href="./history.html">History</a></li>
    </ul>
`;

if (document.getElementById('page-header')) [
    document.getElementById('page-header').innerHTML = page_header
];
else {
    document.getElementById('page-header-inside-src').innerHTML = page_header_inside_src;
}

// console.log("LOADING HEADER (NAVBAR)");
