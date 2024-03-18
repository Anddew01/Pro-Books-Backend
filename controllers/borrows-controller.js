const db = require('../models/db');
const moment = require('moment-timezone'); // เพิ่ม line นี้

// เพิ่ม line นี้
const { Record } = require('../models/db');

exports.getBorrows = async (req, res, next) => {
  try {
    const borrows = await db.borrow.findMany();
    res.json(borrows);
  } catch (err) {
    next(err);
  }
};

exports.getBorrowById = async (req, res, next) => {
  try {
    const { borrowingId } = req.params;
    const borrow = await db.borrow.findUnique({
      where: { id: +borrowingId },
      include: {
        book: true,   
        member: true,
      },
    });
    if (!borrow) {
      return res.status(404).json({ msg: 'ไม่พบข้อมูลการยืมคืน' });
    }
    res.json(borrow);
  } catch (err) {
    next(err);
  }
};

exports.borrowBook = async (req, res, next) => {

  
  try {
    const { memberId, bookId } = req.body;
    const bookIdNumber = parseInt(bookId, 10);   

    const borrowRecord = await db.borrow.create({
      data: {
        member: { connect: { id: +memberId } },
        book: { connect: { id: bookIdNumber } },   
        status: 'ยืม',
        borrowDate: new Date().toISOString(),
      },
    });

    res.json({ msg: 'ยืมหนังสือเรียบร้อยแล้ว', result: borrowRecord });
  } catch (err) {
    next(err);
  }
};

exports.returnBook = async (req, res, next) => {
  try {
    const { borrowingId } = req.params;

    const updatedBorrowRecord = await db.borrow.update({
      where: { id: +borrowingId },
      data: {
        returnDate: new Date().toISOString(),
        status: 'คืน',
      },
    });

    // เพิ่มส่วนนี้
    const borrow = await db.borrow.findUnique({
      where: { id: +borrowingId },
      include: {
        book: true,
        member: true,
      },
    });

    await Record.create({
      data: {
        borrowId: borrow.id,
        memberId: borrow.memberId,
        bookId: borrow.bookId,
        status: 'คืน',
        borrowDate: borrow.borrowDate,
        returnDate: new Date().toISOString(),
      },
    });

    res.json({ msg: 'คืนหนังสือเสร็จแล้ว', result: updatedBorrowRecord });
  } catch (err) {
    next(err);
  }
};


exports.updateBorrow = async (req, res, next) => {
  try {
    const { borrowingId } = req.params;
    const { status } = req.body;

    const updatedBorrowRecord = await db.borrow.update({
      where: { id: +borrowingId },
      data: { status },
    });

    res.json({ msg: 'อัพเดตข้อมูลการยืมคืนหนังสือสำเร็จ', result: updatedBorrowRecord });
  } catch (err) {
    next(err);
  }
};

exports.deleteBorrow = async (req, res, next) => {
  try {
    const { borrowingId } = req.params;

    await db.borrow.delete({
      where: { id: +borrowingId },
    });

    res.json({ msg: 'ลบข้อมูลการยืมคืนหนังสือสำเร็จ' });
  } catch (err) {
    next(err);
  }
};
