const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const port = process.env.port || 8080;
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 3,
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다.");
    });
});

/*
- Product API
*/
app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["createdAt", "DESC"]],
    attributes: [
      "id",
      "name",
      "price",
      "createdAt",
      "seller",
      "imageUrl",
      "soldout",
    ],
  })
    .then((result) => {
      console.log("PRODUCTS : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error("에러 발생 : ", error);
      res.send("에러 발생");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;

  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("모든 필드를 입력하시기 바랍니다.");
    return;
  }

  models.Product.create({
    name: name,
    description: description,
    price: price,
    seller: seller,
    imageUrl: imageUrl,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 업로드에 문제가 발생하였습니다.");
    });
});

app.get("/products/:id/", (req, res) => {
  const params = req.params;
  const { id } = params;

  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회에 에러가 발생했습니다.");
    });
});

/*
- Upload API
*/
app.post("/image/", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);

  res.send({
    imageUrl: file.path,
  });
});

/**
 * 결제요청 API
 *
 */
app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;

  models.Product.update(
    {
      soldout: 1,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((result) => {
      res.send({
        result: true,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생하였습니다.");
    });
});

app.listen(port, () => {
  console.log("====== 그랩 node-Server-On! ======");

  models.sequelize
    .sync()
    .then((result) => {
      console.log("DB 연결 성공!");
    })
    .catch((error) => {
      console.error(error);
      console.log("DB 연결 에러!");
      process.exit();
    });
});
