const inquiryForm = document.querySelector("#b2bInquiryForm");
const statusMessage = inquiryForm?.querySelector(".submit-status");
const submitButton = inquiryForm?.querySelector(".inquiry-submit");

inquiryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearValidation(inquiryForm);

  const formData = new FormData(inquiryForm);
  const payload = Object.fromEntries(formData.entries());

  if (payload.website) {
    showStatus("Submission blocked. Please try again.", "error");
    return;
  }

  const errors = validateInquiry(payload);
  if (errors.length) {
    errors.forEach(({ name }) => markInvalid(name));
    showStatus("Please complete the required fields before submitting.", "error");
    inquiryForm.querySelector(".is-invalid input, .is-invalid textarea, .is-invalid select")?.focus();
    return;
  }

  setSubmitting(true);

  try {
    // To send to a database or CRM, replace this block with:
    // await fetch("/api/inquiries", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    const subject = encodeURIComponent(`Vobran B2B Inquiry - ${payload.productRequirement || "Custom Silicone Wristbands"}`);
    const body = encodeURIComponent(
      [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        `Company: ${payload.company || "-"}`,
        `Country / Region: ${payload.country || "-"}`,
        `Product Requirement: ${payload.productRequirement || "-"}`,
        "",
        "Message:",
        payload.message || "-",
      ].join("\n")
    );

    window.location.href = `mailto:sales@vobransilicone.com?subject=${subject}&body=${body}`;
    inquiryForm.reset();
    showStatus("Submission ready. Your email client should open with the inquiry details.", "success");
  } catch (error) {
    showStatus("Submission failed. Please email sales@vobransilicone.com directly.", "error");
  } finally {
    setSubmitting(false);
  }
});

function validateInquiry(payload) {
  const errors = [];
  if (!payload.name?.trim()) errors.push({ name: "name" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email || "")) errors.push({ name: "email" });
  if (!/^[+()\-\s0-9]{7,24}$/.test(payload.phone || "")) errors.push({ name: "phone" });
  return errors;
}

function markInvalid(name) {
  inquiryForm?.querySelector(`[name="${name}"]`)?.closest("label")?.classList.add("is-invalid");
}

function clearValidation(form) {
  form.querySelectorAll(".is-invalid").forEach((field) => field.classList.remove("is-invalid"));
  showStatus("", "");
}

function showStatus(message, type) {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
}

function setSubmitting(isSubmitting) {
  if (!submitButton) return;
  submitButton.disabled = isSubmitting;
  submitButton.querySelector("span").textContent = isSubmitting ? "Sending..." : "Send Inquiry";
}
