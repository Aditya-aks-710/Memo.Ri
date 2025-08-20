import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Sidebar } from "../components/sidebar";
import { Cards } from "../components/cards";
import { Navbar } from "../components/Navbar";
import { AddContentModal } from "../components/AddContent";
import type { ContentInput } from "../components/AddContent";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../components/search";

export const API_URL = import.meta.env.VITE_API_URL;


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

interface SearchResult {
  _id: string;
  title: string;
  type: "image" | "video" | "pdf" | "article" | "audio";
  score: number;
  link?: string;
  previewhtml?: string;
  tags: { title: string }[];
}

interface ApiResponse {
  message: string;
  data: SearchResult[];
}

export function Dashboard({ setToken, setOpen }: DashboardProps) {
  // -----------------------
  // ALL hooks declared here
  // -----------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  //@ts-ignore
  const [searchError, setSearchError] = useState<string | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Stable callbacks for Sidebar / Navbar
  const handleAddClick = useCallback(() => setIsModalOpen(true), []);
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setOpen(false);
    navigate("/");
  }, [setToken, setOpen, navigate]);
  const handleFilterSelect = useCallback((type: string) => {
    setSelectedType(type);
  }, []);

  // Keep handlers stable for Cards etc.
  const handleAddContent = useCallback(
    async (data: ContentInput) => {
      try {
        const config = { headers: { Authorization: token } };
        const response = await axios.post<{ contentId: string; previewhtml?: string }>(
          `${API_URL}/api/v1/content`,
          { ...data, tags: data.tags.split(",").map((tag) => tag.trim()) },
          config
        );

        const newItem: Content = {
          ...data,
          _id: response.data.contentId,
          previewhtml: response.data.previewhtml,
          tags: data.tags,
        };
        setContents((prev) => [newItem, ...prev]);
        setIsModalOpen(false);
      } catch (err) {
        console.error("Failed to add content:", err);
        alert("Failed to add content. Please try again.");
      }
    },
    [token]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`${API_URL}/api/v1/content/${id}`, {
          headers: { Authorization: token },
        });
        setContents((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Failed to delete content:", err);
        alert("Failed to delete content");
      }
    },
    [token]
  );

  // Search handler (stable)
  const handleSearch = useCallback(
    async (searchQuery: string) => {
      // NOTE: do not change selectedType here if you want Sidebar to stay unchanged
      setIsSearchLoading(true);
      setSearchError(null);
      setSearchResults([]);
      try {
        const apiUrl = `${API_URL}/api/v1/content/search?query=${encodeURIComponent(
          searchQuery
        )}&limit=5`;
        const response = await axios.get<ApiResponse>(apiUrl, {
          headers: { Authorization: token || "" },
        });
        if (response.data.data && response.data.data.length > 0) {
          setSearchResults(response.data.data);
        } else {
          setSearchError("No results found for your query.");
        }
      } catch (err) {
        console.error("Search API call failed:", err);
        setSearchError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsSearchLoading(false);
      }
    },
    [token]
  );

  // Data fetch effect
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: token } };

        const [userRes, contentRes] = await Promise.all([
          axios.get<{ user: User }>(`${API_URL}/api/v1/me`, config),
          axios.get<{ contents: BackendContent[] }>(`${API_URL}/api/v1/content`, config),
        ]);

        setUser(userRes.data.user);

        // Keep tags as object array on backend change; if backend returns objects you may store them directly.
        const formattedContent = contentRes.data.contents.map((item) => ({
          _id: item._id,
          title: item.title,
          type: item.type,
          link: item.link,
          previewhtml: item.previewhtml,
          tags: item.tags.map((t) => t.title).join(", "),
        }));
        setContents(formattedContent);
      } catch (err) {
        console.error(err);
        setError("Unauthorized or failed to fetch data. Please sign in again.");
        localStorage.removeItem("token");
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // derived data (no hooks)
  const filteredContents = selectedType === "all" ? contents : contents.filter((item) => item.type === selectedType);

  // -----------------------
  // THEN conditional returns
  // -----------------------
  if (loading) {
    return <div className="text-center mt-20 text-lg font-semibold">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  }

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="sm:flex sm:flex-row flex-col">
      <div className="fixed top-0 left-0 sm:w-fit w-full z-20">
        <Sidebar
          image={user?.profilePictureUrl}
          onAddClick={handleAddClick}
          onLogout={handleLogout}
          onFilterSelect={handleFilterSelect}
          activeFilter={selectedType}
        />
      </div>

      <div className="flex-1 lg:ml-60 sm:ml-14 mt-[60px] sm:mt-0 h-screen overflow-y-auto bg-[#daedeb] sm:transition-[margin-left] duration-200 ease-in-out">
        <Navbar title={user?.name || "User"} image={user?.profilePictureUrl} onAddClick={handleAddClick} onLogout={handleLogout} />
        <div className="sm:mt-30 mt-5 sm:block flex flex-col justify-center">
          <div className="mx-5">{selectedType === "search" ? <SearchBar onSearch={handleSearch} isLoading={isSearchLoading} /> : ""}</div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 mx-5">
            {selectedType === "search"
              ? searchResults.map((item) => (
                  <div key={item._id} className="w-full h-full flex justify-center">
                    <Cards title={item.title} link={item.link ?? ""} type={item.type} tags={item.tags.map((tag) => tag.title).join(", ")} previewhtml={item.previewhtml} onDelete={() => handleDelete(item._id)} />
                  </div>
                ))
              : filteredContents.map((item) => (
                  <div key={item._id} className="w-full h-full flex flex-col justify-center">
                    <Cards title={item.title} link={item.link} type={item.type} tags={item.tags} previewhtml={item.previewhtml} onDelete={() => handleDelete(item._id)} />
                  </div>
                ))}
          </div>
        </div>

        <AddContentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddContent} />
      </div>
    </div>
  );
}
