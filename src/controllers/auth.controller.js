import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
} from '../services/auth.service.js';

export async function registerController(req, res, next) {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const session = await loginUser(req.body.email, req.body.password);

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.json({
      status: 200,
      message: 'Login successful',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutController(req, res, next) {
  try {
    const { sessionId } = req.cookies;

    if (typeof sessionId === 'string') {
      await logoutUser(sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function refreshController(req, res, next) {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      return res.status(401).json({
        status: 401,
        message: 'Missing sessionId or refreshToken',
      });
    }

    const session = await refreshSession(sessionId, refreshToken);

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.json({
      status: 200,
      message: 'Session refreshed successfully',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}
