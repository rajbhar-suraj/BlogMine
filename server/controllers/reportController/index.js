const Report = require('../../models/reportModel')

const submitReport = async (req, res) => {

  try {
    const { type, itemId, reason, comment } = req.body;
    const userId = req.userId;

    if (!['blog', 'comment'].includes(type)) {
      return res.status(400).json({ error: 'Invalid report type.' });
    }

    if (!itemId || !reason) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const report = new Report({
      type,
      itemId,
      reason,
      comment,
      reportedBy: userId,
    });
    const existingReport = await Report.findOne({
      type, itemId, reportedBy: userId
    });
    if (existingReport) {
      return res.status(409).json({ error: 'You have already reported this item.' });
    }
    if (comment === '') {
      return res.status(409).json({ error: 'Write your reason.' })
    }
    await report.save();

    res.status(201).json({ message: 'Report submitted successfully.', report });
  } catch (error) {
    console.error('Report Error:', error);
    res.status(500).json({ error: 'Server error while submitting report.' });
  }
};

module.exports = { submitReport }
