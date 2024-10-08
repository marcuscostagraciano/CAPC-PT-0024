const form = document.getElementById("input-form");
const category_selection = document.getElementById("category-selection");
const products_table = document.getElementById("products-table");

const productNameField = document.getElementById("product_name");
const amountField = document.getElementById("amount");
const unitPriceField = document.getElementById("unit_price");

let categories, products, productsCart, orderItems;

const loadDatabaseDependencies = async () => {
    try {
        categories = (await getCategories()) ?? [];
        products = (await getProducts()) ?? [];

        // Necessário para impedir remoção de itens registrados no 'carrinho' e 'histórico'
        orderItems = (await getOrderItems()) ?? [];
        productsCart = getItemFromLocalStorage("products_cart") ?? [];
    } catch (err) {
        return console.error(err);
    }

    if (categories.length)
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.code;
            option.textContent = category.name;

            category_selection.append(option);
        });

    if (!categories?.length) {
        const submit_btn = document.getElementById("submit-btn");
        submit_btn.disabled = true;
        submit_btn.title = "Registre Categorias para habilitar o botão";
        submit_btn.value = "No categories found";
    }

    if (products.length)
        products.forEach((product) =>
            insertItemsToTable(
                products_table,
                product.code,
                product.name,
                product.amount,
                product.price,
                getItemFieldBasedOnId(
                    categories,
                    "name",
                    product.category_code
                ),
                product.code
            )
        );
};
loadDatabaseDependencies();

const removeItemBasedOnId = async (itemIdToRemove) => {
    const checkIfProductExistsInHistoryOrProductsCart = (productIdToBeChecked) =>
        productsCart?.items?.some(item => item.code == productIdToBeChecked) ||
        orderItems?.some(item => item.product_code == productIdToBeChecked);

    if (checkIfProductExistsInHistoryOrProductsCart(itemIdToRemove)) {
        return alert("Produto sendo utilizado (no carrinho ou histórico)");
    }

    deleteProduct(itemIdToRemove);
    location.reload();
};

const validateInputs = (productName, amount, unitPrice, category) => {
    let alert_msg = "";
    const is_productName_valid =
        productName &&
        3 <= productName.length &&
        productName.length <= QUANTIDADE_MAXIMA_CARACTERES;
    const is_amount_valid = amount && 0 < amount;
    const is_unitPrice_valid = unitPrice && 0 < unitPrice;
    const is_category_valid = category && 0 < category;
    const isNameBeingUsed = products.some(
        (products) => products.name == productName
    );

    if (
        is_productName_valid &&
        is_amount_valid &&
        is_unitPrice_valid &&
        is_category_valid &&
        !isNameBeingUsed
    )
        return true;
    if (!is_productName_valid) {
        alert_msg += 'Erro no campo "Product name"';
        productNameField.value = "";
        productNameField.focus();
    }
    if (!is_amount_valid) {
        alert_msg += '\nErro no campo "Amount"';
        amountField.value = "";
        amountField.focus();
    }
    if (!is_unitPrice_valid) {
        alert_msg += '\nErro no campo "Unit price"';
        unitPriceField.value = "";
        unitPriceField.focus();
    }
    if (!is_category_valid) {
        alert_msg += '\nErro no campo "Category"';
        category_selection.value = "";
        category_selection.focus();
    }
    if (isNameBeingUsed) {
        alert_msg += "\nNome em uso";
        productNameField.focus();
    }
    alert_msg && alert(alert_msg);
};

const addItemFromInputs = async () => {
    const productName = sanitizeName(productNameField.value);
    const amount = sanitizeInteger(amountField.value);
    const unitPrice = sanitizePrice(unitPriceField.value);

    const category = sanitizeInteger(category_selection.value);

    const areInputsValid = validateInputs(
        productName,
        amount,
        unitPrice,
        category
    );
    if (areInputsValid) {
        products.push(
            await postProduct(productName, amount, unitPrice, category)
        );
        const next_register_id = products.at(-1).code;

        insertItemsToTable(
            products_table,
            next_register_id,
            productName,
            amount,
            unitPrice,
            getItemFieldBasedOnId(categories, "name", category),
            next_register_id
        );

        productNameField.value = "";
        amountField.value = "";
        unitPriceField.value = "";
    }
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    addItemFromInputs();
});
