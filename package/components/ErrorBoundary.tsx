/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import React, { FunctionComponent, PureComponent } from "react";

interface IErrorBoundaryProps
{
    // Component to render when error occurred.
    FallbackComponent: FunctionComponent<{ error: any, [key: string]: any }>;

    // Children content will be rendered if no errors occurred.
    children?: any;
}

interface IErrorBoundaryState
{
    hasError: boolean;

    // Error content.
    error?: any;
}

/**
 * React component for creating error boundaries using function fallback components.
 */
export default class ErrorBoundary extends PureComponent<IErrorBoundaryProps, IErrorBoundaryState>
{
    static getDerivedStateFromError () {
        return { hasError: true };
    }

    public readonly state: IErrorBoundaryState = { hasError: false };

    public componentDidCatch (error: Error) {
        this.setState({ error });
    }

    public render () {
        return <>
            { this.state.error ? <this.props.FallbackComponent error={ this.state.error } /> : this.props.children }
        </>;
    }
}
