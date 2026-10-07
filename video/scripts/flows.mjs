// The open team picker (its Give access footer only appears once someone is picked).
const openPicker = (page) => page.locator('[class*="h-[356px]"]').first();

// The three walkthroughs, each cut to about 15 seconds. Each one is a list of clicks,
// scrolls and captions played against the running prototype; timings here are real
// time, and speed() plays the stretch that follows faster in the video.

const research = {
  path: "/",
  async script({ page, click, focus, scrollTo, wait, caption, speed }) {
    caption("Ask Fluxby AI to research a tool");
    await wait(400);
    await click(page.locator("textarea"), { zoom: 1.9, hold: 0.4, travel: 600 });
    await wait(350);
    await click(page.getByRole("button", { name: /flexible editing capabilities/ }), {
      zoom: 1.9,
      hold: 0.3,
      travel: 450,
      out: true,
    });

    await wait(1300);
    caption("Answer a few quick questions");
    // The camera stays wide on the form: the page scrolls down as the answers go in.
    const option = (name) => page.locator("label").filter({ hasText: name }).first();
    await scrollTo(option("Product explainers"), { ms: 700 });
    await click(option("Product explainers"), { zoom: false, travel: 500, pause: 150 });
    await click(option("Social media ads"), { zoom: false, travel: 400, pause: 150 });
    await scrollTo(option("Text-to-video from scripts"), { ms: 1100 });
    await click(option("Text-to-video from scripts"), { zoom: false, travel: 450, pause: 150 });
    await scrollTo(page.getByRole("button", { name: "Submit answers" }), { ms: 700 });
    await click(page.getByRole("button", { name: "Submit answers" }), { zoom: false, travel: 450 });

    speed(2);
    await wait(2300);
    speed(1);
    caption("Get the best match for your team");
    await wait(300);
    // Bring the product cards fully into view: they are the point of this step.
    await scrollTo(page.getByRole("button", { name: "Get access" }).first(), { block: "end", offset: 30, ms: 900 });
    await focus(page.getByText("Recommended", { exact: true }), { zoom: 1.7, hold: 2.5, at: [0.5, 3.5] });
    await wait(3500);
  },
};

const access = {
  path: "/?start=results",
  async script({ page, click, focus, scrollTo, wait, caption, speed }) {
    caption("Get access to the recommended tool");
    await wait(900);
    await click(page.getByRole("button", { name: "Get access" }).first(), {
      zoom: 1.9,
      hold: 0.5,
      travel: 800,
      pause: 350,
      out: true,
    });

    await wait(1200);
    caption("Pick the teammates who need a seat");
    // The camera stays wide while picking; the page settles once so the whole list and the
    // Give access button are in view, then holds still for every pick.
    await click(page.getByPlaceholder("Search for team members"), { zoom: false, travel: 500 });
    await wait(350);
    await scrollTo(openPicker(page), { block: "end", offset: 30, ms: 900 });
    const member = (name) => page.getByRole("button", { name: new RegExp(name) }).first();
    for (const name of ["Ashley Simmons", "Riley White", "Mellisa Berrera"])
      await click(member(name), { zoom: false, travel: 400, pause: 200 });
    await wait(250);
    await click(page.getByRole("button", { name: /Give access/ }), { zoom: false, travel: 450 });

    caption("Seats assigned, and logged");
    speed(2.5);
    await wait(2700);
    speed(1);
    await focus(page.locator("aside").last(), { zoom: 1.35, hold: 2.3, at: [0.5, 0.56] });
    await wait(3300);
  },
};

