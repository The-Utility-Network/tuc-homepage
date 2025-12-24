'use client';

import { useEffect, useRef } from 'react';

interface StakeholderInterestFormProps {
    themeColor?: string;
}

export default function StakeholderInterestForm({ themeColor = '#2ECC71' }: StakeholderInterestFormProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const formSlug = "lnbs-stakeholder-interest-form-90412afd";

    useEffect(() => {
        if (!containerRef.current) return;

        // Check if form already exists to prevent duplicate injection
        if (containerRef.current.querySelector('form')) return;

        const apiEndpoint = "https://crm.ledger1.ai/api/forms/submit";

        // Theme configuration adapted for LNBS with botanical green
        const theme = {
            primaryColor: themeColor,
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
        form.style.cssText = `display:grid; grid-template-columns: repeat(12, 1fr); column-gap: 20px; row-gap: 24px; max-width:800px; margin:0 auto; font-family:${theme.fontFamily}; background:${theme.backgroundColor}; padding:40px; border-radius:${theme.borderRadius}; border: 1px solid ${theme.primaryColor}30; backdrop-filter: blur(10px); box-shadow: 0 0 20px ${theme.primaryColor}10, inset 0 0 20px ${theme.primaryColor}05; transition: box-shadow 0.3s ease;`;

        // Add generic hover effect
        form.onmouseenter = () => {
            form.style.boxShadow = `0 0 30px ${theme.primaryColor}20, inset 0 0 30px ${theme.primaryColor}10`;
            form.style.borderColor = `${theme.primaryColor}60`;
        };
        form.onmouseleave = () => {
            form.style.boxShadow = `0 0 20px ${theme.primaryColor}10, inset 0 0 20px ${theme.primaryColor}05`;
            form.style.borderColor = `${theme.primaryColor}30`;
        };

        // Fields matching original form structure, with stakeholder_role added and investor fields conditionally shown
        const fields = [
            { "name": "first_name", "label": "First Name", "type": "text", "required": true, "placeholder": "e.g., Alex", "span": 6 },
            { "name": "last_name", "label": "Last Name", "type": "text", "required": true, "placeholder": "e.g., Morgan", "span": 6 },
            { "name": "email", "label": "Email", "type": "email", "required": true, "placeholder": "you@domain.com", "span": 6 },
            { "name": "phone", "label": "Phone", "type": "phone", "required": false, "placeholder": "+1 555 123 4567", "span": 6 },
            { "name": "stakeholder_role", "label": "I am interested as a...", "type": "select", "required": true, "placeholder": null, "span": 12, "options": ["Investor / Financial Backer", "Property Owner / Land Provider", "Farmer / Agricultural Partner", "Community Member / Local Advocate", "Restaurant / Food Service Partner", "Researcher / Academic", "Technology / Equipment Supplier", "Government / Municipal Representative", "General Inquiry / Just Curious"] },
            { "name": "country", "label": "Country of Residence", "type": "select", "required": true, "placeholder": null, "span": 6, "options": ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan", "Singapore", "United Arab Emirates", "Switzerland", "Other"] },
            { "name": "state", "label": "State/Province/Region", "type": "text", "required": false, "placeholder": "e.g., California or Ontario", "span": 6 },
            // Investor-only fields
            { "name": "investment_interest", "label": "Desired Participation Level", "type": "select", "required": false, "placeholder": null, "span": 6, "options": ["Observer ($0 - Just want updates)", "Supporter ($1K - $10K)", "Investor ($10K - $50K)", "Major Stakeholder ($50K - $250K)", "Founding Partner ($250K+)"], "investorOnly": true },
            { "name": "accreditation_status", "label": "Investor Accreditation Status", "type": "select", "required": false, "placeholder": null, "span": 6, "options": ["Accredited Investor", "Qualified Purchaser", "Non-Accredited", "Unsure / Prefer not to say"], "investorOnly": true },
            // Common fields continue
            { "name": "preferred_contact", "label": "Preferred Contact Method", "type": "select", "required": false, "placeholder": null, "span": 6, "options": ["Email", "Phone", "Either"] },
            { "name": "company", "label": "Company (if applicable)", "type": "text", "required": false, "placeholder": "Your organization or leave blank", "span": 6 },
            { "name": "website", "label": "Website (optional)", "type": "text", "required": false, "placeholder": "https://example.com", "span": 6 },
            { "name": "how_heard", "label": "How did you hear about us?", "type": "select", "required": false, "placeholder": null, "span": 6, "options": ["Social Media", "Search Engine", "Friend/Colleague Referral", "Conference/Event", "Podcast", "News/Article", "Other"] },
            { "name": "message", "label": "Questions or Notes", "type": "textarea", "required": false, "placeholder": "Tell us about your goals, timeline, or any questions you have.", "span": 12 },
            { "name": "consent", "label": "I confirm I am 21+ and consent to be contacted about stakeholder opportunities in my jurisdiction.", "type": "checkbox", "required": true, "placeholder": null, "span": 12 }
        ];

        const allInputs: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] = [];
        const investorFieldWrappers: HTMLDivElement[] = [];

        // Function to toggle investor fields visibility
        const updateInvestorFieldsVisibility = (showInvestorFields: boolean) => {
            investorFieldWrappers.forEach(wrapper => {
                wrapper.style.display = showInvestorFields ? 'flex' : 'none';
                // Clear values when hidden
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
                wrapper.style.display = 'none'; // Hidden by default
            }

            let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

            if (field.type === 'checkbox') {
                // Checkbox styling - input comes first
                input = document.createElement("input");
                input.type = "checkbox";
                input.style.cssText = `width: 20px; height: 20px; accent-color: ${theme.primaryColor}; cursor: pointer; flex-shrink: 0; margin-top: 2px;`;

                const label = document.createElement("label");
                label.textContent = field.label + (field.required ? " *" : "");
                label.style.cssText = `color: ${theme.labelColor}; font-size: 13px; line-height: 1.5; cursor: pointer; transition: color 0.3s ease;`;
                label.onclick = () => (input as HTMLInputElement).click();

                wrapper.appendChild(input);
                wrapper.appendChild(label);
            } else {
                const label = document.createElement("label");
                label.textContent = field.label + (field.required ? " *" : "");
                label.style.cssText = "display:block;margin-bottom:8px;font-weight:600;color:" + theme.labelColor + ";font-size:11px;letter-spacing: 0.15em;text-transform:uppercase;transition:color 0.3s ease;";
                wrapper.appendChild(label);

                if (field.type === "textarea") {
                    input = document.createElement("textarea");
                    input.rows = 4;
                } else if (field.type === "select") {
                    input = document.createElement("select");
                    const options = (field as any).options || [];
                    const defaultOpt = document.createElement("option");
                    defaultOpt.text = "Select an option...";
                    defaultOpt.value = "";
                    defaultOpt.disabled = true;
                    defaultOpt.selected = true;
                    input.appendChild(defaultOpt);
                    options.forEach((opt: string) => {
                        const el = document.createElement("option");
                        el.text = opt;
                        el.value = opt;
                        el.style.backgroundColor = "#1a1a1a";
                        el.style.color = theme.textColor;
                        input.appendChild(el);
                    });

                    // Special handling for stakeholder_role to show/hide investor fields
                    if (field.name === 'stakeholder_role') {
                        input.addEventListener('change', () => {
                            const isInvestor = input.value === 'Investor / Financial Backer';
                            updateInvestorFieldsVisibility(isInvestor);
                        });
                    }

                    // Auto-advance logic for select
                    input.addEventListener('change', () => {
                        if (input.value && index < allInputs.length - 1) {
                            // Find next visible input
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

                // Sleek input styling
                input.style.cssText = "width:100%;padding:14px 16px;border:1px solid " + theme.borderColor + ";border-radius:4px;font-size:14px;background:" + theme.inputBgColor + ";color:" + theme.textColor + ";box-sizing:border-box;outline:none;transition:all 0.3s ease;";

                wrapper.appendChild(input);

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
                    const labelEl = wrapper.querySelector('label');
                    if (labelEl) labelEl.style.color = theme.primaryColor;
                    microtext.style.opacity = "1";
                    microtext.style.transform = "translateY(0)";

                    // Scroll into view smoothly if needed
                    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                };
                input.onblur = () => {
                    input.style.borderColor = theme.borderColor;
                    input.style.boxShadow = "none";
                    input.style.transform = "translateY(0)";
                    const labelEl = wrapper.querySelector('label');
                    if (labelEl) labelEl.style.color = theme.labelColor;
                    microtext.style.opacity = "0";
                };
            }

            input.name = field.name;
            input.required = field.required && !(field as any).investorOnly; // Investor-only fields not required
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

            // Enter key navigation
            input.addEventListener('keydown', (e: Event) => {
                const ke = e as KeyboardEvent;
                if (ke.key === 'Enter' && field.type !== 'textarea') {
                    ke.preventDefault();
                    // Find next visible input
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
        submit.textContent = "SUBMIT INTEREST FORM";
        submit.style.cssText = "background:" + theme.primaryColor + ";color:" + theme.buttonTextColor + ";border:none;padding:16px 28px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:700;width:100%;margin-top:16px;letter-spacing:0.1em;text-transform:uppercase;transition:all 0.3s ease;";

        // Submit button needs to span full width
        const submitWrapper = document.createElement("div");
        submitWrapper.style.gridColumn = "span 12";
        submitWrapper.appendChild(submit);
        form.appendChild(submitWrapper);

        submit.onmouseover = () => {
            submit.style.opacity = "0.9";
            submit.style.transform = "translateY(-2px)";
            submit.style.boxShadow = `0 4px 20px ${theme.primaryColor}40`;
        };
        submit.onmouseout = () => {
            submit.style.opacity = "1";
            submit.style.transform = "translateY(0)";
            submit.style.boxShadow = "none";
        };

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
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>🌱</div><h3 style='color:${theme.primaryColor};font-size:24px;margin-bottom:12px;font-weight:bold;letter-spacing:0.05em;'>INTEREST REGISTERED</h3><p style='color:#fff;line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;'>Thank you for planting a seed with the Loch Ness Botanical Society. We will review your submission carefully.</p></div>`;
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
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>🌱</div><h3 style='color:${theme.primaryColor};font-size:24px;margin-bottom:12px;font-weight:bold;letter-spacing:0.05em;'>INTEREST REGISTERED</h3><p style='color:#fff;line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;'>Thank you for planting a seed with the Loch Ness Botanical Society. We will review your submission carefully.</p></div>`;
                    } else {
                        alert("Transmission Error: " + (err.message || "Failed to connect."));
                        submit.disabled = false;
                        submit.textContent = "RETRY TRANSMISSION";
                        submit.style.opacity = "1";
                    }
                });
        });

        containerRef.current.appendChild(form);
    }, [themeColor]); // Run once on mount

    return <div id={"form-" + formSlug} ref={containerRef} className="w-full max-w-2xl mx-auto my-12" />;
}
