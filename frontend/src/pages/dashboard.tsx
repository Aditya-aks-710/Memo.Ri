import { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar } from "../components/sidebar";
import { Cards } from "../components/cards";
import { Navbar } from "../components/Navbar";
import { AddContentModal } from "../components/AddContent";
import type { ContentInput } from "../components/AddContent";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  profilePictureUrl: string;
}

interface BackendContent {
  _id: string;
  title: string;
  type: "image" | "video" | "pdf" | "article" | "audio";
  link: string;
  previewhtml?: string;
  tags: { title: string }[];
}

interface Content extends ContentInput {
  _id: string;
  previewhtml?: string;
  tags: string;
}

interface DashboardProps {
  setToken: (t: string | null) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Dashboard({ setToken, setOpen }: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: token } };

        const [userRes, contentRes] = await Promise.all([
          axios.get<{ user: User }>("http://localhost:3000/api/v1/me", config),
          axios.get<{ contents: BackendContent[] }>("http://localhost:3000/api/v1/content", config)
        ]);

        setUser(userRes.data.user);

        const formattedContent = contentRes.data.contents.map(item => ({
          _id: item._id,
          title: item.title,
          type: item.type,
          link: item.link,
          previewhtml: item.previewhtml,
          tags: item.tags.map(tag => tag.title).join(", "),
        }));
        setContents(formattedContent);

      } catch (err) {
        console.error(err);
        setError("Unauthorized or failed to fetch data. Please sign in again.");
        localStorage.removeItem("token");
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleAddContent = async (data: ContentInput) => {
    try {
      const config = { headers: { Authorization: token } };
      const response = await axios.post<{ contentId: string; previewhtml?: string }>(
        "http://localhost:3000/api/v1/content",
        { ...data, tags: data.tags.split(",").map(tag => tag.trim()) },
        config
      );

      const newItem: Content = {
        ...data,
        _id: response.data.contentId,
        previewhtml: response.data.previewhtml,
        tags: data.tags,
      };
      setContents(prev => [newItem, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add content:", err);
      alert("Failed to add content. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/content/${id}`, {
        headers: { Authorization: token },
      });
      setContents(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Failed to delete content:", err);
      alert("Failed to delete content");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setOpen(false);
    navigate('/');
  };

  // Filter logic
  const filteredContents = selectedType === "all"
    ? contents
    : contents.filter(item => item.type === selectedType);

  if (loading) {
    return <div className="text-center mt-20 text-lg font-semibold">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  return (
    <div className="sm:flex sm:flex-row flex-col">
      <div className="fixed top-0 left-0 sm:w-fit w-full z-20">
        <Sidebar
          image={user?.profilePictureUrl}
          onAddClick={() => setIsModalOpen(true)}
          onLogout={handleLogout}
          onFilterSelect={(type) => setSelectedType(type)}
        />
      </div>

      <div className="flex-1 lg:ml-60 sm:ml-14 mt-[60px] sm:mt-0 h-screen overflow-y-auto bg-[#daedeb] sm:transition-[margin-left] duration-200 ease-in-out">
        <Navbar
          title={user?.name || "User"}
          image={user?.profilePictureUrl}
          onAddClick={() => setIsModalOpen(true)}
          onLogout={handleLogout}
        />
        <div className="sm:mt-30 mt-5 sm:block flex justify-center">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 mx-5">
            {filteredContents.map(item => (
              <div key={item._id} className="w-full h-full flex flex-col justify-center ">
                <Cards
                  title={item.title}
                  link={item.link}
                  type={item.type}
                  tags={item.tags}
                  previewhtml={item.previewhtml}
                  onDelete={() => handleDelete(item._id)}
                />
              </div>
            ))}
          </div>
        </div>
        <AddContentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddContent}
        />
      </div>
    </div>
  );
}
