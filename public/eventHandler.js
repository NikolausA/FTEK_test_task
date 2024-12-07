document.querySelector("#cargo-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newCargo = {
    id: document.querySelector("#cargo-id").value.trim(),
    name: document.querySelector("#cargo-name").value.trim(),
    status: document.querySelector("#cargo-status").value,
    origin: document.querySelector("#cargo-origin").value, // Значение из списка
    destination: document.querySelector("#cargo-destination").value, // Значение из списка
    departureDate: document.querySelector("#cargo-departureDate").value.trim(),
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
    const response = await addCargo(CONSTANTS.API_URL, newCargo);

    if (response.message === "Груз добавлен") {
      cargos.push(newCargo);
      renderTable(cargos);
      e.target.reset();
    } else {
      throw new Error("Ошибка: сервер не вернул подтверждение добавления.");
    }
  } catch (error) {
    console.error("Ошибка добавления груза:", error);
    alert("Не удалось добавить груз.");
  }
});
