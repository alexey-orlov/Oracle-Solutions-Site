(function () {
  "use strict";

  var HONEYPOT = "site-reference";

  function content() { return window.SITE_CONTENT; }
  function config() { return window.SITE_CONFIG; }

  function instance(kind) {
    var forms = content().forms;
    return kind === "contact" ? forms.contact : forms.demo;
  }

  function consentLabel() {
    var UI = window.UI;
    var consent = content().forms.consent;
    var label = consent.label;
    var index = label.indexOf(consent.linkLabel);
    if (index < 0) return UI.esc(label);
    var link = '<a class="inline-link" href="' + UI.esc(consent.linkUrl) +
      '" target="_blank" rel="noopener">' + UI.esc(consent.linkLabel) + "</a>";
    return UI.esc(label.slice(0, index)) + link + UI.esc(label.slice(index + consent.linkLabel.length));
  }

  function field(options) {
    var UI = window.UI;
    return '<div class="field' + (options.wide ? " field--wide" : "") + '">' +
      '<label class="field-label" for="' + UI.esc(options.id) + '">' + UI.esc(options.label) + "</label>" +
      options.control +
      '<p class="field-error" data-error-for="' + UI.esc(options.id) + '" hidden></p>' +
      "</div>";
  }

  function render(kind, options) {
    var UI = window.UI;
    var C = content();
    var opts = options || {};
    var labels = C.forms.labels;
    var meta = instance(kind);
    var uid = "form-" + kind + "-" + Math.random().toString(36).slice(2, 8);
    var submitLabel = opts.submitLabel ||
      (kind === "contact" ? labels.submitContact : labels.submitDemo);
    /* `role: null` leaves every option unchecked — for an entry both audiences use. */
    var selectedRole = opts.role === null ? null : (opts.role || C.forms.roles[0].value);

    var roles = C.forms.roles.map(function (role) {
      return '<label class="radioline">' +
        '<input type="radio" name="' + uid + '-role" value="' + UI.esc(role.value) + '"' +
        (role.value === selectedRole ? " checked" : "") + ">" +
        "<span>" + UI.esc(role.label) + "</span></label>";
    }).join("");

    var productOptions = ['<option value="">' + UI.esc(C.forms.productPlaceholder) + "</option>"]
      .concat(UI.orderedProducts().map(function (product) {
        return '<option value="' + UI.esc(product.slug) + '"' +
          (product.slug === opts.product ? " selected" : "") + ">" + UI.esc(product.name) + "</option>";
      })).join("");

    var head = opts.heading === false ? "" :
      '<div class="form-head">' +
        '<h2 class="h2">' + UI.esc(meta.heading) + "</h2>" +
        '<p class="lead">' + UI.esc(meta.sub) + "</p>" +
      "</div>";

    return '<div class="form-block" data-form-kind="' + UI.esc(kind) + '">' + head +
      '<form class="site-form" novalidate autocomplete="on" data-uid="' + uid + '">' +
        '<div class="form-grid">' +
          field({
            id: uid + "-name", label: labels.name,
            control: '<input class="input" type="text" id="' + uid + '-name" name="name" autocomplete="name" required>'
          }) +
          field({
            id: uid + "-email", label: labels.email,
            control: '<input class="input" type="email" id="' + uid + '-email" name="email" autocomplete="email" required>'
          }) +
          field({
            id: uid + "-company", label: labels.company,
            control: '<input class="input" type="text" id="' + uid + '-company" name="company" autocomplete="organization">'
          }) +
          field({
            id: uid + "-product", label: labels.product,
            control: '<select class="select" id="' + uid + '-product" name="product">' + productOptions + "</select>"
          }) +
          '<fieldset class="field field--wide radio-set">' +
            '<legend class="field-label">' + UI.esc(labels.role) + "</legend>" +
            '<div class="radio-row">' + roles + "</div>" +
          "</fieldset>" +
          field({
            id: uid + "-message", label: labels.message, wide: true,
            control: '<textarea class="textarea" id="' + uid + '-message" name="message" placeholder="' +
              UI.esc(labels.messagePlaceholder) + '"></textarea>'
          }) +
          '<div class="field field--wide">' +
            '<label class="checkline"><input type="checkbox" name="consent" required>' +
              "<span>" + consentLabel() + "</span></label>" +
            '<p class="field-error" data-error-for="consent" hidden></p>' +
          "</div>" +
        "</div>" +
        '<div class="form-trap" aria-hidden="true">' +
          '<label for="' + uid + "-" + HONEYPOT + '">Leave this field empty</label>' +
          '<input id="' + uid + "-" + HONEYPOT + '" type="text" name="' + HONEYPOT + '" tabindex="-1" autocomplete="off">' +
        "</div>" +
        '<div class="form-foot">' +
          window.UI.button({ label: submitLabel, kind: "primary", attrs: { type: "submit" } }) +
          '<p class="form-status" role="status" aria-live="polite"></p>' +
        "</div>" +
      "</form>" +
      "</div>";
  }

  function setError(form, key, message) {
    var node = form.querySelector('[data-error-for="' + key + '"]');
    if (!node) return;
    node.textContent = message || "";
    node.hidden = !message;
  }

  function clearErrors(form) {
    Array.prototype.forEach.call(form.querySelectorAll(".field-error"), function (node) {
      node.textContent = "";
      node.hidden = true;
    });
  }

  function values(form) {
    var uid = form.getAttribute("data-uid");
    var role = form.querySelector('input[name="' + uid + '-role"]:checked');
    var select = form.querySelector('select[name="product"]');
    var productLabel = select && select.value
      ? select.options[select.selectedIndex].text
      : content().forms.productPlaceholder;
    return {
      name: form.querySelector('input[name="name"]').value.trim(),
      email: form.querySelector('input[name="email"]').value.trim(),
      company: form.querySelector('input[name="company"]').value.trim(),
      role: role ? role.value : "",
      product: select ? select.value : "",
      productLabel: productLabel,
      message: form.querySelector('textarea[name="message"]').value.trim(),
      consent: form.querySelector('input[name="consent"]').checked,
      trap: form.querySelector('input[name="' + HONEYPOT + '"]').value
    };
  }

  function validate(form, data) {
    var uid = form.getAttribute("data-uid");
    var labels = content().forms.labels;
    var ok = true;
    clearErrors(form);
    if (!data.name) { setError(form, uid + "-name", labels.required); ok = false; }
    if (!data.email) {
      setError(form, uid + "-email", labels.required);
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      setError(form, uid + "-email", labels.invalidEmail);
      ok = false;
    }
    if (!data.consent) { setError(form, "consent", labels.required); ok = false; }
    if (!ok) {
      var first = form.querySelector(".field-error:not([hidden])");
      if (first) {
        var group = first.closest(".field");
        var input = group && group.querySelector("input, textarea, select");
        if (input) input.focus();
      }
    }
    return ok;
  }

  function roleLabel(value) {
    var found = content().forms.roles.filter(function (role) { return role.value === value; })[0];
    return found ? found.label : value;
  }

  function payload(kind, data) {
    return {
      form: kind,
      name: data.name,
      email: data.email,
      company: data.company,
      role: data.role,
      product: data.product,
      message: data.message,
      consent: data.consent,
      page: window.location.href
    };
  }

  function mailtoHref(kind, data) {
    var C = content();
    var labels = C.forms.labels;
    var subject = (kind === "contact" ? C.forms.contact.heading : C.forms.demo.heading) +
      " — " + data.productLabel;
    var lines = [
      labels.name + ": " + data.name,
      labels.email + ": " + data.email,
      labels.company + ": " + (data.company || "-"),
      labels.role + " " + roleLabel(data.role),
      labels.product + ": " + data.productLabel,
      "",
      labels.message,
      data.message || "-"
    ];
    return "mailto:" + config().contactEmail +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function confirmation(block, outcome) {
    var UI = window.UI;
    var copy = content().forms.confirmations[outcome];
    block.innerHTML = '<div class="form-confirm">' +
      '<span class="form-confirm-mark">' + UI.icon("check") + "</span>" +
      '<h3 class="h3">' + UI.esc(copy.title) + "</h3>" +
      '<p class="body-text">' + UI.esc(copy.body) + "</p>" +
      "</div>";
    var heading = block.querySelector(".h3");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  }

  function mount(root, kind, options) {
    if (!root) return;
    var opts = options || {};
    var block = root.matches && root.matches(".form-block") ? root : root.querySelector(".form-block");
    if (!block) return;
    var form = block.querySelector("form.site-form");
    if (!form || form.getAttribute("data-bound") === "1") return;
    form.setAttribute("data-bound", "1");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = values(form);
      if (data.trap) return;
      if (!validate(form, data)) return;

      var status = form.querySelector(".form-status");
      var endpoint = config().formEndpoint;

      if (endpoint) {
        status.textContent = "…";
        window.fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload(kind, data))
        }).then(function (response) {
          if (!response.ok) throw new Error("rejected");
          confirmation(block, kind === "contact" ? "contactPosted" : "posted");
        }).catch(function () {
          confirmation(block, "error");
        });
        return;
      }

      window.location.href = mailtoHref(kind, data);
      confirmation(block, "mailto");
    });

    if (opts.focus) {
      var firstInput = form.querySelector("input, textarea, select");
      if (firstInput) firstInput.focus();
    }
  }

  /* ————— the sales-kit request ————— */

  /* A short form of its own — work email, the kit, consent — because eligibility
     is the email's domain, not a role the reader declares. The domain is checked
     here to route the reader, and must be checked again by whatever sits behind
     the endpoint. The page never says the kit was emailed unless an auto-sender
     is configured (`sellerGate.kitAutoSend`); with no endpoint the visitor's own
     mail client carries the request, and the confirmation says so. */

  function kitCopy() { return content().salesKit.form; }
  function gateConfig() { return config().sellerGate || {}; }

  /* Escapes the template, then swaps {tokens} for HTML the caller built safely. */
  function fill(template, vars) {
    return window.UI.esc(template).replace(/\{([a-zA-Z]+)\}/g, function (match, key) {
      return Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : match;
    });
  }

  function linkHtml(link) {
    var UI = window.UI;
    return link ? '<a class="inline-link" href="' + UI.esc(link.href) + '">' + UI.esc(link.label) + "</a>" : "";
  }

  function mailboxLink() {
    var UI = window.UI;
    var address = config().contactEmail;
    return '<a class="inline-link" href="mailto:' + UI.esc(address) + '">' + UI.esc(address) + "</a>";
  }

  function kitAllowed(email) {
    var at = email.lastIndexOf("@");
    var domain = at >= 0 ? email.slice(at + 1).toLowerCase() : "";
    return (gateConfig().allowedDomains || []).some(function (allowed) {
      return domain === allowed || domain.slice(-(allowed.length + 1)) === "." + allowed;
    });
  }

  function storedKitEmail() {
    try { return window.localStorage.getItem(gateConfig().kitEmailKey) || ""; } catch (error) { return ""; }
  }

  function productName(slug) {
    var found = (content().products || []).filter(function (item) { return item.slug === slug; })[0];
    return found ? found.name : "";
  }

  function setHtmlError(form, key, html) {
    var node = form.querySelector('[data-error-for="' + key + '"]');
    if (!node) return;
    node.innerHTML = html;
    node.hidden = !html;
  }

  /* options: { product: slug to fix the kit, or none for the select;
     routeLink: { label, href } for customers and partners; next: [{ text, link }]
     lines for the confirmation; again: offer "Request another kit" } */
  function renderKit(options) {
    var UI = window.UI;
    var copy = kitCopy();
    var opts = options || {};
    var uid = "form-kit-" + Math.random().toString(36).slice(2, 8);

    var select = opts.product ? "" :
      '<div class="field kit-field">' +
        '<label class="field-label" for="' + uid + '-product">' + UI.esc(copy.productLabel) + "</label>" +
        '<select class="select" id="' + uid + '-product" name="product">' +
          '<option value="all">' + UI.esc(copy.productAll) + "</option>" +
          UI.orderedProducts().map(function (product) {
            return '<option value="' + UI.esc(product.slug) + '">' + UI.esc(product.name) + "</option>";
          }).join("") +
        "</select>" +
      "</div>";

    return '<div class="form-block kit-block" data-form-kind="kit">' +
      '<form class="kit-form" novalidate autocomplete="on" data-uid="' + uid + '"' +
        (opts.product ? ' data-product="' + UI.esc(opts.product) + '"' : "") + ">" +
        select +
        '<div class="field kit-field">' +
          '<label class="field-label" for="' + uid + '-email">' + UI.esc(copy.emailLabel) + "</label>" +
          '<input class="input" type="email" id="' + uid + '-email" name="email" autocomplete="email" placeholder="' +
            UI.esc(copy.emailPlaceholder) + '" value="' + UI.esc(storedKitEmail()) + '" required>' +
          '<p class="field-error" data-error-for="' + uid + '-email" role="alert" hidden></p>' +
        "</div>" +
        /* Consent before the button, as on every other form here: the button is
           the last thing a reader meets, so it is never pressed too early. */
        '<div class="field kit-field">' +
          '<label class="checkline"><input type="checkbox" name="consent" required>' +
            "<span>" + consentLabel() + "</span></label>" +
          '<p class="field-error" data-error-for="consent" hidden></p>' +
        "</div>" +
        '<div class="form-foot kit-foot">' +
          UI.button({ label: copy.submit, kind: "primary", attrs: { type: "submit" } }) +
        "</div>" +
        '<div class="form-trap" aria-hidden="true">' +
          '<label for="' + uid + "-" + HONEYPOT + '">Leave this field empty</label>' +
          '<input id="' + uid + "-" + HONEYPOT + '" type="text" name="' + HONEYPOT + '" tabindex="-1" autocomplete="off">' +
        "</div>" +
        '<p class="footnote kit-eligibility">' + UI.esc(copy.eligibility) + "</p>" +
        '<p class="small kit-route">' + fill(copy.otherRoute, { routeLink: linkHtml(opts.routeLink) }) + "</p>" +
        '<p class="form-status" role="status" aria-live="polite"></p>' +
      "</form>" +
      "</div>";
  }

  function kitConfirmation(block, outcome, vars, options) {
    var UI = window.UI;
    var copy = kitCopy().confirmations[outcome];
    var next = (options.next || []).map(function (line) {
      return '<p class="small kit-next">' + fill(line.text, { link: linkHtml(line.link) }) + "</p>";
    }).join("");

    block.innerHTML = '<div class="form-confirm kit-confirm">' +
      '<span class="form-confirm-mark">' + UI.icon("check") + "</span>" +
      '<h3 class="h3">' + UI.esc(copy.title) + "</h3>" +
      '<p class="body-text">' + fill(copy.body, vars) + "</p>" +
      next +
      (options.again
        ? UI.button({ label: content().salesKit.page.again, kind: "quiet", sm: true, attrs: { "data-kit-again": "1" } })
        : "") +
      "</div>";

    var heading = block.querySelector(".h3");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }

    var again = block.querySelector("[data-kit-again]");
    if (again) {
      again.addEventListener("click", function () {
        var host = block.parentNode;
        var holder = document.createElement("div");
        holder.innerHTML = renderKit(options);
        var fresh = holder.firstChild;
        host.replaceChild(fresh, block);
        mountKit(fresh, options);
        var input = fresh.querySelector('input[name="email"]');
        if (input) input.focus();
      });
    }
  }

  function mountKit(root, options) {
    if (!root) return;
    var opts = options || {};
    var block = root.matches && root.matches(".kit-block") ? root : root.querySelector(".kit-block");
    if (!block) return;
    var form = block.querySelector("form.kit-form");
    if (!form || form.getAttribute("data-bound") === "1") return;
    form.setAttribute("data-bound", "1");

    /* The retired gate kept an "unlocked" flag; nothing reads it any more. */
    try {
      if (gateConfig().legacyStorageKey) window.localStorage.removeItem(gateConfig().legacyStorageKey);
    } catch (error) { /* nothing stored */ }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var UI = window.UI;
      var copy = kitCopy();
      var labels = content().forms.labels;
      var uid = form.getAttribute("data-uid");
      var emailInput = form.querySelector('input[name="email"]');
      var consentInput = form.querySelector('input[name="consent"]');
      var select = form.querySelector('select[name="product"]');
      var email = emailInput.value.trim();
      var slug = form.getAttribute("data-product") || (select ? select.value : "") || "all";
      if (form.querySelector('input[name="' + HONEYPOT + '"]').value) return;

      clearErrors(form);
      var emailError = "";
      if (!email) emailError = UI.esc(copy.errors.email);
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) emailError = UI.esc(labels.invalidEmail);
      else if (!kitAllowed(email)) emailError = fill(copy.errors.domain, { routeLink: linkHtml(opts.routeLink) });
      if (emailError) setHtmlError(form, uid + "-email", emailError);
      if (!consentInput.checked) setError(form, "consent", labels.required);
      if (emailError || !consentInput.checked) {
        (emailError ? emailInput : consentInput).focus();
        return;
      }

      var all = slug === "all";
      var name = all ? "" : productName(slug);
      var kitName = all ? copy.kitNameAll : copy.kitName.replace("{product}", name);
      var subject = all ? copy.mailSubjectAll : copy.mailSubject.replace("{product}", name);
      var vars = { kitName: UI.esc(kitName), email: UI.esc(email), mailbox: mailboxLink(), subject: UI.esc(subject) };
      var remember = function () {
        try { if (gateConfig().kitEmailKey) window.localStorage.setItem(gateConfig().kitEmailKey, email); }
        catch (error) { /* not remembered */ }
      };
      var status = form.querySelector(".form-status");
      var endpoint = config().formEndpoint;

      if (endpoint) {
        status.textContent = copy.submitting;
        window.fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form: "kit", email: email, product: all ? "all" : slug, consent: true, page: window.location.href })
        }).then(function (response) {
          if (!response.ok) throw new Error("rejected");
          remember();
          kitConfirmation(block, gateConfig().kitAutoSend ? "sent" : "queued", vars, opts);
        }).catch(function () {
          status.innerHTML = fill(copy.errors.send, { mailbox: mailboxLink() });
        });
        return;
      }

      var body = copy.mailBody.replace("{kitName}", kitName).replace("{email}", email).replace("{page}", window.location.href);
      remember();
      window.location.href = "mailto:" + config().contactEmail +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      kitConfirmation(block, "mailto", vars, opts);
    });
  }

  window.FORMS = { render: render, mount: mount, renderKit: renderKit, mountKit: mountKit };
})();
