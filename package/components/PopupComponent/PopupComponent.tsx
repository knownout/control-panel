/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import React, { memo } from "react";
import { atom, useRecoilValue } from "recoil";
import { classNames } from "@knownout/lib";
import { Button } from "@knownout/interface";

import "./PopupComponent.scss";
import { createPortal } from "react-dom";
import { InformationCircleIcon } from "@heroicons/react/solid";

type TPopoverButton = {
    /** Button text. */
    children: string;

    /** Button icon. */
    icon?: JSX.Element;

    /** Button onClick event (without state) */
    onClick? (target: HTMLButtonElement): void;
};

interface IPopoverState
{
    /** Popup shown state. */
    open: boolean;

    /** Popup title text (h1). */
    title: string;

    /** List of popup paragraphs. */
    textContent: string[];

    /** Add an icon before popup title. */
    titleIcon?: JSX.Element;

    /** Add a hint at bottom of the popup (before buttons). */
    hintContent?: string;

    /** Define buttons to render. */
    buttons: TPopoverButton[];
}

/** Popup component state. */
export const popupComponentState = atom<IPopoverState>({
    key: "PopoverComponentState",
    default: {
        open: false,

        title: String(),

        textContent: [],

        buttons: []
    }
});

/**
 * React component to create popups using recoil state.
 * @internal
 */
export default memo(() => {
    const { open, title, titleIcon, textContent, hintContent, buttons } = useRecoilValue(popupComponentState);

    const popoverClassName = classNames("popover-component", { open });

    const component = <div className={ popoverClassName }>
        <div className="popover-content-wrapper">
            <div className="popover-content-holder">
                <h1>{ titleIcon }{ title }</h1>
                <div className="text-holder">
                    { textContent.map((text, index) => <p children={ text } key={ index + "_PTK" } />) }
                </div>
                { hintContent && <span>{ <InformationCircleIcon /> } { hintContent }</span> }
            </div>

            <div className="popover-buttons-holder">
                { buttons.map((button, index) =>
                    <Button { ...button } key={ index + "_PBK" }>{ button.children }</Button>
                ) }
            </div>
        </div>
    </div>;

    return createPortal(component, document.body);
});
