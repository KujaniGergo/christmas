const list = [
    { what: "Logisztika", who1: "Kovács Máté", shift1: "Délelöttös", who2: "Kovács József", shift2: "Délutános" },
    { what: "Könyvelés", who1: "Szabó Anna", shift1: "Éjszakai" },
    { what: "Játékfejlesztés", who1: "Varga Péter", shift1: "Délutános", who2: "Nagy Eszter", shift2: "Éjszakai" }
];


const jsSection = document.createElement("div");
jsSection.id = "jssection";
jsSection.classList.add("hide");
document.body.appendChild(jsSection);


const table = document.createElement("table");
jsSection.appendChild(table);

const thead = document.createElement("thead");
table.appendChild(thead);
const headerRow = document.createElement("tr");
thead.appendChild(headerRow);

const headers = ["Osztály", "Manó", "Műszak"];
for (const text of headers) {
    const th = document.createElement("th");
    th.innerText = text;
    headerRow.appendChild(th);
}

const tbody = document.createElement("tbody");
tbody.id = "jstbody";
table.appendChild(tbody);


function renderTbody(data) {
    const tbodyElement = document.getElementById("jstbody");
    tbodyElement.innerHTML = "";

    for (const item of data) {
        const tr1 = document.createElement("tr");
        tbodyElement.appendChild(tr1);

        const tdWhat = document.createElement("td");
        tdWhat.innerText = item.what;
        tr1.appendChild(tdWhat);

        const tdWho1 = document.createElement("td");
        tdWho1.innerText = item.who1;
        tr1.appendChild(tdWho1);

        const tdShift1 = document.createElement("td");
        tdShift1.innerText = item.shift1;
        tr1.appendChild(tdShift1);

       
        if (item.who2 && item.shift2) {
            tdWhat.rowSpan = 2;
            const tr2 = document.createElement("tr");
            tbodyElement.appendChild(tr2);

            const tdWho2 = document.createElement("td");
            tdWho2.innerText = item.who2;
            tr2.appendChild(tdWho2);

            const tdShift2 = document.createElement("td");
            tdShift2.innerText = item.shift2;
            tr2.appendChild(tdShift2);
        }
    }
}


const formLeiras = [
    { 
        id: "osztaly", label: "Osztály", name: "osztaly" 
    },
    { 
        id: "mano1", label: "Manó 1", name: "mano1" 
    },
    { 
        id: "muszak1", label: "Manó 1 műszak", name: "muszak1", type: "select", 
        optionList: [{ value: "1", label: "Délelöttös" }, { value: "2", label: "Délutános" }, { value: "3", label: "Éjszakai" }] 
    },
    { 
        id: "masodikmano", label: "Két manót veszek fel", name: "masodikmano", type: "checkbox" 
    },
    { 
        id: "mano2", label: "Manó 2", name: "mano2" 
    },
    {
        id: "muszak2", label: "Manó 2 műszak", name: "muszak2", type: "select", 
        optionList: [{ value: "1", label: "Délelöttös" }, { value: "2", label: "Délutános" }, { value: "3", label: "Éjszakai" }] 
    }
];

function createForm(fields) {
    const form = document.createElement("form");
    form.id = "jsform";

    for (const field of fields) {
        const fieldDiv = document.createElement("div");
        form.appendChild(fieldDiv);

        if (field.type === "checkbox") {
            const input = document.createElement("input");
            input.id = field.id;
            input.name = field.name;
            input.type = "checkbox";
            fieldDiv.appendChild(input);

            const label = document.createElement("label");
            label.innerText = field.label;
            label.htmlFor = field.id;
            fieldDiv.appendChild(label);
        } else {
            const label = document.createElement("label");
            label.innerText = field.label;
            label.htmlFor = field.id;
            fieldDiv.appendChild(label);
            fieldDiv.appendChild(document.createElement("br"));

            if (field.type === "select") {
                const select = document.createElement("select");
                select.id = field.id;
                fieldDiv.appendChild(select);
                
                const defaultOpt = document.createElement("option");
                defaultOpt.innerText = "Válassz műszakot!";
                defaultOpt.value = "";
                select.appendChild(defaultOpt);

                for (const opt of field.optionList) {
                    const o = document.createElement("option");
                    o.innerText = opt.label;
                    o.value = opt.value;
                    select.appendChild(o);
                }
            } else {
                const input = document.createElement("input");
                input.id = field.id;
                input.name = field.name;
                fieldDiv.appendChild(input);
                fieldDiv.appendChild(document.createElement("br"));
            }
        }
        const errorSpan = document.createElement("span");
        errorSpan.classList.add("error");
        fieldDiv.appendChild(errorSpan);
    }

    const btn = document.createElement("button");
    btn.innerText = "Hozzaadas";
    form.appendChild(btn);
    return form;
}

const jsForm = createForm(formLeiras);
jsSection.appendChild(jsForm);


function validateField(element) {
    let isValid = true;
    if (element.value === "") {
        element.parentElement.querySelector(".error").innerText = "Kötelező elem!";
        isValid = false;
    }
    return isValid;
}

function clearErrors(container) {
    const errors = container.querySelectorAll(".error");
    for (const err of errors) err.innerText = "";
}


jsForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const form = e.target;
    clearErrors(form);

    const fOsztaly = form.querySelector("#osztaly");
    const fMano1 = form.querySelector("#mano1");
    const fMuszak1 = form.querySelector("#muszak1");
    const fMano2 = form.querySelector("#mano2");
    const fMuszak2 = form.querySelector("#muszak2");
    const fCheckbox = form.querySelector("#masodikmano");

    if (validateField(fOsztaly) & validateField(fMano1) & validateField(fMuszak1)) {
        const newEntry = {
            what: fOsztaly.value,
            who1: fMano1.value,
            shift1: mapMuszak(fMuszak1.value)
        };

        if (fCheckbox.checked) {
            newEntry.who2 = fMano2.value;
            newEntry.shift2 = mapMuszak(fMuszak2.value);
        }

       
        createNewElement(newEntry, form, list);
    }
});


document.getElementById("htmlform").addEventListener("submit", function(e) {
    e.preventDefault();
    const form = e.target;
    const select = form.querySelector("#manochooser");
    const activity1 = form.querySelector("#manotev1");
    const activity2 = form.querySelector("#manotev2");

    clearErrors(form);

    if (validateField(select) & validateField(activity1)) {
        const htmlTbody = document.getElementById("htmltbody");
        const tr = document.createElement("tr");
        htmlTbody.appendChild(tr);

        const td1 = document.createElement("td");
        td1.innerText = select.value;
        tr.appendChild(td1);

        const td2 = document.createElement("td");
        td2.innerText = activity1.value;
        tr.appendChild(td2);

        if (activity2.value) {
            const td3 = document.createElement("td");
            td3.innerText = activity2.value;
            tr.appendChild(td3);
        } else {
            td2.colSpan = 2;
        }
        form.reset();
    }
});


initSelect(list);
renderTbody(list);
initCheckbox(jsForm.querySelector("#masodikmano"));