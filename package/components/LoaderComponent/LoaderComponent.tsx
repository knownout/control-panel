/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import React, { memo } from "react";
import { atom, useRecoilValue } from "recoil";
import { classNames } from "@knownout/lib";

import "./LoaderComponent.scss";
import { createPortal } from "react-dom";

/** Component state */
export const loaderComponentState = atom({
    key: "loaderComponentState",
    default: true
});

/**
 * React component to provide a loading screen, controlled by recoil state.
 * @internal
 */
export default memo(() => {
    const loading = useRecoilValue(loaderComponentState);

    const loaderClassName = classNames("loader-component", { open: loading });
    const component = <div className={ loaderClassName }>
        <i className="loading-spinner" />
    </div>;

    // Create a portal to add a loading screen after other elements.
    return createPortal(component, document.body);
});
