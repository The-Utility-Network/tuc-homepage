'use client';

import { useEffect, useRef } from 'react';

export default function ElysiumContactForm() {
    const containerRef = useRef<HTMLDivElement>(null);
    const formSlug = "elysium-athletica-contact-consultation-2de0dcfc";

    useEffect(() => {
        if (!containerRef.current) return;
        if (containerRef.current.querySelector('form')) return;

        const apiEndpoint = "https://crm.ledger1.ai/api/forms/submit";

        // Elysium Theme: White & Red
        // Primary: #f54029 (Red)
        // Bg: White/Light Gray
        const theme = {
            primaryColor: "#f54029",
            backgroundColor: "rgba(255, 255, 255, 0.7)", // Light glass
            textColor: "#1a1a1a",
            borderColor: "rgba(245, 64, 41, 0.2)",
            borderRadius: "4px", // Sharper for sport/tech feel
            fontFamily: "inherit",
            buttonTextColor: "#ffffff",
            labelColor: "#666666",
            inputBgColor: "rgba(255, 255, 255, 0.9)"
        };

        const form = document.createElement("form");
        form.id = "crm-form-" + formSlug;
        form.style.cssText = `display:grid; grid-template-columns: repeat(12, 1fr); column-gap: 20px; row-gap: 24px; max-width:800px; margin:0 auto; font-family:${theme.fontFamily}; background:${theme.backgroundColor}; padding:40px; border-radius:${theme.borderRadius}; border: 1px solid ${theme.borderColor}; backdrop-filter: blur(20px); box-shadow: 0 10px 40px rgba(0,0,0,0.05); transition: all 0.3s ease;`;

        form.onmouseenter = () => {
            form.style.boxShadow = `0 20px 60px rgba(245, 64, 41, 0.1)`;
            form.style.borderColor = "rgba(245, 64, 41, 0.4)";
        };
        form.onmouseleave = () => {
            form.style.boxShadow = `0 10px 40px rgba(0,0,0,0.05)`;
            form.style.borderColor = theme.borderColor;
        };

        const fields = [
            { "name": "first_name", "label": "First Name", "type": "text", "required": true, "placeholder": "Jane", "span": 6 },
            { "name": "last_name", "label": "Last Name", "type": "text", "required": true, "placeholder": "Doe", "span": 6 },
            { "name": "email", "label": "Email", "type": "email", "required": true, "placeholder": "you@company.com", "span": 6 },
            { "name": "phone", "label": "Phone", "type": "phone", "required": false, "placeholder": "+1 555 123 4567", "span": 6 },
            { "name": "company", "label": "Company / Organization", "type": "text", "required": false, "placeholder": "Your club, team, or organization", "span": 6 },
            { "name": "website", "label": "Website", "type": "text", "required": false, "placeholder": "https://yourcompany.com", "span": 6 },
            { "name": "interest", "label": "Area of Interest", "type": "select", "required": true, "placeholder": null, "span": 12 },
            { "name": "message", "label": "How can we help?", "type": "textarea", "required": true, "placeholder": "Share a brief overview of your goals, timeline, and any relevant leagues or programs.", "span": 12 },
            { "name": "consent", "label": "Consent to Contact", "type": "checkbox", "required": true, "placeholder": null, "span": 12 }
        ];

        const allInputs: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] = [];

        fields.forEach(function (field, index) {
            const wrapper = document.createElement("div");
            wrapper.style.gridColumn = `span ${field.span || 12}`;
            wrapper.style.position = "relative";
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = field.type === 'checkbox' ? "row" : "column";
            wrapper.style.alignItems = field.type === 'checkbox' ? "center" : "stretch"; // Center checkbox vertically

            if (field.type === 'checkbox') {
                wrapper.style.justifyContent = "flex-start";
                wrapper.style.gap = "12px";
            }

            // For non-checkbox inputs, label comes first. For checkbox, we handle it inside to put input first usually? 
            // The script likely appended label then input for everything, but let's stick to standard practice or the script's visual flow.
            // Script: wrapper appended label, then input. So Label on top for text/select.

            if (field.type !== 'checkbox') {
                const label = document.createElement("label");
                label.textContent = field.label + (field.required ? " *" : "");
                label.style.cssText = "display:block;margin-bottom:8px;font-weight:700;color:" + theme.labelColor + ";font-size:11px;letter-spacing: 0.1em;text-transform:uppercase;transition:color 0.3s ease;";
                wrapper.appendChild(label);
            }

            let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

            if (field.type === "textarea") {
                input = document.createElement("textarea");
                input.rows = 4;
            } else if (field.type === "select") {
                input = document.createElement("select");
                const options = [
                    "High Performance Training (Athlete)",
                    "Franchise / Team Licensing",
                    "Data Analytics Partnership",
                    "Investment Logic",
                    "Media / Press",
                    "Other"
                ];
                const defaultOpt = document.createElement("option");
                defaultOpt.text = "Select Interest...";
                defaultOpt.value = "";
                defaultOpt.disabled = true;
                defaultOpt.selected = true;
                input.appendChild(defaultOpt);
                options.forEach(opt => {
                    const el = document.createElement("option");
                    el.text = opt;
                    el.value = opt;
                    el.style.backgroundColor = "#ffffff";
                    el.style.color = "#000000";
                    input.appendChild(el);
                });
                input.addEventListener('change', () => {
                    if (input.value && index < allInputs.length - 1) {
                        // Find next valid input to focus
                        for (let i = index + 1; i < allInputs.length; i++) {
                            // Check if it's the checkbox or valid input
                            allInputs[i].focus();
                            break;
                        }
                    }
                });
            } else if (field.type === 'checkbox') {
                input = document.createElement("input");
                input.type = "checkbox";
                input.style.cssText = `width: 20px; height: 20px; accent-color: ${theme.primaryColor}; cursor: pointer; margin: 0;`; // Reseting margin

                const label = document.createElement("label");
                label.textContent = field.label + (field.required ? " *" : "");
                label.style.cssText = `color: ${theme.labelColor}; font-size: 13px; font-weight: 500; cursor: pointer; line-height: 1;`;
                label.onclick = () => (input as HTMLInputElement).click();

                wrapper.appendChild(input);
                wrapper.appendChild(label); // Label after input for checkbox
            } else {
                input = document.createElement("input");
                input.type = field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text";
            }

            input.name = field.name;
            input.required = field.required;

            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                if (field.placeholder) input.placeholder = field.placeholder;
            }

            if (field.type !== 'checkbox') {
                input.style.cssText = "width:100%;padding:14px 16px;border:1px solid " + theme.borderColor + ";border-radius:4px;font-size:15px;background:" + theme.inputBgColor + ";color:" + theme.textColor + ";box-sizing:border-box;outline:none;transition:all 0.3s ease;font-weight:500;";
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

            if (field.type !== 'checkbox') {
                const microtext = document.createElement("div");
                microtext.style.cssText = "position:absolute;bottom:-18px;right:0;font-size:9px;color:#999;opacity:0;transition:all 0.3s ease;pointer-events:none;letter-spacing:0.05em;font-weight:600;";
                microtext.textContent = (field.required ? "REQUIRED" : "OPTIONAL") + (index < fields.length - 1 ? " • PRESS ENTER ↵" : "");
                wrapper.appendChild(microtext);

                input.onfocus = () => {
                    input.style.borderColor = theme.primaryColor;
                    input.style.boxShadow = `0 4px 12px rgba(245, 64, 41, 0.15)`;
                    input.style.transform = "translateY(-2px)";
                    const labelEl = wrapper.querySelector('label');
                    if (labelEl && field.type !== 'checkbox') labelEl.style.color = theme.primaryColor; // Only color top label
                    microtext.style.opacity = "1";
                    microtext.style.transform = "translateY(0)";
                    microtext.style.color = theme.primaryColor;
                };
                input.onblur = () => {
                    input.style.borderColor = theme.borderColor;
                    input.style.boxShadow = "none";
                    input.style.transform = "translateY(0)";
                    const labelEl = wrapper.querySelector('label');
                    if (labelEl && field.type !== 'checkbox') labelEl.style.color = theme.labelColor;
                    microtext.style.opacity = "0";
                };
            }

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
            if (field.type !== 'checkbox') wrapper.appendChild(input); // Already appended for checkbox
            form.appendChild(wrapper);
        });

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.textContent = "JOIN THE LEAGUE";
        submit.style.cssText = "background:" + theme.primaryColor + ";color:" + theme.buttonTextColor + ";border:none;padding:18px 28px;border-radius:4px;cursor:pointer;font-size:14px;font-weight:800;width:100%;margin-top:16px;letter-spacing:0.15em;text-transform:uppercase;transition: transform 0.2s ease, box-shadow 0.2s ease;";

        const submitWrapper = document.createElement("div");
        submitWrapper.style.gridColumn = "span 12";
        submitWrapper.appendChild(submit);
        form.appendChild(submitWrapper);

        submit.onmouseover = () => {
            submit.style.transform = "scale(1.02)";
            submit.style.boxShadow = "0 10px 20px rgba(245, 64, 41, 0.3)";
        };
        submit.onmouseout = () => {
            submit.style.transform = "scale(1)";
            submit.style.boxShadow = "none";
        };

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            submit.disabled = true;
            submit.textContent = "VITALIZING...";
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
                }),
                mode: 'cors'
            })
                .then(async (response) => {
                    if (response.ok) {
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>🏟️</div><h3 style='color:${theme.primaryColor};font-size:28px;margin-bottom:12px;font-weight:800;text-transform:uppercase;'>Access Granted</h3><p style='color:${theme.textColor};line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;'>Your data has been logged in the Elysium mainframe.</p></div>`;
                        return;
                    }
                    let errorMessage = "Error";
                    try { const res = await response.json(); errorMessage = res.error || errorMessage; } catch (e) { }
                    throw new Error(errorMessage);
                })
                .catch(function (err) {
                    if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>🏟️</div><h3 style='color:${theme.primaryColor};font-size:28px;margin-bottom:12px;font-weight:800;text-transform:uppercase;'>Access Granted</h3><p style='color:${theme.textColor};line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;'>Your data has been logged in the Elysium mainframe.</p></div>`;
                    } else {
                        alert("Transmission Error: " + err.message);
                        submit.disabled = false;
                        submit.textContent = "RETRY JOIN";
                        submit.style.opacity = "1";
                    }
                });
        });

        containerRef.current.appendChild(form);
    }, []);

    return <div id={"form-" + formSlug} ref={containerRef} className="w-full max-w-2xl mx-auto my-12" />;
}
