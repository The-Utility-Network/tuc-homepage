'use client';

import { useEffect, useRef } from 'react';

interface GraineLedgerContactFormProps {
    themeColor?: string;
}

export default function GraineLedgerContactForm({ themeColor = '#F97316' }: GraineLedgerContactFormProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const formSlug = "the-graine-ledger-stakeholder-contact-00be621f";

    useEffect(() => {
        if (!containerRef.current) return;

        // Check if form already exists to prevent duplicate injection
        if (containerRef.current.querySelector('form')) return;

        const apiEndpoint = "https://crm.ledger1.ai/api/forms/submit";

        // Theme configuration adapted for The Graine Ledger with whiskey orange
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

        // Stakeholder role options
        const stakeholderRoleOptions = [
            "Brand Owner / Distiller",
            "Investor / Collector",
            "Retailer / Distributor",
            "Hospitality / Bar / Restaurant",
            "Content Creator / Influencer",
            "Press / Media",
            "General Inquiry"
        ];

        // Areas of interest options (multi-select rendered as checkboxes)
        const areasOfInterestOptions = [
            "Private Label Whiskey",
            "Barrel Investment",
            "Custom Blending",
            "White Label Production",
            "Event Hosting at Lodge",
            "NFT Ownership",
            "Retail Partnership"
        ];

        // Timeline options
        const timelineOptions = [
            "Immediately",
            "Within 3 months",
            "3-6 months",
            "6-12 months",
            "Just exploring"
        ];

        // Fields matching original form structure
        const fields = [
            { "name": "first_name", "label": "First Name", "type": "text", "required": true, "placeholder": "John", "span": 6 },
            { "name": "last_name", "label": "Last Name", "type": "text", "required": true, "placeholder": "Doe", "span": 6 },
            { "name": "email", "label": "Email", "type": "email", "required": true, "placeholder": "john.doe@example.com", "span": 6 },
            { "name": "phone", "label": "Phone", "type": "phone", "required": false, "placeholder": "+1 555-123-4567", "span": 6 },
            { "name": "stakeholder_role", "label": "Stakeholder Role", "type": "select", "required": true, "placeholder": null, "span": 6, "options": stakeholderRoleOptions },
            { "name": "country", "label": "Country", "type": "text", "required": true, "placeholder": "United States", "span": 6 },
            { "name": "company_brand", "label": "Company / Brand", "type": "text", "required": false, "placeholder": "Your brand or company", "span": 6 },
            { "name": "website", "label": "Website", "type": "text", "required": false, "placeholder": "https://yourbrand.com", "span": 6 },
            // Investor-only fields
            { "name": "investment_level", "label": "Investment Interest", "type": "select", "required": false, "placeholder": null, "span": 6, "options": ["1 Barrel ($5K - $10K)", "2-5 Barrels ($10K - $50K)", "6-20 Barrels ($50K - $200K)", "Private Collection (20+ Barrels)"], "investorOnly": true },
            { "name": "project_timeline", "label": "Desired Timeline", "type": "select", "required": false, "placeholder": null, "span": 6, "options": timelineOptions, "investorOnly": true },
            // Common fields continue
            { "name": "areas_of_interest", "label": "Areas of Interest", "type": "multi_select", "required": false, "placeholder": null, "span": 12, "options": areasOfInterestOptions },
            { "name": "message", "label": "How can we help?", "type": "textarea", "required": true, "placeholder": "Tell us about your goals, barrel preferences (e.g., char level, finish type), bottling plans, and distribution needs.", "span": 12 }
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
            wrapper.style.flexDirection = "column";

            // Track investor-only fields
            if ((field as any).investorOnly) {
                investorFieldWrappers.push(wrapper);
                wrapper.style.display = 'none'; // Hidden by default
            }

            const label = document.createElement("label");
            label.textContent = field.label + (field.required ? " *" : "");
            label.style.cssText = "display:block;margin-bottom:8px;font-weight:600;color:" + theme.labelColor + ";font-size:11px;letter-spacing: 0.15em;text-transform:uppercase;transition:color 0.3s ease;";
            wrapper.appendChild(label);

            let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

            if (field.type === "textarea") {
                input = document.createElement("textarea");
                input.rows = 4;
                input.style.cssText = "width:100%;padding:14px 16px;border:1px solid " + theme.borderColor + ";border-radius:4px;font-size:14px;background:" + theme.inputBgColor + ";color:" + theme.textColor + ";box-sizing:border-box;outline:none;transition:all 0.3s ease;resize:vertical;";
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
                input.style.cssText = "width:100%;padding:14px 16px;border:1px solid " + theme.borderColor + ";border-radius:4px;font-size:14px;background:" + theme.inputBgColor + ";color:" + theme.textColor + ";box-sizing:border-box;outline:none;transition:all 0.3s ease;cursor:pointer;";

                // Special handling for stakeholder_role to show/hide investor fields
                if (field.name === 'stakeholder_role') {
                    input.addEventListener('change', () => {
                        const isInvestor = input.value === 'Investor / Collector';
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
            } else if (field.type === "multi_select") {
                // Multi-select rendered as checkbox group
                const checkboxContainer = document.createElement("div");
                checkboxContainer.style.cssText = "display:flex;flex-wrap:wrap;gap:12px;";

                const options = (field as any).options || [];
                const hiddenInput = document.createElement("input");
                hiddenInput.type = "hidden";
                hiddenInput.name = field.name;
                wrapper.appendChild(hiddenInput);

                const selectedValues: Set<string> = new Set();

                options.forEach((opt: string) => {
                    const checkLabel = document.createElement("label");
                    checkLabel.style.cssText = `display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid ${theme.borderColor};border-radius:6px;cursor:pointer;transition:all 0.2s ease;font-size:13px;color:${theme.labelColor};`;

                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.value = opt;
                    checkbox.style.cssText = `accent-color:${theme.primaryColor};width:16px;height:16px;`;

                    checkbox.addEventListener('change', () => {
                        if (checkbox.checked) {
                            selectedValues.add(opt);
                            checkLabel.style.borderColor = theme.primaryColor;
                            checkLabel.style.backgroundColor = `${theme.primaryColor}10`;
                            checkLabel.style.color = theme.textColor;
                        } else {
                            selectedValues.delete(opt);
                            checkLabel.style.borderColor = theme.borderColor;
                            checkLabel.style.backgroundColor = "transparent";
                            checkLabel.style.color = theme.labelColor;
                        }
                        hiddenInput.value = Array.from(selectedValues).join(", ");
                    });

                    const text = document.createElement("span");
                    text.textContent = opt;

                    checkLabel.appendChild(checkbox);
                    checkLabel.appendChild(text);
                    checkboxContainer.appendChild(checkLabel);
                });

                wrapper.appendChild(checkboxContainer);
                // Use hiddenInput for the allInputs array
                input = hiddenInput;
            } else {
                input = document.createElement("input");
                input.type = field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text";
                input.style.cssText = "width:100%;padding:14px 16px;border:1px solid " + theme.borderColor + ";border-radius:4px;font-size:14px;background:" + theme.inputBgColor + ";color:" + theme.textColor + ";box-sizing:border-box;outline:none;transition:all 0.3s ease;";
            }

            if (field.type !== "multi_select") {
                wrapper.appendChild(input);
            }

            input.name = field.name;
            input.required = field.required && !(field as any).investorOnly;
            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                if (field.placeholder) input.placeholder = field.placeholder;
            }

            // Phone formatting
            if (field.type === 'phone' && input instanceof HTMLInputElement) {
                input.addEventListener('input', (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    let x = target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                    if (x) {
                        target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
                    }
                });
            }

            // Microtext / Hint (only for non-multi-select)
            if (field.type !== "multi_select") {
                const microtext = document.createElement("div");
                microtext.style.cssText = "position:absolute;bottom:-18px;right:0;font-size:9px;color:#666;opacity:0;transition:all 0.3s ease;pointer-events:none;letter-spacing:0.05em;";
                microtext.textContent = (field.required ? "REQUIRED" : "OPTIONAL") + (index < fields.length - 1 ? " • PRESS ENTER ↵" : "");
                wrapper.appendChild(microtext);

                // Focus Effects
                input.onfocus = () => {
                    if (input instanceof HTMLSelectElement || input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                        input.style.borderColor = theme.primaryColor;
                        input.style.boxShadow = `0 0 15px ${theme.primaryColor}20`;
                        if (field.type !== 'select') input.style.transform = "translateY(-2px)";
                    }
                    label.style.color = theme.primaryColor;
                    microtext.style.opacity = "1";
                    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                };
                input.onblur = () => {
                    if (input instanceof HTMLSelectElement || input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                        input.style.borderColor = theme.borderColor;
                        input.style.boxShadow = "none";
                        input.style.transform = "translateY(0)";
                    }
                    label.style.color = theme.labelColor;
                    microtext.style.opacity = "0";
                };
            }

            input.dataset.index = index.toString();

            // Enter key navigation
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
        submit.textContent = "SUBMIT INQUIRY";
        submit.style.cssText = "background:" + theme.primaryColor + ";color:" + theme.buttonTextColor + ";border:none;padding:16px 28px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:700;width:100%;margin-top:16px;letter-spacing:0.1em;text-transform:uppercase;transition:all 0.3s ease;";

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
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>🥃</div><h3 style='color:${theme.primaryColor};font-size:24px;margin-bottom:12px;font-weight:bold;letter-spacing:0.05em;'>ENTRY RECORDED</h3><p style='color:#fff;line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;'>Your interest has been ledgered. We will contact you to discuss the next steps.</p></div>`;
                        return;
                    }

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

                    if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>🥃</div><h3 style='color:${theme.primaryColor};font-size:24px;margin-bottom:12px;font-weight:bold;letter-spacing:0.05em;'>ENTRY RECORDED</h3><p style='color:#fff;line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;'>Your interest has been ledgered. We will contact you to discuss the next steps.</p></div>`;
                    } else {
                        alert("Transmission Error: " + (err.message || "Failed to connect."));
                        submit.disabled = false;
                        submit.textContent = "RETRY TRANSMISSION";
                        submit.style.opacity = "1";
                    }
                });
        });

        containerRef.current.appendChild(form);
    }, [themeColor]);

    return <div id={"form-" + formSlug} ref={containerRef} className="w-full max-w-2xl mx-auto my-12" />;
}
