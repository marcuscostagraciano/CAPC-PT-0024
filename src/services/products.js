const getProducts = async () =>
    await fetch("http://localhost/products", { method: "GET" })
        .then((e) => e.json());

const postProduct = async (name, amount, price, category_code) => {
    const response = await fetch("http://localhost/products", {
        method: "POST",
        body: JSON.stringify({ name, price, category_code, amount }),
    })
        .then((e) => e.json())
        .then((e) => e);
    return response;
};

const deleteProduct = async (id) => {
    return await fetch(`http://localhost/products/${id}`, {
        method: "DELETE",
    })
        .then((e) => e.json())
        .then((e) => e);
};

const patchProduct = async (id, amount, price) => {
    const response = await fetch(`http://localhost/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ amount }),
    })
        .then((e) => e.json())
        .then((e) => e);
    return response;
};
