const getOrderItems = async () =>
    await fetch("http://localhost/order_item", { method: "GET" })
        .then((e) => e.json())
        .then((e) => e);

const postOrderItem = async (order_code, product_code, amount) => {
    const response = fetch("http://localhost/order_item", {
        method: "POST",
        body: JSON.stringify({ order_code, product_code, amount }),
    });

    return response;
};

// const deleteOrderItem = async (id) => {
//     console.log(`http://localhost/order_item/${id}`);

//     return await fetch(`http://localhost/order_item/${id}`, {
//         method: "DELETE",
//     })
//         .then((e) => e.json())
//         .then((e) => e);
// };
