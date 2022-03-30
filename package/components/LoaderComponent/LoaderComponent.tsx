/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import React, { memo } from "react";
import { atom, useRecoilValue } from "recoil";
import { classNames } from "@knownout/lib";

import "./LoaderComponent.scss";
import { ShieldExclamationIcon } from "@heroicons/react/solid";
import { Button } from "@knownout/interface";
import { HomeIcon } from "@heroicons/react/outline";

export const LoaderComponentState = {
    loadingState: atom({
        key: "LoaderComponent.LoadingState",
        default: true
    }),

    errorState: atom<boolean | string | undefined>({
        key: "LoaderComponent.ErrorState",
        default: false
    })
};

const ErrorHandlerComponent = (props: { error: string | boolean | undefined }) => {
    const errorHandlerClassName = classNames("screen", "error", { show: Boolean(props.error) });

    return <div className={ errorHandlerClassName }>
        <div>
            <div className="content">
                <h1><ShieldExclamationIcon /> Произошла ошибка</h1>
                <p>При обработке текущего запроса произошла непредвиденная ошибка.</p>
                <p>Если вы уверены, что это ошибка модуля, свяжитесь с разработчиком.</p>
                <span className="error-content">
                    Данные ошибки: { props.error || "unknown" }
                </span>
            </div>
            <Button icon={ <HomeIcon /> }>На главную</Button>
        </div>
    </div>;
};

export default memo(() => {
    const loading = useRecoilValue(LoaderComponentState.loadingState);
    const error = useRecoilValue(LoaderComponentState.errorState);

    const loadingScreenClassName = classNames("screen loading", { show: loading });
    return <div className="loader-component">
        <div className={ loadingScreenClassName } children={ <i className="loading-spinner" /> } />
        <ErrorHandlerComponent error={ error } />
    </div>;
});
