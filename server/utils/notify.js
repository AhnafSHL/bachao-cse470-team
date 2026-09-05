import Notification from '../models/Notification.js';

export const notify = async (
  userId,
  message,
  type = 'info',
  link = ''
) => {
  if (!userId) {
    return null;
  }

  try {
    return await Notification.create({
      user: userId,
      message,
      type,
      link,
    });
  } catch (err) {
    console.error(
      'notify() failed:',
      err.message
    );

    return null;
  }
};