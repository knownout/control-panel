/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { RecoilState } from "recoil";

interface IControlPanelExtensionCore
{
    /** Extension name to display inside dropbox (for default extensions). */
    name: string;

    /** Extension key to be used internally and in a path (only latin symbols recommended) */
    key: string;

    /** Extension version to display at extensions screen. */
    version: string;

    /** Extension description. */
    description?: string[] | string;

    /** Extension image to display at extensions screen. */
    image?: JSX.Element;
}

export type TCommonObject<T = string> = { id: T, [key: string]: any };

export type TControlPanelExtensionsObject<P extends TCommonObject, C extends TCommonObject, K = string>
    = { [key: string]: IControlPanelExtension<P, C, K> }

export interface IControlPanelExtension<Preview extends TCommonObject, Content extends TCommonObject, Key = string>
    extends IControlPanelExtensionCore
{
    /** Save object content when get closed */
    saveOnClose?: boolean;

    /**
     * Require objects preview list from a server.
     * @return {ObjectPreview[]} objects preview list.
     */
    requireObjectsPreview (): Promise<Preview[]>;

    /**
     * Require objects preview list from a server by a specific query.
     * @param {string} query search query.
     * @return {ObjectPreview[]} objects preview list.
     */
    requireObjectsPreviewByQuery (query: string): Promise<Preview[]>;

    /**
     * Retrieve single object preview from server by object key.
     * @param {Key} key constant unique object key.
     * @return {ObjectPreview} single object preview.
     */
    requireObjectPreviewByKey (key: Key): Promise<Preview>;

    /**
     * Require object content from server by constant object key.
     * @param {Key} key constant unique object key.
     * @return object content
     */
    requireObjectContent (key: Key): Promise<Content>;

    /**
     * Remove object by its key.
     * @param {Key} key constant unique key.
     * @return {Promise<boolean>} removal result.
     */
    removeObject (key: Key): Promise<boolean>;

    /**
     * Send object content update request to a server.
     * @param content new object content.
     * @return {Promise<boolean>} update result.
     */
    updateObject? (content: Content): Promise<boolean>;

    /**
     * Renderer for object editor.
     * @param content content of an object.
     * @return {JSX.Element} React element.
     */
    renderContentView (content: Content): JSX.Element;

    /**
     * Renderer for object preview element.
     * @param {ObjectPreview} preview object preview data.
     * @return {JSX.Element} React element.
     */
    renderObjectPreview (preview: Preview): JSX.Element;

    /**
     * Render initial screen (when no selected object)
     * @return {JSX.Element} React element.
     */
    renderInitialContentScreen? (): JSX.Element;
}

export interface IControlPanelScreenExtension extends IControlPanelExtensionCore
{
    /** Screen recoil state. */
    state: RecoilState<{ shown: boolean, [key: string]: any }>;

    /**
     * Render screen.
     * @return {JSX.Element} React component.
     */
    render (): JSX.Element;

    /** Fires before screen opens and force component to wait for promise to resolve. */
    screenWillOpen (): Promise<void>;

    /** Fires before screen closes and force component to wait for promise to resolve. */
    screenWillClose (): Promise<void>;

    /** Fires after screen opens. */
    screenDidOpen (): void;

    /** Fires after screen closes. */
    screenDidClose (): void;
}
