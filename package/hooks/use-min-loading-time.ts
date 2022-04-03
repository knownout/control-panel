/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { limitNumber } from "@knownout/lib";

/**
 * Utility function to fix loading time too short (for CSS transition)
 * @param {() => void} callback function to execute immediately after the loading screen appears.
 * @return {Promise<unknown>} resolved after at least 300ms of loading.
 */
export default (callback?: () => void) => new Promise(resolve => {
    const startTime = Date.now();
    setTimeout(() => callback && callback(), 200);

    const timeoutLeft = limitNumber(300 - (Date.now() - startTime), { bottom: 0 });
    setTimeout(resolve, timeoutLeft);
});
