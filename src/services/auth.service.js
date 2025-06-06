import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { User } from '../models/user.model.js';
import { Session } from '../models/session.model.js';

export async function registerUser(payload) {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser !== null) {
    throw new createHttpError.Conflict('Email is already in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  const newUser = await User.create(payload);

  const userObj = newUser.toObject();
  delete userObj.password;
  return userObj;
}

export async function loginUser(email, password) {
  console.log('loginUser:', email, password);
  const user = await User.findOne({ email });

  if (user === null) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  const session = await createSession(user._id);

  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    sessionId: session._id,
  };
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

// export async function refreshSession(oldRefreshToken, sessionId) {
//   console.log('🔁 Refreshing session...');
//   console.log('refreshToken:', oldRefreshToken);
//   console.log('sessionId:', sessionId);

//   const existingSession = await Session.findOne({ _id: sessionId, refreshToken: oldRefreshToken });

//   if (!existingSession) {
//     throw createHttpError(401, 'Invalid session');
//   }

//   if (existingSession.refreshTokenValidUntil < new Date()) {
//     throw createHttpError(401, 'Refresh token expired');
//   }

//   await Session.findByIdAndDelete(sessionId);

//   const user = await User.findById(existingSession.userId);

//   if (!user) {
//     throw createHttpError(401, 'User not found');
//   }

//   const newSession = await createSession(user._id);

//   return {
//     accessToken: newSession.accessToken,
//     refreshToken: newSession.refreshToken,
//     session: newSession,
//   };
// }

export async function refreshSession(oldRefreshToken, sessionId) {
  console.log('🔁 Refreshing session...');
  console.log('refreshToken:', oldRefreshToken);
  console.log('sessionId:', sessionId);

  const session = await Session.findOne({ _id: sessionId, refreshToken: oldRefreshToken });

  if (!session) {
    console.log('❌ Session not found or invalid token');
    throw createHttpError(401, 'Invalid session');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    console.log('❌ Refresh token expired');
    throw createHttpError(401, 'Refresh token expired');
  }

  const user = await User.findById(session.userId);

  if (!user) {
    console.log('❌ User not found');
    throw createHttpError(401, 'User not found');
  }

  await Session.findByIdAndDelete(sessionId);

  const newSession = await createSession(user._id);

  console.log('✅ New session created');
  return {
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
    session: newSession,
  };
}


// 🔧 Додано функцію створення нової сесії
function createSession(userId) {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 хв
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 днів

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
}
