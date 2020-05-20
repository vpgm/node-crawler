// 存储字段
const VISIT_FIELD = "visit_record";

// 获取记录
function getRecords(field) {
  let records;
  try {
    records = JSON.parse(localStorage.getItem(field));
  } catch (err) {}
  if (!Array.isArray(records)) records = [];
  return records;
}

// 设置记录
function setRecords(field, records) {
  !Array.isArray(records) && (records = []);
  localStorage.setItem(field, JSON.stringify(records));
}

// 清除记录
function clearRecords(field) {
  localStorage.removeItem(field);
}

// 获取书本book_id
function getBookId(chapter_id) {
  return (chapter_id + "").split('/').find(item => item !== "");
}

// 获取所有访问记录
function getVisitRecords() {
  return getRecords(VISIT_FIELD);
}

// 设置所有访问记录
function setVisitRecords(records) {
  setRecords(VISIT_FIELD, records);
}

// 根据book_id返回访问记录
function getVisitRecord(book_id) {
  return getVisitRecords().find(item => item.book_id === book_id);
}

// 更新当前记录
function updateVisitRecord(record) {
  let records = getVisitRecords();
  if (!(record instanceof Object)) {
    throw new Error(`"record" must be a object.`);
  }
  if (!("book_id" in record)) {
    throw new Error(`"record" must have a "book_id field.`);
  }
  let find = records.find(rd => {
    return rd.book_id === record.book_id;
  });
  if (find) {
    Object.assign(find, record);
  } else {
    records.push(record);
  }
  localStorage.setItem(VISIT_FIELD, JSON.stringify(records));
}

// 清除访问记录
function clearVisitRecords() {
  clearRecords(VISIT_FIELD);
}

// 获取书架上的书籍
function getBooksOnShelf() {
  return getVisitRecords().filter(item => item.on_shelf === true);
}

// 书本是否在书架
function isBookOnShelf(book_id) {
  return getVisitRecords().some(
    item => item.book_id === book_id && item.on_shelf === true
  );
}

// 将书本加入书架
function addBookToShelf(book_id, info) {
  let book = getVisitRecord(book_id);
  if (book) {
    book.on_shelf = true;
  } else {
    book = info || {};
    book.on_shelf = true;
  }
  updateVisitRecord(book);
}

// 将书本从书架移除
function removeBookFromShelf(book_id) {
  let book = getVisitRecord(book_id);
  if (book && book.on_shelf) {
    book.on_shelf = false;
    updateVisitRecord(book);
  }
}

// 移除书架上的所有书
function removeBooksFromShelf() {
  let records = getVisitRecords().filter(item => item.on_shelf !== true);
  setVisitRecords(records);
}

// 重置书架上的书
function resetBooksOnShelf(array_ids = []) {
  let records = getVisitRecords();
  let new_array = array_ids.map(id => records.find(record => record.book_id === id));
  new_array.filter(item => !!item);
  removeBooksFromShelf();
  let new_records = getVisitRecords();
  new_records.push(...new_array);
  setVisitRecords(new_records);
}

// 是否已阅读书本
function isBookReaded(book_id) {
  return getVisitRecords().find(
    item =>
      item.book_id === book_id && (item.curr_chapter + "").endsWith(".html")
  );
}

export {
  VISIT_FIELD,
  getRecords,
  setRecords,
  clearRecords,
  getBookId,
  getVisitRecords,
  setVisitRecords,
  getVisitRecord,
  updateVisitRecord,
  clearVisitRecords,
  getBooksOnShelf,
  isBookOnShelf,
  addBookToShelf,
  removeBookFromShelf,
  removeBooksFromShelf,
  resetBooksOnShelf,
  isBookReaded
};
