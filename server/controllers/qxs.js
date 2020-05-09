const cheerio = require("cheerio");
const { success, error } = require("../response");
const { extendsFrom } = require("../util");
let iconv = require("iconv-lite");
const request = require("superagent");
const host = "https://qxs.la";
// todo: ...

class NovelManager {
  constructor() {}

  findBookList(req, res) {
    request
    .post(`${host}/s_${encodeURIComponent(req.body.name)}`)
    .withCredentials()
    .responseType('arrayBuffer')
    .then(response => {
        let data = iconv.decode(Buffer.from(response.body), "gbk");
        res.json(extendsFrom(success, {
            html: data
        }))
    }).catch(err => {
        console.log(err);
        res.json(error)
    })
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
        let book = $(".con_top > a").toArray()[2];
        let book_id = ($(book).attr("href") || "")
          .split("/")
          .reverse()
          .find(href => href);
        let bookname = $(".content_read .bookname");
        let result = {
          book_id: book_id,
          book_name: $(book).text(),
          chapter_name: bookname.find("h1").text(),
          content: $("#content").html(),
          prev: bookname
            .find(".bottem1 > a")
            .eq(1)
            .attr("href"),
          next: bookname
            .find(".bottem1 > a")
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

  viewRank(req, res) {
    fetch(`${host}/paihangbang/`)
      .then(data => {
        let $ = cheerio.load(data);
        let boxList = $("#main > .box").toArray();
        let list = boxList.map(box => {
          let $box = $(box);
          let title = $box.find("h3").text() || "";
          let lis = $box
            .find("ul")
            .first()
            .find("li")
            .filter(
              (i, el) => !($(el).attr("class") || "").match(/ltitle|more/)
            )
            .toArray();
          let books = lis.map(li => {
            let tag_a = $(li).find("a");
            return {
              book_id: (tag_a.attr("href") || "")
                .replace(host, "")
                .replace(/\//g, ""),
              book_name: tag_a.text()
            };
          });
          return {
            title: title,
            list: books
          };
        });
        res.json(
          extendsFrom(success, {
            data: list
          })
        );
      })
      .catch(err => {
        console.log(err);
        res.json(error);
      });
  }

  viewMenu(req, res) {
    let menu_id = req.body.menu_id;
    fetch(`${host}/${menu_id}/${req.body.page}`)
      .then(data => {
        let $ = cheerio.load(data);
        let lis = $("#newscontent ul")
          .first()
          .find("li")
          .toArray();
        let list = lis.map(li => {
          let tag_a = $(li)
            .find("span")
            .first()
            .find("a");
          let span = $(li)
            .find("span")
            .last();
          return {
            book_id: (tag_a.attr("href") || "")
              .replace(host, "")
              .replace(/\//g, ""),
            book_name: tag_a.text(),
            author: span.text()
          };
        });
        let first = $("#pagelink a.first");
        let pageInfo = $("#pagestats")
          .text()
          .split("/");
        res.json(
          extendsFrom(success, {
            data: {
              list,
              page_code: (first.attr("href") || "")
                .replace(host, "")
                .replace(menu_id, "")
                .replace(/\//g, "")
                .substr(0, 2),
              page_num: Number(pageInfo[0]),
              total: Number(pageInfo[1])
            }
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
