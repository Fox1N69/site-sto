import { NextApiRequest, NextApiResponse } from 'next';
import { EditedData } from '../../types'; // Предположим, у вас есть тип `EditedData` в файле types.ts
import fs from 'fs';
import path from 'path';

const dataFilePath = path.resolve('./data/orderDB.json');

export default async function updateOrderHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const editedData: EditedData = req.body;
      const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

      // Найдем элемент в данных и обновим его
      const updatedData = data.map((item: EditedData) =>
        item.fio === editedData.fio ? { ...item, data: editedData.data, price: editedData.price } : item
      );

      // Сохраним обновленные данные обратно в файл
      fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2));

      res.status(200).json({ message: 'Данные успешно обновлены' });
    } catch (error) {
      console.error('Произошла ошибка при обновлении данных:', error);
      res.status(500).json({ message: 'Произошла ошибка при обновлении данных' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешен. Используйте метод POST' });
  }
}
