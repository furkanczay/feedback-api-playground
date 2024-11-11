const express = require("express");
const app = express();
const routes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const checkToken = require("./utils/check.token");
require("dotenv").config();
const port = 3012;
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(checkToken);
app.use("/", routes);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
