import mongoose from 'mongoose';
import moment from 'moment';
import { Request, Response } from 'express';

const Model = mongoose.model('Payment') as any;
import { loadSettings } from '../../../middlewares/settings';

const summary = async (req: Request, res: Response) => {
  let defaultType = 'month';

  const { type } = req.query as { type?: string };

  const settings = await loadSettings();

  if (type) {
    if (['week', 'month', 'year'].includes(type)) {
      defaultType = type;
    } else {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid type',
      });
    }
  }

  const currentDate = moment();
  let startDate: any;
  let endDate: any;
  if (defaultType === 'week') {
    startDate = currentDate.clone().startOf('week');
    endDate = currentDate.clone().endOf('week');
  } else if (defaultType === 'year') {
    startDate = currentDate.clone().startOf('year');
    endDate = currentDate.clone().endOf('year');
  } else {
    startDate = currentDate.clone().startOf('month');
    endDate = currentDate.clone().endOf('month');
  }

  // get total amount of invoices
  const result = await Model.aggregate([
    {
      $match: {
        removed: false,

        // date: {
        //   $gte: startDate.toDate(),
        //   $lte: endDate.toDate(),
        // },
      },
    },
    {
      $group: {
        _id: null, // Group all documents into a single group
        count: {
          $sum: 1,
        },
        total: {
          $sum: '$amount',
        },
      },
    },
    {
      $project: {
        _id: 0, // Exclude _id from the result
        count: 1,
        total: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    result: result.length > 0 ? result[0] : { count: 0, total: 0 },
    message: `Successfully fetched the summary of payment invoices for the last ${defaultType}`,
  });
};

export default summary;
