// Datos base del usuario solicitado en la Fase 2
const DEFAULT_USER = {
    name: "Ash Ketchum",
    pin: "1234",
    account: "0987654321",
    balance: 500.00,
    history: []
};

let user = {};
let chartInstance = null;

// Inicializa los datos usando LocalStorage
function initializeUser() {
    const savedUser = localStorage.getItem("pokemonBankUser");

    if (savedUser) {
        user = JSON.parse(savedUser);
    } else {
        user = { ...DEFAULT_USER };
        saveUser();
    }
}

function saveUser() {
    localStorage.setItem("pokemonBankUser", JSON.stringify(user));
}

function login() {
    const pin = document.getElementById("pinInput").value;
    const pinError = validatePIN(pin);

    if (pinError) {
        Swal.fire("Validación", pinError, "warning");
        return;
    }

    if (pin === user.pin) {
        document.getElementById("loginView").classList.add("d-none");
        document.getElementById("atmView").classList.remove("d-none");
        updateUI();

        Swal.fire({
            icon: "success",
            title: "Bienvenido",
            text: user.name,
            timer: 1200,
            showConfirmButton: false
        });
    } else {
        Swal.fire("Error", "PIN incorrecto.", "error");
    }
}

function logout() {
    document.getElementById("loginView").classList.remove("d-none");
    document.getElementById("atmView").classList.add("d-none");
    document.getElementById("pinInput").value = "";
}

function validatePIN(pin) {
    if (!pin || pin.trim() === "") return "Debe ingresar el PIN.";
    if (!/^\d{4}$/.test(pin)) return "El PIN debe contener exactamente 4 dígitos numéricos.";
    return null;
}

function validateAmount(value) {
    const amount = Number(value);

    if (value === null || value === "") return "Debe ingresar un monto.";
    if (!Number.isFinite(amount)) return "El monto ingresado no es válido.";
    if (amount <= 0) return "El monto debe ser mayor que cero.";
    if (amount > 10000) return "El monto no puede ser mayor a $10,000.";
    return null;
}

function addTransaction(type, detail, amount) {
    user.history.unshift({
        date: new Date().toLocaleString(),
        type,
        detail,
        amount: Number(amount)
    });

    saveUser();
    updateUI();
}

function deposit() {
    Swal.fire({
        title: "Depósito",
        input: "number",
        inputLabel: "Ingrese el monto a depositar",
        inputAttributes: { min: 1, step: "0.01" },
        showCancelButton: true
    }).then(result => {
        if (!result.isConfirmed) return;

        const error = validateAmount(result.value);
        if (error) {
            Swal.fire("Error", error, "error");
            return;
        }

        const amount = Number(result.value);
        user.balance += amount;
        addTransaction("Depósito", "Depósito a cuenta", amount);

        Swal.fire("Operación exitosa", "El depósito fue realizado correctamente.", "success");
    });
}

function withdraw() {
    Swal.fire({
        title: "Retiro",
        input: "number",
        inputLabel: "Ingrese el monto a retirar",
        inputAttributes: { min: 1, step: "0.01" },
        showCancelButton: true
    }).then(result => {
        if (!result.isConfirmed) return;

        const error = validateAmount(result.value);
        if (error) {
            Swal.fire("Error", error, "error");
            return;
        }

        const amount = Number(result.value);

        if (amount > user.balance) {
            Swal.fire("Error", "Fondos insuficientes.", "error");
            return;
        }

        user.balance -= amount;
        addTransaction("Retiro", "Retiro de efectivo", amount);

        Swal.fire("Operación exitosa", "El retiro fue realizado correctamente.", "success");
    });
}

function payService() {
    Swal.fire({
        title: "Pago de servicio",
        input: "select",
        inputOptions: {
            "Energía eléctrica": "Energía eléctrica - $45.00",
            "Internet": "Internet - $60.00",
            "Telefonía": "Telefonía - $25.00",
            "Agua potable": "Agua potable - $15.00"
        },
        showCancelButton: true
    }).then(result => {
        if (!result.isConfirmed) return;

        const prices = {
            "Energía eléctrica": 45,
            "Internet": 60,
            "Telefonía": 25,
            "Agua potable": 15
        };

        const service = result.value;
        const amount = prices[service];

        if (amount > user.balance) {
            Swal.fire("Error", "Saldo insuficiente para pagar este servicio.", "error");
            return;
        }

        user.balance -= amount;
        addTransaction("Pago de servicio", service, amount);

        Swal.fire("Pago realizado", "El servicio fue pagado correctamente.", "success");
    });
}

function showBalance() {
    Swal.fire("Saldo disponible", "$" + user.balance.toFixed(2), "info");
}

function updateUI() {
    document.getElementById("clientName").innerText = user.name;
    document.getElementById("accountNumber").innerText = user.account;
    document.getElementById("balanceText").innerText = "$" + user.balance.toFixed(2);

    let rows = "";

    if (user.history.length === 0) {
        rows = `<tr><td colspan="4" class="text-center text-muted">No hay transacciones registradas.</td></tr>`;
    } else {
        user.history.forEach(item => {
            rows += `
                <tr>
                    <td>${item.date}</td>
                    <td>${item.type}</td>
                    <td>${item.detail}</td>
                    <td>$${Number(item.amount).toFixed(2)}</td>
                </tr>
            `;
        });
    }

    document.getElementById("historyTable").innerHTML = rows;
}

function generateLastReceiptPDF() {
    if (user.history.length === 0) {
        Swal.fire("Aviso", "No hay transacciones para generar comprobante.", "info");
        return;
    }

    const last = user.history[0];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Pokémon Bank - Comprobante de Transacción", 10, 10);
    doc.text("Cliente: " + user.name, 10, 25);
    doc.text("Cuenta: " + user.account, 10, 35);
    doc.text("Fecha: " + last.date, 10, 45);
    doc.text("Tipo: " + last.type, 10, 55);
    doc.text("Detalle: " + last.detail, 10, 65);
    doc.text("Monto: $" + Number(last.amount).toFixed(2), 10, 75);
    doc.text("Saldo actual: $" + user.balance.toFixed(2), 10, 85);

    doc.save("comprobante-transaccion.pdf");
}

function generateHistoryPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Pokémon Bank - Historial de Transacciones", 10, 10);
    doc.text("Cliente: " + user.name, 10, 20);
    doc.text("Cuenta: " + user.account, 10, 30);

    let y = 45;

    user.history.forEach(item => {
        doc.text(`${item.date} | ${item.type} | ${item.detail} | $${Number(item.amount).toFixed(2)}`, 10, y);
        y += 10;
    });

    doc.save("historial-transacciones.pdf");
}

function showChart() {
    const counts = {
        "Depósito": 0,
        "Retiro": 0,
        "Pago de servicio": 0
    };

    user.history.forEach(item => {
        if (counts[item.type] !== undefined) counts[item.type]++;
    });

    const ctx = document.getElementById("chartCanvas");

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(counts),
            datasets: [{
                label: "Número de transacciones",
                data: Object.values(counts)
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

function clearData() {
    Swal.fire({
        title: "¿Reiniciar datos?",
        text: "Se eliminará el historial y el saldo volverá a $500.00.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, reiniciar",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (!result.isConfirmed) return;

        localStorage.removeItem("pokemonBankUser");
        initializeUser();
        updateUI();

        if (chartInstance) chartInstance.destroy();

        Swal.fire("Listo", "Los datos fueron reiniciados.", "success");
    });
}

initializeUser();
