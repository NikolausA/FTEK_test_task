import { updateCargoStatus } from "./cargoService.js";
import { CONSTANTS } from "./constants.js";

function getStatusClass(status) {
  switch (status) {
    case "Ожидает отправки":
      return "table-warning";
    case "В пути":
      return "table-primary";
    case "Доставлен":
      return "table-success";
    default:
      return "";
  }
}

export function renderTable(cargos, statuses = CONSTANTS.STATUSES) {
  const tableBody = document.querySelector("#cargo-table tbody");
  tableBody.innerHTML = "";

  cargos.forEach((cargo) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${cargo.id}</td>
      <td>${cargo.name}</td>
      <td class="${getStatusClass(cargo.status)}">
        <select class="form-select update-status">
          ${statuses
            .map(
              (status) =>
                `<option value="${status}" ${
                  status === cargo.status ? "selected" : ""
                }>${status}</option>`
            )
            .join("")}
        </select>
      </td>
      <td>${cargo.origin}</td>
      <td>${cargo.destination}</td>
      <td>${cargo.departureDate}</td>
      
    `;

    const statusDropdown = row.querySelector(".update-status");
    statusDropdown.addEventListener("change", async (e) => {
      const newStatus = e.target.value;

      if (
        newStatus === "Доставлен" &&
        new Date(cargo.departureDate) > new Date()
      ) {
        alert(
          'Ошибка: Нельзя установить статус "Доставлен", если дата отправления находится в будущем.'
        );
        e.target.value = cargo.status; // Сбрасываем значение на предыдущее
        return;
      }

      try {
        await updateCargoStatus(CONSTANTS.API_URL, cargo.id, newStatus);
        cargo.status = newStatus;
        renderTable(cargos);
      } catch (error) {
        console.error("Ошибка обновления статуса:", error);
        alert("Не удалось обновить статус груза.");
        e.target.value = cargo.status;
      }
    });

    tableBody.appendChild(row);
  });
}

export function populateCityDropdown(dropdownId, cities) {
  const dropdown = document.querySelector(`#${dropdownId}`);
  dropdown.innerHTML = "";
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    dropdown.appendChild(option);
  });
}
