const API_URL = "/vehicles";

// getElements

const form = document.getElementById("vehicleForm");
const vehicleIdInput = document.getElementById("vehicle_id");
const plateInput = document.getElementById("plate_vehicle");
const modelInput = document.getElementById("model");
const colorInput = document.getElementById("color");
const vehicleStateInput = document.getElementById("vehicle_state");
const mileageInput = document.getElementById("mileage");
const operatingStateInput = document.getElementById("operating_state");

const tableBody = document.getElementById("vehicleTableBody");
const message = document.getElementById("message");
const searchIdInput = document.getElementById("searchId");

const cancelBtn = document.getElementById("cancelBtn");
const searchBtn = document.getElementById("searchBtn");
const loadAllBtn = document.getElementById("loadAllBtn");

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "#b91c1c" : "#0f766e";
}

// Get form data
function getFormData() {
    return {
        plate_vehicle: plateInput.value.trim(),
        model: modelInput.value.trim(),
        color: colorInput.value.trim(),
        vehicle_state: vehicleStateInput.value,
        mileage: Number(mileageInput.value) || 0,
        operating_state: operatingStateInput.value
    };
}

// reset form
function resetForm() {
    vehicleIdInput.value = "";
    form.reset();
    vehicleStateInput.value = "Nuevo";
    operatingStateInput.value = "Disponible";
    mileageInput.value = 0;
}

// render vehicles table
function renderVehicles(vehicles) {
    tableBody.innerHTML = "";

    if (!Array.isArray(vehicles) || vehicles.length === 0) {
        tableBody.innerHTML = `
      <tr>
        <td colspan="8">No hay vehículos para mostrar.</td>
      </tr>
    `;
        return;
    }

    vehicles.forEach((vehicle) => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td>${vehicle.vehicle_id}</td>
      <td>${vehicle.plate_vehicle}</td>
      <td>${vehicle.model}</td>
      <td>${vehicle.color}</td>
      <td>${vehicle.vehicle_state}</td>
      <td>${vehicle.mileage}</td>
      <td>${vehicle.operating_state}</td>
      <td>
        <button class="warning" onclick="editVehicle(${vehicle.vehicle_id}, '${vehicle.plate_vehicle}', '${vehicle.model}', '${vehicle.color}', '${vehicle.vehicle_state}', ${vehicle.mileage}, '${vehicle.operating_state}')">
          Editar
        </button>
        <button class="danger" onclick="deleteVehicle(${vehicle.vehicle_id})">
          Eliminar
        </button>
      </td>
    `;

        tableBody.appendChild(row);
    });
}


// load vehicles
async function loadVehicles() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        renderVehicles(data.response || []);
        showMessage("Vehículos cargados correctamente.");
    } catch (error) {
        showMessage("Error al cargar vehículos.", true);
        console.error(error);
    }
}

// search vehicle by id
async function searchVehicleById() {
    const id = searchIdInput.value.trim();

    if (!id) {
        showMessage("Ingresa un ID para buscar.", true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (Array.isArray(data.response)) {
            renderVehicles(data.response);
            showMessage(`Resultado de búsqueda para ID ${id}.`);
            return;
        }

        if (typeof data.response === "string") {
            renderVehicles([]);
            showMessage(data.response, true);
            return;
        }

        renderVehicles([]);
        showMessage("No se encontró el vehículo.", true);
    } catch (error) {
        showMessage("Error al buscar el vehículo.", true);
        console.error(error);
    }
}

// create vehicle
async function createVehicle(payload) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    return response.json();
}

// update vehicle
async function updateVehicle(id, payload) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    return response.json();
}


// delete vehicle
window.deleteVehicle = async function (id) {
    const confirmed = confirm(`¿Seguro que deseas eliminar el vehículo ${id}?`);

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json().catch(() => null);

        showMessage(data?.message || "Vehículo eliminado correctamente.");
        await loadVehicles();
    } catch (error) {
        showMessage("Error al eliminar el vehículo.", true);
        console.error(error);
    }
};


window.editVehicle = function (id, plate, model, color, vehicleState, mileage, operatingState) {
    vehicleIdInput.value = id;
    plateInput.value = plate;
    modelInput.value = model;
    colorInput.value = color;
    vehicleStateInput.value = vehicleState;
    mileageInput.value = mileage;
    operatingStateInput.value = operatingState;

    showMessage(`Editando vehículo con ID ${id}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = getFormData();

    if (!payload.plate_vehicle || !payload.model || !payload.color || !payload.operating_state) {
        showMessage("Completa los campos obligatorios.", true);
        return;
    }

    try {
        const id = vehicleIdInput.value.trim();

        if (id) {
            await updateVehicle(id, payload);
            showMessage("Vehículo actualizado correctamente.");
        } else {
            await createVehicle(payload);
            showMessage("Vehículo creado correctamente.");
        }

        resetForm();
        await loadVehicles();
    } catch (error) {
        showMessage("Error al guardar el vehículo.", true);
        console.error(error);
    }
});

cancelBtn.addEventListener("click", () => {
    resetForm();
    showMessage("Edición cancelada.");
});

searchBtn.addEventListener("click", searchVehicleById);
loadAllBtn.addEventListener("click", loadVehicles);

loadVehicles();