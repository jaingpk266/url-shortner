import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api";
import { RefreshCcw, Trash2, LinkIcon, Copy, ArrowLeft } from "lucide-react";

const BACKEND_BASE_URL = API.defaults.baseURL;

export default function LinkDetails() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLink = async () => {
    try {
      const res = await API.get(`/api/links/${code}`);
      setLink(res.data);
    } catch (err) {
      setError("Link not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLink();
    const interval = setInterval(fetchLink, 5000);
    return () => clearInterval(interval);
  }, []);

  const deleteLink = async () => {
    if (!confirm("Delete this link? This cannot be undone.")) return;
    await API.delete(`/api/links/${code}`);
    navigate("/");
  };

  const refreshLink = async () => {
    try {
      const res = await API.get(`/api/links/${code}`);
      setLink(res.data);
    } catch {
      setError("Failed to refresh link details");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  const shortUrl = link.shortUrl || `${BACKEND_BASE_URL}/${link.code}`;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Top Back Button */}
      <Link
        to="/"
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 gap-1"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Header Title Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <LinkIcon size={22} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Link Overview</h2>
        </div>

        <div className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
          {link.clicks} Clicks
        </div>
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">

        {/* Code */}
        <Item label="Code">
          <span className="text-gray-900 font-medium">{link.code}</span>
        </Item>

        <Divider />

        {/* Original URL */}
        <Item label="Original URL">
          <a
            href={link.targetUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-sm underline hover:text-blue-800"
          >
            {link.targetUrl}
          </a>
        </Item>

        <Divider />

        {/* Short URL with Copy */}
        <Item label="Short URL">
          <div className="flex items-center gap-3">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm underline hover:text-blue-800 truncate"
            >
              {shortUrl}
            </a>
            <button
              onClick={() => copyToClipboard(shortUrl)}
              className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 hover:text-blue-600 border border-gray-200"
              title="Copy Link"
            >
              <Copy size={14} />
            </button>
          </div>
        </Item>

        <Divider />

        {/* Created Date */}
        <Item label="Created On">
          <span className="text-gray-700 text-sm">
            {new Date(link.createdAt).toLocaleString()}
          </span>
        </Item>

        {/* Buttons */}
        <div className="pt-4 flex gap-3">
          <button
            onClick={refreshLink}
            className="flex items-center gap-2 text-sm border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
          >
            <RefreshCcw size={16} /> Refresh
          </button>

          <button
            onClick={deleteLink}
            className="flex items-center gap-2 text-sm bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* Styled Components */
function Item({ label, children }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-200" />;
}
