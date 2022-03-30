/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

export type TStoredUserData = {
    /** User login */
    username: string;

    /** User real name */
    fullname: string;

    /** Raw user password */
    password: string;
};

export type THashedUserData = {
    /** User login */
    username: string;

    /** User hashed password */
    hash: string;
}

export interface IControlPanelAuthenticationMechanism
{
    /** Data storage type. */
    storage: Storage;

    /**
     * Send authentication request to the server.
     * @param {TStoredUserData} userData user data to send.
     * @return {Promise<boolean>} authentication result.
     */
    requireServerAuthentication (userData: TStoredUserData): Promise<boolean>;

    /**
     * Require cached in specific storage user data.
     * @return {TStoredUserData | false} data parsing result.
     */
    requireCachedUserData (): TStoredUserData | false;
}
