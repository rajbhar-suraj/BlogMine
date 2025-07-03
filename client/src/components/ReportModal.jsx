import React, { useState } from 'react';
import axios from 'axios';
import { reportOptions } from '../config/index';
import toast from 'react-hot-toast';

const ReportModal = ({ type, itemId, onClose }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (id) => {
    setSelectedReason(id);
  };

  const handleSubmit = async () => {
    
    if (!selectedReason) return alert('Please select a reason');

    try {
      setLoading(true);
      await axiosInstance.post('/blog/comment/report', {
        type,
        itemId,
        reason: selectedReason,
        comment,
      });
      onClose();
      toast.success('Reported successfully!');

    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('You have already reported this item.');
      } else {
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Report</h2>

        <div className="space-y-3">
          {reportOptions.map((option) => (
            <label key={option.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedReason === option.id}
                onChange={() => handleCheckboxChange(option.id)}
              />
              {option.label}
            </label>
          ))}
        </div>

        {selectedReason === 'other' && (
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add details (optional)"
            className="mt-4 w-full p-2 border rounded"

          />
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="text-gray-500 hover:underline">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black shadow rounded-md text-white px-4 py-1 hover:bg-zinc-700 disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
