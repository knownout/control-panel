/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { classNames } from "@knownout/lib";
import React, { memo } from "react";
import { createPortal } from "react-dom";
import { atom, useRecoilValue } from "recoil";

import "./LoaderComponent.scss";

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

    // Create a portal to avoid z-index usage.
    return createPortal(component, document.body);
});
