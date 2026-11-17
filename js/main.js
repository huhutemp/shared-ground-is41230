const progressBar = document.querySelector("#reading-progress-bar");
const progressRoot = document.documentElement;
const chapterLinks = [...document.querySelectorAll(".chapter-nav a")];
const chapters = chapterLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateReadingProgress() {
  const scrollable = progressRoot.scrollHeight - progressRoot.clientHeight;
  const progress = scrollable > 0 ? progressRoot.scrollTop / scrollable : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
}

function setActiveChapter(id) {
  chapterLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

const chapterObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) {
      setActiveChapter(visible[0].target.id);
    }
  },
  {
    rootMargin: "-18% 0px -55% 0px",
    threshold: [0.1, 0.3, 0.55],
  },
);

chapters.forEach((chapter) => chapterObserver.observe(chapter));
window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();

const splitInput = document.querySelector("#ownership-split");
const splitOutput = document.querySelector("#split-output");
const wilcoxBar = document.querySelector("#wilcox-bar");
const pullmanBar = document.querySelector("#pullman-bar");
const wilcoxDeposit = document.querySelector("#wilcox-deposit");
const wilcoxMonthly = document.querySelector("#wilcox-monthly");
const pullmanDeposit = document.querySelector("#pullman-deposit");
const pullmanMonthly = document.querySelector("#pullman-monthly");

const DEPOSIT_TOTAL = 250000;
const MONTHLY_TOTAL = 3900;
const currencyNumber = new Intl.NumberFormat("en-CA", {
  maximumFractionDigits: 0,
});
const formatCad = (value) => `C$${currencyNumber.format(value)}`;

function updateCostSplit() {
  const wilcoxShare = Number(splitInput.value) / 100;
  const pullmanShare = 1 - wilcoxShare;
  const wilcoxPercent = Math.round(wilcoxShare * 100);
  const pullmanPercent = 100 - wilcoxPercent;

  splitOutput.textContent = `${wilcoxPercent} / ${pullmanPercent}`;
  wilcoxBar.style.width = `${wilcoxPercent}%`;
  pullmanBar.style.width = `${pullmanPercent}%`;
  wilcoxDeposit.textContent = formatCad(DEPOSIT_TOTAL * wilcoxShare);
  wilcoxMonthly.textContent = formatCad(MONTHLY_TOTAL * wilcoxShare);
  pullmanDeposit.textContent = formatCad(DEPOSIT_TOTAL * pullmanShare);
  pullmanMonthly.textContent = formatCad(MONTHLY_TOTAL * pullmanShare);
}

splitInput.addEventListener("input", updateCostSplit);
updateCostSplit();

document.querySelectorAll(".agreement-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    const panel = document.querySelector(`#${trigger.getAttribute("aria-controls")}`);
    trigger.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
  });
});
