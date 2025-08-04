/* AddContentModal.tsx */
import React, { useState } from 'react';

export interface ContentInput {
  title: string;
  type: string;
  link: string;
  tags: string; // comma-separated
}

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContentInput) => Promise<void>;
}

export function AddContentModal({ isOpen, onClose, onSubmit }: AddContentModalProps) {
  const [form, setForm] = useState<ContentInput>({ title: '', type: '', link: '', tags: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4">Add New Content</h2>
        <label className="block mb-2">
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Type
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Link
          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            type="url"
            required
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-4">
          Tags (comma-separated)
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-2xl bg-blue-500 text-white"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
