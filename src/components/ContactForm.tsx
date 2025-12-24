'use client';

import { useEffect, useRef } from 'react';

export default function ContactForm() {
    const containerRef = useRef<HTMLDivElement>(null);
    const formSlug = "the-utility-company-contact-form-915664af";

    useEffect(() => {
        if (!containerRef.current) return;

        // Check if form already exists to prevent duplicate injection
        if (containerRef.current.querySelector('form')) return;

        const apiEndpoint = "https://crm.ledger1.ai/api/forms/submit";

        // TUC Core Theme
        const theme = {
            primaryColor: "#F54029",
            backgroundColor: "rgba(255, 255, 255, 0.03)", // Subtle glass
            textColor: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            fontFamily: "inherit",
            buttonTextColor: "#ffffff",
            labelColor: "#9ca3af", // gray-400
            inputBgColor: "rgba(0, 0, 0, 0.2)"
        };

        const form = document.createElement("form");
        form.id = "crm-form-" + formSlug;
        form.style.cssText = `display:grid; grid-template-columns: repeat(12, 1fr); column-gap: 20px; row-gap: 24px; width:100%; max-width:800px; margin:0 auto; font-family:${theme.fontFamily}; background:${theme.backgroundColor}; padding:40px; border-radius:${theme.borderRadius}; border: 1px solid ${theme.borderColor}; backdrop-filter: blur(10px);`;

        const fields = [
            { name: "first_name", label: "First Name", type: "text", required: true, placeholder: "Jane", span: 6 },
            { name: "last_name", label: "Last Name", type: "text", required: true, placeholder: "Doe", span: 6 },
            { name: "email", label: "Email", type: "email", required: true, placeholder: "name@company.com", span: 6 },
            { name: "phone", label: "Phone", type: "phone", required: false, placeholder: "(555) 123-4567", span: 6 },
            { name: "company", label: "Company", type: "text", required: true, placeholder: "Acme Industrial Co.", span: 12 },
            { name: "website", label: "Company website", type: "text", required: false, placeholder: "https://www.example.com", span: 12 },
            { name: "subsidiary", label: "Subsidiary Interest", type: "select", required: true, placeholder: null, span: 12 },
            { name: "city", label: "City", type: "text", required: false, placeholder: "City", span: 4 },
            { name: "state", label: "State/Region", type: "text", required: false, placeholder: "State", span: 4 },
            { name: "country", label: "Country", type: "select", required: false, placeholder: null, span: 4 },
            { name: "message", label: "How can we help?", type: "textarea", required: true, placeholder: "Briefly describe your project, timelines, and goals...", span: 12 }
        ];

        const allInputs: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] = [];

        fields.forEach(function (field, index) {
            const wrapper = document.createElement("div");
            wrapper.style.gridColumn = `span ${field.span || 12}`;
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = "column";

            const label = document.createElement("label");
            label.textContent = field.label + (field.required ? " *" : "");
            label.style.cssText = "display:block;margin-bottom:8px;font-weight:600;color:" + theme.labelColor + ";font-size:12px;letter-spacing: 0.05em;text-transform:uppercase;";
            wrapper.appendChild(label);

            let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

            if (field.type === "textarea") {
                input = document.createElement("textarea");
                input.rows = 4;
            } else if (field.type === "select") {
                input = document.createElement("select");

                let options: string[] = [];
                if (field.name === 'subsidiary') {
                    options = ["General Inquiry", "Ledger1", "Requiem Electric", "Vulcan Forge", "Osiris Protocol", "Cornucopia Robotics", "The Graine Ledger", "Elysium Athletica", "DigiBazaar", "Loch Ness Botanical Society"];
                } else if (field.name === 'country') {
                    options = ["United States", "United Kingdom", "Canada", "Singapore", "Switzerland", "United Arab Emirates", "Other"];
                }

                const defaultOpt = document.createElement("option");
                defaultOpt.text = "Select...";
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
            } else {
                input = document.createElement("input");
                input.type = field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text";
            }

            input.name = field.name;
            input.required = field.required;
            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                input.placeholder = field.placeholder || "";
            }

            // Input Styling
            input.style.cssText = `width:100%;padding:14px 16px;border:1px solid ${theme.borderColor};border-radius:8px;font-size:14px;background:${theme.inputBgColor};color:${theme.textColor};box-sizing:border-box;outline:none;transition:all 0.2s ease;`;

            input.onfocus = () => {
                input.style.borderColor = theme.primaryColor;
                input.style.background = "rgba(0,0,0,0.5)";
            };
            input.onblur = () => {
                input.style.borderColor = theme.borderColor;
                input.style.background = theme.inputBgColor;
            };

            allInputs.push(input);
            wrapper.appendChild(input);
            form.appendChild(wrapper);
        });

        // Submit Button
        const submitWrapper = document.createElement("div");
        submitWrapper.style.gridColumn = "span 12";

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.textContent = "SEND MESSAGE";
        submit.style.cssText = `background:${theme.primaryColor};color:${theme.buttonTextColor};border:none;padding:16px 28px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:700;width:100%;letter-spacing:0.1em;text-transform:uppercase;transition:opacity 0.2s;`;

        submit.onmouseover = () => { submit.style.opacity = "0.9"; };
        submit.onmouseout = () => { submit.style.opacity = "1"; };

        submitWrapper.appendChild(submit);
        form.appendChild(submitWrapper);

        // Submit Handler
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
                        form.innerHTML = `<div style='grid-column:span 12;text-align:center;padding:60px;'><h3 style='color:${theme.primaryColor};font-size:24px;margin-bottom:12px;font-weight:bold;'>MESSAGE RECEIVED</h3><p style='color:${theme.textColor};opacity:0.8;'>We will be in touch shortly.</p></div>`;
                        return;
                    }
                    throw new Error("Submission error");
                })
                .catch(function () {
                    alert("Transmission failed. Please try again.");
                    submit.disabled = false;
                    submit.textContent = "SEND MESSAGE";
                    submit.style.opacity = "1";
                });
        });

        containerRef.current.appendChild(form);
    }, []);

    return <div id={"form-" + formSlug} ref={containerRef} className="w-full" />;
}
