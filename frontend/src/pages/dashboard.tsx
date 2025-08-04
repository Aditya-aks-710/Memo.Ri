import { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar } from "../components/sidebar";
import { Cards } from "../components/cards";
import { Navbar } from "../components/Navbar";
import { AddContentModal } from "../components/AddContent";
import type { ContentInput } from "../components/AddContent";
import dp from "../assets/nn.jpg";

// Backend response format for GET
interface BackendContent {
  _id: string;
  title: string;
  type: "image" | "video" | "pdf" | "article" | "audio";
  link: string;
  previewhtml?: string;
  tags: { title: string }[];
}

// Data used in frontend (flattened tags as string)
interface ContentResponse extends ContentInput {
  _id: string;
  previewhtml?: string;
  tags: string; // comma-separated string
}

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contents, setContents] = useState<ContentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Fetch content on load
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get<{ contents: BackendContent[] }>("http://localhost:3000/api/v1/content", {
        headers: {
          Authorization: token,
        },
      });

      const formatted = res.data.contents.map(item => ({
        _id: item._id,
        title: item.title,
        type: item.type,
        link: item.link,
        previewhtml: item.previewhtml,
        tags: item.tags.map(tag => tag.title).join(", "),
      }));

      setContents(formatted);
    } catch (err) {
      console.error(err);
      setError("Unauthorized or failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [token]);


  // Add content
  const handleAddContent = async (data: ContentInput) => {
    const response = await axios.post<{
      contentId: string;
      previewhtml?: string;
    }>("http://localhost:3000/api/v1/content", {
      ...data,
      tags: data.tags.split(",").map(tag => tag.trim()),
    }, {
      headers: {
        Authorization: token,
      },
    });

    const newItem: ContentResponse = {
      ...data,
      _id: response.data.contentId,
      previewhtml: response.data.previewhtml,
      tags: data.tags,
    };

    setContents(prev => [newItem, ...prev]);
  };

  return (
    <div className="sm:flex sm:flex-row flex-col">
        <div className="fixed top-0 left-0 sm:w-fit w-full z-100">
            <Sidebar onAddClick={() => setIsModalOpen(true)}/>
        </div>
        <div className="flex-1 lg:ml-60 sm:ml-14 mt-[60px] sm:mt-0 h-screen overflow-y-auto bg-[#daedeb] sm:transition-[margin-left] duration-200 ease-in-out">
            <Navbar title="Aditya" image={dp} onAddClick={() => setIsModalOpen(true)} />
            <div className="sm:mt-30 mt-5">     
                {loading ? (
                <div className="text-center mt-10 text-lg font-semibold">Loading content...</div>
                ) : error ? (
                <div className="text-center mt-10 text-red-600">{error}</div>
                ) : (
                <div className="flex flex-wrap mx-5 gap-4">
                    {contents.map(item => (
                    <div key={item._id} className="">
                        <Cards
                            title={item.title}
                            link={item.link}
                            type={item.type}
                            tags={item.tags}
                            previewhtml={item.previewhtml}
                        />
                        </div>
                    ))}
                </div>
                )}
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
