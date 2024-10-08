const ordersTable = document.getElementById("history-table");
const ordersInfoModal = document.getElementById("history-info");

const orderDialog = document.getElementById("purchase-dialog");
const productsListingDiv = document.getElementById("products-listing");

let orders, orderItems, products;

const showPurchaseDialog = () => {
    ordersInfoModal.classList.remove("invisible");
    ordersInfoModal.classList.add("visible");
};

const hidePurchaseDialog = () => {
    ordersInfoModal.classList.remove("visible");
    ordersInfoModal.classList.add("invisible");
};

const renderProductsInOrders = (orderCode) => {
    productsListingDiv.innerHTML = "";

    let productsQtyInOrder = 0;
    const productsInSaidOrder = orderItems.filter(
        (order) => order.order_code == orderCode
    );

    productsInSaidOrder.forEach((item) => {
        productsQtyInOrder += item.amount;
        const itemName = getItemFieldBasedOnId(products, "name", item.product_code);

        p = document.createElement("p");
        p.textContent = `${item.amount}x ${itemName}`;
        productsListingDiv.append(p);
    });

    return { productsQtyInOrder };
};

const viewPurchase = (orderId) => {
    const order = getItemBasedOnId(orders, orderId);
    const { productsQtyInOrder } = renderProductsInOrders(order.code);

    const orderIdP = document.getElementById("order-id");
    const orderTaxP = document.getElementById("order-tax");
    const orderTotalP = document.getElementById("order-total");
    const productsQtyP = document.getElementById("products-qty");

    orderIdP.textContent = order.code;
    orderTaxP.textContent = "$ " + order.tax;
    orderTotalP.textContent = "$ " + order.total;
    productsQtyP.textContent = productsQtyInOrder;

    showPurchaseDialog();
};

const addOrderToOrdersTable = (...row_fields) => {
    const table_last_row = ordersTable.insertRow(-1);
    const purchase_id = row_fields[0];

    row_fields.forEach((value, index) => {
        const cell = table_last_row.insertCell(index);
        cell.textContent = `${value}`;

        if (index == row_fields.length - 1) {
            cell.innerHTML = `<button id='${purchase_id}' class='delete-btns' onclick='viewPurchase(${purchase_id})'>View order</button>`;
        }
    });
};

const loadDatabaseDependencies = async () => {
    try {
        orders = (await getOrders()) ?? [];
        orderItems = (await getOrderItems()) ?? [];
        products = (await getProducts()) ?? [];
    } catch (e) {
        return console.error(e);
    }

    if (orders.length)
        orders.forEach((order) =>
            addOrderToOrdersTable(
                order.code,
                order.tax,
                order.total,
                order.code
            )
        );
};
loadDatabaseDependencies();
