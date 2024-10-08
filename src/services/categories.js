const getCategories = async () =>
    await fetch("http://localhost/categories", { method: "GET" })
        .then((e) => e.json());

const postCategory = async (name, tax) => {
    const response = await fetch("http://localhost/categories", {
        method: "POST",
        body: JSON.stringify({ name, tax }),
    })
        .then((e) => e.json())
        .then((e) => e);

    return response;
};

const deleteCategory = async (id) => {
    return await fetch(`http://localhost/categories/${id}`, {
        method: "DELETE",
    })
        .then((e) => e.json())
        .then((e) => e);
};