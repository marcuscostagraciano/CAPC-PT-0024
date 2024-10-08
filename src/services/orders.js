const getOrders = async () =>
    await fetch("http://localhost/orders", { method: "GET" })
        .then((e) => e.json());

const postOrder = async (total = 0, tax = 0) => {
    const response = await fetch("http://localhost/orders", {
        method: "POST",
        body: JSON.stringify({ total, tax }),
    })
        .then((e) => e.json());
    return response;
};

const putOrder = async (id, total, tax) => {
    const response = await fetch(`http://localhost/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ total, tax }),
    })
        .then((e) => e.json());
    return response;
};
