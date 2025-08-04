import React, { useState, useEffect } from 'react';
import { InputBox } from './input';
import { Button } from './button';

export interface ContentInput {
  title: string;
  type: "image" | "video" | "pdf" | "article" | "audio";
  link: string;
  tags: string;
}

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContentInput) => Promise<void>;
}

export function AddContentModal({ isOpen, onClose, onSubmit }: AddContentModalProps) {
  const initialForm: ContentInput = { title: '', type: 'image', link: '', tags: '' };
  const [form, setForm] = useState<ContentInput>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <form className="bg-[#daedeb] p-6 rounded-md shadow-2xl w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4 text-center">Add New Content</h2>

        <InputBox
          name="title"
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="px-2 py-1.5 mx-4 border border-[#438989] rounded-md bg-white"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="article">Article</option>
          <option value="audio">Audio</option>
        </select>
        <InputBox
          name="link"
          type="url"
          placeholder="Link"
          value={form.link}
          onChange={handleChange}
        />
        <InputBox
          name="tags"
          type="text"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
        />

        {error && <div className="text-red-500 mb-4 mx-4 text-sm" >{error}</div>}

        <div className="flex justify-center gap-2">
          <Button title="Cancel" onClick={onClose} type="button" />
          <Button title={loading ? "Saving..." : "Save"} type="submit" disabled={loading} />
        </div>
      </form>
    </div>
  );
}
