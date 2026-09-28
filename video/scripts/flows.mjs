// The three walkthroughs. Each one is a list of clicks, scrolls and captions played
// against the running prototype; timings here are real time before any speed-ups.

const research = {
  path: "/",
  async script({ page, click, focus, scrollTo, wait, caption, speed }) {
    caption("Ask Fluxby AI to research a tool");
    await wait(900);
    await click(page.locator("textarea"), { zoom: 1.9, hold: 0.6 });
    await wait(500);
    await click(page.getByRole("button", { name: /flexible editing capabilities/ }), { zoom: 1.9, hold: 0.35, out: true });

    await wait(1400);
    caption("Answer a few quick questions");
    const option = (name) => page.locator("label").filter({ hasText: name }).first();
    await click(option("Product explainers"), { zoom: 1.7, hold: 0.3, travel: 600 });
    await click(option("Social media ads"), { zoom: 1.7, hold: 0.3, travel: 450 });
    await scrollTo(option("Timeline control"), { ms: 700 });
    await click(option("Timeline control"), { zoom: 1.7, hold: 0.3, travel: 500 });
    await click(option("Keyframe animation"), { zoom: 1.7, hold: 0.3, travel: 450 });
    await scrollTo(option("Text-to-video from scripts"), { ms: 700 });
    await click(option("Text-to-video from scripts"), { zoom: 1.7, hold: 0.3, travel: 500 });
    await wait(300);
    await click(page.getByRole("button", { name: "Submit answers" }), { zoom: 1.7, hold: 0.35, out: true });

    caption("Fluxby researches the options");
    await wait(2300);
    caption("Get the best match for your team");
    await wait(700);
    await focus(page.getByText("Recommended", { exact: true }), { zoom: 1.7, hold: 1.8, at: [0.5, 3.5] });
    await wait(2600);
    speed(1.4);
    // The turn's title stays pinned at the top, so land the heading just below it.
    const best = page.getByRole("heading", { name: "Runway AI is your best choice" });
    await scrollTo(best, { block: "start", offset: -190, ms: 1400 });
    speed(1);
    await focus(best, { zoom: 1.6, hold: 2.6, at: [0.5, 3.5] });
    await wait(4200);
  },
};

const access = {
  path: "/?start=results",
  async script({ page, click, focus, wait, caption }) {
    caption("Pick the recommended tool");
    await wait(600);
    await focus(page.getByText("Recommended", { exact: true }), { zoom: 1.6, hold: 1, at: [0.5, 3.5] });
    await wait(1200);
    await click(page.getByRole("button", { name: "Get access" }).first(), { zoom: 1.9, hold: 0.35, out: true });

    await wait(1400);
    caption("Choose the teammates who need a seat");
    await click(page.getByPlaceholder("Search for team members"), { zoom: 1.7, hold: 0.8 });
    await wait(500);
    const member = (name) => page.getByRole("button", { name: new RegExp(name) }).first();
    for (const name of ["Ashley Simmons", "Riley White", "Mellisa Berrera", "Nikita Skye"])
      await click(member(name), { zoom: 1.7, hold: 0.3, travel: 500 });
    await wait(300);
    await click(page.getByRole("button", { name: /Give access/ }), { zoom: 1.7, hold: 0.35, out: true });

    caption("Seats are assigned instantly");
    await wait(2700);
    caption("Every assignment is logged");
    await wait(900);
    await focus(page.getByText("Assigned members x", { exact: false }), { zoom: 1.5, hold: 2.4, at: [1.2, 3] });
    await wait(3400);
  },
};

const moreSeats = {
  path: "/?start=results",
  async script({ page, click, focus, scrollTo, wait, caption, speed }) {
    caption("Only 5 seats left, but the team needs 10");
    await wait(500);
    await focus(page.getByText("5 seats left").first(), { zoom: 1.9, hold: 0.6 });
    await wait(1100);
    await click(page.getByPlaceholder("Ask Fluxby AI"), { zoom: 1.6, hold: 0.6 });
    await wait(400);
    await click(page.getByRole("button", { name: "Send" }), { zoom: 1.6, hold: 0.3, travel: 500, out: true });

    caption("Fluxby lays out the upgrade process");
    await wait(900);
    speed(2.2);
    await scrollTo(page.getByRole("heading", { name: "How would you like to proceed?" }), { block: "start", offset: -120, ms: 2200 });
    speed(1);
    await wait(200);
    caption("Assign 5 now, request 5 more");
    await click(page.getByRole("button", { name: /Assign the available 5 seats now/ }), { zoom: 1.7, hold: 0.35, out: true });

    await wait(1300);
    await click(page.getByPlaceholder("Search for team members"), { zoom: 1.7, hold: 0.4 });
    await wait(300);
    speed(1.5);
    const member = (name) => page.getByRole("button", { name: new RegExp(name) }).first();
    for (const name of ["Ashley Simmons", "Riley White", "Mellisa Berrera", "Nikita Skye", "Liam O"])
      await click(member(name), { zoom: 1.7, hold: 0.2, travel: 380, pause: 120 });
    speed(1);
    await click(page.getByRole("button", { name: /Give access/ }), { zoom: 1.7, hold: 0.3, out: true });
    speed(2);
    await wait(3000);
    speed(1);

    caption("Raise the seat upgrade request");
    await click(page.getByRole("button", { name: /Yes, proceed/ }), { zoom: 1.7, hold: 0.35, out: true });
    speed(2);
    await wait(2400);
    speed(1);
    await wait(900);
    speed(1.6);
    await scrollTo(page.getByRole("button", { name: "Submit request" }), { block: "end", offset: 30, ms: 1600 });
    speed(1);
    await click(page.getByRole("button", { name: "Submit request" }), { zoom: 1.8, hold: 0.3, out: true });
    caption("Sent for approval");
    await wait(500);
    await wait(700);
    await focus(page.getByText("Request submitted successfully"), { zoom: 1.6, hold: 2.4, at: [0.5, 2.5] });
    await wait(3000);
  },
};

export const FLOWS = { research, access, "more-seats": moreSeats };
