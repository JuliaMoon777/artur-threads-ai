"use client";

import { useEffect, useState } from "react";

type GeneratedPost = {
  hook: string;
  post: string;
  angle: string;
  why_it_works: string;
  quality_score: number;
  image_worth_it: boolean;
  image_prompt: string;
  model?: string;
};

type SelectedTrend = {
  title?: string;
  polish_angle?: string;
};

const starterTrends = [
  "AI won’t replace designers — average designers using AI will",
  "Small businesses don’t need 20-page websites",
  "Before/after homepage teardown"
];

export default function TextGenerator() {
  const [trend, setTrend] = useState(starterTrends[0]);
  const [context, setContext] = useState("");
  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function onTrendSelected(event: Event) {
      const detail = (event as CustomEvent<SelectedTrend>).detail;
      if (detail?.title) setTrend(detail.title);
      if (detail?.polish_angle) setContext(detail.polish_angle);
      setResult(null);
      setError("");
    }

    window.addEventListener("artur:trend-selected", onTrendSelected);
    return () => window.removeEventListener("artur:trend-selected", onTrendSelected);
  }, []);

  async function generate() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trend, context })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Generation failed.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="generator">
      <div className="trendchips">
        {starterTrends.map((item) => (
          <button
            type="button"
            className={trend === item ? "chip active" : "chip"}
            key={item}
            onClick={() => setTrend(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <label className="fieldlabel" htmlFor="trend-input">US trend / source idea</label>
      <textarea
        id="trend-input"
        className="trendinput"
        value={trend}
        onChange={(event) => setTrend(event.target.value)}
        rows={3}
      />

      <label className="fieldlabel" htmlFor="context-input">Optional Polish angle or context</label>
      <input
        id="context-input"
        className="textinput"
        value={context}
        onChange={(event) => setContext(event.target.value)}
        placeholder="np. skieruj to do właścicieli salonów, lokalnych firm, B2B…"
      />

      <div className="generatoractions">
        <button type="button" onClick={generate} disabled={loading || !trend.trim()}>
          {loading ? "Generating…" : "Generate Polish Thread"}
        </button>
        <small>AI creates an original PL post — not a translation.</small>
      </div>

      {error ? <div className="errorbox">{error}</div> : null}

      {result ? (
        <div className="resultbox">
          <div className="resultmeta">
            <span>Quality <b>{result.quality_score}/100</b></span>
            <span>{result.image_worth_it ? "Image recommended" : "Text-only recommended"}</span>
            {result.model ? <span>{result.model}</span> : null}
          </div>
          <span className="eyebrow">HOOK</span>
          <h3>{result.hook}</h3>
          <span className="eyebrow">READY THREAD</span>
          <p className="postcopy">{result.post}</p>
          <div className="resultnotes">
            <div><span>Angle</span><p>{result.angle}</p></div>
            <div><span>Why it works</span><p>{result.why_it_works}</p></div>
          </div>
          {result.image_worth_it && result.image_prompt ? (
            <div className="imageprompt"><span>GPT Image prompt</span><p>{result.image_prompt}</p></div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
