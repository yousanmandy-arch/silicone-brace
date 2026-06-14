const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const certificateDialog = document.querySelector(".cert-modal");
const certificateImage = certificateDialog?.querySelector("img");
const toast = document.querySelector(".toast");

navToggle?.addEventListener("click", () => {
  const open = header.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".main-nav a, .header-cta").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-cert]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!certificateDialog || !certificateImage) return;
    certificateImage.src = button.dataset.cert;
    certificateImage.alt = button.querySelector("img")?.alt || "Certificate preview";
    certificateDialog.showModal();
  });
});

document.querySelector(".modal-close")?.addEventListener("click", () => {
  certificateDialog?.close();
});

certificateDialog?.addEventListener("click", (event) => {
  if (event.target === certificateDialog) certificateDialog.close();
});

document.querySelector(".rfq-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const productType = data.get("productType") || "custom silicone wristbands";
  const country = data.get("country") || "my market";
  const quantity = data.get("quantity") || "to be confirmed";
  const message = encodeURIComponent(
    `Hello Vobran, I want to request a quote for ${productType}. Country: ${country}. Quantity: ${quantity}. Please contact me with wholesale options.`
  );
  const mailto = `mailto:sales@vobransilicone.com?subject=Vobran%20RFQ%20-%20${encodeURIComponent(productType)}&body=${message}`;
  showToast("Thank you. Your inquiry draft is ready in your email client.");
  window.location.href = mailto;
});

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
}
