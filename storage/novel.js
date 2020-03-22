import { getRecords, clearRecords } from "./record";

// 存储字段
const VISIT_NOVEL_FIELD = "visit_novel";
const READ_NOVEL_FIELD = "read_novel";

// 小说访问记录
function getVisitNovels() {
  return getRecords(VISIT_NOVEL_FIELD);
}

// 小说阅读记录
function getReadNovels() {
  return getRecords(READ_NOVEL_FIELD);
}

// 更新访问记录
function updateVisitNovelRecord(record) {
  let records = getVisitNovels();
  if (!(record instanceof Object)) {
    throw new Error(`"record" must be a object.`);
  }
  if (!("book_id" in record)) {
    throw new Error(`"record" must have "book_id" field.`);
  }
  if (!Array.isArray(record.list)) record.list = [];
  let flag = records.every((rd, index) => {
    let bool =
      rd.list.length !== record.list.length || rd.book_id !== record.book_id;
    if (!bool) records[index] = record;
    return bool;
  });
  if (flag) records.push(record);
  localStorage.setItem(VISIT_NOVEL_FIELD, JSON.stringify(records));
}

// 更新阅读记录
function updateReadNovelRecord(record) {
  let records = getReadNovels();
  if (!(record instanceof Object)) {
    throw new Error(`"record" must be a object.`);
  }
  if (!("chapter_id" in record)) {
    throw new Error(`"record" must have "chapter_id" field.`);
  }
  let new_book_id = getBookId(record.chapter_id);
  let flag = records.every((rd, index) => {
    let old_book_id = getBookId(rd);
    let bool = old_book_id !== new_book_id;
    if (!bool) {
      // 判断最新最新章节
      let novel = getVisitNovel(new_book_id);
      let old_index = novel.list.findIndex(
        li => li.chapter_id === rd.chapter_id
      );
      let new_index = novel.list.findIndex(
        li => li.chapter_id === record.chapter_id
      );
      if (new_index > old_index) {
        records[index] = record;
      }
    }
    return bool;
  });
  if (flag) records.push(record);
  localStorage.setItem(READ_NOVEL_FIELD, JSON.stringify(records));
}

function getBookId(chapter) {
  let chapter_id = chapter instanceof Object ? chapter.chapter_id : chapter;
  let ids = chapter_id.split("/");
  return ids.find(id => id);
}

// 根据book_id获取小说
function getVisitNovel(book_id) {
  let novels = getVisitNovels();
  return novels.find(nv => nv.book_id === book_id);
}

// 根据book_id获取最新阅读章节
function getLatestReadChapter(book_id) {
  let novels = getReadNovels();
  return novels.find(nv => getBookId(nv.chapter_id) === book_id);
}

// 清除访问记录
function clearVisitNovelRecords() {
  clearRecords(VISIT_NOVEL_FIELD);
}

// 清除阅读记录
function clearReadNovelRecords() {
  clearRecords(READ_NOVEL_FIELD);
}

export {
  VISIT_NOVEL_FIELD,
  READ_NOVEL_FIELD,
  getVisitNovels,
  getReadNovels,
  updateVisitNovelRecord,
  updateReadNovelRecord,
  getBookId,
  getVisitNovel,
  getLatestReadChapter,
  clearVisitNovelRecords,
  clearReadNovelRecords
};
