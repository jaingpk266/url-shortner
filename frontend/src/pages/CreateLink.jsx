import { useState } from "react";
import { Copy, Check, Link2 } from 'lucide-react';
import API from "../api";

export default function CreateLink() {
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    try {
      const body = { targetUrl };
      if (customCode.trim() !== "") body.customCode = customCode.trim();

      const res = await API.post("/api/links", body);
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("This custom code is already used. Try another.");
      } else {
        setError("Something went wrong. Check the URL.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>

      {/* --- Updated Icon + Heading (Same as Total Links UI) --- */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg bg-blue-100 ">
          <Link2 size={22} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold">Create Short Link</h2>
      </div>

      <div className="card border border-gray-300">

        <form onSubmit={handleSubmit} className="stack">
          <label className="muted">Enter Target URL</label>
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com"
            required
            style={{ padding: 12, borderRadius: 8, border: '1px solid #D1D5DB' }}
          />

          <label className="muted">Custom Code (optional)</label>
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="my-custom-link"
            style={{ padding: 12, borderRadius: 8, border: '1px solid #D1D5DB' }}
          />

          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <button type="submit" className="btn"><Link2 size={18} />Shorten</button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setTargetUrl('');
                setCustomCode('');
                setShortUrl('');
                setError('');
              }}
            >
              Reset
            </button>
          </div>
        </form>

        {error && <p style={{ color: "#dc2626", marginTop: 12 }}>{error}</p>}

        {shortUrl && (
          <div style={{ marginTop: 16 }} className="stack">
            <h3 style={{ margin: 0 }}>Your Short Link</h3>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="accent"
                style={{ maxWidth: 520, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {shortUrl}
              </a>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                {/* Copy Button */}
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={async () => {
                    setCopyError("");
                    try {
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(shortUrl);
                      } else {
                        const ta = document.createElement('textarea');
                        ta.value = shortUrl;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                      }
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1800);
                    } catch (err) {
                      setCopyError('Copy failed');
                      setTimeout(() => setCopyError(''), 2500);
                    }
                  }}
                >
                  <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </span>
                </button>

                {copyError && (
                  <div className="badge badge-error pop">
                    {copyError}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
