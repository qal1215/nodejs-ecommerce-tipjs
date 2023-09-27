"use strict";

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp::`, req.body);

      return res.status(201).json({
        code: 201,
        metadata: {
          userId: 1,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new AccessController();
