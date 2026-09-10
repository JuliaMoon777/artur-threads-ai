"use client";

import { useEffect, useState } from "react";

type ThreadsStatus = {
  configured: boolean;
  connected: boolean;
  username?: string | null;
  userId?: string;
  profilePictureUrl?: string | null;
  biography?: string | null;
  expiresAt?: string;
  error?: string;
};

type SearchItem = {
  id: string;
  username?: string;
  text?: string;
  permalink?: string;
  timestamp?: string;
};

export default function ThreadsConnection() {
  const [status, setStatus] = useState<ThreadsStatus | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("strona internetowa");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);

  async function loadStatus() {
    try {
      const response = await fetch("/api/threads/status", { cache: "no-store" });
      const data = await response.json();
      setStatus(data);
    } catch {
      setError("Nie udało się sprawdzić połączenia Threads.");
    }
  }

  useEffect(() => {
    loadStatus();
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("threads_error");
    if (oauthError) setError(`Threads OAuth: ${oauthError}`);
  }, []);

  async function disconnect() {
    await fetch("/api/threads/disconnect", { method: "POST" });
    setResults([]);
    await loadStatus();
  }

  async function testSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    try {
      const response = await fetch(`/api/threads/search?q=${encodeURIComponent(query)}&search_type=RECENT&limit=8`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Threads search failed.");
      setResults(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Threads search failed.");
    } finally {
      setSearching(false);
    }
  }

  if (!status) {
    return <div className="threadsConnect"><p>Sprawdzam połączenie Threads…</p></div>;
  }

  return (
    <div className="threadsConnect">
      {error ? <div className="errorbox">{error}</div> : null}

      {!status.configured ? (
        <div className="threadsSetup">
          <div className="connectionState"><i className="off"/><div><strong>Meta app not configured yet</strong><span>Dodaj dwa sekrety do Vercel, potem wróć tutaj.</span></div></div>
          <div className="envList"><code>THREADS_APP_ID</code><code>THREADS_APP_SECRET</code></div>
          <div className="callbackBox"><span>Valid OAuth Redirect URI</span><code>https://artur-threads-ai.vercel.app/api/threads/callback</code></div>
        </div>
      ) : status.connected ? (
        <>
          <div className="connectionState connected">
            {status.profilePictureUrl ? <img src={status.profilePictureUrl} alt="Threads profile" /> : <i />}
            <div><strong>@{status.username || "Threads account"}</strong><span>Connected · user {status.userId}</span></div>
            <button type="button" className="ghostbtn" onClick={disconnect}>Disconnect</button>
          </div>
          <div className="threadTest">
            <div><span className="eyebrow">LIVE THREADS TEST</span><h3>Keyword search</h3></div>
            <div className="threadSearchBar"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="np. szukam strony internetowej"/><button type="button" onClick={testSearch} disabled={searching}>{searching ? "Searching…" : "Search RECENT"}</button></div>
            {status.expiresAt ? <small className="tokenExpiry">Long-lived token expires: {new Date(status.expiresAt).toLocaleDateString("pl-PL")}</small> : null}
            {results.length ? <div className="threadResults">{results.map((item) => <article key={item.id}><div><strong>@{item.username || "unknown"}</strong><span>{item.timestamp ? new Date(item.timestamp).toLocaleString("pl-PL") : ""}</span></div><p>{item.text || "No text"}</p>{item.permalink ? <a href={item.permalink} target="_blank" rel="noreferrer">Open in Threads ↗</a> : null}</article>)}</div> : null}
          </div>
        </>
      ) : (
        <div className="threadsSetup">
          <div className="connectionState"><i/><div><strong>Meta app ready</strong><span>Autoryzuj konto Threads, aby włączyć live search i publikowanie.</span></div></div>
          <a className="connectThreadsBtn" href="/api/threads/connect">Connect Threads account</a>
          <div className="callbackBox"><span>OAuth callback configured in Meta must be exactly</span><code>https://artur-threads-ai.vercel.app/api/threads/callback</code></div>
        </div>
      )}
    </div>
  );
}
