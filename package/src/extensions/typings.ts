/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { RecoilState } from "recoil";

export interface IControlPanelExtensionCore
{
    /** Extension name. */
    readonly name: string;

    /** Extension version number. */
    readonly version: string;

    /** Extension icon element. */
    readonly icon?: JSX.Element;

    /** Extension description. */
    readonly description?: string | string[];
}

export interface IControlPanelExtension<Preview, Material> extends IControlPanelExtensionCore
{
    /**
     * Method for require objects preview.
     * @param {number} from objects database offset.
     * @param {number} limit objects count limit.
     * @return {Promise} objects preview list.
     */
    previewObjectRequest (from: number, limit: number): Promise<Preview[]>;

    /**
     * Method for require a specific object full content.
     * @param {string} identifier object identifier in the database.
     * @return {Promise} full object content.
     */
    objectDataRequest (identifier: string): Promise<Material>;

    /**
     * Search for objects by a specific query.
     * @param {string} query search query string.
     * @return {Promise} search result.
     */
    objectSearch (query: string): Promise<Preview[]>;

    /**
     * Remove a specific object by an identifier.
     * @param {string} identifier object identifier.
     * @return {Promise<boolean>} removing result.
     */
    removeObject (identifier: string): Promise<boolean>;

    /**
     * Update specific object content.
     * @param {string} identifier object identifier.
     * @param objectData new object content.
     * @return {Promise<boolean>} updating result.
     */
    updateObjectData? (identifier: string, objectData: Material): Promise<boolean>;

}

export interface IControlPanelViewExtension extends IControlPanelExtensionCore
{
    /** View-specific recoil state */
    readonly recoilState: RecoilState<{ showState: boolean, [key: string]: any }>;

    /**
     * Render JSX element for view.
     * @return {JSX.Element} render result.
     */
    render (): JSX.Element;
}
