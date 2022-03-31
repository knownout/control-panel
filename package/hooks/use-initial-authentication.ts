/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { IControlPanelAuthenticator } from "../global/AuthenticationTypes";

/**
 * Initial authentication hook based on the
 * control panel authentication extension.
 *
 * @param {IControlPanelAuthenticator} authenticator control panel authentication extension.
 * @param {string} recaptchaPublicKey recaptcha public key.
 * @return {Promise<boolean>} authentication result.
 */
async function useInitialAuthentication (authenticator: IControlPanelAuthenticator, recaptchaPublicKey?: string) {
    // Process only if cached content available
    const cachedContent = authenticator.requireCachedAccountData();
    if (!cachedContent) return false;

    // Verify cached content
    const response = await authenticator.requireServerAuthentication(cachedContent, recaptchaPublicKey);
    if (!response) authenticator.removeCachedAccountData();

    return response;
}

export default useInitialAuthentication;
