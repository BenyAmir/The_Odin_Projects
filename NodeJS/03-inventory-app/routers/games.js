import express from "express";
import * as controllers from "../controllers/gameController.js";

const gameRouter = express.Router();

gameRouter.get("/", controllers.GetAllGames);

gameRouter.post("/add", controllers.InsertNewGame);
gameRouter.get('/:id',  controllers.GetGameById)
gameRouter.post("/:id/update", controllers.UpdateGame);
gameRouter.post("/:id/delete", controllers.DeleteGame);

export default gameRouter;
