let express = require("express");
let router = express.Router();
let bodyParser = require("body-parser");
// 创建application/json 解析器
let jsonParser = bodyParser.json();
// 创建 application/x-www-form-urlencoded 解析器
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let NovelManager = require("./controllers/tianxiabachang");
let novelManager = new NovelManager();

router.post("/findBookList", jsonParser, novelManager.findBookList);
router.post("/viewBook", jsonParser, novelManager.viewBook);
router.post("/viewChapter", jsonParser, novelManager.viewChapter);
router.post("/viewRank", jsonParser, novelManager.viewRank);
router.post("/viewMenu", jsonParser, novelManager.viewMenu);

module.exports = router;
