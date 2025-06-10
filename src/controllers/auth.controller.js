import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetPassword,
  resetPassword,
} from '../services/auth.service.js';

export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body.email, req.body.password);

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expire: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expire: session.refreshTokenValidUntil,
    });

    res.json({
      status: 200,
      message: 'Login successfully',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (!sessionId) {
      throw createHttpError(401, 'No sessionId provided');
    }

    await logoutUser(sessionId);

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    const session = await refreshSession(sessionId, refreshToken);

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expire: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expire: session.refreshTokenValidUntil,
    });

    res.json({
      status: 200,
      message: 'Refresh completed successfully',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const requestResetPasswordController = async (req, res, next) => {
  console.log('🔔 requestResetPasswordController body:', req.body);
  try {
    const { email } = req.body;
    await requestResetPassword(email);
    res.json({
      status: 200,
      message: 'Reset password email sent successfully',
    });
  } catch (error) {
    next(error);
  }
};


export const resetPasswordController = async (req, res, next) => {
  try {
    const { password, token } = req.body;

    await resetPassword(password, token);

    res.json({
      status: 200,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

