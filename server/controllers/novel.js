const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const { success, error, timeout } = require("../response");
const { extendsFrom, fetch } = require("../util");
const host = "http://www.tianxiabachang.cn";

class NovelManager {
  constructor() {}

  findBookList(req, res) {
    fetch(`${host}/cse/search?q=${req.body.name}`)
      .then(data => {
        let $ = cheerio.load(data);
        let novelUl = $(".novelslist2 > ul").first();
        let bookLis = novelUl
          .children("li")
          .toArray()
          .slice(1);
        let list = bookLis.map(li => {
          let spans = $(li)
            .children("span")
            .toArray();
          let tag_a = $(spans[1]).find("a");
          return {
            type: $(spans[0])
              .text()
              .trim()
              .replace(/[\[\]]/g, ""),
            book_name: tag_a.text().trim(),
            author: $(spans[3])
              .text()
              .trim(),
            book_id: tag_a.attr("href").trim(),
            status: $(spans[6])
              .text()
              .trim(),
            latest_chapter: $(spans[2])
              .text()
              .trim(),
            latest_time: $(spans[5])
              .text()
              .trim()
          };
        });
        res.json(
          extendsFrom(success, {
            data: list
          })
        );
      })
      .catch(err => {
        console.log("findBookList error => ", err);
        res.json(error);
      });
  }

  viewBook(req, res) {
    fetch(`${host}/${req.body.book_id}/`)
      .then(data => {
        let $ = cheerio.load(data);
        let info_box = $("#info");
        let info = {
          img: host + $("#sidebar img").attr("src"),
          book_name: $(info_box)
            .find("h1")
            .text()
            .trim(),
          author: $(info_box)
            .find("p")
            .eq(0)
            .text()
            .trim()
            .split("：")[1],
          latest_time: $(info_box)
            .find("p")
            .eq(2)
            .text()
            .trim()
            .split("：")[1],
          desc: $("#intro p")
            .eq(0)
            .html()
        };
        let chapters = $("#list dl")
          .first()
          .children("dt, dd")
          .toArray()
          .slice(1);
        let dtIndex = -1;
        chapters.some((item, index) => {
          let flag = item.name === "dt";
          if (flag) {
            dtIndex = index;
          }
          return flag;
        });
        let latestChapters = chapters.slice(0, dtIndex);
        let allChapters = dtIndex > 0 ? chapters.slice(dtIndex + 1) : [];
        let latest_list = latestChapters.map(item => {
          let tag_a = $(item).find("a");
          return {
            text: tag_a.text(),
            chapter_id: tag_a.attr("href")
          };
        });
        let list = allChapters.map(item => {
          let tag_a = $(item).find("a");
          return {
            chapter_name: tag_a.text(),
            chapter_id: tag_a.attr("href")
          };
        });
        res.json(
          extendsFrom(success, {
            data: { info, latest_list, list }
          })
        );
      })
      .catch(err => {
        console.log(err);
        res.json(error);
      });
  }

  viewChapter(req, res) {
    fetch(`${host}${req.body.chapter_id}`)
      .then(data => {
        let $ = cheerio.load(data);
        let bookname = $(".content_read .bookname");

        let result = {
          content: $("#content").html(),
          chapter_name: bookname.find("h1").text(),
          prev: bookname
            .find(".bottem1 >a")
            .eq(1)
            .attr("href"),
          next: bookname
            .find(".bottem1 >a")
            .eq(3)
            .attr("href")
        };
        res.json(
          extendsFrom(success, {
            data: result
          })
        );
      })
      .catch(err => {
        console.log(err);
        res.json(error);
      });
  }
}

module.exports = NovelManager;
