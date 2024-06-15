import jsonDB from "./db.json";

export const columns = [
  { name: "ФИО", uid: "fio" },
  { name: "Филиал", uid: "branch" },
  { name: "Место хранения", uid: "storageCell" },
  { name: "Радиус шины", uid: "diskSize" },
  { name: "Дата полуения", uid: "arrivalDate" },
  { name: "Дата сдачи", uid: "deliveryDate" },
  { name: "Цена хранения", uid: "price" },
  { name: "Оплата", uid: "isPaid" },
  { name: "Статус", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const orders = jsonDB.orders;
export const products = jsonDB.clients;