const moreSeats = {
  // Opens on Fluxby's answer to "I want 5 more seats", so the approval process is the first thing seen.
  path: "/?start=more-seats",
  // Start filming as soon as the process card appears, so its steps land on camera.
  ready: (page) => page.getByText("Process (~3 weeks)").waitFor(),
  async script({ page, click, focus, scrollTo, wait, caption, speed }) {
    caption("Fluxby lays out the approval process");
    const process = page.getByText("Process (~3 weeks)").locator("..");
    await focus(process, { zoom: 1.45, hold: 2.1, at: [0.5, 0.32] });
    await wait(1100);
    // Glide down the steps while the camera holds on the card.
    await scrollTo(process, { block: "end", offset: 60, ms: 1200 });
    await wait(300);

    speed(2.5);
    await scrollTo(page.getByRole("heading", { name: "How would you like to proceed?" }), {
      block: "start",
      offset: -120,
      ms: 2000,
    });
    speed(1);
    caption("Assign 5 now, request 5 more");
    await click(page.getByRole("button", { name: /Assign the available 5 seats now/ }), {
      zoom: 1.7,
      hold: 0.3,
      travel: 450,
      out: true,
    });

    // Picking teammates plays a little calmer so each check reads. The camera stays wide and
    // the page settles once as the list opens, then holds still for every pick.
    speed(1.25);
    await wait(800);
    await click(page.getByPlaceholder("Search for team members"), { zoom: false, travel: 450 });
    await wait(200);
    await scrollTo(openPicker(page), { block: "end", offset: 30, ms: 900 });
    const member = (name) => page.getByRole("button", { name: new RegExp(name) }).first();
    for (const name of ["Ashley Simmons", "Riley White", "Mellisa Berrera", "Nikita Skye", "Liam O"])
      await click(member(name), { zoom: false, travel: 350, pause: 120 });
    await click(page.getByRole("button", { name: /Give access/ }), { zoom: false, travel: 400 });
    // Assigning takes 2s, then the log panel slides open.
    speed(2.2);
    await wait(3400);
    speed(1);

    caption("Raise a seat upgrade request");
    // Linger on the choice so viewers can read it before and after the click.
    await wait(900);
    await click(page.getByRole("button", { name: /Yes, proceed/ }), { zoom: 1.7, hold: 1.4, travel: 900, pause: 400, out: true });
    await wait(900);
    // Creating the request, then the document slides in.
    speed(2.2);
    await wait(2700);
    speed(2.5);
    const preassign = page.getByPlaceholder("Choose team members");
    await scrollTo(preassign, { block: "start", offset: -70, ms: 1300 });
    speed(1);

    caption("Pre-assign the extra seats");
    await click(preassign, { zoom: false, travel: 600 });
    await wait(300);
    for (const name of ["Jordan Taylor", "Samantha Lee", "Carlos Mendoza"])
      await click(member(name), { zoom: false, travel: 350, pause: 120 });
    await wait(400);
    speed(2);
    await scrollTo(page.getByRole("button", { name: "Submit request" }), { block: "end", offset: 30, ms: 1200 });
    speed(1);
    await click(page.getByRole("button", { name: "Submit request" }), { zoom: 1.8, hold: 0.3, travel: 450, out: true });
    caption("Sent for approval");
    await wait(450);
    await focus(page.getByText("Request submitted successfully"), { zoom: 1.6, hold: 1.3, at: [0.5, 2.5] });
    await wait(1800);
  },
};

const request = {
  path: "/?start=requests",
  async script({ page, click, focus, scrollTo, wait, caption }) {
    const drawer = page.getByRole("dialog");
    caption("Open your latest request");
    await wait(700);
    // Stays wide: the click and the panel sliding in read best as a whole.
    await click(page.getByRole("row", { name: /SUR# 1029/ }), { zoom: false, travel: 700, at: [0.2, 0.5] });
    // The panel slides in from the right.
    await wait(1000);

    caption("Follow its approval, step by step");
    await focus(drawer.getByText("Procurement Approval"), { zoom: 1.45, hold: 2.6, at: [0.5, 1.5] });
    await wait(900);
    await scrollTo(drawer.getByText("Implementation"), { block: "end", offset: 40, ms: 1400 });
    await wait(900);

    caption("Check the request details");
    await click(drawer.getByRole("button", { name: "Details", exact: true }), { zoom: 1.7, hold: 0.5, travel: 600 });
    await wait(900);
    await focus(drawer.getByText("Tool details"), { zoom: 1.45, hold: 2.8, at: [0.5, 2] });
    await wait(700);
    await scrollTo(drawer.getByText("Pre-assign seats to"), { block: "start", offset: -20, ms: 1500 });
    await wait(2200);
  },
};

// The same flows in a wider, shorter browser window for the 1700×1056 portfolio frame
// (src/Walkthrough.tsx FLOW_LAYOUTS.frame): 1631×760 fills its 1588×834 screen exactly once
// the sidebar is cropped. Recorded at 2× so the larger on-screen page stays sharp when zoomed.
// Played 6× slower while recording (see `slow` in recorder.mjs) so scrolls and slides stay smooth.
const framed = (flow) => ({ ...flow, viewport: { width: 1631, height: 760 }, scale: 2, slow: 6 });

export const FLOWS = {
  research,
  access,
  "more-seats": moreSeats,
  "research-frame": framed(research),
  "access-frame": framed(access),
  "more-seats-frame": framed(moreSeats),
  request,
  "request-frame": framed(request),
};
