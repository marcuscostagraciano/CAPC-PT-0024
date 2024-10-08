const head = `
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Desafio: CAPC-PT-0024</title>

        <link rel="stylesheet" href="src/assets/views/index.css">
        <link rel="icon" href="src/assets/images/icon-softexpert-site.png" type="image/x-icon">
    </head>
`;

const document_head = document.getElementsByTagName('head')[0];
document_head.innerHTML = head;
console.log("LOADING HEAD");
