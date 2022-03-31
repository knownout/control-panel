/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

/** Map extensions to its names. */
export default function useExtensionsObject<T> (extensions: T[]) {
    return (extensions as any[]).map(item => ({ [item.name]: item }))
        .reduce((a, b) => Object.assign(a, b)) as { [key: string]: T };
}
