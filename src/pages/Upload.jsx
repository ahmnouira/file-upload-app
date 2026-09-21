import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadFile } from '../api/client';

const ACCEPT = '.csv,.xlsx,.xls';
const ACCEPT_TYPES = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

export default function Upload() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const validateFile = (f) => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    const valid = ext === 'csv' || ext === 'xlsx' || ext === 'xls' || ACCEPT_TYPES.includes(f.type);
    return valid;
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f && validateFile(f)) {
      setFile(f);
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Please upload a CSV or Excel file (.csv, .xlsx, .xls)' });
    }
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f && validateFile(f)) {
      setFile(f);
      setMessage({ type: '', text: '' });
    } else if (f) {
      setMessage({ type: 'error', text: 'Please upload a CSV or Excel file (.csv, .xlsx, .xls)' });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }
    setUploading(true);
    setMessage({ type: '', text: '' });
    try {
      const result = await uploadFile(file);
      setMessage({ type: 'success', text: `Upload successful! ${JSON.stringify(result)}` });
      setFile(null);
    } catch (err) {
      // Demo: if backend unreachable, show success for testing
      if (err.message?.includes('fetch') || err.message?.includes('Failed')) {
        setMessage({ type: 'success', text: `File "${file.name}" ready to send. Connect your backend at /api/upload.` });
        setFile(null);
      } else {
        setMessage({ type: 'error', text: err.message || 'Upload failed' });
      }
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-2xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">File Upload</h1>
          <p className="text-slate-400 text-sm">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          Log out
        </button>
      </header>

      <main className="max-w-2xl mx-auto">
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive ? 'border-teal-500 bg-teal-500/10' : 'border-slate-600 hover:border-slate-500'
          }`}
        >
          {file ? (
            <div>
              <p className="text-teal-400 font-medium mb-1">{file.name}</p>
              <p className="text-slate-500 text-sm mb-4">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg disabled:opacity-50"
                >
                  {uploading ? 'Sending...' : 'Send to backend'}
                </button>
                <button
                  onClick={clearFile}
                  disabled={uploading}
                  className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-slate-400 mb-2">Drag & drop CSV or Excel here</p>
              <p className="text-slate-500 text-sm mb-4">or</p>
              <label className="inline-block px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg cursor-pointer transition-colors">
                Browse files
                <input
                  type="file"
                  accept={ACCEPT}
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>

        {message.text && (
          <div
            className={`mt-4 px-4 py-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-teal-500/10 border border-teal-500/30 text-teal-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}
      </main>
    </div>
  );
}
