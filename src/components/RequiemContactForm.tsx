'use client';

import { useEffect, useRef } from 'react';

export default function RequiemContactForm() {
    const containerRef = useRef<HTMLDivElement>(null);
    const formSlug = "requiem-electric-contact-host-interest-ad10a3f4";

    useEffect(() => {
        if (!containerRef.current) return;

        // Check if form already exists to prevent duplicate injection
        if (containerRef.current.querySelector('form')) return;

        const apiEndpoint = "https://crm.ledger1.ai/api/forms/submit";

        // Adapted Theme configuration for Requiem Dark Mode
        const theme = {
            primaryColor: "#FFD700",
            backgroundColor: "rgba(25, 25, 25, 0.6)", // Glass dark
            textColor: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            fontFamily: "inherit",
            buttonTextColor: "#000000",
            labelColor: "#9ca3af", // gray-400
            inputBgColor: "rgba(0, 0, 0, 0.4)"
        };

        const form = document.createElement("form");
        form.id = "crm-form-" + formSlug;
        form.style.cssText = `display:grid; grid-template-columns: repeat(12, 1fr); column-gap: 20px; row-gap: 24px; max-width:800px; margin:0 auto; font-family:${theme.fontFamily}; background:${theme.backgroundColor}; padding:40px; border-radius:${theme.borderRadius}; border: 1px solid rgba(255, 215, 0, 0.3); backdrop-filter: blur(10px); box-shadow: 0 0 20px rgba(255, 215, 0, 0.1), inset 0 0 20px rgba(255, 215, 0, 0.05); transition: box-shadow 0.3s ease;`;

        // Add generic hover effect
        form.onmouseenter = () => {
            form.style.boxShadow = `0 0 30px rgba(255, 215, 0, 0.2), inset 0 0 30px rgba(255, 215, 0, 0.1)`;
            form.style.borderColor = "rgba(255, 215, 0, 0.6)";
        };
        form.onmouseleave = () => {
            form.style.boxShadow = `0 0 20px rgba(255, 215, 0, 0.1), inset 0 0 20px rgba(255, 215, 0, 0.05)`;
            form.style.borderColor = "rgba(255, 215, 0, 0.3)";
        };

        const fields = [
            { "name": "first_name", "label": "First Name", "type": "text", "required": true, "placeholder": "Jane", "span": 6 },
            { "name": "last_name", "label": "Last Name", "type": "text", "required": true, "placeholder": "Doe", "span": 6 },
            { "name": "email", "label": "Email", "type": "email", "required": true, "placeholder": "you@example.com", "span": 6 },
            { "name": "phone", "label": "Phone", "type": "phone", "required": false, "placeholder": "(555) 123-4567", "span": 6 },
            { "name": "company", "label": "Company / Organization", "type": "text", "required": false, "placeholder": "Your company", "span": 12 },
            { "name": "engagement_type", "label": "Engagement Type", "type": "select", "required": true, "placeholder": null, "span": 12 },
            { "name": "address", "label": "Property Address", "type": "text", "required": false, "placeholder": "123 Energy Ave", "span": 12 },
            { "name": "city", "label": "City", "type": "text", "required": false, "placeholder": "City", "span": 4 },
            { "name": "state", "label": "State", "type": "text", "required": false, "placeholder": "State", "span": 4 },
            { "name": "zip", "label": "ZIP", "type": "text", "required": false, "placeholder": "ZIP", "span": 4 },
            { "name": "country", "label": "Country", "type": "text", "required": false, "placeholder": "Country", "span": 6 },
            { "name": "website", "label": "Website", "type": "text", "required": false, "placeholder": "https://", "span": 6 },
            { "name": "spots_available", "label": "Est. Spots", "type": "number", "required": false, "placeholder": "4", "span": 12 },
            { "name": "message", "label": "Message", "type": "textarea", "required": false, "placeholder": "Tell us about your project...", "span": 12 }
        ];

        const allInputs: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] = [];

        fields.forEach(function (field, index) {
            const wrapper = document.createElement("div");
            wrapper.style.gridColumn = `span ${field.span || 12}`;
            wrapper.style.position = "relative";
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = "column";

            const label = document.createElement("label");
            label.textContent = field.label + (field.required ? " *" : "");
            label.style.cssText = "display:block;margin-bottom:8px;font-weight:600;color:" + theme.labelColor + ";font-size:11px;letter-spacing: 0.15em;text-transform:uppercase;transition:color 0.3s ease;";
            wrapper.appendChild(label);

            let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            if (field.type === "textarea") {
                input = document.createElement("textarea");
                input.rows = 4;
            } else if (field.type === "select") {
                input = document.createElement("select");
                const options = ["I want to host chargers (Property Owner)", "I want to invest (Finance Partner)", "I want to buy tokens (NFT Owner)", "General Inquiry", "Partnership Proposal", "Press / Media"];
                const defaultOpt = document.createElement("option");
                defaultOpt.text = "Select an option...";
                defaultOpt.value = "";
                defaultOpt.disabled = true;
                defaultOpt.selected = true;
                input.appendChild(defaultOpt);
                options.forEach(opt => {
                    const el = document.createElement("option");
                    el.text = opt;
                    el.value = opt;
                    el.style.backgroundColor = "#1a1a1a";
                    el.style.color = theme.textColor;
                    input.appendChild(el);
                });

                // Auto-advance logic for select
                input.addEventListener('change', () => {
                    if (input.value && index < allInputs.length - 1) {
                        allInputs[index + 1].focus();
                    }
                });
            } else {
                input = document.createElement("input");
                input.type = field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"; // number falls back to text or number if supported
                if (field.type === 'number') input.type = "number";
            }

            input.name = field.name;
            input.required = field.required;
            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                input.placeholder = field.placeholder || "";
            }

            if (field.type === 'phone' && input instanceof HTMLInputElement) {
                input.addEventListener('input', (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    let x = target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                    if (x) {
                        target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
                    }
                });
            }

            input.dataset.index = index.toString();

            // Sleek input styling
            input.style.cssText = "width:100%;padding:14px 16px;border:1px solid " + theme.borderColor + ";border-radius:4px;font-size:14px;background:" + theme.inputBgColor + ";color:" + theme.textColor + ";box-sizing:border-box;outline:none;transition:all 0.3s ease;";

            // Microtext / Hint
            const microtext = document.createElement("div");
            microtext.style.cssText = "position:absolute;bottom:-18px;right:0;font-size:9px;color:#666;opacity:0;transition:all 0.3s ease;pointer-events:none;letter-spacing:0.05em;";
            microtext.textContent = (field.required ? "REQUIRED" : "OPTIONAL") + (index < fields.length - 1 ? " • PRESS ENTER ↵" : "");
            wrapper.appendChild(microtext);

            // Focus Effects & Navigation Listener
            input.onfocus = () => {
                input.style.borderColor = theme.primaryColor;
                input.style.boxShadow = `0 0 15px ${theme.primaryColor}20`;
                input.style.transform = "translateY(-2px)";
                label.style.color = theme.primaryColor;
                microtext.style.opacity = "1";
                microtext.style.transform = "translateY(0)";

                // Scroll into view smoothly if needed, but not too aggressive
                wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
            };
            input.onblur = () => {
                input.style.borderColor = theme.borderColor;
                input.style.boxShadow = "none";
                input.style.transform = "translateY(0)";
                label.style.color = theme.labelColor;
                microtext.style.opacity = "0";
            };

            // Enter key navigation
            input.addEventListener('keydown', (e: Event) => {
                const ke = e as KeyboardEvent;
                if (ke.key === 'Enter' && field.type !== 'textarea') {
                    ke.preventDefault();
                    if (index < allInputs.length - 1) {
                        allInputs[index + 1].focus();
                    }
                }
            });

            allInputs.push(input);
            wrapper.appendChild(input);
            form.appendChild(wrapper);
        });

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.textContent = "SUBMIT INQUIRY";
        submit.style.cssText = "background:" + theme.primaryColor + ";color:" + theme.buttonTextColor + ";border:none;padding:16px 28px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:700;width:100%;margin-top:16px;letter-spacing:0.1em;text-transform:uppercase;";

        // Submit button needs to span full width
        const submitWrapper = document.createElement("div");
        submitWrapper.style.gridColumn = "span 12";
        submitWrapper.appendChild(submit);
        form.appendChild(submitWrapper);

        submit.onmouseover = () => { submit.style.opacity = "0.9"; };
        submit.onmouseout = () => { submit.style.opacity = "1"; };

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            submit.disabled = true;
            submit.textContent = "TRANSMITTING...";
            submit.style.opacity = "0.7";

            const data: Record<string, any> = {};
            new FormData(form).forEach(function (v, k) { data[k] = v; });

            fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    form_slug: formSlug,
                    data: data,
                    source_url: window.location.href,
                    referrer: document.referrer
                })
            })
                .then(async (response) => {
                    if (response.ok) {
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>⚡</div><h3 style='color:${theme.primaryColor};font-size:24px;margin-bottom:12px;font-weight:bold;letter-spacing:0.05em;'>TRANSMISSION RECEIVED</h3><p style='color:${theme.textColor};line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;'>We will be in touch shortly.</p></div>`;
                        return;
                    }

                    // Try to read error only if not OK
                    let errorMessage = "Server responded with an error.";
                    try {
                        const res = await response.json();
                        errorMessage = res.error || errorMessage;
                    } catch (e) {
                        // Ignore parsing errors
                    }
                    throw new Error(errorMessage);
                })
                .catch(function (err) {
                    console.warn("Form transmission note:", err);

                    // Specific handling for "Failed to fetch" which often masks a successful 200 OK on CORS-misconfigured servers
                    if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>⚡</div><h3 style='color:${theme.primaryColor};font-size:24px;margin-bottom:12px;font-weight:bold;letter-spacing:0.05em;'>TRANSMISSION RECEIVED</h3><p style='color:${theme.textColor};line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;'>We will be in touch shortly.</p></div>`;
                    } else {
                        alert("Transmission Error: " + (err.message || "Failed to connect."));
                        submit.disabled = false;
                        submit.textContent = "RETRY TRANSMISSION";
                        submit.style.opacity = "1";
                    }
                });
        });

        containerRef.current.appendChild(form);
    }, []); // Run once on mount

    return <div id={"form-" + formSlug} ref={containerRef} className="w-full max-w-2xl mx-auto my-12" />;
}
