// Source takes for the 20-second launch film (src/launch). Each take is one continuous
// session; the film cuts and retimes them by the named marks and clicks logged here, so
// these flows only need to perform the interactions cleanly and at a natural pace.

// Take A: the research and access story, from an empty home screen to the license log.
const launchA = {
  path: "/",
  async script({ page, click, mark, scrollTo, wait, speed }) {
    const input = page.locator("textarea");
    await mark("home", input);
    await wait(700);
    await click(input, { travel: 500, name: "input" });
    await wait(150);
    // The auto-filled prompt: the film's opening type lands on it (textarea has no padding,
    // 16px Manrope on a 24px line).
    await mark("prompt", input);
    await wait(900);
    const suggestion = page.getByRole("button", { name: /flexible editing capabilities/ });
    await mark("suggestions", suggestion);
    await click(suggestion, { travel: 550, name: "suggestion" });

    await page.locator("fieldset").first().waitFor();
    await wait(450);
    await mark("questions", page.locator("fieldset").first());
    const option = (name) => page.locator("label").filter({ hasText: name }).first();
    await click(option("Product explainers"), { travel: 500, pause: 160, name: "q1" });
    await click(option("Social media ads"), { travel: 380, pause: 140, name: "q2" });
    speed(2.5);
    await scrollTo(page.getByRole("button", { name: "Submit answers" }), { block: "end", offset: 60, ms: 900 });
    speed(1);
    await click(page.getByRole("button", { name: "Submit answers" }), { travel: 450, name: "submit" });
    await wait(200);
    await mark("thinking", page.getByText("Understanding the context...").first());
    await page.getByRole("heading", { name: "Product catalogue (4 matches)" }).waitFor({ timeout: 8000 });
    await mark("results", page.getByRole("heading", { name: "Product catalogue (4 matches)" }));
    await wait(300);
    const runway = page.getByText("Recommended", { exact: true }).locator("..");
    await mark("runway", runway);
    await mark("seatsLeft", page.getByText("5 seats left").first());
    await wait(1400);
    await click(page.getByRole("button", { name: "Get access" }).first(), { travel: 650, name: "getAccess" });

    await page.getByPlaceholder("Search for team members").waitFor();
    await wait(500);
    await mark("picker", page.getByPlaceholder("Search for team members").locator("../.."));
    await click(page.getByPlaceholder("Search for team members"), { travel: 450, name: "search" });
    await wait(250);
    const member = (name) => page.getByRole("button", { name: new RegExp(name) }).first();
    for (const [i, name] of ["Ashley Simmons", "Riley White", "Mellisa Berrera", "Nikita Skye", "Liam O"].entries())
      await click(member(name), { travel: 330, pause: 120, name: `member${i + 1}` });
    await wait(150);
    await click(page.getByRole("button", { name: /Give access/ }), { travel: 400, name: "giveAccess" });
    await mark("assigning");
    await page.getByRole("heading", { name: "Runway seats successfully assigned" }).waitFor();
    await mark("assigned");
    await page.locator("aside").last().getByText("Runway seats assigned to 5 members").waitFor();
    await wait(700);
    await mark("log", page.locator("aside").last());
    await mark("logTitle", page.locator("aside").last().getByText("Runway seats assigned to 5 members"));
    await mark("logMembers", page.locator("aside").last().getByText("Assigned members x 5"));
    await wait(1800);
  },
};

// Take B: the seat upgrade request. The more-seats branch is played through off camera
// (5 seats assigned, log open) so the take opens on the same log panel take A ends on.
const launchB = {
  path: "/?start=more-seats",
  async ready(page) {
    await page.getByRole("button", { name: /Assign the available 5 seats now/ }).click();
    await page.getByPlaceholder("Search for team members").click();
    for (const name of ["Ashley Simmons", "Riley White", "Mellisa Berrera", "Nikita Skye", "Liam O"])
      await page.getByRole("button", { name: new RegExp(name) }).first().click();
    await page.getByRole("button", { name: /Give access/ }).click();
    await page.getByRole("button", { name: /Yes, proceed/ }).waitFor();
    await page.locator("aside").last().getByText("Runway seats assigned to 5 members").waitFor();
    await page.mouse.move(1100, 900);
    await page.waitForTimeout(1200);
  },
  async script({ page, click, mark, scrollTo, wait, speed }) {
    await mark("log", page.locator("aside").last());
    await wait(600);
    const proceed = page.getByRole("button", { name: /Yes, proceed/ });
    await mark("ask", page.getByText("Let me know if I can proceed").first());
    await mark("proceed", proceed);
    await click(proceed, { travel: 600, name: "proceed" });
    await mark("creating");
    const doc = page.locator("aside").last();
    await doc.getByText("Seat upgrade details").waitFor({ timeout: 8000 });
    await mark("doc", doc);
    await mark("docTitle", doc.getByText("5 extra Runway seats").first());
    await mark("details", doc.getByText("Seat upgrade details").locator("../.."));
    await wait(1600);
    speed(2);
    await scrollTo(page.getByRole("button", { name: "Submit request" }), { block: "end", offset: 40, ms: 1100 });
    speed(1);
    await mark("submitArea", page.getByRole("button", { name: "Submit request" }));
    await click(page.getByRole("button", { name: "Submit request" }), { travel: 500, name: "submit" });
    await page.getByText("Request submitted successfully").waitFor();
    await wait(250);
    await mark("modal", page.getByText("Request submitted successfully").locator("../.."));
    await wait(2200);
  },
};

export const LAUNCH_FLOWS = { "launch-a": launchA, "launch-b": launchB };
