const express = require("express");
const userRouter = express.Router();

const{all_data,all_repo_data,limited_repo_data,pagination_repo_data,user_profile_data}=require("../controllers/User_data");

userRouter.get("/all_data",all_data);
userRouter.get("/all_repo",all_repo_data);
userRouter.get("/limit_repo",limited_repo_data);
userRouter.get("/pagination_repo",pagination_repo_data);
userRouter.get("/user_profile",user_profile_data);
// make prfile get data

module.exports = userRouter;