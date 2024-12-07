const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const dataFilePath = path.join(__dirname, "data", "cargoData.json");

app.get("/api/cargo", (req, res) => {
  fs.readFile(dataFilePath, "utf8", (error, data) => {
    if (error)
      return res.status(500).json({ error: "Не удалось прочитать файл" });

    res.json(JSON.parse(data));
  });
});

app.put("/api/cargo/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  fs.readFile(dataFilePath, "utf8", (error, data) => {
    if (error)
      return res.status(500).json({ error: "Не удалось прочитать файл" });

    let cargoList = JSON.parse(data);
    const cargoId = cargoList.findIndex((cargo) => cargo.id === id);
    if (cargoId === -1)
      return res
        .status(404)
        .json({ error: "Не удалось найти груз с таким индексом" });

    cargoList[cargoId].status = status;

    fs.writeFile(dataFilePath, JSON.stringify(cargoList, null, 2), (error) => {
      if (error)
        return res
          .status(500)
          .json({ error: "Не удалось записать данные в файл" });
      res.json({ message: "Статус обновлен" });
    });
  });
});

app.post("/api/cargo", (req, res) => {
  const newCargo = req.body;

  fs.readFile(dataFilePath, "utf8", (error, data) => {
    if (error)
      return res.status(500).json({ error: "Не удалось прочитать файл" });

    let cargoList = JSON.parse(data);
    cargoList.push(newCargo);

    fs.writeFile(dataFilePath, JSON.stringify(cargoList, null, 2), (error) => {
      if (error)
        return res
          .status(500)
          .json({ error: "Не удалось добавить данные в таблицу" });
      res.status(201).json(newCargo);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
