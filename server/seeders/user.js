import { faker } from "@faker-js/faker";
import { User } from "../models/user.model.js";

export const createUser = async (numUsers) => {
  try {
    const userPromise = [];
    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: "password",
      });
      userPromise.push(tempUser);
    }
    await Promise.all(userPromise);
    console.log("User created ", numUsers);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const deleteAllUsers = async ()=> {
  try {
    await User.deleteMany({});
    console.log("All users are deleted!");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
