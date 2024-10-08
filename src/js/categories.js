const form = document.getElementById("input-form");
const categoriesTable = document.getElementById("categories-table");

const categoryName_field = document.getElementById("category_name");
const tax_field = document.getElementById("tax");

// const categories = getItemFromLocalStorage("categories") ?? (setItemToLocalStorage("categories", []) && []);
// const categories = [];
// const products = getItemFromLocalStorage("products") ?? [];
let categories, products;

const loadDatabaseDependencies = async () => {
    try {
        categories = (await getCategories()) ?? [];
        // Necessário para impedir remoção de categorias com itens registrados
        products = (await getProducts()) ?? [];
    } catch (e) {
        return console.error(e);
    }

    if (categories.length)
        categories.forEach((category) =>
            insertItemsToTable(
                categoriesTable,
                category.code,
                category.name,
                category.tax,
                category.code
            )
        );
};
loadDatabaseDependencies();

const validateInputs = (categoryName, tax) => {
    let alert_msg = "";
    const isCategoryNameValid =
        categoryName &&
        3 <= categoryName.length &&
        categoryName.length <= QUANTIDADE_MAXIMA_CARACTERES;
    const isTaxValid = 0 <= tax && tax <= 100;
    const isNameBeingUsed = categories.some(
        (category) => category.name == categoryName
    );

    if (isCategoryNameValid && isTaxValid && !isNameBeingUsed) return true;
    if (!isCategoryNameValid) {
        alert_msg += 'Erro no campo "Category name"';
        categoryName_field.value = "";
        categoryName_field.focus();
    }
    if (!isTaxValid) {
        alert_msg += '\nErro no campo "Tax"';
        tax_field.value = "";
        tax_field.focus();
    }
    if (isNameBeingUsed) {
        alert_msg += "\nNome em uso";
        categoryName_field.focus();
    }
    alert_msg && alert(alert_msg);
};

const addItemFromInputs = async () => {
    const categoryName = sanitizeName(categoryName_field.value);
    const tax = sanitizeTax(tax_field.value);

    const areInputsValid = validateInputs(categoryName, tax);
    if (areInputsValid) {
        categories.push(await postCategory(categoryName, tax));
        const nextRegisterId = categories.at(-1).code;

        insertItemsToTable(
            categoriesTable,
            nextRegisterId,
            categoryName,
            tax,
            nextRegisterId
        );

        categoryName_field.value = "";
        tax_field.value = "";
    }
};

const removeItemBasedOnId = async (itemIdToRemove) => {
    const checkIfCategoryExistsInProductsList = (category_id) =>
        products.some((product) => product.category_code == category_id);

    if (checkIfCategoryExistsInProductsList(itemIdToRemove)) {
        return alert("Categoria sendo utilizada (no(s) produto(s))");
    }

    deleteCategory(itemIdToRemove);
    location.reload();
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    addItemFromInputs();
});
