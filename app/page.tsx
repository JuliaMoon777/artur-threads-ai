import TextGenerator from "../components/TextGenerator";
import ThreadsConnection from "../components/ThreadsConnection";
import TrendRadar from "../components/TrendRadar";

const leads = [
  ["@studioluna.krk", "Kraków", 94, "Nowy lokalny biznes beauty, wysoka szansa na prostą stronę usługową."],
  ["@remonty_pro", "Katowice", 88, "Rozważa stronę firmową i pyta, czy ma sens dla małej firmy."],
  ["@anna.probiz", "Warszawa", 82, "Rosyjskojęzyczny biznes usługowy w Polsce, porównuje stronę i Instagram."],
];

export default function Home() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span>A</span><div><b>Artur</b><small>Threads AI</small></div></div>
        <nav><a href="#overview">Overview</a><a href="#leads">Lead Radar</a><a href="#trends">USA Trends</a><a href="#content">Text Content</a><a href="#threads-account">Threads Account</a><a href="#images">Images</a></nav>
        <div className="status"><i/>Scout active<small>PL/RU leads · USA trends · Polish text</small></div>
      </aside>

      <section className="content" id="overview">
        <header><div><span className="eyebrow">TEXT-FIRST MVP</span><h1>Good morning, Artur.</h1><p>Find clients, catch US trends and turn them into Polish Threads posts. Images stay optional.</p></div><a className="buttonlink" href="#trends">Run AI scout</a></header>

        <div className="metrics">
          <article><span>Leads found</span><strong>37</strong><small>mock until Threads is connected</small></article>
          <article><span>Hot leads</span><strong>8</strong><small>score 85+</small></article>
          <article><span>USA trend radar</span><strong>LIVE</strong><small>OpenAI web research</small></article>
          <article><span>Threads account</span><strong>OAuth</strong><small>connect below</small></article>
        </div>

        <div className="grid2">
          <section className="card" id="leads"><div className="cardhead"><div><span className="eyebrow">LEAD RADAR · PL + RU</span><h2>Best opportunities now</h2></div><b>THREADS NEXT</b></div>{leads.map(([name,city,score,reason])=><div className="row" key={String(name)}><div className="avatar">{String(name).slice(1,3).toUpperCase()}</div><div className="grow"><strong>{name}</strong><span>{city}</span><small>{reason}</small></div><em>{score}</em></div>)}</section>
          <section className="card"><span className="eyebrow">SIGNAL STACK</span><h2>Research + Threads</h2><p>The USA radar is live through OpenAI web search. Once Threads is authorized, we add platform-specific TOP + RECENT search and replace mock leads with real prospects.</p><ul><li>Live US web research</li><li>Original Polish adaptation</li><li>Threads keyword search</li><li>Lead scoring PL/RU</li></ul></section>
        </div>

        <TrendRadar />

        <section className="card contentengine" id="content">
          <div className="cardhead"><div><span className="eyebrow">POLISH TEXT ENGINE</span><h2>US trend → original Polish Thread</h2></div><b>LIVE OPENAI</b></div>
          <p>Select a trend above or paste your own idea. The AI extracts the mechanism, rewrites it for Polish business owners and decides whether an image is worth adding.</p>
          <TextGenerator />
        </section>

        <section className="card threadsAccountCard" id="threads-account">
          <div className="cardhead"><div><span className="eyebrow">THREADS ACCOUNT · META OAUTH</span><h2>Connect your Threads profile</h2></div><b>SECURE SESSION</b></div>
          <p>Authorize through Meta. After connection, use the live keyword search below to verify access.</p>
          <ThreadsConnection />
        </section>

        <section className="card queuecard"><div className="cardhead"><div><span className="eyebrow">PUBLISHING QUEUE</span><h2>Today</h2></div><b>APPROVAL FIRST</b></div><div className="queue"><div><time>09:15</time><span>Opinion</span><strong>AI nie zabierze pracy dobrym designerom.</strong><b>Draft</b></div><div><time>14:00</time><span>Mini case</span><strong>Mała firma nie potrzebuje strony z 20 podstronami.</strong><b>Draft</b></div><div><time>19:30</time><span>Discussion</span><strong>Ile naprawdę powinna kosztować dobra strona?</strong><b>Draft</b></div></div></section>

        <div className="grid2">
          <section className="card" id="images"><span className="eyebrow">OPTIONAL VISUALS</span><h2>GPT Image 2.5</h2><p>Generate an image only when AI predicts it will materially strengthen the post.</p><div className="imagebox">✦<small>Text first. Visual only when useful.</small></div></section>
          <section className="card"><span className="eyebrow">PRODUCT RULES</span><h2>Current strategy</h2><ul><li>Trend source: USA</li><li>Lead market: Poland + Russian-speaking businesses in Poland</li><li>Published content: Polish text only</li><li>3 strong posts/day + optional 4th</li><li>Approval mode before autopilot</li></ul></section>
        </div>
      </section>
    </main>
  );
}
