import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.service.js';

export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// export const loginController = async (req, res, next) => {
//   try {
//     const { accessToken, refreshToken, session } = await loginUser(req.body);

//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       expires: session.refreshTokenValidUntil,
//     });

//     res.status(200).json({
//       status: 200,
//       message: 'Successfully logged in an user!',
//       data: { accessToken },
//     });
//   } catch (err) {
//     next(err);
//   }
// };
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const session = await loginUser(email, password); // ← ВАЖЛИВО: передай два аргументи!

    res.cookie('sessionId', session.sessionId, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (err) {
    console.error('Login error:', err); // залиш для діагностики
    next(err);
  }
};

// export const refreshController = async (req, res, next) => {
//   try {
//     const oldRefreshToken = req.cookies.refreshToken;
//     const { accessToken, refreshToken, session } = await refreshSession(oldRefreshToken);

//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       expires: session.refreshTokenValidUntil,
//     });

//     res.status(200).json({
//       status: 200,
//       message: 'Successfully refreshed a session!',
//       data: { accessToken },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const refreshController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const sessionId = req.cookies.sessionId;

    if (!refreshToken || !sessionId) {
      return res.status(401).json({
        status: 401,
        message: 'No refresh token or sessionId found in cookies',
      });
    }

    const { accessToken, refreshToken: newRefreshToken, session } = await refreshSession(
      refreshToken,
      sessionId,
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (err) {
    console.error('Refresh error:', err);
    next(err);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await logoutUser(refreshToken);
    res.clearCookie('refreshToken');
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};