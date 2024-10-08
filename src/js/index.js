const form = document.getElementById("input-form");
const product_selection = document.getElementById("product-selection");
const products_table = document.getElementById("products-cart-table");
const finish_sale_btn = document.getElementById("finish_sale_btn");
const cancel_sale_btn = document.getElementById("cancel_sale_btn");

const amount_field = document.getElementById("amount_input");
const tax_field = document.getElementById("tax_input");
const price_field = document.getElementById("price_input");

const tax_td = document.getElementById("tax_td");
const total_td = document.getElementById("total_td");

let selected_product = { id: 0, name: "", amount: 0, price: 0, category: 0 };
const products_cart_template = { tax: 0, value: 0, item_qty: 0, items: [] };

let categories, products, history;
let productsCart =
    getItemFromLocalStorage("products_cart") ??
    (setItemToLocalStorage("products_cart", products_cart_template) && []);

const loadDatabaseDependencies = async () => {
    categories = (await getCategories()) ?? [];
    products = (await getProducts()) ?? [];
    // history = (await getOrders()) ?? [];
    // Produtos com unidades no estoque
    const not_amount_zero_products = products?.filter(
        (product) => product.amount != 0
    );

    if (productsCart.items) {
        productsCart.items.length ? (finish_sale_btn.disabled = false) : "";
        productsCart.items.length ? (cancel_sale_btn.disabled = false) : "";
        updateValuesInValuesTable();

        productsCart.items.forEach((item, index) => {
            decrementQuantityOfProductsToPurchase(
                products,
                item.code,
                item.amount
            );
            insertItemsToTable(
                products_table,
                item.name,
                item.amount,
                item.price,
                item.amount * item.price,
                index
            );
        });
    }

    // Atribui os itens com "amount" diferente de 0 às opções do select
    if (not_amount_zero_products?.length) {
        changeInputFields(not_amount_zero_products[0].code);

        not_amount_zero_products.forEach((product) => {
            const option = document.createElement("option");
            option.value = product.code;
            option.textContent = product.name;

            product_selection.append(option);
        });
    }

    // Desabilita o botão de submit caso não existam produtos registrados
    if (!not_amount_zero_products?.length) {
        const submit_btn = document.getElementById("submit-btn");
        submit_btn.disabled = true;
        submit_btn.title = "Registre Produtos para habilitar o botão";
        submit_btn.value = "No products found";
    }
};
loadDatabaseDependencies();

const validateInputs = (product_id, amount, tax, price) => {
    let alert_msg = "";
    const is_amount_valid =
        amount && 0 < amount && amount <= selected_product.amount;
    const is_tax_valid = tax && 0 < tax;
    const is_price_valid = price && 0 < price;

    if (is_amount_valid && is_tax_valid && is_price_valid) return true;

    if (!is_amount_valid) {
        alert_msg += `Quantidade máxima permitida: ${selected_product.amount}`;
        amount_field.max = selected_product.amount;
        amount_field.focus();
    }

    alert_msg && alert(alert_msg);
};

const addItemFromInputs = () => {
    const product_id = sanitizeInteger(product_selection.value);
    const amount = sanitizeInteger(amount_field.value);
    const tax = sanitizeTax(tax_field.value);
    const price = sanitizePrice(price_field.value);

    const areInputsValid = validateInputs(product_id, amount, tax, price);

    if (areInputsValid) {
        const total_price = amount * price;
        const total_tax = parseFloat(((total_price * tax) / 100).toFixed(2));
        const last_added_product = getItemBasedOnId(products, product_id);

        // Snapshot do carrinho
        productsCart.item_qty += amount;
        productsCart.tax += total_tax;
        productsCart.value += total_price;
        productsCart.items.push({ ...last_added_product, amount: amount });
        setItemToLocalStorage("products_cart", productsCart);

        // INSERE ITENS NA TABELA 1 (CARRINHO)
        insertItemsToTable(
            products_table,
            getItemFieldBasedOnId(products, "name", product_id),
            amount,
            price,
            total_price,
            productsCart.items.length - 1
        );
        decrementQuantityOfProductsToPurchase(products, product_id, amount);

        // LIDA COM A TABELA 2 (SOMA DE VALORES)
        updateValuesInValuesTable();
    }
};

