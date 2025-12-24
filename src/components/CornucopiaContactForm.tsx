'use client';

import { useEffect, useRef } from 'react';

export default function CornucopiaContactForm() {
    const containerRef = useRef<HTMLDivElement>(null);
    const formSlug = "cornucopia-robotics-stakeholder-contact-edc96142";

    useEffect(() => {
        if (!containerRef.current) return;
        if (containerRef.current.querySelector('form')) return;

        const apiEndpoint = "https://crm.ledger1.ai/api/forms/submit";

        // Cornucopia Theme: Pink & Dark
        const theme = {
            primaryColor: "#EC4899",
            backgroundColor: "rgba(20, 20, 20, 0.75)",
            textColor: "#ffffff",
            borderColor: "rgba(236, 72, 153, 0.2)",
            borderRadius: "8px",
            fontFamily: "inherit",
            buttonTextColor: "#ffffff",
            labelColor: "#9ca3af",
            inputBgColor: "rgba(0, 0, 0, 0.5)"
        };

        const form = document.createElement("form");
        form.id = "crm-form-" + formSlug;
        form.style.cssText = `display:grid; grid-template-columns: repeat(12, 1fr); column-gap: 20px; row-gap: 24px; max-width:800px; margin:0 auto; font-family:${theme.fontFamily}; background:${theme.backgroundColor}; padding:40px; border-radius:${theme.borderRadius}; border: 1px solid ${theme.borderColor}; backdrop-filter: blur(12px); box-shadow: 0 0 20px rgba(0,0,0,0.2); transition: all 0.3s ease;`;

        form.onmouseenter = () => {
            form.style.borderColor = "rgba(236, 72, 153, 0.5)";
            form.style.boxShadow = "0 0 30px rgba(236, 72, 153, 0.1)";
        };
        form.onmouseleave = () => {
            form.style.borderColor = theme.borderColor;
            form.style.boxShadow = "0 0 20px rgba(0,0,0,0.2)";
        };

        // Stakeholder type options
        const stakeholderTypeOptions = [
            "Farmer / Grower",
            "Agricultural Co-Op",
            "Investor / Financial Backer",
            "Technology Partner",
            "Land Owner",
            "Researcher / Academic",
            "Government / Municipal",
            "General Inquiry"
        ];

        // Reason for contact options
        const reasonForContactOptions = [
            "Precision Spraying Drones",
            "Autonomous Harvesters",
            "Soil Analysis Swarms",
            "Vertical Farming Systems",
            "Investment Opportunity",
            "Partnership Proposal",
            "Press / Media",
            "Other"
        ];

        // Preferred contact method options
        const preferredContactOptions = ["Email", "Phone", "Either"];

        // Fields matching form schema
        const fields = [
            { "name": "first_name", "label": "First name", "type": "text", "required": true, "placeholder": "e.g., Maria", "span": 6 },
            { "name": "last_name", "label": "Last name", "type": "text", "required": true, "placeholder": "e.g., Lopez", "span": 6 },
            { "name": "email", "label": "Email", "type": "email", "required": true, "placeholder": "name@company.com", "span": 6 },
            { "name": "phone", "label": "Phone (optional)", "type": "phone", "required": false, "placeholder": "+1 555 123 4567", "span": 6 },
            { "name": "stakeholder_type", "label": "I am a...", "type": "select", "required": true, "placeholder": null, "span": 6, "options": stakeholderTypeOptions },
            { "name": "reason_for_contact", "label": "Reason for contact", "type": "select", "required": true, "placeholder": null, "span": 6, "options": reasonForContactOptions },
            { "name": "company", "label": "Company / Organization (optional)", "type": "text", "required": false, "placeholder": "e.g., Cornfield Co-Op", "span": 6 },
            { "name": "website", "label": "Website (optional)", "type": "text", "required": false, "placeholder": "https://yourcompany.com", "span": 6 },
            // Investor-only fields
            { "name": "investment_range", "label": "Investment Interest", "type": "select", "required": false, "placeholder": null, "span": 6, "options": ["$10K - $50K", "$50K - $250K", "$250K - $1M", "$1M+"], "investorOnly": true },
            { "name": "acreage_interest", "label": "Acreage Interest", "type": "select", "required": false, "placeholder": null, "span": 6, "options": ["< 100 Acres", "100 - 500 Acres", "500 - 2000 Acres", "2000+ Acres"], "investorOnly": true },
            // Common fields continue
            { "name": "country", "label": "Country (optional)", "type": "text", "required": false, "placeholder": "e.g., United States", "span": 12 },
            { "name": "message", "label": "Your message", "type": "textarea", "required": true, "placeholder": "Share details about your farm or project, investment interest, timelines, and any specific questions.", "span": 12 },
            { "name": "preferred_contact_method", "label": "Preferred contact method (optional)", "type": "radio", "required": false, "placeholder": null, "span": 12, "options": preferredContactOptions },
            { "name": "contact_consent", "label": "I consent to be contacted regarding this inquiry.", "type": "checkbox", "required": true, "placeholder": null, "span": 12 }
        ];

        const allInputs: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] = [];
        const investorFieldWrappers: HTMLDivElement[] = [];

        // Function to toggle investor fields visibility
        const updateInvestorFieldsVisibility = (showInvestorFields: boolean) => {
            investorFieldWrappers.forEach(wrapper => {
                wrapper.style.display = showInvestorFields ? 'flex' : 'none';
                if (!showInvestorFields) {
                    const input = wrapper.querySelector('select, input') as HTMLSelectElement | HTMLInputElement;
                    if (input) input.value = '';
                }
            });
        };

        fields.forEach(function (field, index) {
            const wrapper = document.createElement("div");
            wrapper.style.gridColumn = `span ${field.span || 12}`;
            wrapper.style.position = "relative";
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = field.type === 'checkbox' ? "row" : "column";
            wrapper.style.alignItems = field.type === 'checkbox' ? "flex-start" : "stretch";
            wrapper.style.gap = field.type === 'checkbox' ? "12px" : "0";

            // Track investor-only fields
            if ((field as any).investorOnly) {
                investorFieldWrappers.push(wrapper);
                wrapper.style.display = 'none';
            }

            let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

            if (field.type === 'checkbox') {
                input = document.createElement("input");
                input.type = "checkbox";
                input.style.cssText = `width: 20px; height: 20px; accent-color: ${theme.primaryColor}; cursor: pointer; flex-shrink: 0; margin-top: 2px;`;

                const label = document.createElement("label");
                label.textContent = field.label + (field.required ? " *" : "");
                label.style.cssText = `color: ${theme.labelColor}; font-size: 13px; line-height: 1.5; cursor: pointer; transition: color 0.3s ease; font-family: monospace;`;
                label.onclick = () => (input as HTMLInputElement).click();

                wrapper.appendChild(input);
                wrapper.appendChild(label);
            } else if (field.type === 'radio') {
                const label = document.createElement("label");
                label.textContent = field.label;
                label.style.cssText = "display:block;margin-bottom:8px;font-weight:600;color:" + theme.labelColor + ";font-size:11px;letter-spacing: 0.1em;text-transform:uppercase;transition:color 0.3s ease;font-family:monospace;";
                wrapper.appendChild(label);

                const radioContainer = document.createElement("div");
                radioContainer.style.cssText = "display:flex;flex-wrap:wrap;gap:16px;";

                const options = (field as any).options || [];
                const hiddenInput = document.createElement("input");
                hiddenInput.type = "hidden";
                hiddenInput.name = field.name;
                wrapper.appendChild(hiddenInput);

                options.forEach((opt: string) => {
                    const radioLabel = document.createElement("label");
                    radioLabel.style.cssText = `display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:${theme.labelColor};font-family:monospace;transition:color 0.2s ease;`;

                    const radio = document.createElement("input");
                    radio.type = "radio";
                    radio.name = field.name + "_radio";
                    radio.value = opt;
                    radio.style.cssText = `accent-color:${theme.primaryColor};width:16px;height:16px;`;

                    radio.addEventListener('change', () => {
                        hiddenInput.value = opt;
                        radioLabel.style.color = theme.textColor;
                    });

                    const text = document.createElement("span");
                    text.textContent = opt;

                    radioLabel.appendChild(radio);
                    radioLabel.appendChild(text);
                    radioContainer.appendChild(radioLabel);
                });

                wrapper.appendChild(radioContainer);
                input = hiddenInput;
            } else {
                const label = document.createElement("label");
                label.textContent = field.label + (field.required ? " *" : "");
                label.style.cssText = "display:block;margin-bottom:8px;font-weight:600;color:" + theme.labelColor + ";font-size:11px;letter-spacing: 0.1em;text-transform:uppercase;transition:color 0.3s ease;font-family:monospace;";
                wrapper.appendChild(label);

                if (field.type === "textarea") {
                    input = document.createElement("textarea");
                    input.rows = 4;
                } else if (field.type === "select") {
                    input = document.createElement("select");
                    const options = (field as any).options || [];
                    const defaultOpt = document.createElement("option");
                    defaultOpt.text = "Select...";
                    defaultOpt.value = "";
                    defaultOpt.disabled = true;
                    defaultOpt.selected = true;
                    input.appendChild(defaultOpt);
                    options.forEach((opt: string) => {
                        const el = document.createElement("option");
                        el.text = opt;
                        el.value = opt;
                        el.style.backgroundColor = "#2d2d2d";
                        el.style.color = theme.textColor;
                        input.appendChild(el);
                    });

                    // Special handling for stakeholder_type to show/hide investor fields
                    if (field.name === 'stakeholder_type') {
                        input.addEventListener('change', () => {
                            const isInvestor = input.value === 'Investor / Financial Backer';
                            updateInvestorFieldsVisibility(isInvestor);
                        });
                    }

                    input.addEventListener('change', () => {
                        if (input.value && index < allInputs.length - 1) {
                            for (let i = index + 1; i < allInputs.length; i++) {
                                const nextWrapper = allInputs[i].closest('div');
                                if (nextWrapper && (nextWrapper as HTMLDivElement).style.display !== 'none') {
                                    allInputs[i].focus();
                                    break;
                                }
                            }
                        }
                    });
                } else {
                    input = document.createElement("input");
                    input.type = field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text";
                }

                input.style.cssText = "width:100%;padding:14px 16px;border:1px solid " + theme.borderColor + ";border-radius:6px;font-size:14px;background:" + theme.inputBgColor + ";color:" + theme.textColor + ";box-sizing:border-box;outline:none;transition:all 0.3s ease;font-family:monospace;";
                wrapper.appendChild(input);

                // Microtext
                const microtext = document.createElement("div");
                microtext.style.cssText = "position:absolute;bottom:-18px;right:0;font-size:9px;color:#777;opacity:0;transition:all 0.3s ease;pointer-events:none;letter-spacing:0.05em;font-family:monospace;";
                microtext.textContent = (field.required ? "REQ" : "OPT") + (index < fields.length - 1 ? " >> ENTER" : "");
                wrapper.appendChild(microtext);

                input.onfocus = () => {
                    input.style.borderColor = theme.primaryColor;
                    input.style.boxShadow = `0 0 15px rgba(236, 72, 153, 0.15)`;
                    input.style.backgroundColor = "rgba(236, 72, 153, 0.05)";
                    const labelEl = wrapper.querySelector('label');
                    if (labelEl) labelEl.style.color = theme.primaryColor;
                    microtext.style.opacity = "1";
                    microtext.style.color = theme.primaryColor;
                    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                };
                input.onblur = () => {
                    input.style.borderColor = theme.borderColor;
                    input.style.boxShadow = "none";
                    input.style.backgroundColor = theme.inputBgColor;
                    const labelEl = wrapper.querySelector('label');
                    if (labelEl) labelEl.style.color = theme.labelColor;
                    microtext.style.opacity = "0";
                };
            }

            input.name = field.name;
            input.required = field.required && !(field as any).investorOnly;
            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                if (field.placeholder) input.placeholder = field.placeholder;
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

            input.addEventListener('keydown', (e: Event) => {
                const ke = e as KeyboardEvent;
                if (ke.key === 'Enter' && field.type !== 'textarea') {
                    ke.preventDefault();
                    for (let i = index + 1; i < allInputs.length; i++) {
                        const nextWrapper = allInputs[i].closest('div');
                        if (nextWrapper && (nextWrapper as HTMLDivElement).style.display !== 'none') {
                            allInputs[i].focus();
                            break;
                        }
                    }
                }
            });

            allInputs.push(input);
            form.appendChild(wrapper);
        });

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.textContent = "DEPLOY SWARM";
        submit.style.cssText = "background:" + theme.primaryColor + ";color:" + theme.buttonTextColor + ";border:none;padding:16px 28px;border-radius:6px;cursor:pointer;font-size:14px;font-weight:700;width:100%;margin-top:16px;letter-spacing:0.1em;text-transform:uppercase;font-family:monospace;transition:all 0.3s ease;";

        const submitWrapper = document.createElement("div");
        submitWrapper.style.gridColumn = "span 12";
        submitWrapper.appendChild(submit);
        form.appendChild(submitWrapper);

        submit.onmouseover = () => {
            submit.style.opacity = "0.9";
            submit.style.transform = "translateY(-2px)";
            submit.style.boxShadow = "0 4px 20px rgba(236, 72, 153, 0.4)";
        };
        submit.onmouseout = () => {
            submit.style.opacity = "1";
            submit.style.transform = "translateY(0)";
            submit.style.boxShadow = "none";
        };

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            submit.disabled = true;
            submit.textContent = "INITIALIZING...";
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
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>🤖</div><h3 style='color:${theme.primaryColor};font-size:24px;margin-bottom:12px;font-family:monospace;font-weight:bold;'>SEQUENCE COMPLETE</h3><p style='color:#fff;line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;font-family:monospace;'>Swarm deployment scheduling initiated.</p></div>`;
                        return;
                    }
                    let errorMessage = "Error";
                    try { const res = await response.json(); errorMessage = res.error || errorMessage; } catch (e) { }
                    throw new Error(errorMessage);
                })
                .catch(function (err) {
                    if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>🤖</div><h3 style='color:${theme.primaryColor};font-size:24px;margin-bottom:12px;font-family:monospace;font-weight:bold;'>SEQUENCE COMPLETE</h3><p style='color:#fff;line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;font-family:monospace;'>Swarm deployment scheduling initiated.</p></div>`;
                    } else {
                        alert("Transmission Error: " + err.message);
                        submit.disabled = false;
                        submit.textContent = "RETRY DEPLOY";
                        submit.style.opacity = "1";
                    }
                });
        });

        containerRef.current.appendChild(form);
    }, []);

    return <div id={"form-" + formSlug} ref={containerRef} className="w-full max-w-2xl mx-auto my-12" />;
}
