import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import {
  Link2,
  Trash2,
  Copy,
  CheckCircle,
  MousePointerClick,
  TrendingUp,
  Globe,
  ArrowRight,
  Search,
  Filter
} from "lucide-react";

const BACKEND_BASE_URL = API.defaults.baseURL;

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newUrl, setNewUrl] = useState("");
  const [newAlias, setNewAlias] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchLinks = async () => {
    try {
      const res = await API.get("/api/links");
      setLinks(res.data);
    } catch (err) {
      console.error("Error fetching links:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
    const timer = setInterval(fetchLinks, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!newUrl) return;
    setCreating(true);
    try {
      await API.post("/api/links", { targetUrl: newUrl, customCode: newAlias });
      setNewUrl("");
      setNewAlias("");
      fetchLinks();
    } catch {
      alert("Failed to create link. Custom code might be taken.");
    } finally {
      setCreating(false);
    }
  };

  const deleteLink = async (code) => {
    if (!confirm("Delete this link? This cannot be undone.")) return;
    try {
      await API.delete(`/api/links/${code}`);
      setLinks((prev) => prev.filter((l) => l.code !== code));
    } catch {
      alert("Failed to delete link");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        <div className="animate-pulse">Loading Dashboard...</div>
      </div>
    );

  const totalLinks = links.length;
  const activeLinks = links.filter((l) => !l.disabled).length;
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);

  const maxClicks = Math.max(...links.map((l) => l.clicks), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your shortened links and track performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Links" value={totalLinks} icon={Link2} trend="+5 this week" color="blue" />
        <StatCard title="Active Links" value={activeLinks} icon={CheckCircle} trend="98% Uptime" color="green" />
        <StatCard title="Total Clicks" value={totalClicks} icon={MousePointerClick} trend="+12% vs last week" color="purple" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 mb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
        <form onSubmit={handleShorten} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe size={16} className="text-gray-400" />
              </div>
              <input
                type="url"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="https://example.com/very-long-url..."
              />
            </div>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Code <span className="text-gray-400 text-xs">(Optional)</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xs font-bold">/</span>
              </div>
              <input
                type="text"
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                className="pl-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="my-link"
              />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <button disabled={creating} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-70">
              {creating ? "Shortening..." : <><Link2 size={18} /> Shorten</>}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-300 flex flex-col sm:flex-row justify-between items-center bg-gray-50 gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Your Links</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input type="text" placeholder="Search links..." className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            </div>
            <button className="text-gray-500 hover:text-gray-700 px-2 border border-gray-300 rounded bg-white">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            {/* 🔥 NEW TABLE HEADERS */}
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Original URL</th>
                <th className="px-6 py-3">Short URL</th>
                <th className="px-6 py-3">Clicks</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {links.map((link) => {
                const shortUrl = link.shortUrl || `${BACKEND_BASE_URL}/${link.code}`;
                const clickPercentage = Math.min(100, Math.max(5, (link.clicks / maxClicks) * 100));

                return (
                  <tr key={link.code} className="bg-white border-b border-gray-300 hover:bg-gray-50 transition-colors group">

                    {/* Code */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/link/${link.code}`} className="font-medium text-blue-600 hover:underline hover:text-blue-800">
                        {link.code}
                      </Link>
                    </td>

                    {/* Original URL */}
                    <td className="px-6 py-4 max-w-[210px]">
                      <a href={link.targetUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 truncate hover:text-blue-600 hover:underline" title={link.targetUrl}>
                        <img src={`https://www.google.com/s2/favicons?domain=${link.targetUrl}`} alt="" className="w-4 h-4 opacity-70" />
                        <span className="truncate">{link.targetUrl.replace(/^https?:\/\//, "")}</span>
                      </a>
                    </td>

                    {/* Short URL + Copy */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline hover:text-blue-800" title={shortUrl}>
                          {shortUrl}
                        </a>
                        <button onClick={() => copyToClipboard(shortUrl)} className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer" title="Copy Short URL">
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>

                    {/* Clicks */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-bold text-gray-900 w-8">{link.clicks}</span>
                        <div className="h-1.5 w-15 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${clickPercentage}%` }}></div>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(link.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 rounded transition-colors hover:bg-blue-100 hover:text-blue-600">
                          <ArrowRight size={18} />
                        </a>

                        <button onClick={() => deleteLink(link.code)} className="p-1.5 text-gray-500 rounded transition-colors hover:bg-red-100 hover:text-red-600">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {links.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    No links created yet. Use the form above to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
        {trend && (
          <p className="text-xs text-green-600 mt-2 flex items-center font-medium">
            <TrendingUp size={12} className="mr-1" /> {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${colors[color] || colors.blue}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}
