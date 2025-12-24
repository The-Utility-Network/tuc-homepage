'use client';

import { useEffect, useRef } from 'react';

interface ArthaneetiContactFormProps {
    themeColor?: string;
}

export default function ArthaneetiContactForm({ themeColor = '#3B82F6' }: ArthaneetiContactFormProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const formSlug = "early-registration-arthaneeti-platform-political-daos-e562fb25";

    useEffect(() => {
        if (!containerRef.current) return;
        if (containerRef.current.querySelector('form')) return;

        const apiEndpoint = "https://crm.ledger1.ai/api/forms/submit";

        // Arthaneeti Theme: Civic Blue & Clean
        const theme = {
            primaryColor: themeColor,
            backgroundColor: "rgba(25, 25, 25, 0.6)",
            textColor: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            fontFamily: "inherit",
            buttonTextColor: "#ffffff",
            labelColor: "#9ca3af",
            inputBgColor: "rgba(0, 0, 0, 0.4)"
        };

        const form = document.createElement("form");
        form.id = "crm-form-" + formSlug;
        form.style.cssText = `display:grid; grid-template-columns: repeat(12, 1fr); column-gap: 20px; row-gap: 24px; max-width:800px; margin:0 auto; font-family:${theme.fontFamily}; background:${theme.backgroundColor}; padding:40px; border-radius:${theme.borderRadius}; border: 1px solid ${theme.primaryColor}30; backdrop-filter: blur(10px); box-shadow: 0 0 20px ${theme.primaryColor}10, inset 0 0 20px ${theme.primaryColor}05; transition: box-shadow 0.3s ease;`;

        form.onmouseenter = () => {
            form.style.boxShadow = `0 0 30px ${theme.primaryColor}20, inset 0 0 30px ${theme.primaryColor}10`;
            form.style.borderColor = `${theme.primaryColor}60`;
        };
        form.onmouseleave = () => {
            form.style.boxShadow = `0 0 20px ${theme.primaryColor}10, inset 0 0 20px ${theme.primaryColor}05`;
            form.style.borderColor = `${theme.primaryColor}30`;
        };

        // Primary Interest options (inferred for Radio)
        const interestOptions = [
            "Becoming an Arthanagrik (Citizen)",
            "Forming/Joining a Political DAO",
            "Policy Research & Development",
            "Developer / Technical Contribution",
            "Partnership / Sponsorship"
        ];

        const fields = [
            { "name": "first_name", "label": "First Name", "type": "text", "required": true, "placeholder": "e.g., Asha", "span": 6 },
            { "name": "last_name", "label": "Last Name", "type": "text", "required": true, "placeholder": "e.g., Sharma", "span": 6 },
            { "name": "email", "label": "Email", "type": "email", "required": true, "placeholder": "name@example.com", "span": 6 },
            { "name": "phone", "label": "Phone", "type": "phone", "required": false, "placeholder": "e.g., +1 202 555 0182", "span": 6 },
            { "name": "company", "label": "Organization / Affiliation", "type": "text", "required": false, "placeholder": "e.g., Youth Political Action Committee", "span": 6 },
            { "name": "country", "label": "Country", "type": "text", "required": false, "placeholder": "e.g., India", "span": 6 },
            { "name": "primary_interest", "label": "Primary Interest", "type": "radio", "required": false, "placeholder": null, "span": 12, "options": interestOptions },
            { "name": "comments", "label": "Topics or Causes (Optional)", "type": "textarea", "required": false, "placeholder": "Briefly share the issues you care about or DAOs you’d like to join.", "span": 12 }
        ];

        const allInputs: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] = [];

        fields.forEach(function (field, index) {
            const wrapper = document.createElement("div");
            wrapper.style.gridColumn = `span ${field.span || 12}`;
            wrapper.style.position = "relative";
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = field.type === 'radio' ? "column" : "column";

            const label = document.createElement("label");
            label.textContent = field.label + (field.required ? " *" : "");
            label.style.cssText = "display:block;margin-bottom:8px;font-weight:600;color:" + theme.labelColor + ";font-size:11px;letter-spacing: 0.15em;text-transform:uppercase;transition:color 0.3s ease;";
            wrapper.appendChild(label);

            let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

            if (field.type === 'radio') {
                const radioContainer = document.createElement("div");
                radioContainer.style.cssText = "display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:12px;";

                const options = (field as any).options || [];
                const hiddenInput = document.createElement("input");
                hiddenInput.type = "hidden";
                hiddenInput.name = field.name;
                wrapper.appendChild(hiddenInput);

                options.forEach((opt: string) => {
                    const radioLabel = document.createElement("label");
                    radioLabel.style.cssText = `display:flex;align-items:center;padding:12px;background:${theme.inputBgColor};border:1px solid ${theme.borderColor};border-radius:8px;cursor:pointer;transition:all 0.2s ease;font-size:13px;color:${theme.textColor};`;

                    const radio = document.createElement("input");
                    radio.type = "radio";
                    radio.name = field.name + "_radio";
                    radio.value = opt;
                    radio.style.cssText = `accent-color:${theme.primaryColor};width:16px;height:16px;margin-right:10px;`;

                    radio.addEventListener('change', () => {
                        hiddenInput.value = opt;
                        // Reset all labels
                        radioContainer.querySelectorAll('label').forEach(l => {
                            l.style.borderColor = theme.borderColor;
                            l.style.boxShadow = "none";
                        });
                        // Highlight selected
                        radioLabel.style.borderColor = theme.primaryColor;
                        radioLabel.style.boxShadow = `0 0 10px ${theme.primaryColor}20`;
                    });

                    radioLabel.appendChild(radio);
                    radioLabel.appendChild(document.createTextNode(opt));
                    radioContainer.appendChild(radioLabel);
                });

                wrapper.appendChild(radioContainer);
                input = hiddenInput;
            } else {
                if (field.type === "textarea") {
                    input = document.createElement("textarea");
                    input.rows = 4;
                } else {
                    input = document.createElement("input");
                    input.type = field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"; // Fallback
                }

                input.style.cssText = "width:100%;padding:14px 16px;border:1px solid " + theme.borderColor + ";border-radius:4px;font-size:14px;background:" + theme.inputBgColor + ";color:" + theme.textColor + ";box-sizing:border-box;outline:none;transition:all 0.3s ease;";
                wrapper.appendChild(input);

                // Microtext
                const microtext = document.createElement("div");
                microtext.style.cssText = "position:absolute;bottom:-18px;right:0;font-size:9px;color:#666;opacity:0;transition:all 0.3s ease;pointer-events:none;letter-spacing:0.05em;";
                microtext.textContent = (field.required ? "REQUIRED" : "OPTIONAL") + (index < fields.length - 1 ? " • ENTER ↵" : "");
                wrapper.appendChild(microtext);

                input.onfocus = () => {
                    input.style.borderColor = theme.primaryColor;
                    input.style.boxShadow = `0 0 15px ${theme.primaryColor}20`;
                    input.style.transform = "translateY(-2px)";
                    label.style.color = theme.primaryColor;
                    microtext.style.opacity = "1";
                    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                };
                input.onblur = () => {
                    input.style.borderColor = theme.borderColor;
                    input.style.boxShadow = "none";
                    input.style.transform = "translateY(0)";
                    label.style.color = theme.labelColor;
                    microtext.style.opacity = "0";
                };
            }

            input.name = field.name;
            input.required = field.required;
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
        submit.textContent = "REGISTER INTEREST";
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
            submit.textContent = "REGISTERING...";
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
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>🗳️</div><h3 style='color:${theme.primaryColor};font-size:24px;margin-bottom:12px;font-weight:bold;letter-spacing:0.05em;'>REGISTRATION COMPLETE</h3><p style='color:#fff;line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;'>You have taken the first step towards the Arthanagrik identity.</p></div>`;
                        return;
                    }
                    let errorMessage = "Error";
                    try { const res = await response.json(); errorMessage = res.error || errorMessage; } catch (e) { }
                    throw new Error(errorMessage);
                })
                .catch(function (err) {
                    if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
                        form.innerHTML = `<div style='grid-column:span 12;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;text-align:center;padding:40px;'><div style='font-size:48px;margin-bottom:20px;'>🗳️</div><h3 style='color:${theme.primaryColor};font-size:24px;margin-bottom:12px;font-weight:bold;letter-spacing:0.05em;'>REGISTRATION COMPLETE</h3><p style='color:#fff;line-height:1.6;max-width:400px;margin:0 auto;opacity:0.8;'>You have taken the first step towards the Arthanagrik identity.</p></div>`;
                    } else {
                        alert("Transmission Error: " + err.message);
                        submit.disabled = false;
                        submit.textContent = "RETRY REGISTRATION";
                        submit.style.opacity = "1";
                    }
                });
        });

        containerRef.current.appendChild(form);
    }, [themeColor]);

    return <div id={"form-" + formSlug} ref={containerRef} className="w-full max-w-2xl mx-auto my-12" />;
}
