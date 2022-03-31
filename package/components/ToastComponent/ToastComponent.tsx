/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/control-panel
 */

import React, { createContext, memo, useCallback, useRef } from "react";
import { classNames, MakeElement, Random } from "@knownout/lib";

import "./ToastComponent.scss";

interface IToastComponentContext
{
    /**
     * Add a new message to the toast component.
     * @param {string} content message text.
     * @param {number} timeout message TTL (default — 4000).
     */
    addMessage (content: string, timeout?: number): void;
}

/**
 * Component functions storage.
 * @type {React.Context<Partial<IToastComponentContext>>}
 */
export const ToastComponentContext = createContext<Partial<IToastComponentContext>>({});

interface IToastComponentProps
{
    // Max messages count at screen
    messagesLimit?: number;

    children: any;
}

/**
 * React component to provide toast messages in the screen corner.
 * @internal
 */
export default memo((props: IToastComponentProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const messagesLimit = props.messagesLimit || 5;

    // Remove “enter” class name and then remove element from DOM tree.
    const removeElement = useCallback((element: HTMLDivElement) => {
        setTimeout(() => element.remove(), 100);
        element.classList.remove("enter");
    }, []);

    // Add a new message to the toast component.
    const addMessage = useCallback((content: string, timeout: number = 4000) => {
        if (!ref.current) return;

        // Create a new element using @knownout/lib MakeElement class.
        const element = new MakeElement("div").attr("class", "toast-message")

            // Set unique identifier.
            .attr("id", Random.string(6, "AZ,az"))

            // Set text with content wrapper.
            .setInnerHTML(`<div>${ content }</div>`);

        // Remove extra elements if limit exceeded.
        if (ref.current.childNodes.length >= messagesLimit) (Array.from(ref.current.childNodes) as HTMLDivElement[])
            .slice(0, ref.current.childNodes.length - (messagesLimit - 1))
            .forEach(element => removeElement(element));

        // Append an element to the DOM tree.
        ref.current.append(element.native);
        setTimeout(() => element.native.classList.add("enter"), 100);

        // Auto remove element after some time or
        const removeTimeout = setTimeout(() => removeElement(element.native), timeout);
        element.native.addEventListener("click", () => {
            clearTimeout(removeTimeout);
            removeElement(element.native);
        });
    }, []);

    const toastClassName = classNames("toast-component");
    return <ToastComponentContext.Provider value={ { addMessage } }>
        { props.children }
        <div className={ toastClassName }>
            <div className="messages-wrapper" ref={ ref } />
        </div>
    </ToastComponentContext.Provider>;
});
