import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMyNotifications =
  asyncHandler(async (req, res) => {
    const notifications =
      await Notification.find({
        user: req.user._id,
      })
        .sort({
          createdAt: -1,
        })
        .limit(50);

    const unread =
      await Notification.countDocuments({
        user: req.user._id,
        isRead: false,
      });

    res.json({
      notifications,
      unread,
    });
  });

export const markRead =
  asyncHandler(async (req, res) => {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      res.status(404);

      throw new Error(
        'Notification not found'
      );
    }

    res.json(notification);
  });

export const markAllRead =
  asyncHandler(async (req, res) => {
    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.json({
      message:
        'All notifications marked read',
    });
  });