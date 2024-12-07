export async function getCargos(apiUrl) {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.statusText}`);
  }
  return await response.json();
}

export async function addCargo(apiUrl, newCargo) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCargo),
  });
  if (!response.ok) {
    throw new Error(`Ошибка добавления груза: ${response.statusText}`);
  }
  return await response.json();
}

export async function updateCargoStatus(apiUrl, id, newStatus) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!response.ok) {
    throw new Error(`Ошибка обновления статуса: ${response.statusText}`);
  }
  return await response.json();
}
