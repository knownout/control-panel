/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/control-panel
 */

export type TAccountData = {
    /** User login */
    username: string;

    /** Hashed user password */
    hash: string;
};

export interface IControlPanelAuthenticator
{
    /** Data storage type. */
    storage: Storage;

    /**
     * Send authentication request to the server.
     * @param {TAccountData} userData user data to send.
     * @param recaptchaPublicKey recaptcha public key.
     * @return {Promise<boolean>} authentication result.
     */
    requireServerAuthentication (userData: TAccountData, recaptchaPublicKey?: string): Promise<boolean>;

    /**
     * Require cached in specific storage user data.
     * @return {TAccountData | false} data parsing result.
     */
    requireCachedAccountData (): TAccountData | false;

    /**
     * Update cached user data in the storage.
     * @param {TAccountData} cachedUserData new user data to cache.
     */
    cacheAccountData (cachedUserData: TAccountData): void;

    /**
     * Remove cached data from storage.
     */
    removeCachedAccountData (): void;
}
