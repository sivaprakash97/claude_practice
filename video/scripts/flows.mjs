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
    const option = (name) => page.locator("label").filter({ hasText: name }).first();
    await click(option("Product explainers"), { zoom: 1.7, hold: 0.2, travel: 500, pause: 150 });
    await click(option("Social media ads"), { zoom: 1.7, hold: 0.2, travel: 400, pause: 150 });
    speed(2);
    await scrollTo(option("Text-to-video from scripts"), { ms: 900 });
    speed(1);
    await click(option("Text-to-video from scripts"), { zoom: 1.7, hold: 0.2, travel: 450, pause: 150 });
    await wait(200);
    await click(page.getByRole("button", { name: "Submit answers" }), { zoom: 1.7, hold: 0.3, travel: 450, out: true });

    speed(2);
    await wait(2300);
    speed(1);
    caption("Get the best match for your team");
    await wait(300);
    await focus(page.getByText("Recommended", { exact: true }), { zoom: 1.7, hold: 2.5, at: [0.5, 3.5] });
    await wait(3500);
  },
};

const access = {
  path: "/?start=results",
  async script({ page, click, focus, wait, caption, speed }) {
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
    await click(page.getByPlaceholder("Search for team members"), { zoom: 1.7, hold: 0.4, travel: 500 });
    await wait(350);
    const member = (name) => page.getByRole("button", { name: new RegExp(name) }).first();
    for (const name of ["Ashley Simmons", "Riley White", "Mellisa Berrera"])
      await click(member(name), { zoom: 1.7, hold: 0.3, travel: 400, pause: 200 });
    await wait(250);
    await click(page.getByRole("button", { name: /Give access/ }), { zoom: 1.7, hold: 0.3, travel: 450, out: true });

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
    await focus(process, { zoom: 1.45, hold: 3.6, at: [0.5, 0.32] });
    await wait(1600);
    // Glide down the steps while the camera holds on the card.
    await scrollTo(process, { block: "end", offset: 60, ms: 1900 });
    await wait(600);

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

    // Picking teammates plays a little calmer so each check reads.
    speed(1.45);
    await wait(800);
    await click(page.getByPlaceholder("Search for team members"), { zoom: 1.7, hold: 0.3, travel: 450 });
    await wait(200);
    const member = (name) => page.getByRole("button", { name: new RegExp(name) }).first();
    for (const name of ["Ashley Simmons", "Riley White", "Mellisa Berrera", "Nikita Skye", "Liam O"])
      await click(member(name), { zoom: 1.7, hold: 0.2, travel: 350, pause: 120 });
    await click(page.getByRole("button", { name: /Give access/ }), { zoom: 1.7, hold: 0.2, travel: 400, out: true });
    speed(3);
    // Assigning takes 2s, then the log panel slides open.
    await wait(3400);
    speed(1);

    caption("Raise a seat upgrade request");
    await click(page.getByRole("button", { name: /Yes, proceed/ }), { zoom: 1.7, hold: 0.3, travel: 500, out: true });
    speed(3);
    await wait(2700);
    await scrollTo(page.getByRole("button", { name: "Submit request" }), { block: "end", offset: 30, ms: 1500 });
    speed(1);
    await click(page.getByRole("button", { name: "Submit request" }), { zoom: 1.8, hold: 0.3, travel: 450, out: true });
    caption("Sent for approval");
    await wait(450);
    await focus(page.getByText("Request submitted successfully"), { zoom: 1.6, hold: 1.3, at: [0.5, 2.5] });
    await wait(1800);
  },
};

export const FLOWS = { research, access, "more-seats": moreSeats };
