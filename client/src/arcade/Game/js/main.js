console.log("hello");
const cont = document.querySelector(".container");
let colr = false;
for(var x = 0; x < 8; x++) {
    const row = document.createElement("div");
        row.className = `row mx-auto w-75`;
    for(var y = 0; y < 8; y++) {
        const col = document.createElement("div");
        col.className = `tile ${color()}`;
        row.appendChild(col);
    }
    color();

    cont.appendChild(row);
}

function color() {
    colr = !(colr);
    if(colr) {
        return `bg-danger`;
    } else {
        return `bg-dark`;
    }
}