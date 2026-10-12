import Image from "next/image";
import DemoVideo from "@/components/DemoVideo";
import SectionNav from "@/components/SectionNav";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="tag">{children}</p>;
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="stack-8">
      <h3 className="h4">{title}</h3>
      <p className="body">{children}</p>
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <div className="topbar" />

      {/* Hero */}
      <header className="hero">
        <div className="hero__titles">
          <span className="sticker" aria-hidden>
            UX Design
          </span>
          <h1 className="h-display">Designing a smart procurement experience</h1>
          <p className="hero__sub">A solution to preventing duplicate purchases at your organisation</p>
        </div>
        <Image
          className="hero-cover"
          src="/img/hero-cover.jpg"
          alt="Designing a Smart Procurement Experience. Created for ORO Labs, role Product Designer, duration 2 weeks. Product screens: research results, the request list and a request's approval steps."
          width={1057}
          height={594}
          sizes="(max-width: 1098px) 100vw, 1058px"
          priority
        />
      </header>

      <SectionNav />

      {/* Overview */}
      <section id="overview" className="section" style={{ gap: 64 }}>
        <div className="col stack-8">
          <Eyebrow>premise</Eyebrow>
          <h2 className="h1">Duplicate Software Purchases are a thing</h2>
          <div>
            <p className="body" style={{ marginBottom: 8 }}>
              <strong>Large companies use an internal procurement portal to buy software.</strong> When an employee requests a tool, it goes
              through finance, IT, legal, and procurement before access is granted. Sometimes,{" "}
              <strong>employees are unaware that the software they need is already available, leading to duplicate purchase requests</strong>.
            </p>
            <p className="body">
              I designed an AI-powered, web-based purchasing experience for an internal procurement platform that ensures a seamless and
              intelligent buying process.
            </p>
          </div>
        </div>
        <dl className="col facts" style={{ margin: "0 auto" }}>
          <div>
            <dt>timeline</dt>
            <dd>July 2025 / 7 days, weekend included</dd>
          </div>
          <div>
            <dt>role</dt>
            <dd>Solo product designer</dd>
          </div>
          <div>
            <dt>team</dt>
            <dd>Just me; brief and review by the ORO Labs team.</dd>
          </div>
        </dl>

        <div className="stack-8 col" style={{ marginTop: 16 }}>
          <Eyebrow>Demo</Eyebrow>
          <h2 className="h1">Let’s first see the product in action</h2>
        </div>
        <div style={{ width: "100%", maxWidth: 842, marginInline: "auto" }}>
          <DemoVideo name="launch" label="Full walkthrough of the Fluxby AI procurement flow" />
        </div>
      </section>

      {/* People */}
      <section id="people" className="section">
        <div className="col stack-8">
          <Eyebrow>users</Eyebrow>
          <h2 className="h1">Introducing our main characters</h2>
          <p className="body">
            Before we get into the nitty-gritty of how I figured the solution out, let’s take a quick look at the situation we’re dealing with!
          </p>
        </div>

        <div className="col persona-grid">
          <div className="persona">
            <div className="stack-16">
              <div className="portrait">
                <Image src="/img/portrait-amar.png" alt="Pencil sketch portrait of Amar" fill sizes="(max-width: 760px) 100vw, 296px" />
                <span className="name-tape" data-tone="yellow">Amar</span>
              </div>
              <div className="stack-8" style={{ marginTop: 8 }}>
                <p className="h3">
                  Lead, Marketing Design,
                  <br />
                  <span style={{ fontWeight: 400 }}>ACME</span>
                </p>
                <p className="body">Busy leader, very particular about spending time mindfully</p>
              </div>
            </div>
            <div className="note note--yellow tilt-1">
              <p className="h3">Amar’s goals &amp; needs</p>
              <ul>
                <li><strong>Find the most suitable software</strong> as soon as possible</li>
                <li><strong>Submit a purchase request</strong> easily &amp; quickly</li>
              </ul>
            </div>
            <div className="note note--yellow tilt-2">
              <p className="h3">Pain points</p>
              <ul>
                <li><strong>Taking lot of time in extensive research</strong> for the best software</li>
                <li><strong>Unsure whether the software licenses already exist</strong></li>
                <li>No guidance on approval requirements upfront</li>
              </ul>
            </div>
          </div>

          <div className="persona">
            <div className="stack-16">
              <div className="portrait">
                <Image src="/img/portrait-alisha.png" alt="Pencil sketch portrait of Alisha" fill sizes="(max-width: 760px) 100vw, 296px" />
                <span className="name-tape" data-tone="purple">Alisha</span>
              </div>
              <div className="stack-8" style={{ marginTop: 8 }}>
                <p className="h3">
                  Procurement Specialist,
                  <br />
                  <span style={{ fontWeight: 400 }}>ACME</span>
                </p>
                <p className="body">New recruit, very proactive. Also mindful of her bandwidth</p>
              </div>
            </div>
            <div className="note note--purple tilt-3">
              <p className="h3">Alisha’s goals &amp; needs</p>
              <ul>
                <li><strong>Review the purchase requests</strong> and ensure they are all complete and accurate</li>
                <li>Ensure the purchases are routed to various teams (IT, Security, Finance etc)</li>
              </ul>
            </div>
            <div className="note note--purple tilt-4">
              <p className="h3">Pain points</p>
              <ul>
                <li><strong>Relying on memory alone isn’t sustainable to flag duplicate requests</strong></li>
                <li>Delays in getting necessary approvals from stakeholders</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="wider stack-24" style={{ alignItems: "center", marginTop: 16 }}>
          <h2 className="h2" style={{ textAlign: "center" }}>Here’s how a typical Purchase Request gets processed</h2>
          <Image
            className="panel-img"
            src="/img/journey.jpg"
            width={2120}
            height={1160}
            sizes="(max-width: 1100px) 100vw, 1060px"
            alt="Four-step journey. Step 1: Requester does extensive research online to get the best software for his team. Step 2: after 2 days of effort, he picks a tool and submits a purchase request. Step 3: Alisha recalls that this software already exists in ACME's inventory. Step 4: she rejects the request, citing the existing software. Note: this journey is based on desk research and 4 user interviews."
          />
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="section" style={{ gap: 32, paddingTop: 24 }}>
        <div className="col problem stack-16">
          <div className="stack-8">
            <Eyebrow>problem statement</Eyebrow>
            <h2 className="h1">Duplicate software purchase requests cause problems across multiple levels</h2>
          </div>
          <p className="body">
            Requester researched and requested a tool the company already owns. The procurement specialist (Alisha) rejected it only because she
            remembered the earlier purchase.
          </p>
          <div className="stack-16">
            <div className="level">
              <p className="tag">USER LEVEL PROBLEM</p>
              <p className="body">This whole ordeal cost Requester hours which he could’ve spent productively.</p>
            </div>
            <div className="level">
              <p className="tag">BUSINESS LEVEL PROBLEM</p>
              <p className="body">And if Alisha had missed it, it could’ve caused a redundant purchase costing ACME money.</p>
            </div>
          </div>
          <aside className="fact-note" aria-label="Not so fun fact">
            <p className="h3" style={{ color: "#bb5050", whiteSpace: "nowrap" }}>Not so fun fact</p>
            <div className="stack-16" style={{ gap: 12 }}>
              <div className="stack-8" style={{ gap: 4 }}>
                <p className="big">46%</p>
                <p className="small">of SaaS licenses go unused in an average org</p>
              </div>
              <div className="stack-8" style={{ gap: 4 }}>
                <p className="big">$21M</p>
                <p className="small">is the yearly cost for duplicate software purchases</p>
              </div>
            </div>
            <a href="https://zylo.com/blog/how-much-wasted-on-saas-spend" target="_blank" rel="noreferrer">Source: ZYLO</a>
          </aside>
        </div>

        <div className="col stack-16" style={{ marginTop: 48 }}>
          <div className="stack-8">
            <Eyebrow>solution</Eyebrow>
            <h2 className="h1">Which journey was worth solving for?</h2>
          </div>
          <p className="body">
            <strong>I ended up solving for Journey 1</strong> because it <strong>addresses the core issue</strong> where Requester needed to be aware
            that the <strong>required software was already available</strong>. This way, he can <strong>avoid making duplicate purchase requests</strong>{" "}
            and prevent unnecessary software purchases.
          </p>
        </div>

        <div className="wider">
          <Image
            className="panel-img"
            src="/img/journeys-compare.jpg"
            width={2120}
            height={798}
            sizes="(max-width: 1100px) 100vw, 1060px"
            alt="Journey 1: help the Requester find and pick the right software in the procurement platform. Journey 2: help the Procurement Specialist detect duplicate software requests."
          />
        </div>

        <div className="col stack-16">
          <h3 className="h3">With that, I came up with the following design solution</h3>
          <ol className="body" style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>An AI assisted system in the procurement platform that informs users of existing softwares.</li>
            <li>To go a step further, it can research on their behalf to find the most suitable software from its inventory based on their needs.</li>
          </ol>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section" style={{ gap: 32 }}>
        <div className="col stack-16">
          <div className="stack-8">
            <Eyebrow>Design</Eyebrow>
            <h2 className="h1">Setting the scope</h2>
          </div>
          <div className="stack-8">
            <p className="body">I mapped the whole purchase process, then designed the part that creates the problem.</p>
            <p className="body">
              My journey map covered all of it: Requester&apos;s research, Alisha&apos;s review, automatic routing to finance, IT and legal, AI-written
              requests for proposals (RFPs), vendor demos and contracts. But designing every step would have meant a thin pass over all of them.
            </p>
          </div>
        </div>
        <div className="stack-24" style={{ width: "100%" }}>
          <h3 className="h3 col">Due to time constraints and to show a quick proof of work, I scoped it down to these 3 usecases</h3>
          <div className="cases">
            <div className="case"><p className="label">Use case 1</p><p className="body">Research for suitable software within the procurement platform</p></div>
            <div className="case"><p className="label">Use case 2</p><p className="body">Gaining access to the recommended software</p></div>
            <div className="case"><p className="label">Edge Case</p><p className="body">What if Requester needs more licenses?</p></div>
          </div>
        </div>
      </section>

      {/* Use case 1 */}
      <section className="section" style={{ gap: 40 }}>
        <div className="wide stack-24">
          <div className="col stack-8">
            <Eyebrow>USE CASE 1</Eyebrow>
            <h2 className="h1">Helping the Requester research for suitable software within the procurement platform</h2>
          </div>
          <DemoVideo name="flow1-research" label="Research flow: query, dynamic form, shortlist and suggestions" />
          <div className="col pair-grid">
            <Block title="Enter your query in the chat box">
              The assistant lives on the portal&apos;s home page, where the Requester can enter his query. Research is the mode for Requester&apos;s problem.
            </Block>
            <Block title="Smart dynamic form based on the inputs">
              The assistant presents multiple-choice questions with an &quot;Others&quot; option and a text box. It can ask follow-up questions.
            </Block>
            <Block title="AI finds software that fits your needs.">
              The assistant reviews Requester&apos;s answers and surfaces a shortlist of tools that match the procurement requirements.
            </Block>
            <Block title="It suggests top software with quick explanations.">
              The assistant surfaces the strongest matches with short summaries so Requester can quickly compare options.
            </Block>
          </div>
        </div>

        <div className="wider stack-24">
          <div className="col stack-16">
            <h2 className="h2">The software suggestion widget went through the most iterations</h2>
            <p className="body">
              Since the software widgets would be the ones which the users would be interacting with the most in the research phase and they need to get{" "}
              <strong>as much information as possible at a short glance</strong>, it is really important for the cards to be designed with those needs in
              mind. Also with the consideration that the user would want to click on these cards to request access.
            </p>
          </div>
          <Image
            className="panel-img"
            src="/img/widget-iterations.jpg"
            width={2016}
            height={962}
            sizes="(max-width: 1100px) 100vw, 1060px"
            alt="Earlier iterations of the Runway software card around the final widget: Runway, Runway AI Inc, $150 per seat, AI video editor with generative tools for scenes, effects and cleanup, Enterprise license, 5 seats left, See details, Get access."
          />
        </div>
      </section>

      {/* Use case 2 */}
      <section className="section" style={{ gap: 32 }}>
        <div className="wide stack-24">
          <div className="col stack-8">
            <Eyebrow>Use case 2</Eyebrow>
            <h2 className="h1">Gaining access to the recommended software</h2>
          </div>
          <DemoVideo name="flow2-access" label="Access flow: pick software, assign seats, licence log" />
          <div className="col pair-grid">
            <Block title="Pick the software you want">
              From the shortlist of tools the company already owns, the Requester picks one and taps &quot;Get access&quot;. No separate request form opens.
            </Block>
            <Block title="AI itself recommends who can be assigned seats">
              The assistant suggests teammates by role (video editors, motion graphics designer) so the Requester doesn&apos;t start from a blank list.
            </Block>
            <Block title="Choose who should be assigned">
              The Requester confirms the suggested teammates, or searches for anyone else who needs a seat. Access is granted straight from the chat.
            </Block>
            <Block title="After assignment, AI creates a log of the activity">
              The assistant records a licence log with the software, licence type, renewal date and who got a seat, so there&apos;s a clear record without extra paperwork.
            </Block>
          </div>
        </div>
      </section>

      {/* Edge case */}
      <section className="section" style={{ gap: 48 }}>
        <div className="wide stack-24">
          <div className="col stack-8">
            <Eyebrow>Edge Case</Eyebrow>
            <h2 className="h1">Helping the Requester research for suitable software within the procurement platform</h2>
          </div>
          <DemoVideo name="flow3-more-seats" label="Edge case: requesting more seats than are available" />
          <div className="col pair-grid">
            <Block title="AI will state that extra seats cost time and money">
              If the requester requires 10 seats but only 5 seats are available, the tool will give him a heads up about how much the extra seats would cost and how long they will take to get approved.
            </Block>
            <Block title="It provides a clear breakdown of the approval process.">
              Before the Requester decides anything, the assistant walks through each approval step and who handles it, so they know who to contact along the way.
            </Block>
            <Block title="It will nudge Requester to access available seats for the time-being.">
              Instead of making the whole team wait, the assistant suggests using the 5 free seats right away, so part of the team can start working immediately.
            </Block>
            <Block title="If Requester confirms on getting extra seats, the AI will begin approval">
              The assistant drafts a seat upgrade request with the details already filled in. The Requester can pre-assign the extra seats, so those people get access automatically once it&apos;s approved.
            </Block>
          </div>
        </div>
        <div className="wide stack-24">
          <div className="col stack-8">
            <h2 className="h2">Waiting is visible, with owners, dates, and a follow-up path</h2>
            <p className="body">
              Each request sits in the home page&apos;s request table with an approval progress bar. Its detail page shows every step with dates and owners. In
              case the requester wants to check in on the progress with the appropriate approver, a follow-up button beside that step appears on hover.
            </p>
          </div>
          <DemoVideo name="flow4-request" label="Tracking a request: approval progress, steps, owners and follow-up" />
        </div>
      </section>

      {/* Validation */}
      <section id="validation" className="section" style={{ gap: 40, paddingBottom: 120 }}>
        <div className="col stack-8">
          <Eyebrow>validation</Eyebrow>
          <h2 className="h1">Honest reviews and metrics to measure</h2>
          <p className="body">
            <strong>The Head of Design responded positively to the design</strong>. Although I haven&apos;t tested it with users yet, so here&apos;s what I&apos;d measure:
          </p>
        </div>
        <div className="col metrics" style={{ marginTop: 8 }}>
          <div className="metric">
            <span className="north-star">North star metric</span>
            <h3 className="h4" style={{ marginTop: 6 }}>Duplicate purchase rate</h3>
            <p className="body">A decrease in % of duplicate requests shows users are finding existing tools before asking for new ones.</p>
          </div>
          <div className="metric">
            <h3 className="h4" style={{ marginTop: 6 }}>Rate of assignment of existing tools</h3>
            <p className="body">Increase in % of sessions that end with a seat assigned for an existing tool instead of a new purchase request indicates that prevention works.</p>
          </div>
          <div className="metric">
            <h3 className="h4">Time to access</h3>
            <p className="body">Decrease in time taken for the whole process - right from the first query to a seat granted.</p>
          </div>
          <div className="metric">
            <h3 className="h4">Recommendation acceptance</h3>
            <p className="body">The % of sessions where the Recommended tool is the one picked. If it&apos;s low, the matching is off.</p>
          </div>
        </div>

        <div className="col stack-8" style={{ marginTop: 48 }}>
          <Eyebrow>retrospective</Eyebrow>
          <h2 className="h1">What I learned from this project</h2>
        </div>
        <div className="col stack-24">
        <Block title="Solve for the root cause not the symptom">
          The original problem statement was to help the procurement specialist in catching duplicate purchase requests. But upon investigating, the real problem started much earlier when the requester had no way to see what softwares were already available. So I moved my fix to help the requester instead.
        </Block>
        <Block title="Design for where AI is going, not only for what it can do today">
          This was my first AI assistant. What changed my thinking was designing for its future scope instead of limiting the flow to what AI could do at the time.
        </Block>
        </div>
      </section>
    </main>
  );
}
