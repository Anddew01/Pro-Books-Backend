const db = require('../models/db');

exports.getRecords = async (req, res, next) => {
  try {
    const records = await db.record.findMany();
    res.json(records);
  } catch (err) {
    next(err);
  }
};

exports.getRecordById = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const record = await db.record.findUnique({
      where: { id: +recordId },
      include: {
        borrow: true,
      },
    });
    if (!record) {
      return res.status(404).json({ msg: 'ไม่พบข้อมูลการยืมคืน' });
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
};

// exports.createRecord = async (req, res, next) => {
//   try {
//     const { borrowId, status } = req.body;

//     const record = await db.record.create({
//       data: {
//         borrow: { connect: { id: +borrowId } },
//         status,
//         borrowDate: new Date().toISOString(),
//       },
//     });

//     res.json({ msg: 'บันทึกข้อมูล Record สำเร็จ', result: record });
//   } catch (err) {
//     next(err);
//   }
// };
