"use client";

import { useState } from "react";

type Trend = {
  title: string;
  trend_score: number;
  why_now: string;
  mechanism: string;
  polish_angle: string;
  source_hint: string;
};

type TrendResponse = {
  trends: Trend[];
  summary: string;
  model?: string;
  researchedAt?: string;
};

export default function TrendRadar() {
  const [niche, setNiche] = useState("web design, websites, AI for business, automation, branding, marketing, lead generation, small business");
  const [data, setData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function research() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche })
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error || "Trend research failed.");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trend research failed.");
    } finally {
      setLoading(false);
    }
  }

  function useTrend(trend: Trend) {
    window.dispatchEvent(new CustomEvent("artur:trend-selected", { detail: trend }));
    document.querySelector("#content")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="card trendradar" id="trends">
      <div className="cardhead">
        <div><span className="eyebrow">USA TREND RADAR · LIVE WEB RESEARCH</span><h2>What is moving in the US market</h2></div>
        <b>{data ? "LIVE" : "READY"}</b>
      </div>
      <p>Research fresh US conversations around web design, AI, automation and small business, then adapt the strongest mechanisms to Poland.</p>

      <div className="radarcontrols">
        <input className="textinput" value={niche} onChange={(event) => setNiche(event.target.value)} aria-label="Trend research niche" />
        <button type="button" onClick={research} disabled={loading || !niche.trim()}>{loading ? "Researching USA…" : "Research USA now"}</button>
      </div>

      {error ? <div className="errorbox">{error}</div> : null}

      {data ? (
        <div className="radarresults">
          <div className="radarsummary">
            <span className="eyebrow">MARKET PULSE</span>
            <p>{data.summary}</p>
            <small>{data.model}{data.researchedAt ? ` · ${new Date(data.researchedAt).toLocaleString("pl-PL")}` : ""}</small>
          </div>
          {data.trends.map((trend, index) => (
            <article className="livetrend" key={`${trend.title}-${index}`}>
              <div className="trendscore"><strong>{trend.trend_score}</strong><span>/100</span></div>
              <div className="trendbody">
                <span className="eyebrow">US SIGNAL #{index + 1}</span>
                <h3>{trend.title}</h3>
                <p>{trend.why_now}</p>
                <div className="trenddetails">
                  <div><span>Mechanism</span><p>{trend.mechanism}</p></div>
                  <div><span>Polish angle</span><p>{trend.polish_angle}</p></div>
                </div>
                <small>{trend.source_hint}</small>
              </div>
              <button type="button" className="usebtn" onClick={() => useTrend(trend)}>Use for Polish post</button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
