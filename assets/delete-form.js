(() => {
  const form = document.getElementById("realm-delete-form");
  if (!form) return;

  const endpoint =
    "https://rwrgnkvwtbbksuezgqkc.supabase.co/functions/v1/request-realm-account-deletion";
  const publishableKey = "sb_publishable_aAOsXFhv5WQE5eJfu1L0TA_ncpRvIh9";
  const status = document.getElementById("delete-status");
  const submit = document.getElementById("delete-submit");
  const copy = {
    en: {
      sending: "Sending…",
      success:
        "Request received privately. We will delete the matching REALM account after we can identify it. This email was not posted publicly.",
      invalid: "Enter a valid email address.",
      confirm: "Confirm the deletion checkbox before sending.",
      limited: "Too many requests for this email today. Try again tomorrow.",
      fail: "The request could not be sent. Your email was not published. Try again.",
    },
    tr: {
      sending: "Gönderiliyor…",
      success:
        "Talep özel olarak alındı. Hesabı tanımlayabildikten sonra eşleşen REALM hesabını sileriz. Bu e-posta herkese açık yayımlanmadı.",
      invalid: "Geçerli bir e-posta adresi yaz.",
      confirm: "Göndermeden önce silme onay kutusunu işaretle.",
      limited: "Bu e-posta için bugün çok fazla istek var. Yarın tekrar dene.",
      fail: "Talep gönderilemedi. E-postan yayımlanmadı. Tekrar dene.",
    },
  };

  const lang = () =>
    document.documentElement.lang === "tr" ? "tr" : "en";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const t = copy[lang()];
    const email = String(form.email.value || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      status.textContent = t.invalid;
      return;
    }
    if (!document.getElementById("delete-confirm").checked) {
      status.textContent = t.confirm;
      return;
    }

    submit.disabled = true;
    status.textContent = t.sending;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: publishableKey,
          authorization: `Bearer ${publishableKey}`,
        },
        body: JSON.stringify({
          email,
          username: String(form.username.value || "").trim(),
          package_id: String(form.package_id.value || "app.aetherrealm.realm"),
          notes: String(form.notes.value || "").trim(),
        }),
      });
      if (response.status === 429) {
        status.textContent = t.limited;
        return;
      }
      if (!response.ok) {
        throw new Error("REQUEST_FAILED");
      }
      form.reset();
      status.textContent = t.success;
    } catch (error) {
      status.textContent = t.fail;
    } finally {
      submit.disabled = false;
    }
  });
})();
