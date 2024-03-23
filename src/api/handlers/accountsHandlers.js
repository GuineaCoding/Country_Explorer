import { accountsModel } from '../models/accountsModel.js';

export const accountsHandlers = {
  async createUser(req, res) {
    try {
      const user = await accountsModel.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getUserByEmail(req, res) {
    try {
      const user = await accountsModel.getUserByEmail(req.params.email);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateUser(req, res) {
    try {
      const email = req.params.email;
      const updatedUser = await accountsModel.updateUser(email, req.body);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateUserAnalytics(req, res) {
    try {
      const email = req.params.email;
      const newLoginData = req.body;
      await accountsModel.updateUserAnalytics(email, newLoginData);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