const clearCart = async () => {
    setItemToLocalStorage("products_cart", products_cart_template);
    location.reload();
};

const removeItemBasedOnId = (item_id_to_remove) => {
    // Remove o produto da lista e atribui à uma variável
    const removed_product = productsCart.items.splice(item_id_to_remove, 1)[0];
    productsCart.item_qty -= removed_product.amount;

    // Calcula o preço total do item removido (preço * quantidade no carrinho)
    const total_price_of_removed_product =
        removed_product.amount * removed_product.price;
    // Remove o valor total do carrinho
    productsCart.value -= total_price_of_removed_product;
    // Calcula o preço total das taxas do item removido (preço total * taxa da categoria do item)
    const tax_of_removed_product = getItemFieldBasedOnId(
        categories,
        "tax",
        removed_product.category_code
    );
    // Remove o valor da taxa do carrinho
    productsCart.tax -= parseFloat(
        (
            (total_price_of_removed_product * tax_of_removed_product) /
            100
        ).toFixed(2)
    );

    // Atualiza o carrinho
    setItemToLocalStorage("products_cart", productsCart);
    // Refresh na página
    location.reload();
};

const cancelSale = () => {
    const user_cancel_confirmation = window.confirm(
        "Deseja mesmo cancelar seu pedido? (Seu carrinho será deletado)"
    );
    user_cancel_confirmation && clearCart();
};

const postOrderItemFromTheCart = async (orderCode, items) => {
    const postPromises = items.map(
        async (product) =>
            await postOrderItem(orderCode, product.code, product.amount)
    );

    Promise.all(postPromises).then(async () => {
        await clearCart();
    });
};

const finishSale = async () => {
    const user_cancel_confirmation = window.confirm(
        "Deseja mesmo confirmar seu pedido?"
    );
    if (user_cancel_confirmation) {
        try {
            const createdOrder = await postOrder(0, 0);

            await postOrderItemFromTheCart(
                createdOrder.code,
                productsCart.items
            );
        } catch (err) {
            console.error(err);
        }
    }
};

const disableProductSelectionOption = (product_id) => {
    const selection_option =
        product_selection.options[
        getIndexOfItemOnListBasedOnItemId(products, product_id)
        ];
    selection_option.disabled = true;
};

const updateValuesInValuesTable = () => {
    tax_td.textContent = productsCart.tax;
    total_td.textContent = productsCart.value;
};

const decrementQuantityOfProductsToPurchase = (
    products_list,
    product_id,
    product_amount
) => {
    // Necessário, já que não é passado o item, mas sim o id dele
    const index_of_selected_product = getIndexOfItemOnListBasedOnItemId(
        products_list,
        product_id
    );
    // Decrementa o número de itens para compra
    products[index_of_selected_product].amount -= product_amount;

    // Atualiza o número máximo para compra no form
    changeInputFields(product_id);

    // Se a quantidade de itens disponíveis para compra for 0, desabilita a opção no "select"
    // products[index_of_selected_product].amount == 0 && disableProductSelectionOption(product_id);
};

const changeInputFields = (product_id) => {
    selected_product = getItemBasedOnId(products, product_id);
    const tax_from_selected_product = getItemFieldBasedOnId(
        categories,
        "tax",
        selected_product.category_code
    );

    amount_field.max = selected_product.amount;
    amount_field.title = `Quantidade disponível de itens: ${selected_product.amount}`;
    amount_field.value = "";
    amount_field.focus();

    tax_field.value = tax_from_selected_product;
    price_field.value = selected_product.price;
};

// EVENT LISTENER
product_selection.addEventListener("change", (e) => {
    const selected_product_id = product_selection.value;
    changeInputFields(selected_product_id);
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    addItemFromInputs();

    productsCart.items.length ? (finish_sale_btn.disabled = false) : "";
    productsCart.items.length ? (cancel_sale_btn.disabled = false) : "";
});
