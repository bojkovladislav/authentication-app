import { user } from '../models/user.js';

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.sendStatus(400);

    return;
  }

  const newUser = await user.create({ email, password });

  res.status(200).send(newUser);
};

export const authController = {
  register,
};
