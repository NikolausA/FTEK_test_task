import { getCargos, addCargo } from "./cargoService.js";
import { renderTable, populateCityDropdown } from "./uiService.js";
import { CONSTANTS } from "./constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  let filteredCargos = [];

  try {
    const cargos = await getCargos(CONSTANTS.API_URL);

    filteredCargos = [...cargos];

    renderTable(filteredCargos, CONSTANTS.STATUSES);

    populateCityDropdown("cargo-origin", CONSTANTS.CITIES);
    populateCityDropdown("cargo-destination", CONSTANTS.CITIES);

    const statusFilter = document.querySelector("#status-filter");
    statusFilter.innerHTML = `<option value="">Все</option>`;
    CONSTANTS.STATUSES.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      statusFilter.appendChild(option);
    });

    statusFilter.addEventListener("change", (e) => {
      const selectedStatus = e.target.value;
      filteredCargos = selectedStatus
        ? cargos.filter((cargo) => cargo.status === selectedStatus)
        : [...cargos];

      renderTable(filteredCargos, CONSTANTS.STATUSES);
    });

    const form = document.querySelector("#cargo-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newCargo = {
        id: "CARGO" + Date.now(),
        name: document.querySelector("#cargo-name").value.trim(),
        status: document.querySelector("#cargo-status").value,
        origin: document.querySelector("#cargo-origin").value,
        destination: document.querySelector("#cargo-destination").value,
        departureDate: document
          .querySelector("#cargo-departureDate")
          .value.trim(),
      };

      if (
        !newCargo.id ||
        !newCargo.name ||
        !newCargo.origin ||
        !newCargo.destination ||
        !newCargo.departureDate
      ) {
        alert("Ошибка: Все поля должны быть заполнены!");
        return;
      }

      try {
        const addedCargo = await addCargo(CONSTANTS.API_URL, newCargo);

        cargos.push(addedCargo);
        filteredCargos = [...cargos];
        renderTable(filteredCargos, CONSTANTS.STATUSES);
        form.reset();
      } catch (error) {
        console.error("Ошибка добавления груза:", error);
        alert("Не удалось добавить груз.");
      }
    });
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    alert("Не удалось загрузить данные грузов.");
  }
});
