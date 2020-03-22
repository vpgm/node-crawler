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

// 所有访问记录
function getVisitRecords() {
  return getRecords(VISIT_FIELD);
}

// 更新当前记录
function updateVisitRecord(record) {
  let records = getVisitRecords();
  if (!(record instanceof Object)) {
    throw new Error(`"record" must be a object.`);
  }
  if (!("id" in record) || !("type" in record)) {
    throw new Error(`"record" must have "id and "type" fields.`);
  }
  let flag = records.every((rd, index) => {
    let bool = rd.type !== record.type || rd.id !== record.id;
    if (!bool) records[index] = record;
    return bool;
  });
  if (flag) records.push(record);
  localStorage.setItem(VISIT_FIELD, JSON.stringify(records));
}

// 清除记录
function clearRecords(field) {
  localStorage.removeItem(field);
}

// 清除访问记录
function clearVisitRecords() {
  clearRecords(VISIT_FIELD);
}

export {
  VISIT_FIELD,
  getRecords,
  getVisitRecords,
  updateVisitRecord,
  clearRecords,
  clearVisitRecords
};
