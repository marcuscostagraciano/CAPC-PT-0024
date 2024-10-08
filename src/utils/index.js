const QUANTIDADE_MAXIMA_CARACTERES = 33;

const removeExtraSpacesFromInput = (text) => text.trim().replace(/\s+/g, " ");

const preventHtmlInjection = (text) =>
    text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

const preventSQLInjection = (text) => null;

const setItemToLocalStorage = (name, item) => {
    localStorage.setItem(name, JSON.stringify(item));
    return true;
};

const getItemFromLocalStorage = (name) =>
    JSON.parse(localStorage.getItem(name));

const getNextRegisterId = (item_list) => {
    // Se o "item_list.at(-1)" existir, atribui o ID, do contrário, 0
    const last_register_id = item_list?.at(-1)?.code ?? 0;
    return last_register_id + 1;
};

const getIndexOfItemOnListBasedOnItemId = (item_list, item_id) => {
    const item = item_list.find((item) => item.code == item_id);
    return item_list.indexOf(item);
};

const getItemBasedOnId = (item_list, id) => {
    const item = item_list.find((item) => item.code == id);
    return item;
};

const getItemFieldBasedOnId = (item_list, field, id) => {
    const item = item_list.find((item) => item.code == id);
    return item[field];
};

const tableWithNoItems = (table) => {
    const table_row = table.insertRow(-1);
    const cell = table_row.insertCell();
    cell.colSpan = 6;
    cell.textContent = "No items to display";
};

const insertItemsToTable = (table, ...row_fields) => {
    const table_row = table.insertRow(-1);

    row_fields.forEach((value, index) => {
        const cell = table_row.insertCell(index);
        cell.textContent = `${value}`;

        if (index == row_fields.length - 1) {
            cell.innerHTML = `<i class="bi bi-trash-fill delete-btn" onclick='removeItemBasedOnId(${value})'></i>`;
        }
    });
};

const sanitizeName = (name) => {
    const name_wo_extra_spaces = removeExtraSpacesFromInput(name);
    // const name_regex = /[a-zà-ú ]+[a-zà-ú]?[0-9]?/i;
    // const name_match_result = name_wo_extra_spaces.replace(/</g, "&lt;").replace(/>/g, "&gt;").match(name_regex);
    // const name_wo_html_injection = name_wo_extra_spaces.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const name_wo_double_quotes = name_wo_extra_spaces.replace(/["]/g, "'");

    // if (QUANTIDADE_MAXIMA_CARACTERES <= name_match_result[0].length)
    //     return name_match_result[0].substring(0, QUANTIDADE_MAXIMA_CARACTERES) + '...';
    // return name_match_result ? name_match_result[0] : false;

    // o '3' vem das reticências (...)
    const QTD_MAX_CARACTERES_MENOS_RETICENCIAS =
        QUANTIDADE_MAXIMA_CARACTERES - 3;
    if (QTD_MAX_CARACTERES_MENOS_RETICENCIAS <= name_wo_double_quotes.length)
        return (
            name_wo_double_quotes.substring(
                0,
                QTD_MAX_CARACTERES_MENOS_RETICENCIAS
            ) + "..."
        );

    return name_wo_double_quotes ?? false;
};

const sanitizeInteger = (amount) => {
    const amount_regex = /[0-9]+/;
    const amount_match_result = amount.match(amount_regex);

    return amount_match_result ? parseInt(amount_match_result[0]) : false;
};

const sanitizeTax = (tax) => {
    const tax_regex = /([0-9]{1,3})(\.([0-9]{1,2}))?/;
    return sanitizeFloat(tax_regex, tax);
};

const sanitizePrice = (price) => {
    const price_regex = /([0-9]*)\.?([0-9]{1,2})?/;
    return sanitizeFloat(price_regex, price);
};

const sanitizeFloat = (regex, number) => {
    const number_match_result = number.match(regex);
    return number_match_result ? parseFloat(number_match_result[0]) : false;
};
