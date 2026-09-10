const leads = [
  ["@studioluna.krk", "Kraków", 94, "Nowy lokalny biznes beauty, wysoka szansa na prostą stronę usługową."],
  ["@remonty_pro", "Katowice", 88, "Rozważa stronę firmową i pyta, czy ma sens dla małej firmy."],
  ["@anna.probiz", "Warszawa", 82, "Русскоязычный сервисный бизнес в Польше, сравнивает сайт и Instagram."],
];

const trends = [
  ["AI won’t replace designers — average designers using AI will", 96, "Mocna opinia + lęk + kontrariański hook"],
  ["Small businesses don’t need 20-page websites", 92, "Prostota kontra przepłacanie"],
  ["Before/after homepage teardown", 89, "Konkretny przykład i szybka transformacja"],
];

export default function Home() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span>A</span><div><b>Artur</b><small>Threads AI</small></div></div>
        <nav><a href="#overview">Overview</a><a href="#leads">Lead Radar</a><a href="#trends">USA Trends</a><a href="#content">Text Content</a><a href="#images">Images</a><a href="#settings">Settings</a></nav>
        <div className="status"><i/>Scout active<small>PL/RU leads · USA trends · Polish text</small></div>
      </aside>

      <section className="content" id="overview">
        <header><div><span className="eyebrow">TEXT-FIRST MVP</span><h1>Good morning, Artur.</h1><p>Find clients, catch US trends and turn them into Polish Threads posts. Images stay optional.</p></div><button>Run AI scout</button></header>

        <div className="metrics">
          <article><span>Leads found</span><strong>37</strong><small>+12 since last scan</small></article>
          <article><span>Hot leads</span><strong>8</strong><small>score 85+</small></article>
          <article><span>USA trend pulse</span><strong>92</strong><small>strong today</small></article>
          <article><span>Text posts today</span><strong>3</strong><small>4th only if quality is high</small></article>
        </div>

        <div className="grid2">
          <section className="card" id="leads"><div className="cardhead"><div><span className="eyebrow">LEAD RADAR · PL + RU</span><h2>Best opportunities now</h2></div><b>Live soon</b></div>{leads.map(([name,city,score,reason])=><div className="row" key={String(name)}><div className="avatar">{String(name).slice(1,3).toUpperCase()}</div><div className="grow"><strong>{name}</strong><span>{city}</span><small>{reason}</small></div><em>{score}</em></div>)}</section>
          <section className="card" id="trends"><div className="cardhead"><div><span className="eyebrow">USA TREND RADAR</span><h2>What is moving</h2></div><b>TOP + RECENT</b></div>{trends.map(([title,score,angle])=><div className="trend" key={String(title)}><strong>{title}</strong><span>{angle}</span><em>{score}/100</em></div>)}</section>
        </div>

        <section className="card" id="content"><div className="cardhead"><div><span className="eyebrow">POLISH TEXT ENGINE</span><h2>Today’s publishing queue</h2></div><button className="smallbtn">Generate post</button></div><div className="queue"><div><time>09:15</time><span>Opinion</span><strong>AI nie zabierze pracy dobrym designerom.</strong><b>Published</b></div><div><time>14:00</time><span>Mini case</span><strong>Mała firma nie potrzebuje strony z 20 podstronami.</strong><b>Scheduled</b></div><div><time>19:30</time><span>Discussion</span><strong>Ile naprawdę powinna kosztować dobra strona?</strong><b>Draft</b></div></div></section>

        <div className="grid2">
          <section className="card" id="images"><span className="eyebrow">OPTIONAL VISUALS</span><h2>GPT Image 2.5</h2><p>Generate an image only when AI predicts it will materially strengthen the post.</p><div className="imagebox">✦<small>Text first. Visual only when useful.</small></div></section>
          <section className="card" id="settings"><span className="eyebrow">PRODUCT RULES</span><h2>Current strategy</h2><ul><li>Trend source: USA</li><li>Lead market: Poland + Russian-speaking businesses in Poland</li><li>Published content: Polish text only</li><li>3 strong posts/day + optional 4th</li><li>Approval mode before autopilot</li></ul></section>
        </div>
      </section>
    </main>
  );
}
