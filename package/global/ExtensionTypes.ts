/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/control-panel
 */

import { RecoilState } from "recoil";

interface IControlPanelExtensionCore
{
    /** Extension name to display inside dropbox (for default extensions). */
    name: string;

    /** Extension version to display at extensions screen. */
    version: string;

    /** Extension description. */
    description?: string[] | string;

    /** Extension image to display at extensions screen. */
    image?: JSX.Element;
}

export interface IControlPanelExtension<ObjectPreview, ObjectContent, Key = string> extends IControlPanelExtensionCore
{
    /**
     * Require objects preview list from a server.
     * @param {number} offset database objects offset,
     * @param {number} limit count of entries to retrieve.
     * @return {ObjectPreview[]} objects preview list.
     */
    requireObjectsPreview (offset: number, limit: number): ObjectPreview[];

    /**
     * Require objects preview list from a server by specific query.
     * @param {string} query search query.
     * @param {number} limit count of entries to retrieve.
     * @return {ObjectPreview[]} objects preview list.
     */
    requireObjectsPreviewByQuery (query: string, limit: number): ObjectPreview[];

    /**
     * Retrieve single object preview from server by object key.
     * @param {Key} key constant unique object key.
     * @return {ObjectPreview} single object preview.
     */
    requireObjectPreviewByKey (key: Key): ObjectPreview;

    /**
     * Require object content from server by constant object key.
     * @param {Key} key constant unique object key.
     * @return object content
     */
    requireObjectContent (key: Key): ObjectContent;

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
    updateObject? (content: ObjectContent): Promise<boolean>;

    /**
     * Renderer for object editor.
     * @param content content of an object.
     * @return {JSX.Element} React element.
     */
    renderContentView (content: ObjectContent): JSX.Element;

    /**
     * Renderer for object preview element.
     * @param {ObjectPreview} preview object preview data.
     * @return {JSX.Element} React element.
     */
    renderObjectPreview (preview: ObjectPreview): JSX.Element;
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
